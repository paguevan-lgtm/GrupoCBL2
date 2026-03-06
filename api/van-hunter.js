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
        targetDescription = "empreiteiras de obras, principalmente que prestam serviço para a SABESP, construtoras e empresas de engenharia civil que precisam transportar equipes de operários para canteiros de obras";
    } else if (serviceType === 'eventos') {
        targetDescription = "casas de festas, organizadores de eventos, buffets e hotéis que realizam eventos e podem precisar de vans para transporte de convidados";
    } else {
        targetDescription = "agências de turismo, hotéis, empresas de eventos e grandes condomínios que precisam de transporte executivo ou viagens";
    }

    const prompt = `
      Atue como um Especialista em Inteligência Logística e Prospecção B2B.
      
      TAREFA: Encontre 10 a 15 alvos cirúrgicos na região de "${location}" que se encaixam neste perfil: ${targetDescription}.
      
      REGRAS DE OURO PARA BUSCA:
      1. Use o Google Search para encontrar empresas REAIS e ATIVAS.
      2. Foque em empresas que tenham fluxo constante de pessoas ou necessidade de deslocamento em grupo.
      3. BUSCA DE CONTATO PROFUNDA: Você deve tentar encontrar o número de CELULAR/WHATSAPP da empresa. Muitas vezes o número fixo não tem WhatsApp. Procure em sites, redes sociais ou descrições do Google Maps por números que comecem com (11) 9... ou similares.
      4. Se encontrar apenas o fixo, tente encontrar um segundo número que pareça ser celular.
      
      DADOS NECESSÁRIOS:
      - Nome, Endereço, Telefone (Priorize Celular/WhatsApp), Site.
      - "Justificativa Sniper": Por que essa empresa é um alvo perfeito para uma van? (ex: "Empreiteira da Sabesp com obras em locais variados", "Construtora com canteiro de obras ativo").
      
      SAÍDA OBRIGATÓRIA: JSON ARRAY.
      Schema:
      [
        {
          "name": "Nome da Empresa",
          "address": "Endereço completo",
          "phone": "Número de Celular/WhatsApp (obrigatório tentar achar o celular)",
          "website": "URL ou null",
          "justification": "Justificativa estratégica detalhada",
          "vibe": "Tag (ex: Empreiteira Sabesp, Construtora, Eventos)"
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

    const processedResults = results.map((item, index) => {
        // Gera um ID estável baseado no nome e endereço para evitar duplicatas em sessões diferentes
        const stableId = `van_${Buffer.from(item.name + item.address).toString('hex').substring(0, 16)}`;
        
        return {
            id: stableId,
            place_id: stableId,
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
        };
    });

    return res.status(200).json({ results: processedResults });

  } catch (error) {
    console.error('Error in Van Hunter:', error);
    return res.status(500).json({ error: 'Failed to execute Van Hunter', details: error.message });
  }
}
