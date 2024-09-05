import { Notify } from '@gdrmusic/components/Notify'
import { Queue } from '@gdrmusic/models/music'
import { SetQueue } from '@gdrmusic/types/setQueue'
import { Dispatch, SetStateAction, useContext } from 'react'
import { MusicContext } from './MusicContext'
import { Socket } from 'socket.io-client'

export const onPlay = async (
  id: string,
  queue: Queue[],
  setQueue: SetQueue,
  isPlaying: [boolean, boolean],
  setIsPlaying: Dispatch<SetStateAction<[boolean, boolean]>>,
  socket: Socket | null,
  ownerId: string,
  userId: string | undefined,
  allowCommandsByAll: boolean,
  setSeconds: Dispatch<SetStateAction<number>>,
  updateCurrentMusic: boolean = true,
  playlistId?: string
): Promise<{
  status: number
}> => {
  if (socket && updateCurrentMusic && ownerId !== userId && !allowCommandsByAll) {
    Notify('Você não tem permissão para alterar a música', 'Peça ao dono da sala para habilitar o comando')
    return {
      status: 403
    }
  }
  updateCurrentMusic = updateCurrentMusic || queue.length === 0 || queue.every(music => !music.active)

  const response = await fetch(`/api/queue/add`, {
    method: 'POST',
    body: JSON.stringify({
      id,
      updateCurrentMusic,
      playlistId
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (response.status !== 200) {
    Notify('Ocorreu um erro ao adicionar a música na fila', 'Tente novamente mais tarde')
  } else {
    const data = await response.json()
    if (JSON.stringify(data) === JSON.stringify(queue)) {
      setIsPlaying([!isPlaying[0], true])
      return {
        status: response.status
      }
    }
    if (socket) {
      socket.emit('queue', {
        updatedQueue: data,
        isPlaying: isPlaying[0],
        seekTime: updateCurrentMusic ? 0 : undefined
      })
    }
    setQueue(data)
    if (updateCurrentMusic) {
      setIsPlaying([true, true])
      socket?.emit('action', {
        type: 'SEEK',
        data: {
          seek: 0
        }
      })
      setSeconds(0)
    }
  }
  return {
    status: response.status
  }
}
