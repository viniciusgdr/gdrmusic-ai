import prismaClient from '@gdrmusic/db/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { RedisHelper } from '../../../db/connection';
import { getSession } from 'next-auth/react';
import { Session } from '../auth/[...nextauth]';
import { makeDownloadUsecase } from '../../../../gdrmusic-backend/src/main/factories/download';
import { makeSaveMusicUsecase } from '../../../../gdrmusic-backend/src/main/factories/save-music';
import { makeMusicAlreadyOnDbUsecase } from '../../../../gdrmusic-backend/src/main/usecases/music-already-on-db';
import { Queue } from '@gdrmusic/models/music';

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
  const { queue } = req.body as { queue: Queue[] }
  if (!Array.isArray(queue)) {
    res.status(400).json({ message: 'Bad request' })
    return
  }
  let userId = session?.user.id ?? req.cookies["next-auth.csrf-token"]?.split('|')[0]! ?? req.cookies["__Host-next-auth.csrf-token"]?.split('|')[0]!
  await RedisHelper.connect()
  const userList = await RedisHelper.client.get('user_' + userId)
  const userQueue: Queue[] = userList ? JSON.parse(userList) : []
  userQueue.splice(0, userQueue.length)
  userQueue.push(...queue)
  if (userQueue.length > 50) {
    userQueue.shift()
  }
  await RedisHelper.client.set('user_' + userId, JSON.stringify(userQueue))
  return res.status(200).json(userQueue)
}
