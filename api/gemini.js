
import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { contents, model, config } = req.body;

  if (!contents) {
    return res.status(400).json({ error: 'Conteúdo (contents) é obrigatório' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Suporta tanto string simples quanto o objeto estruturado de contents
    const response = await ai.models.generateContent({
      model: model || 'gemini-3-pro-preview',
      contents: contents,
      config: config || {}
    });

    return res.status(200).json({ 
      text: response.text 
    });
  } catch (error) {
    console.error('Erro na API Gemini (Server-side):', error);
    return res.status(500).json({ 
      error: 'Falha ao processar requisição na IA',
      details: error.message 
    });
  }
}
