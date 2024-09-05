import prismaClient from '@gdrmusic/db/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { makeCreatePlaylistController } from '../../../../gdrmusic-backend/src/main/factories/create-playlist';
import { getSession } from 'next-auth/react';
import { Session } from '../auth/[...nextauth]';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
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
  const controller = makeCreatePlaylistController(prismaClient as any)
  const httpResponse = await controller.handle({
    body: {
      userId: session.user.id,
      title: req.body.title || undefined,
      thumbnailUrl: req.body.thumbnailUrl || undefined
    }
  })
  res.status(httpResponse.statusCode).json(httpResponse.body)
}