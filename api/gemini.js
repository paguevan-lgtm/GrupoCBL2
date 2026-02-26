
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
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    
    if (!apiKey) {
        throw new Error("API Key não configurada no servidor (process.env.GEMINI_API_KEY ou API_KEY)");
    }
    
    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    console.log("Iniciando requisição Gemini...");

    const response = await ai.models.generateContent({
      model: model || 'gemini-3-flash-preview',
      contents: contents,
      config: config || {}
    });

    console.log("Resposta Gemini recebida com sucesso.");

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json({ 
      text: response.text 
    });
  } catch (error) {
    console.error('Erro CRÍTICO na API Gemini:', error);
    return res.status(500).json({ 
      error: 'Falha ao processar requisição na IA',
      details: error.message,
      stack: error.stack
    });
  }
}
