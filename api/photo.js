
export default async function handler(req, res) {
  const { ref } = req.query;
  const apiKey = process.env.API_KEY; 
  
  if (!apiKey) {
    console.error("API_KEY environment variable is missing");
    return res.status(500).send('Server configuration error');
  }
  
  if (!ref) return res.status(400).send('No reference provided');

  try {
    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${ref}&key=${apiKey}`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error('Failed to fetch image');

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache por 1 dia
    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching image');
  }
}
