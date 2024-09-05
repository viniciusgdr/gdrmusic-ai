import prismaClient from '@gdrmusic/db/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { makeDeletePlaylistController } from '../../../../gdrmusic-backend/src/main/factories/delete-playlist';
import { makeValidateOwnerPlaylistController } from '../../../../gdrmusic-backend/src/main/factories/validate-owner-playlist';
import { getSession } from 'next-auth/react';
import { Session } from '../auth/[...nextauth]';
import { RedisHelper } from '@gdrmusic/db/connection';
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
  if (!req.body.playlistId) {
    res.status(400).json({ message: 'Missing param: playlistId' });
    return
  }
  if (typeof req.body.playlistId !== 'string') {
    res.status(400).json({ message: 'Invalid param: playlistId' });
    return
  }
  await RedisHelper.connect()
  const validateOwnerPlaylistController = makeValidateOwnerPlaylistController(prismaClient as any, RedisHelper.client)
  const validateOwnerPlaylistResponse = await validateOwnerPlaylistController.handle({
    body: {
      userId: session.user.id,
      playlistId: req.body.playlistId
    }
  })
  if (!validateOwnerPlaylistResponse.body.isValid) {
    res.status(403).json({ message: 'Forbidden' });
    return
  }
  const controller = makeDeletePlaylistController(prismaClient as any)
  const httpResponse = await controller.handle({
    body: {
      userId: session.user.id,
      playlistId: req.body.playlistId
    }
  })
  res.status(httpResponse.statusCode).json(httpResponse.body)
}