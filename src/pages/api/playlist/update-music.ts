import prismaClient from '@gdrmusic/db/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { makeAddMusicPlaylistRepository } from '../../../../gdrmusic-backend/src/main/factories/add-music-playlist';
import { makeDelMusicPlaylistRepository } from '../../../../gdrmusic-backend/src/main/factories/del-music-playlist';
import { RedisHelper } from '@gdrmusic/db/connection';
import { getSession } from 'next-auth/react';
import { Session } from '../auth/[...nextauth]';
import { makeValidateOwnerPlaylistController } from '../../../../gdrmusic-backend/src/main/factories/validate-owner-playlist';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
  if (!req.body.musicId) {
    res.status(400).json({ message: 'Missing param: musicId' });
    return
  }
  if (typeof req.body.playlistId !== 'string' || typeof req.body.musicId !== 'string') {
    res.status(400).json({ message: 'Invalid param: playlistId or musicId' });
    return
  }
  try {
    const { musicId, playlistId, type } = req.body
    if (type !== 'ADD' && type !== 'REMOVE') {
      res.status(400).json({ message: 'Invalid param: type' });
      return
    }
    await RedisHelper.connect()
    const validateOwnerPlaylistController = makeValidateOwnerPlaylistController(prismaClient as any, RedisHelper.client)
    const validateOwnerPlaylistResponse = await validateOwnerPlaylistController.handle({
      body: {
        userId: session.user.id,
        playlistId
      }
    })
    if (!validateOwnerPlaylistResponse.body.isValid) {
      res.status(403).json({ message: 'Forbidden' });
      return
    }
    if (type === 'ADD') {
      const controller = makeAddMusicPlaylistRepository(prismaClient as any)
      const httpResponse = await controller.handle({
        body: {
          playlistId,
          musicId,
          userId: session.user.id
        }
      })
      res.status(httpResponse.statusCode).json(httpResponse.body)
    }  else if (type === 'REMOVE') {
      const controller = makeDelMusicPlaylistRepository(prismaClient as any)
      const httpResponse = await controller.handle({
        body: {
          playlistId,
          musicId,
          userId: session.user.id
        }
      })
      res.status(httpResponse.statusCode).json(httpResponse.body)
    }
  } catch (error: any) {
    console.error(error)
    res.status(500).json('Internal server error')
  }
}