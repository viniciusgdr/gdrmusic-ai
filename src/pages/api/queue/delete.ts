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
  const { _id } = req.body
  if (typeof _id !== 'string') {
    res.status(400).json({ message: 'Bad request' })
    return
  }
  let userId = session?.user.id ?? req.cookies["next-auth.csrf-token"]?.split('|')[0]! ?? req.cookies["__Host-next-auth.csrf-token"]?.split('|')[0]!
  await RedisHelper.connect()
  const userList = await RedisHelper.client.get('user_' + userId)
  const userQueue = userList ? JSON.parse(userList) : []
  const index = userQueue.findIndex((music: any) => music._id === _id)
  if (index === -1) {
    res.status(404).json({ message: 'Music not found' })
    return
  }
  userQueue.splice(index, 1)
  await RedisHelper.client.set('user_' + userId, JSON.stringify(userQueue))
  return res.status(200).json(userQueue)
}