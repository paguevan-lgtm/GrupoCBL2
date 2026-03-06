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
    if (serviceType === 'empreiteiras') {
        targetDescription = "empreiteiras de obras civis, construtoras de infraestrutura e empresas de engenharia que prestam serviços para a SABESP na região da Baixada Santista. Foque em empresas que ganharam licitações ou que realizam manutenção de redes de água e esgoto, pois elas precisam transportar equipes de operários diariamente.";
    } else if (serviceType === 'fretado') {
        targetDescription = "empresas de médio/grande porte, indústrias, fábricas e centros logísticos que possuem muitos funcionários e podem precisar de transporte fretado.";
    } else if (serviceType === 'eventos') {
        targetDescription = "casas de festas, organizadores de eventos, buffets e hotéis que realizam eventos e podem precisar de vans para transporte de convidados.";
    } else {
        targetDescription = "agências de turismo, hotéis e empresas de viagens que precisam de transporte executivo ou turismo.";
    }

    const prompt = `
      Atue como um Especialista em Inteligência Logística e Prospecção B2B de ALTO NÍVEL.
      
      TAREFA: Encontre 10 a 15 alvos REAIS e ESPECÍFICOS na região de "${location}" para o perfil: ${targetDescription}.
      
      REGRAS CRÍTICAS PARA "EMPREITEIRAS SABESP":
      1. NÃO retorne hotéis, pousadas ou agências de turismo. Isso é um erro grave que o usuário reportou.
      2. Pesquise especificamente por:
         - "Empresas contratadas Sabesp Baixada Santista"
         - "Empreiteiras de saneamento em ${location}"
         - "Consórcios de obras Sabesp Santos São Vicente"
         - "Empresas de engenharia civil pesada em ${location}"
      3. Procure por nomes como: "Engeform", "Sanevix", "Consórcio Baixada", "Terracom", "Selt Engenharia", etc.
      4. BUSCA DE CONTATO PROFUNDA: O usuário precisa do WHATSAPP. Procure por números de celular em sites de transparência, redes sociais ou no rodapé dos sites das empresas.
      
      DADOS NECESSÁRIOS:
      - Nome da Empresa, Endereço, Telefone (Priorize Celular/WhatsApp), Site.
      - "Justificativa Sniper": Por que essa empresa precisa de uma VAN hoje? (ex: "Realizando obra de saneamento no bairro X", "Ganhou licitação recente da Sabesp").
      
      SAÍDA OBRIGATÓRIA: JSON ARRAY.
      Retorne APENAS o JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING" },
              address: { type: "STRING" },
              phone: { type: "STRING" },
              website: { type: "STRING" },
              justification: { type: "STRING" },
              vibe: { type: "STRING" }
            },
            required: ["name", "address", "phone", "justification", "vibe"]
          }
        }
      }
    });

    const text = response.text ? response.text.trim() : '[]';
    let results = [];
    try {
        results = JSON.parse(text);
    } catch (e) {
        console.error("Failed to parse JSON from Gemini:", text);
        // Fallback: try to clean markdown if Gemini ignored the mimeType
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        results = JSON.parse(cleanText);
    }

    const processedResults = results.map((item, index) => {
        const name = item.name || "Empresa Desconhecida";
        const address = item.address || "Endereço não informado";
        
        // Gera um ID estável baseado no nome e endereço
        const stableId = `van_${Buffer.from(name + address).toString('hex').substring(0, 16)}`;
        
        return {
            id: stableId,
            place_id: stableId,
            name: name,
            address: address,
            phone: item.phone || "Não encontrado",
            website: item.website || null,
            rating: 0,
            user_ratings_total: 0,
            status_site: item.website ? 'com_site' : 'sem_site',
            types: [serviceType, 'van_service'],
            ai_snippet: item.justification || "Sem justificativa disponível",
            vibe: item.vibe || "Empreiteira",
            source: 'van_hunter'
        };
    });

    return res.status(200).json({ results: processedResults });

  } catch (error) {
    console.error('Error in Van Hunter:', error);
    return res.status(500).json({ error: 'Failed to execute Van Hunter', details: error.message });
  }
}
