import prismaClient from '@gdrmusic/db/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { makeSearchController } from '../../../../gdrmusic-backend/src/main/factories/search';
import { RedisHelper } from '@gdrmusic/db/connection';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return
  }
  await RedisHelper.connect()
  const controller = makeSearchController(prismaClient as any, RedisHelper.client)
  const httpResponse = await controller.handle(req)
  res.status(httpResponse.statusCode).json(httpResponse.body)
}