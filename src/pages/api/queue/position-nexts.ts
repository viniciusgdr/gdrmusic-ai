import { NextApiRequest, NextApiResponse } from 'next';
import { RedisHelper } from '../../../db/connection';
import { getSession } from 'next-auth/react';
import { Session } from '../auth/[...nextauth]';
import { Queue } from '@gdrmusic/models/music';
import prismaClient from '@gdrmusic/db/prismaClient';
import { generateId } from './add';
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
  const nexts: Queue[] = req.body
  if (!nexts || nexts.length === 0) {
    return res.status(400).json({ message: 'Missing nexts' });
  }
  // check content of nexts
  for (let i = 0; i < nexts.length; i++) {
    if (!nexts[i].id || !nexts[i]._id) {
      return res.status(400).json({ message: 'Invalid nexts' });
    }
  }
  let userId = session?.user.id ?? req.cookies["next-auth.csrf-token"]?.split('|')[0]! ?? req.cookies["__Host-next-auth.csrf-token"]?.split('|')[0]!
  await RedisHelper.connect()
  const userList = await RedisHelper.client.get('user_' + userId)
  if (!userList) {
    return res.status(200).json([])
  }
  const userQueue: Queue[] = userList ? JSON.parse(userList) : []
  const currentMusicIndex = userQueue.findIndex((music) => music.active)
  if (currentMusicIndex === -1) {
    return res.status(200).json(userQueue)
  }
  const latestQueue = userQueue.slice(0, currentMusicIndex + 1)
  for (const next of nexts) {
    const existsOnQueue = latestQueue.find((music) => music._id === next._id)
    if (existsOnQueue) {
      continue
    }
    const musicDB = await prismaClient.music.findUnique({
      where: {
        id: next.id
      },
      select: {
        id: true,
        album: true,
        artist: true,
        genre: true,
        thumbnail: true,
        title: true,
        year: true
      }
    })
    if (!musicDB) {
      continue
    }
    const musicQueue = {
      ...musicDB,
      _id: next._id,
      active: false
    }
    latestQueue.push(musicQueue)
  }
  
  await RedisHelper.client.set('user_' + userId, JSON.stringify(latestQueue))

  return res.status(200).json(latestQueue)
}