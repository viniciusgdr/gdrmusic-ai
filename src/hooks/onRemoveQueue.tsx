import { Queue } from '@gdrmusic/models/music'
import { useContext } from 'react'
import { MusicContext } from './MusicContext'
import { Socket } from 'socket.io-client'

export const onRemoveQueue = async ({
  musicId,
  setQueue,
  socket,
  isPlaying
}: {
  musicId: string,
  setQueue: React.Dispatch<React.SetStateAction<Queue[]>>,
  socket: Socket | null,
  isPlaying: [boolean, boolean],
}): Promise<{
  status: number
}> => {
  const response = await fetch(`/api/queue/delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      _id: musicId
    })
  })
  if (response.status === 200) {
    const data = await response.json()
    if (socket) {
      socket.emit('queue', {
        updatedQueue: data,
        isPlaying: isPlaying[0]
      })
    }
    setQueue(data)
  }
  return {
    status: response.status
  }
}