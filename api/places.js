
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, pagetoken } = req.body;

  if (!query && !pagetoken) {
    return res.status(400).json({ error: 'Query or pagetoken is required' });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.API_KEY;

  if (!apiKey) {
    console.error("API Key is missing in environment variables");
    return res.status(500).json({ error: 'Server configuration error: GOOGLE_MAPS_API_KEY missing' });
  }

  try {
    const searchUrl = `https://places.googleapis.com/v1/places:searchText`;
    
    const requestBody = {
        textQuery: query,
    };
    if (pagetoken) {
        requestBody.pageToken = pagetoken;
    }

    const fieldMask = 'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.types,places.priceLevel,places.businessStatus,places.regularOpeningHours,places.photos,places.googleMapsUri,nextPageToken';

    const searchResponse = await fetch(searchUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': fieldMask
        },
        body: JSON.stringify(requestBody)
    });

    if (!searchResponse.ok) {
        const errorText = await searchResponse.text();
        throw new Error(`Google API HTTP ${searchResponse.status}: ${errorText}`);
    }

    const searchData = await searchResponse.json();
    
    const initialResults = searchData.places || [];
    const detailedResults = initialResults.map((place) => {
        let price_level = undefined;
        if (place.priceLevel === 'PRICE_LEVEL_INEXPENSIVE') price_level = 1;
        else if (place.priceLevel === 'PRICE_LEVEL_MODERATE') price_level = 2;
        else if (place.priceLevel === 'PRICE_LEVEL_EXPENSIVE') price_level = 3;
        else if (place.priceLevel === 'PRICE_LEVEL_VERY_EXPENSIVE') price_level = 4;

        let photos = undefined;
        if (place.photos && place.photos.length > 0) {
            photos = place.photos.map((p) => ({
                photo_reference: p.name,
                height: p.heightPx,
                width: p.widthPx
            }));
        }

        return {
            place_id: place.id,
            name: place.displayName?.text,
            formatted_address: place.formattedAddress,
            formatted_phone_number: place.nationalPhoneNumber,
            international_phone_number: place.internationalPhoneNumber,
            website: place.websiteUri,
            rating: place.rating,
            user_ratings_total: place.userRatingCount,
            types: place.types,
            price_level: price_level,
            business_status: place.businessStatus,
            opening_hours: place.regularOpeningHours ? { open_now: place.regularOpeningHours.openNow } : undefined,
            photos: photos,
            url: place.googleMapsUri,
            original_search_ref: place.id
        };
    });

    return res.status(200).json({ 
        results: detailedResults,
        next_page_token: searchData.nextPageToken 
    });
  } catch (error) {
    console.error('Places API Error:', error);
    return res.status(500).json({ 
        error: 'Failed to fetch places', 
        details: error.message 
    });
  }
}
