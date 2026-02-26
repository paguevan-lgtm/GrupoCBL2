import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

  if (!apiKey) {
    console.error("API Key is missing in environment variables");
    return res.status(500).json({ error: 'Server configuration error: API Key missing' });
  }

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
  } catch (error) {
    console.error("Error generating strategy:", error);
    
    let errorMessage = error.message;
    if (errorMessage.includes("API key not valid")) {
        errorMessage = "A chave da API do Gemini é inválida. Certifique-se de ter configurado a variável GEMINI_API_KEY corretamente na Vercel com uma chave do Google AI Studio.";
    }
    
    return res.status(500).json({ error: "Failed to generate strategy", details: errorMessage });
  }
}
