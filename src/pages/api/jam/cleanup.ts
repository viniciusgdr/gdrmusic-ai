import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { Session } from '../auth/[...nextauth]';
import { RedisHelper } from '@gdrmusic/db/connection';
import { JamInfo } from '@gdrmusic/models/jam';

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
  await RedisHelper.connect()
  const rooms = await RedisHelper.client.keys('room-*')
  for (const room of rooms) {
    const roomData = await RedisHelper.client.get(room)
    if (roomData) {
      const parsedRoom: JamInfo = JSON.parse(roomData)
      const user = parsedRoom.users.find(user => user.userId === session.user.id)
      if (user) {
        parsedRoom.users = parsedRoom.users.filter(user => user.userId !== session.user.id)
        await RedisHelper.client.set(room, JSON.stringify(parsedRoom))
      }
    }
  }
  res.status(200).json({ message: 'Success' })
}