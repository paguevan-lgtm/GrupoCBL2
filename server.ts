import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json());

  // --- API ROUTES ---

  // 1. Places API Proxy
  app.post("/api/places", async (req, res) => {
    const { query, pagetoken } = req.body;
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY; // Fallback, though Maps needs Maps Key

    if (!query && !pagetoken) {
      return res.status(400).json({ error: 'Query or pagetoken is required' });
    }
    if (!apiKey) {
      return res.status(500).json({ error: 'Server configuration error: API Key missing' });
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

      // Process results sequentially
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
          // Small delay
          await new Promise(resolve => setTimeout(resolve, 50));
      }

      return res.status(200).json({ 
          results: detailedResults,
          next_page_token: searchData.next_page_token 
      });
    } catch (error: any) {
      console.error('Places API Error:', error);
      return res.status(500).json({ error: 'Failed to fetch places', details: error.message });
    }
  });

  // 2. Find Instagram
  app.post("/api/find-instagram", async (req, res) => {
    const { name, address, website } = req.body;
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

    if (!name) return res.status(400).json({ error: 'Business name is required' });
    if (!apiKey) return res.status(500).json({ error: 'API Key not configured' });

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
        Find the official Instagram profile URL for the business "${name}" located at "${address}".
        Context:
        - Business Name: ${name}
        - Address: ${address}
        - Website: ${website || 'N/A'}
        Task:
        1. Search for the official Instagram page.
        2. Verify it matches the location and business type.
        3. Return ONLY the Instagram URL (e.g., https://www.instagram.com/handle/).
        4. If you cannot find a specific, confident match, return "NOT_FOUND".
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: prompt }] },
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "text/plain"
        }
      });

      const text = response.text ? response.text.trim() : '';
      const urlMatch = text.match(/https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?/);
      
      if (urlMatch) {
         return res.status(200).json({ url: urlMatch[0] });
      }
      return res.status(404).json({ error: 'Instagram not found', raw: text });

    } catch (error: any) {
      console.error('Error finding Instagram:', error);
      return res.status(500).json({ error: 'Failed to search Instagram', details: error.message });
    }
  });

  // 3. Photo Proxy
  app.get("/api/photo", async (req, res) => {
    const { ref } = req.query;
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey) return res.status(500).send('Server configuration error');
    if (!ref) return res.status(400).send('No reference provided');

    try {
      const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${ref}&key=${apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) throw new Error('Failed to fetch image');

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.send(buffer);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching image');
    }
  });

  // 4. Web Hunter
  app.post("/api/web-hunter", async (req, res) => {
    const { query, location } = req.body;
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

    if (!query) return res.status(400).json({ error: 'Query is required' });
    if (!apiKey) return res.status(500).json({ error: 'API Key not configured' });

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
        Atue como um "Lead Scraper" inteligente.
        TAREFA: Encontre 10 a 15 empresas reais do nicho "${query}" na região de "${location}".
        REGRAS DE OURO:
        1. Use o Google Search para encontrar dados reais e recentes.
        2. Tente encontrar empresas que talvez não estejam bem ranqueadas no Maps, mas tenham presença digital (Instagram, Site, Listas).
        3. Extraia o máximo de dados possível: Nome, Endereço (ou cidade/bairro), Telefone (se visível), Site/Instagram.
        4. Classifique a "Vibe" da empresa (Ex: "Moderno", "Tradicional", "Luxo", "Bairro").
        SAÍDA OBRIGATÓRIA: JSON ARRAY.
        Schema:
        [
          {
            "name": "Nome da Empresa",
            "address": "Endereço ou Cidade/Bairro",
            "phone": "Telefone ou null",
            "website": "URL ou null",
            "snippet": "Breve descrição do que encontrou",
            "vibe": "Tag curta"
          }
        ]
        Retorne APENAS o JSON. Sem markdown, sem explicações extras.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: prompt }] },
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json"
        }
      });

      const text = response.text ? response.text.trim() : '[]';
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '');
      let results = [];
      try {
          results = JSON.parse(cleanText);
      } catch (e) {
          console.error("Failed to parse JSON from AI", text);
          return res.status(500).json({ error: 'Failed to parse AI results' });
      }

      const processedResults = results.map((item: any, index: number) => ({
          place_id: `web_${Date.now()}_${index}`,
          name: item.name,
          formatted_address: item.address,
          formatted_phone_number: item.phone,
          website: item.website,
          rating: 0,
          user_ratings_total: 0,
          types: [query, 'web_result'],
          business_status: 'OPERATIONAL',
          ai_snippet: item.snippet,
          vibe: item.vibe,
          source: 'web_hunter'
      }));

      return res.status(200).json({ results: processedResults });

    } catch (error: any) {
      console.error('Error in Web Hunter:', error);
      return res.status(500).json({ error: 'Failed to execute Web Hunter', details: error.message });
    }
  });

  // 5. Generate Strategy (Killer Offer) - Server Side Implementation
  app.post("/api/generate-strategy", async (req, res) => {
      const { prompt } = req.body;
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

      if (!apiKey) return res.status(500).json({ error: 'API Key not configured' });

      try {
          const ai = new GoogleGenAI({ apiKey });
          const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: prompt,
              config: {
                  responseMimeType: "application/json"
              }
          });

          return res.status(200).json({ text: response.text });
      } catch (error: any) {
          console.error("Error generating strategy:", error);
          return res.status(500).json({ error: "Failed to generate strategy", details: error.message });
      }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
