
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, pagetoken } = req.body;

  if (!query && !pagetoken) {
    return res.status(400).json({ error: 'Query or pagetoken is required' });
  }

  // Chave fornecida
  const apiKey = "AIzaSyDx8QZ41gze3XEYhXvo6r5EmkXxmC8_daA";

  try {
    let searchUrl;
    
    // Se tiver token de paginação, usa ele. Se não, faz a busca textual.
    if (pagetoken) {
        searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken=${pagetoken}&key=${apiKey}`;
        console.log(`[API Places] Fetching next page...`);
    } else {
        searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;
        console.log(`[API Places] Searching: ${query}`);
    }
    
    const searchResponse = await fetch(searchUrl);
    
    if (!searchResponse.ok) throw new Error(`Search HTTP Error: ${searchResponse.status}`);
    const searchData = await searchResponse.json();

    if (searchData.status !== 'OK' && searchData.status !== 'ZERO_RESULTS') {
      throw new Error(`Search API Error: ${searchData.status}`);
    }

    const initialResults = searchData.results || [];
    
    // Google Places retorna 20 resultados por página.
    // Vamos processar todos os 20 para maximizar a eficiência da busca.
    const detailedResults = await Promise.all(
      initialResults.map(async (place) => {
        try {
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,international_phone_number,website,rating,user_ratings_total,types,price_level,business_status,opening_hours,photos,url&key=${apiKey}`;
          
          const detailsResponse = await fetch(detailsUrl);
          const detailsData = await detailsResponse.json();

          if (detailsData.status === 'OK') {
            // Mescla os dados da busca com os detalhes ricos
            return {
              ...place,
              ...detailsData.result, // Sobrescreve com dados mais precisos
              original_search_ref: place.place_id
            };
          }
          return place; // Fallback para o resultado básico se o details falhar
        } catch (err) {
          console.error(`Failed to fetch details for ${place.place_id}`, err);
          return place;
        }
      })
    );

    return res.status(200).json({ 
        results: detailedResults,
        next_page_token: searchData.next_page_token 
    });
  } catch (error) {
    console.error('Places API Error:', error);
    return res.status(500).json({ 
        error: 'Failed to fetch places', 
        details: error.message 
    });
  }
}
