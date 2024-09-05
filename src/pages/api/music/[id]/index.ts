import prismaClient from '@gdrmusic/db/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { makeDownloadUsecase } from '../../../../../gdrmusic-backend/src/main/factories/download';
import { makeSaveMusicUsecase } from '../../../../../gdrmusic-backend/src/main/factories/save-music';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return
  }
  const { id, action } = req.query
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
  const usecase = makeDownloadUsecase(prismaClient as any)
  const httpResponse = await usecase.download({
    id,
    PATH: process.env.PATH_MUSICS || ''
  })
  console.log('finished download', httpResponse.size, musicExists.title)
  res.setHeader('Content-Type', 'audio/mp3')
  if (action === 'download') {
    res.setHeader('Content-Disposition', `attachment; filename=${musicExists.title}.mp3`)
  } else {
    res.setHeader('Content-Disposition', `attachment; filename=${id}.mp3`)
  }
  res.setHeader('Content-Length', httpResponse.size)
  res.setHeader('Accept-Ranges', 'bytes')

  const buffers: Buffer[] = []
  await new Promise((resolve, reject) => {
    httpResponse.stream.pipe(res)
    httpResponse.stream.on('data', (data: any) => {
      buffers.push(data)
    })
    httpResponse.stream.on('end', (end: any) => {
      console.log('finished')
      makeSaveMusicUsecase().save({
        id,
        buffer: Buffer.concat(buffers),
        PATH: process.env.PATH_MUSICS || ''
      })
      resolve(end)
    })
    httpResponse.stream.on('error', reject)
  })
}

export const config = {
  api: {
    responseLimit: '50mb',
  }
}