
import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // Garantir que apenas requisições POST sejam aceitas
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { prompt, model, config } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'O prompt é obrigatório' });
  }

  try {
    // Inicializa a IA usando a chave de ambiente protegida no Vercel
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Executa a geração de conteúdo
    const response = await ai.models.generateContent({
      model: model || 'gemini-3-pro-preview',
      contents: prompt,
      config: config || {}
    });

    // Retorna o texto gerado para o front-end
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
