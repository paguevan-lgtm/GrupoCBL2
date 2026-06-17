import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json());

  // --- API ROUTES ---

  // 1. Places API Proxy
  app.post("/api/places", async (req, res) => {
    const { query, pagetoken } = req.body;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.API_KEY; 

    if (!query && !pagetoken) {
      return res.status(400).json({ error: 'Query or pagetoken is required' });
    }
    if (!apiKey) {
      return res.status(500).json({ error: 'Server configuration error: GOOGLE_MAPS_API_KEY missing' });
    }

    try {
      const searchUrl = `https://places.googleapis.com/v1/places:searchText`;
      
      const requestBody: any = {
          textQuery: query,
      };
      if (pagetoken) {
          requestBody.pageToken = pagetoken;
      }

      const fieldMask = 'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.types,places.priceLevel,places.businessStatus,places.regularOpeningHours,places.photos,places.googleMapsUri,nextPageToken';

      const searchResponse = await fetch(searchUrl, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': apiKey,
              'X-Goog-FieldMask': fieldMask
          },
          body: JSON.stringify(requestBody)
      });

      if (!searchResponse.ok) {
          const errorText = await searchResponse.text();
          throw new Error(`Google API HTTP ${searchResponse.status}: ${errorText}`);
      }

      const searchData = await searchResponse.json();
      
      const initialResults = searchData.places || [];
      const detailedResults = initialResults.map((place: any) => {
          let price_level = undefined;
          if (place.priceLevel === 'PRICE_LEVEL_INEXPENSIVE') price_level = 1;
          else if (place.priceLevel === 'PRICE_LEVEL_MODERATE') price_level = 2;
          else if (place.priceLevel === 'PRICE_LEVEL_EXPENSIVE') price_level = 3;
          else if (place.priceLevel === 'PRICE_LEVEL_VERY_EXPENSIVE') price_level = 4;

          let photos = undefined;
          if (place.photos && place.photos.length > 0) {
              photos = place.photos.map((p: any) => ({
                  photo_reference: p.name,
                  height: p.heightPx,
                  width: p.widthPx
              }));
          }

          return {
              place_id: place.id,
              name: place.displayName?.text,
              formatted_address: place.formattedAddress,
              formatted_phone_number: place.nationalPhoneNumber,
              international_phone_number: place.internationalPhoneNumber,
              website: place.websiteUri,
              rating: place.rating,
              user_ratings_total: place.userRatingCount,
              types: place.types,
              price_level: price_level,
              business_status: place.businessStatus,
              opening_hours: place.regularOpeningHours ? { open_now: place.regularOpeningHours.openNow } : undefined,
              photos: photos,
              url: place.googleMapsUri,
              original_search_ref: place.id
          };
      });

      return res.status(200).json({ 
          results: detailedResults,
          next_page_token: searchData.nextPageToken 
      });
    } catch (error: any) {
      console.error('Places API Error:', error);
      return res.status(500).json({ error: 'Failed to fetch places', details: error.message });
    }
  });

  // 2. Find Instagram
  app.post("/api/find-instagram", async (req, res) => {
    const { name, address, website } = req.body;
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

    if (!name) return res.status(400).json({ error: 'Business name is required' });
    if (!apiKey) return res.status(500).json({ error: 'API Key not configured' });

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
      const urlMatch = text.match(/https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?/);
      
      if (urlMatch) {
         return res.status(200).json({ url: urlMatch[0] });
      }
      return res.status(404).json({ error: 'Instagram not found', raw: text });

    } catch (error: any) {
      console.error('Error finding Instagram:', error);
      return res.status(500).json({ error: 'Failed to search Instagram', details: error.message });
    }
  });

  // 3. Photo Proxy
  app.get("/api/photo", async (req, res) => {
    const { ref } = req.query;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.API_KEY;
    
    if (!apiKey) return res.status(500).send('Server configuration error: GOOGLE_MAPS_API_KEY missing');
    if (!ref) return res.status(400).send('No reference provided');

    try {
      let url = "";
      // Check if it's the new API format (places/PLACE_ID/photos/PHOTO_REFERENCE)
      if (typeof ref === 'string' && ref.startsWith('places/')) {
          url = `https://places.googleapis.com/v1/${ref}/media?maxHeightPx=800&maxWidthPx=800&key=${apiKey}`;
      } else {
          // Fallback to legacy
          url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${ref}&key=${apiKey}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) throw new Error('Failed to fetch image');

      const contentType = response.headers.get('content-type');
      if (contentType) {
          res.setHeader('Content-Type', contentType);
      }
      res.setHeader('Cache-Control', 'public, max-age=86400');
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      res.send(buffer);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching image');
    }
  });

  // 4. Web Hunter
  app.post("/api/web-hunter", async (req, res) => {
    const { query, location } = req.body;
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

    if (!query) return res.status(400).json({ error: 'Query is required' });
    if (!apiKey) return res.status(500).json({ error: 'API Key not configured' });

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
        Atue como um "Lead Scraper" inteligente.
        TAREFA: Encontre 10 a 15 empresas reais do nicho "${query}" na região de "${location}".
        REGRAS DE OURO:
        1. Use o Google Search para encontrar dados reais e recentes.
        2. Tente encontrar empresas que talvez não estejam bem ranqueadas no Maps, mas tenham presença digital (Instagram, Site, Listas).
        3. Extraia o máximo de dados possível: Nome, Endereço (ou cidade/bairro), Telefone (se visível), Site/Instagram.
        4. Classifique a "Vibe" da empresa (Ex: "Moderno", "Tradicional", "Luxo", "Bairro").
        SAÍDA OBRIGATÓRIA: JSON ARRAY.
        Schema:
        [
          {
            "name": "Nome da Empresa",
            "address": "Endereço ou Cidade/Bairro",
            "phone": "Telefone ou null",
            "website": "URL ou null",
            "snippet": "Breve descrição do que encontrou",
            "vibe": "Tag curta"
          }
        ]
        Retorne APENAS o JSON. Sem markdown, sem explicações extras.
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
      let results = [];
      try {
          results = JSON.parse(cleanText);
      } catch (e) {
          console.error("Failed to parse JSON from AI", text);
          return res.status(500).json({ error: 'Failed to parse AI results' });
      }

      const processedResults = results.map((item: any, index: number) => ({
          place_id: `web_${Date.now()}_${index}`,
          name: item.name,
          formatted_address: item.address,
          formatted_phone_number: item.phone,
          website: item.website,
          rating: 0,
          user_ratings_total: 0,
          types: [query, 'web_result'],
          business_status: 'OPERATIONAL',
          ai_snippet: item.snippet,
          vibe: item.vibe,
          source: 'web_hunter'
      }));

      return res.status(200).json({ results: processedResults });

    } catch (error: any) {
      console.error('Error in Web Hunter:', error);
      return res.status(500).json({ error: 'Failed to execute Web Hunter', details: error.message });
    }
  });

  // 5. Generate Strategy (Killer Offer) - Server Side Implementation
  app.post("/api/generate-strategy", async (req, res) => {
      const { prompt } = req.body;
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

      if (!apiKey) return res.status(500).json({ error: 'API Key not configured' });

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
      } catch (error: any) {
          console.error("Error generating strategy:", error);
          return res.status(500).json({ error: "Failed to generate strategy", details: error.message });
      }
  });

      const DEFAULT_MARKETPLACES = [
      { id: 'ml_classico', name: 'Mercado Livre (Clássico)', feePercent: 11.5, fixedFee: 6, threshold: 79, rulesDescription: 'Taxa base para categorias gerais.', brandColor: 'text-yellow-400', bgColor: 'bg-yellow-400/10', borderColor: 'border-yellow-400/20' },
      { id: 'ml_premium', name: 'Mercado Livre (Premium)', feePercent: 16.5, fixedFee: 6, threshold: 79, rulesDescription: 'Exposição máxima no ML.', brandColor: 'text-yellow-500', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/20' },
      { id: 'shopee', name: 'Shopee (Padrão)', feePercent: 14, fixedFee: 3, threshold: 0, rulesDescription: 'Taxa padrão sem programa de frete grátis.', brandColor: 'text-orange-500', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/20' },
      { id: 'shopee_frete', name: 'Shopee (Frete Grátis)', feePercent: 20, fixedFee: 3, threshold: 0, rulesDescription: 'Inclui 6% do programa Frete Grátis Extra.', brandColor: 'text-orange-500', bgColor: 'bg-orange-600/10', borderColor: 'border-orange-600/20' },
      { id: 'amazon', name: 'Amazon Brasil', feePercent: 15, fixedFee: 0, threshold: 0, rulesDescription: 'Taxa média. Varia de 8% a 15% por categoria.', brandColor: 'text-blue-400', bgColor: 'bg-blue-400/10', borderColor: 'border-blue-400/20' },
      { id: 'magalu', name: 'Magalu', feePercent: 16, fixedFee: 3, threshold: 0, rulesDescription: 'Taxa base + custo fixo transacional.', brandColor: 'text-blue-600', bgColor: 'bg-blue-600/10', borderColor: 'border-blue-600/20' },
      { id: 'b2w', name: 'Americanas (B2W)', feePercent: 16, fixedFee: 0, threshold: 0, rulesDescription: 'Taxa padrão aplicável à maioria das categorias.', brandColor: 'text-red-500', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/20' },
      { id: 'tiktok', name: 'TikTok Shop', feePercent: 12, fixedFee: 3, threshold: 0, rulesDescription: 'Taxa inicial + tarifa fixa por pedido.', brandColor: 'text-pink-500', bgColor: 'bg-pink-500/10', borderColor: 'border-pink-500/20' },
      { id: 'shein', name: 'Shein Marketplace', feePercent: 12, fixedFee: 0, threshold: 0, rulesDescription: 'Comissão base para vendedores nacionais.', brandColor: 'text-slate-900', bgColor: 'bg-slate-800/10', borderColor: 'border-slate-800/20' },
      { id: 'aliexpress', name: 'AliExpress Brasil', feePercent: 8, fixedFee: 0, threshold: 0, rulesDescription: 'Vendedores locais BR. Taxas menores.', brandColor: 'text-red-600', bgColor: 'bg-red-600/10', borderColor: 'border-red-600/20' },
      { id: 'casasbahia', name: 'Casas Bahia', feePercent: 16, fixedFee: 0, threshold: 0, rulesDescription: 'Taxa comumente aplicada a eletrônicos/móveis.', brandColor: 'text-blue-500', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20' }
    ];

  // 6. Marketplaces Dynamic AI Rates (Ecommerce Hub)
  app.post("/api/marketplaces-ai", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'API Key not configured', fallback: DEFAULT_MARKETPLACES });
      }

      const { category, price } = req.body;

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
        Atue como um especialista em Marketplaces Brasileiros (Mercado Livre, Shopee, Amazon Brasil, Magalu, TikTok Shop, Shein, AliExpress, Casas Bahia, Americanas).
        Eu preciso calcular as taxas exatas para um produto vendido hoje.
        
        Categoria do produto: "${category || 'Geral'}"
        Preço de Venda: R$ ${price || '100'}

        Analise a política de taxas de ${new Date().getFullYear()} para cada um dos seguintes marketplaces e retorne as opções em formato JSON:
        - Mercado Livre (Clássico e Premium)
        - Shopee (Padrão e Frete Grátis)
        - Amazon Brasil
        - Magalu
        - TikTok Shop
        - Shein Marketplace
        - AliExpress Brasil
        - Casas Bahia
        - Americanas Marketplace

        Para cada um, identifique:
        - feePercent: A porcentagem de comissão para a categoria informada.
        - fixedFee: A tarifa fixa (se houver, ex: R$ 6 no ML abaixo de R$ 79, R$ 3 na Shopee, etc). Considere a regra de threshold.
        - threshold: O valor limite para a cobrança da taxa fixa (ex: 79 no ML). Retorne 0 se a taxa fixa for cobrada sempre.
        - rulesDescription: Uma breve explicação de 1 frase do porquê dessa taxa (baseado na categoria e valor).
        
        RETORNE APENAS UM ARRAY JSON VÁLIDO DE OBJETOS com os campos: 
        id, name, feePercent (number), fixedFee (number), threshold (number), rulesDescription (string), brandColor, bgColor, borderColor.
        
        Use as cores adequadas para cada marca (ex: text-yellow-400 para ML, text-orange-500 para Shopee, text-pink-500 para TikTok).
        
        JSON LIMIT: Responda APENAS com o JSON, sem formatação markdown, sem \`\`\`json.
      `;

      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: { parts: [{ text: prompt }] }
        });
      } catch (aiError) {
        console.error('AI generation failed, returning fallback:', aiError.message);
        return res.status(200).json(DEFAULT_MARKETPLACES);
      }

      const text = response.text ? response.text.trim() : '[]';
      let results = [];
      try {
          const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
          const match = cleanText.match(/\[[\s\S]*\]/);
          results = JSON.parse(match ? match[0] : cleanText);
          if (!Array.isArray(results) || results.length === 0) {
              return res.status(200).json(DEFAULT_MARKETPLACES);
          }
      } catch (e) {
          console.error('Failed to parse AI JSON:', text);
          results = DEFAULT_MARKETPLACES;
      }

      return res.status(200).json(results);
    } catch (error) {
      console.error('Error fetching marketplace rates from AI:', error);
      return res.status(200).json(DEFAULT_MARKETPLACES); // Always return fallback
    }
  });

  app.get("/api/marketplaces", (req, res) => {
    return res.status(200).json(DEFAULT_MARKETPLACES);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files from dist
    app.use(express.static(path.resolve(__dirname, "dist")));

    // Handle SPA fallback for non-API routes
    app.get("*", (req, res) => {
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'Not Found' });
      }
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
