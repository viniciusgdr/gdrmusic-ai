import prismaClient from '@gdrmusic/db/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { RedisHelper } from '../../../db/connection';
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
  const { id, action } = req.body as { id: string, action: 'next' | 'previous' }
  if (typeof id !== 'string') {
    res.status(400).json({ message: 'Bad request' })
    return
  }
  const musicExists = await prismaClient.music.findUnique({
    where: {
      id
    }
  })
  if (!musicExists) {
    res.status(404).json({ message: 'Music not found' })
    return
  }
  let userId = session?.user.id ?? req.cookies["next-auth.csrf-token"]?.split('|')[0]! ?? req.cookies["__Host-next-auth.csrf-token"]?.split('|')[0]!
  await RedisHelper.connect()
  const userList = await RedisHelper.client.get('user_' + userId)
  const userQueue = userList ? JSON.parse(userList) : []
  const activeMusics = userQueue.filter((music: any) => music.active)
  if (activeMusics.length > 1) {
    for (let i = 0; i < activeMusics.length - 1; i++) {
      activeMusics[i].active = false
    }
  }
  const index = userQueue.findIndex((music: any) => music.active)
  if (index > -1) {
    if (action === 'next') {
      const nextIndex = index + 1
      userQueue[index].active = false
      if (nextIndex < userQueue.length) {
        userQueue[nextIndex].active = true
      }
    } else if (action === 'previous') {
      const previousIndex = index - 1
      if (previousIndex > -1) {
        userQueue[index].active = false
        userQueue[previousIndex].active = true
      }
    }
  }
  await RedisHelper.client.set('user_' + userId, JSON.stringify(userQueue))
  return res.status(200).json(userQueue)
}