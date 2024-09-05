import prismaClient from '@gdrmusic/db/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { makePlaylistListController } from '../../../../gdrmusic-backend/src/main/factories/playlist-list';
import { RedisHelper } from '@gdrmusic/db/connection';
import { getSession } from 'next-auth/react';
import { Session } from '../auth/[...nextauth]';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return
  }
  const session = await getSession({
    req: {
      headers: {
        cookie: req.headers.cookie
      }
    }
  }) as Session | null;
  if (!session) {
    res.status(401).json({ message: 'Unauthorized' });
    return
  }
  await RedisHelper.connect()
  const controller = makePlaylistListController(prismaClient as any)
  const httpResponse = await controller.handle({
    body: {
      userId: session.user.id
    }
  })
  res.status(httpResponse.statusCode).json(httpResponse.body)
}