
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, pagetoken } = req.body;

  if (!query && !pagetoken) {
    return res.status(400).json({ error: 'Query or pagetoken is required' });
  }

  // Tenta usar a chave específica do Maps primeiro, senão cai na geral
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.API_KEY;

  if (!apiKey) {
    console.error("GOOGLE_MAPS_API_KEY or API_KEY environment variable is missing");
    return res.status(500).json({ error: 'Configuração de servidor inválida: Chave de API ausente.' });
  }

  try {
    let searchUrl;
    
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
      const errorMsg = searchData.error_message || searchData.status;
      throw new Error(`Google Maps API Error: ${errorMsg}`);
    }

    const initialResults = searchData.results || [];
    
    const detailedResults = await Promise.all(
      initialResults.map(async (place) => {
        try {
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,international_phone_number,website,rating,user_ratings_total,types,price_level,business_status,opening_hours,photos,url&key=${apiKey}`;
          
          const detailsResponse = await fetch(detailsUrl);
          const detailsData = await detailsResponse.json();

          if (detailsData.status === 'OK') {
            return {
              ...place,
              ...detailsData.result,
              original_search_ref: place.place_id
            };
          }
          return place;
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
