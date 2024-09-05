import prismaClient from '@gdrmusic/db/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { RedisHelper } from '../../../db/connection';
import { getSession } from 'next-auth/react';
import { Session } from '../auth/[...nextauth]';
import { makeDownloadUsecase } from '../../../../gdrmusic-backend/src/main/factories/download';
import { makeSaveMusicUsecase } from '../../../../gdrmusic-backend/src/main/factories/save-music';
import { makeMusicAlreadyOnDbUsecase } from '../../../../gdrmusic-backend/src/main/usecases/music-already-on-db';
import { Queue } from '@gdrmusic/models/music';

export function generateId() {
  return Math.random().toString(36).substr(2, 9)
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
  const { id, updateCurrentMusic, playlistId } = req.body as { id: string, updateCurrentMusic: boolean, playlistId: string }
  if (typeof id !== 'string' && typeof playlistId !== 'string') {
    res.status(400).json({ message: 'Bad request' })
    return
  }
  let userId = session?.user.id ?? req.cookies["next-auth.csrf-token"]?.split('|')[0]! ?? req.cookies["__Host-next-auth.csrf-token"]?.split('|')[0]!
  await RedisHelper.connect()
  const userList = await RedisHelper.client.get('user_' + userId)
  const userQueue: Queue[] = userList ? JSON.parse(userList) : []
  if (id && !playlistId) {
    const musicExists = await prismaClient.music.findUnique({
      where: {
        id
      }
    })
    if (!musicExists) {
      res.status(404).json({ message: 'Music not found' })
      return
    }
    const { likesOnPartnerId, partnerId, ...music } = musicExists
    if (userQueue.length === 0) {
      userQueue.push({
        ...music,
        active: updateCurrentMusic,
        _id: generateId()
      })
    } else {
      const previousMusic = userQueue.find((music: any) => music.active)
      if (!previousMusic) {
        userQueue.push({
          ...music,
          active: true,
          _id: generateId()
        })
      } else {
        if (previousMusic.id === id && updateCurrentMusic) {
          res.status(200).json(userQueue)
          return
        }
      }
      if (updateCurrentMusic) {
        const currentSongIndex = userQueue.findIndex((music: any) => music.active)
        userQueue.forEach((music: any) => {
          if (music.active) {
            music.active = false
          }
        })
        // add next song now, and replace all next songs with the new one
        userQueue.splice(currentSongIndex + 1, 0, {
          ...music,
          active: true,
          _id: generateId()
        })
      } else {
        userQueue.push({
          ...music,
          active: false,
          _id: generateId()
        })
        prepareMusicWithAdvance(id)
      }
    }
  } else if (id && playlistId) {
    const playlistExists = await prismaClient.playlist.findUnique({
      where: {
        id: playlistId
      },
      include: {
        musics: {
          include: {
            music: true
          }
        }
      }
    })
    if (!playlistExists) {
      res.status(404).json({ message: 'Playlist not found' })
      return
    }
    if (playlistExists.musics.length === 0) {
      res.status(404).json({ message: 'Playlist is empty' })
      return
    }
    const currentSong = userQueue.find((music: any) => music.active)
    if (currentSong) {
      const activeIndex = userQueue.findIndex((music: any) => music.active)
      if (updateCurrentMusic) {
        currentSong.active = false
      }
      userQueue.splice(activeIndex + 1)
    }
    const musicIdIndex = playlistExists.musics.findIndex((music: any) => music.music.id === id)
    const nexts = playlistExists.musics.slice(musicIdIndex ? musicIdIndex : 0)
    for (let i = 0; i < nexts.length; i++) {
      const music = nexts[i]
      const { likesOnPartnerId, partnerId, ...musicData } = music.music
      userQueue.push({
        ...musicData,
        active: updateCurrentMusic ? i === 0 : false,
        _id: generateId(),
        playlistId: updateCurrentMusic ? playlistId : undefined
      })
      if (i !== 0) prepareMusicWithAdvance(music.music.id)
    }
  }
  if (userQueue.length > 50) {
    userQueue.shift()
  }
  await RedisHelper.client.set('user_' + userId, JSON.stringify(userQueue))
  return res.status(200).json(userQueue)
}

async function prepareMusicWithAdvance(id: string) {
  const musicAlreadyOnDB = makeMusicAlreadyOnDbUsecase()
  const musicExists = await musicAlreadyOnDB.check(id, process.env.PATH_MUSICS || '')
  if (!musicExists) {
    const usecase = makeDownloadUsecase(prismaClient as any)
    const httpResponse = await usecase.download({
      id,
      PATH: process.env.PATH_MUSICS || ''
    })
    console.log('finished download', httpResponse.size)
    const buffers: Buffer[] = []
    httpResponse.stream.on('data', (data: any) => {
      buffers.push(data)
    })
    httpResponse.stream.on('end', (end: any) => {
      console.log('finished download [experience]')
      makeSaveMusicUsecase().save({
        id,
        buffer: Buffer.concat(buffers),
        PATH: process.env.PATH_MUSICS || ''
      })
    })
    httpResponse.stream.on('error', (error: any) => {
      console.log('error', error)
    })
  }
}