// api/gemini.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GeminiClient } from '@gemini/sdk';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const client = new GeminiClient({ apiKey: process.env.API_KEY });
    const { prompt } = req.body;

    const response = await client.create({
      model: 'gemini-1',
      prompt,
    });

    res.status(200).json(response);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
