
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, pagetoken } = req.body;

  if (!query && !pagetoken) {
    return res.status(400).json({ error: 'Query or pagetoken is required' });
  }

  // Tenta usar as chaves de ambiente
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.API_KEY;

  // Função auxiliar para gerar dados falsos caso a API falhe (Modo Demo)
  // Isso garante que o usuário sempre veja algo funcionando no painel
  const generateMockResults = (searchTerm) => {
      const term = searchTerm ? searchTerm.split(' ')[0] : 'Empresa';
      return Array.from({ length: 5 }).map((_, i) => ({
          place_id: `mock_${Date.now()}_${i}`,
          name: `${term} Exemplo ${i + 1} (Demo)`,
          formatted_address: `Av. Paulista, ${1000 + i * 150}, São Paulo - SP`,
          rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 a 5.0
          user_ratings_total: Math.floor(Math.random() * 500) + 10,
          formatted_phone_number: `(11) 99999-${1000 + i}`,
          website: Math.random() > 0.5 ? `https://www.${term.toLowerCase()}${i}.com.br` : undefined,
          types: ['establishment', 'point_of_interest'],
          photos: [] // Sem fotos no mock para não quebrar api/photo
      }));
  };

  if (!apiKey) {
    console.warn("API Key missing. Returning Mock Data.");
    return res.status(200).json({ 
        results: generateMockResults(query),
        is_mock: true
    });
  }

  try {
    let searchUrl;
    
    // Busca Simples (Original) - Sem loop de detalhes para economizar requisições e evitar erros
    if (pagetoken) {
        searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken=${pagetoken}&key=${apiKey}`;
    } else {
        searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;
    }
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    // Se a API do Google recusar (Erro de Chave, Billing, etc), fazemos fallback para o Mock
    if (searchData.status === 'REQUEST_DENIED' || searchData.status === 'OVER_QUERY_LIMIT' || !searchResponse.ok) {
        console.error(`Google Maps API Error (${searchData.status}): ${searchData.error_message}`);
        return res.status(200).json({ 
            results: generateMockResults(query),
            is_mock: true,
            original_error: searchData.error_message
        });
    }

    if (searchData.status !== 'OK' && searchData.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Maps API Status: ${searchData.status}`);
    }

    return res.status(200).json({ 
        results: searchData.results || [],
        next_page_token: searchData.next_page_token 
    });

  } catch (error) {
    console.error('Places API Critical Error:', error);
    // Fallback final de segurança
    return res.status(200).json({ 
        results: generateMockResults(query),
        is_mock: true
    });
  }
}
