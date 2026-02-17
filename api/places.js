
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  // Chave fornecida
  const apiKey = "AIzaSyC1mfIO67ZnVuMbbDoyibfX_A_O2D9eB5s";

  try {
    // 1. Busca Inicial (Text Search) - Encontra os candidatos
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;
    
    console.log(`[API Places] Searching: ${query}`);
    const searchResponse = await fetch(searchUrl);
    
    if (!searchResponse.ok) throw new Error(`Search HTTP Error: ${searchResponse.status}`);
    const searchData = await searchResponse.json();

    if (searchData.status !== 'OK' && searchData.status !== 'ZERO_RESULTS') {
      throw new Error(`Search API Error: ${searchData.status}`);
    }

    const initialResults = searchData.results || [];
    
    // 2. Deep Dive (Place Details) - Para cada resultado, busca os dados completos
    // Limitamos a 10 para garantir performance e não estourar quotas rapidamente, 
    // mas garantindo dados ricos para os principais leads.
    const detailedResults = await Promise.all(
      initialResults.slice(0, 12).map(async (place) => {
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

    return res.status(200).json({ results: detailedResults });
  } catch (error) {
    console.error('Places API Error:', error);
    return res.status(500).json({ 
        error: 'Failed to fetch places', 
        details: error.message 
    });
  }
}
