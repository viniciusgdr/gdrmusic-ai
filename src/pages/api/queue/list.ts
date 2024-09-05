import prismaClient from '@gdrmusic/db/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { RedisHelper } from '../../../db/connection';
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
  try {
    await RedisHelper.connect()
    let userId = session?.user.id ?? req.cookies["next-auth.csrf-token"]?.split('|')[0]! ?? req.cookies["__Host-next-auth.csrf-token"]?.split('|')[0]!
    if (!userId) {
      return res.status(200).json([])
    }
    const userList = await RedisHelper.client.get('user_' + userId)
    if (userList) {
      res.status(200).json(JSON.parse(userList))
      return
    }
    return res.status(200).json([])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}