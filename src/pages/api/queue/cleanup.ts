import { NextApiRequest, NextApiResponse } from 'next';
import { RedisHelper } from '../../../db/connection';
import { getSession } from 'next-auth/react';
import { Session } from '../auth/[...nextauth]';
import { Queue } from '@gdrmusic/models/music';
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
  let userId = session?.user.id ?? req.cookies["next-auth.csrf-token"]?.split('|')[0]! ?? req.cookies["__Host-next-auth.csrf-token"]?.split('|')[0]!
  await RedisHelper.connect()
  await RedisHelper.client.del('user_' + userId)
  return res.status(200).json([])
}