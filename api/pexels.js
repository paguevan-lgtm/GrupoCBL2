
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const apiKey = process.env.PEXELS_API_KEY;

  // Se não tiver chave configurada, retorna erro para ativar o fallback no frontend
  if (!apiKey) {
    return res.status(503).json({ error: 'Pexels API Key not configured' });
  }

  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=6&orientation=landscape&size=large`, {
      headers: {
        Authorization: apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Pexels API Error: ${response.status}`);
    }

    const data = await response.json();
    
    // Mapeia para retornar apenas os URLs necessários
    const images = data.photos.map(photo => ({
      src: photo.src.large2x || photo.src.large,
      alt: photo.alt
    }));

    return res.status(200).json({ images });
  } catch (error) {
    console.error('Pexels API Error:', error);
    return res.status(500).json({ error: 'Failed to fetch images' });
  }
}
