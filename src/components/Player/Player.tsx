import { useContext, useState } from 'react'
import { PlayerContent } from './PlayerContent'
import { MusicContext } from '@gdrmusic/hooks/MusicContext'
import { useSession } from 'next-auth/react'
import { Session } from '@gdrmusic/pages/api/auth/[...nextauth]'
import { Notify } from '../Notify'


export const Player = () => {
  const { data: session, status } = useSession() as { data: Session | null, status: string }
  const { queue, setQueue, setIsPlaying, setSeconds, jamInfos: { ownerId, allowCommandsByAll, socket } } = useContext(MusicContext)
  let currentSong = queue.find(music => music.active)
  let currentSongIndex = queue.findIndex(music => music.active)
  const [onCanPlay, setOnCanPlay] = useState(false)
  const onPlayNext = async (clicked: boolean = false) => {
    if (ownerId !== session?.user?.id && !allowCommandsByAll && clicked && socket) {
      Notify('Você não tem permissão para executar essa ação.', 'Você pode adicionar músicas na playlist apenas.')
      return
    }
    const request = await fetch('/api/queue/edit', {
      method: 'POST',
      body: JSON.stringify({
        id: currentSong?.id,
        action: 'next'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await request.json()
    if (socket) {
      socket?.emit('action', {
        type: 'SEEK',
        data: {
          seek: 0
        }
      })
      setSeconds(0)
      socket.emit('queue', {
        updatedQueue: data,
        isPlaying: true,
        seekTime: 0
      })
    }
    setOnCanPlay(false)
    setQueue(data)
    setIsPlaying([true, true])
  }
  const onPlayPrevious = async (clicked: boolean = false) => {
    if (ownerId !== session?.user?.id && !allowCommandsByAll && clicked && socket) {
      Notify('Você não tem permissão para executar essa ação.', 'Você pode adicionar músicas na playlist apenas.')
      return
    }
    const request = await fetch('/api/queue/edit', {
      method: 'POST',
      body: JSON.stringify({
        id: currentSong?.id,
        action: 'previous'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await request.json()
    if (socket) {
      socket?.emit('action', {
        type: 'SEEK',
        data: {
          seek: 0
        }
      })
      socket.emit('queue', {
        updatedQueue: data,
        isPlaying: true,
        seekTime: 0
      })
    }
    setOnCanPlay(false)
    setSeconds(0)
    setQueue(data)
    setIsPlaying([true, true])
  }
  if (!currentSong || status === 'loading') {
    return null
  }
  return (
    <div
      className="fixed md:absolute bottom-[5.3rem] left-3 md:left-auto right-3 md:right-auto md:w-full md:bottom-0 h-16 md:h-[90px] flex flex-row items-center min-h-16 rounded-lg md:rounded-none bg-black"
    >
      <PlayerContent
        music={currentSong}
        currentSongIndex={currentSongIndex}
        onPlayNext={onPlayNext}
        onPlayPrevious={onPlayPrevious}
        session={session}
        onCanPlay={onCanPlay}
        setOnCanPlay={setOnCanPlay}
      />
    </div>
  )
}