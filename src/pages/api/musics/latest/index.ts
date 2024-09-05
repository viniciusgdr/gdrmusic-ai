import prismaClient from '@gdrmusic/db/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { makeMusicsLatestController } from '../../../../../gdrmusic-backend/src/main/factories/musics-latest';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return
  }
  const controller = makeMusicsLatestController(prismaClient as any)
  const httpResponse = await controller.handle(req)
  res.status(httpResponse.statusCode).json(httpResponse.body)
}