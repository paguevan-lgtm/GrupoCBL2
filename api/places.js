
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, pagetoken } = req.body;

  if (!query && !pagetoken) {
    return res.status(400).json({ error: 'Query or pagetoken is required' });
  }

  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("API Key is missing in environment variables");
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    let searchUrl;
    
    if (pagetoken) {
        searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken=${pagetoken}&key=${apiKey}`;
    } else {
        searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;
    }
    
    const searchResponse = await fetch(searchUrl);
    
    if (!searchResponse.ok) {
        const errorText = await searchResponse.text();
        throw new Error(`Google API HTTP ${searchResponse.status}: ${errorText}`);
    }

    const searchData = await searchResponse.json();

    if (searchData.status !== 'OK' && searchData.status !== 'ZERO_RESULTS') {
      throw new Error(`Google API Error: ${searchData.status} ${searchData.error_message ? '- ' + searchData.error_message : ''}`);
    }

    const initialResults = searchData.results || [];
    const detailedResults = [];

    // Process results sequentially to avoid hitting rate limits (QPS)
    for (const place of initialResults) {
        try {
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,international_phone_number,website,rating,user_ratings_total,types,price_level,business_status,opening_hours,photos,url&key=${apiKey}`;
          
          const detailsResponse = await fetch(detailsUrl);
          const detailsData = await detailsResponse.json();

          if (detailsData.status === 'OK') {
            detailedResults.push({
              ...place,
              ...detailsData.result,
              original_search_ref: place.place_id
            });
          } else {
             detailedResults.push(place);
          }
        } catch (err) {
          console.error(`Failed to fetch details for ${place.place_id}`, err);
          detailedResults.push(place);
        }
        // Small delay to be gentle with the API quota
        await new Promise(resolve => setTimeout(resolve, 50));
    }

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
