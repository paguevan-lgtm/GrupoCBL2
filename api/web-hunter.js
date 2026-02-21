
import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, location } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API Key not configured' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Prompt engineered to extract structured lead data from search results
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
      model: 'gemini-3-pro-image-preview', // Using Pro for better reasoning and search tools
      contents: { parts: [{ text: prompt }] },
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      }
    });

    const text = response.text ? response.text.trim() : '[]';
    
    // Sanitize and parse
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '');
    let results = [];
    try {
        results = JSON.parse(cleanText);
    } catch (e) {
        console.error("Failed to parse JSON from AI", text);
        return res.status(500).json({ error: 'Failed to parse AI results' });
    }

    // Add IDs and structure to match Maps API format roughly
    const processedResults = results.map((item, index) => ({
        place_id: `web_${Date.now()}_${index}`, // Fake ID for Web leads
        name: item.name,
        formatted_address: item.address,
        formatted_phone_number: item.phone,
        website: item.website,
        rating: 0, // Web leads might not have ratings readily available
        user_ratings_total: 0,
        types: [query, 'web_result'],
        business_status: 'OPERATIONAL',
        ai_snippet: item.snippet,
        vibe: item.vibe,
        source: 'web_hunter'
    }));

    return res.status(200).json({ results: processedResults });

  } catch (error) {
    console.error('Error in Web Hunter:', error);
    return res.status(500).json({ error: 'Failed to execute Web Hunter', details: error.message });
  }
}
