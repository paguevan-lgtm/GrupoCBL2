
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
    // Usando a chave que você forneceu explicitamente para a IA no início.
    const apiKey = "AIzaSyDx8QZ41gze3XEYhXvo6r5EmkXxmC8_daA";
    
    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    console.log("Iniciando requisição Gemini...");

    const response = await ai.models.generateContent({
      model: model || 'gemini-2.0-flash',
      contents: contents,
      config: config || {}
    });

    console.log("Resposta Gemini recebida com sucesso.");

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
