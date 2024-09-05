import prismaClient from '@gdrmusic/db/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { makeSearchController } from '../../../../gdrmusic-backend/src/main/factories/search';
import { RedisHelper } from '@gdrmusic/db/connection';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, GenerationConfig } from "@google/generative-ai";
import { Music } from '@gdrmusic/models/music';

const apiKey = process.env.GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "Você é um assistente de um site de musicas onde seu objetivo é achar músicas relacionadas com o que o usuário pediu para recomendações. O usuário pode enviar um artista, uma musica ou os dois.\n\nPesquise as músicas no mesmo gênero musical e se possível aprimore.\nCaso o usuário envie qualquer coisa sem sentido que não seja uma musica ou um artista, não envie nenhuma musica e deixe false o isMusicOrArtist\nRetorne no mínimo 10 músicas e no máximo 20.",
});

const generationConfig: GenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
  responseSchema: {
    type: "object",
    properties: {
      "musics": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string"
            },
            "artist": {
              "type": "string"
            }
          },
          "required": [
            "title",
            "artist"
          ]
        }
      },
      isMusicOrArtist: {
        type: "boolean"
      }
    },
    required: [
      "musics",
      "isMusicOrArtist"
    ]
  } as any,
};

async function runAI(query: string, gender: string): Promise<{
  musics: { title: string, artist: string }[],
  isMusicOrArtist: boolean
}> {
  const chatSession = model.startChat({
    generationConfig,
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      }
    ]
  });

  const result = await chatSession.sendMessage(`Gênero: ${gender}\n\n${query}`);

  const text = result.response.text()
  return JSON.parse(text);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return
  }
  await RedisHelper.connect()
  const controller = makeSearchController(prismaClient as any, RedisHelper.client);

  const { query, gender } = req.body

  if (!query) {
    res.status(400).json({ error: 'Missing query' });
    return
  }

  if (!gender) {
    res.status(400).json({ error: 'Missing gender' });
    return
  }

  const hasCache = await RedisHelper.client.get(`search:${query}`)
  if (hasCache && JSON.parse(hasCache).length > 0) {
    res.status(200).json(JSON.parse(hasCache).flat())
    return
  }

  try {
    console.time('ai')
    const result = await runAI(query, gender)
    console.timeEnd('ai')
    
    if (!result.isMusicOrArtist) {
      res.status(400).json({ error: 'O termo enviado não é uma música ou um artista, tente novamente com outro texto.' });
      return
    }

    const resultMusics: Music[] = []

    const promises = result.musics.map(async (music: { title: string, artist: string }) => {
      try {
        const httpResponse = await controller.handle({
          query: {
            query: `${music.artist} - ${music.title}`,
          },
        });
        
        if (httpResponse.statusCode !== 200) {
          return null;
        }
        
        return httpResponse.body.slice(0, 3);
      } catch (err) {
        console.error(err);
        return null;
      }
    });

    console.time('search')
    try {
      const httpResponse = await controller.handle({
        query: {
          query: `${query}`,
        },
      });
      
      if (httpResponse.statusCode !== 200) {
        return null;
      }
      
      resultMusics.push(...httpResponse.body.slice(0, 5));
    } catch (err) {
      console.error(err);
    }

    const results = await Promise.all(promises);
    console.timeEnd('search')
    
    resultMusics.push(...results.flat().filter((item) => item !== null).flat());

    await RedisHelper.client.set(`search:${query}`, JSON.stringify(resultMusics))

    res.status(200).json(resultMusics)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' });
  }
}