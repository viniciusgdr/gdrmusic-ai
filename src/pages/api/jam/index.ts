import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { Session } from '../auth/[...nextauth]';
import { RedisHelper } from '@gdrmusic/db/connection';
import { JamInfo } from '@gdrmusic/models/jam';

async function generateIdRoom(): Promise<string> {
  const createdId = 'room-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  const room = await RedisHelper.client.get(createdId)
  if (room) {
    return await generateIdRoom()
  } else {
    return createdId
  }
}

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
  const { action } = req.body
  if (typeof action !== 'string') {
    res.status(400).json({ message: 'Bad request' });
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
  switch (action) {
    case 'create':
      const idRoom = await generateIdRoom()
      await RedisHelper.client.set(idRoom, JSON.stringify({
        roomId: idRoom,
        ownerId: null,
        allowCommandsByAll: true,
        users: [],
        queue: [],
        isPlaying: false
      }))
      res.status(200).json({ idRoom })
      break;
    case 'join':
      const { code } = req.body
      if (typeof code !== 'string') {
        res.status(400).json({ message: 'Bad request' });
        return
      }
      const room = await RedisHelper.client.get(code)
      if (!room) {
        res.status(404).json({ message: 'Room not found' });
        return
      }
      res.status(200).json({ idRoom: code })
      break;
    default:
      res.status(400).json({ message: 'Bad request' });
      break;
  }
}