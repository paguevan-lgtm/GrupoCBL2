import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { location, serviceType } = req.body;

  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API Key not configured' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    let targetDescription = "";
    if (serviceType === 'fretado') {
        targetDescription = "empresas de médio/grande porte, indústrias, fábricas e centros logísticos que podem precisar de transporte fretado para funcionários";
    } else if (serviceType === 'eventos') {
        targetDescription = "casas de festas, organizadores de eventos, buffets e hotéis que realizam eventos e podem precisar de vans para transporte de convidados";
    } else {
        targetDescription = "agências de turismo, hotéis, empresas de eventos e grandes condomínios que precisam de transporte executivo ou viagens";
    }

    const prompt = `
      Atue como um Especialista em Prospecção Logística.
      
      TAREFA: Encontre 10 a 15 alvos cirúrgicos na região de "${location}" que se encaixam neste perfil: ${targetDescription}.
      
      REGRAS DE OURO:
      1. Use o Google Search para encontrar empresas REAIS.
      2. Foque em empresas que tenham fluxo constante de pessoas ou necessidade de deslocamento em grupo.
      3. Extraia: Nome, Endereço, Telefone (se houver), Site e uma "Justificativa Sniper" (por que essa empresa é um alvo perfeito para uma van?).
      
      SAÍDA OBRIGATÓRIA: JSON ARRAY.
      Schema:
      [
        {
          "name": "Nome da Empresa",
          "address": "Endereço completo",
          "phone": "Telefone ou null",
          "website": "URL ou null",
          "justification": "Explique por que eles precisam de uma van (ex: Localização remota, muitos funcionários, eventos frequentes)",
          "vibe": "Tag curta (ex: Indústria, Eventos, Hotel)"
        }
      ]
      
      Retorne APENAS o JSON. Sem markdown.
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
    let results = JSON.parse(cleanText);

    const processedResults = results.map((item, index) => ({
        id: `van_${Date.now()}_${index}`,
        place_id: `van_${Date.now()}_${index}`,
        name: item.name,
        address: item.address,
        phone: item.phone,
        website: item.website,
        rating: 0,
        user_ratings_total: 0,
        status_site: 'sem_site',
        types: [serviceType, 'van_service'],
        ai_snippet: item.justification,
        vibe: item.vibe,
        source: 'van_hunter'
    }));

    return res.status(200).json({ results: processedResults });

  } catch (error) {
    console.error('Error in Van Hunter:', error);
    return res.status(500).json({ error: 'Failed to execute Van Hunter', details: error.message });
  }
}
