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
  let userId = session?.user.id ?? req.cookies["next-auth.csrf-token"]?.split('|')[0]! ?? req.cookies["__Host-next-auth.csrf-token"]?.split('|')[0]!
  await RedisHelper.connect()
  const userList = await RedisHelper.client.get('user_' + userId)
  const userQueue = userList ? JSON.parse(userList) : []
  const active = userQueue.find((music: any) => music.active)
  if (!active) {
    await RedisHelper.client.del('user_' + userId)
    return res.status(200).json([])
  }
  const activeIndex = userQueue.findIndex((music: any) => music.active)
  const nexts = userQueue.slice(activeIndex + 1)
  for (const music of nexts) {
    userQueue.splice(userQueue.indexOf(music), 1) 
  }
  await RedisHelper.client.set('user_' + userId, JSON.stringify(userQueue))
  return res.status(200).json(userQueue)
}