
import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, address, website } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Business name is required' });
  }

  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API Key not configured' });
  }

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
    
    // Simple validation
    const urlMatch = text.match(/https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?/);
    
    if (urlMatch) {
       return res.status(200).json({ url: urlMatch[0] });
    }

    return res.status(404).json({ error: 'Instagram not found', raw: text });

  } catch (error) {
    console.error('Error finding Instagram:', error);
    
    let errorMessage = error.message;
    if (errorMessage.includes("API key not valid")) {
        errorMessage = "A chave da API do Gemini é inválida. Certifique-se de ter configurado a variável GEMINI_API_KEY corretamente na Vercel com uma chave do Google AI Studio.";
    }
    
    return res.status(500).json({ error: 'Failed to search Instagram', details: errorMessage });
  }
}
