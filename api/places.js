
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  // Chave fornecida pelo usuário
  const apiKey = "AIzaSyC1mfIO67ZnVuMbbDoyibfX_A_O2D9eB5s";

  try {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;

    console.log(`[API Places] Fetching: ${url.replace(apiKey, 'HIDDEN_KEY')}`);
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`Google Maps API HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Maps API Data Error: ${data.status} - ${data.error_message || ''}`);
    }

    return res.status(200).json({ results: data.results });
  } catch (error) {
    console.error('Places API Error:', error);
    return res.status(500).json({ 
        error: 'Failed to fetch places', 
        details: error.message 
    });
  }
}
