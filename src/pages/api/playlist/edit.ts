import prismaClient from '@gdrmusic/db/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';
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
  if (!session) {
    res.status(401).json({ message: 'Unauthorized' });
    return
  }
  const { playlistId, title, description, thumbnail } = req.body;
  if (!playlistId || !title) {
    res.status(400).json({ message: 'Missing required fields' });
    return
  }
  try {
    const playlist = await prismaClient.playlist.findUnique({
      where: {
        id: playlistId
      }
    });
    if (!playlist) {
      res.status(404).json({ message: 'Playlist not found' });
      return
    }
    if (playlist.userId !== session.user.id) {
      res.status(403).json({ message: 'Forbidden' });
      return
    }
    if (playlist.createdBy === 'SYSTEM') {
      res.status(403).json({ message: 'Forbidden' });
      return
    }
    const updatedPlaylist = await prismaClient.playlist.update({
      where: {
        id: playlistId
      },
      data: {
        title,
        description,
        thumbnail
      }
    });
    res.status(200).json(updatedPlaylist);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
}