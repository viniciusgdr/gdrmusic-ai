import { Music } from '@gdrmusic/models/music'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useEffect, useState, useContext } from 'react'
import { AiFillSound, AiOutlineSound } from 'react-icons/ai'
import { HiOutlineQueueList } from 'react-icons/hi2'
import { MdPauseCircle, MdPlayCircle, MdSkipNext, MdSkipPrevious } from 'react-icons/md'
import { MusicContext } from '@gdrmusic/hooks/MusicContext'
import { Session } from '@gdrmusic/pages/api/auth/[...nextauth]'
import { Notify } from '../Notify'
import { IoIosArrowDown } from 'react-icons/io'
import MoreOptionsButton from '../MoreOptionsButton'
import Image from 'next/image'
import Marquee from "react-fast-marquee";
import { CiHeart } from 'react-icons/ci'
import { updateMusicPlaylist } from '@gdrmusic/hooks/addMusicPlaylist'
import { FaDownload, FaHeart } from 'react-icons/fa'
import Link from 'next/link'
import { SkipNextBtn, SkipPreviousBtn, StopPauseBtn } from './ButtonsPlayer'
import { PlayerContext } from '@gdrmusic/hooks/PlayerContext'

export const PlayerContent = ({
  music,
  onPlayNext,
  onPlayPrevious,
  currentSongIndex,
  session,
  onCanPlay,
  setOnCanPlay
}: {
  music: Music,
  onPlayNext: (clicked?: boolean) => Promise<void>,
  onPlayPrevious: (clicked?: boolean) => void,
  currentSongIndex: number
  session: Session | null
  onCanPlay: boolean
  setOnCanPlay: Dispatch<SetStateAction<boolean>>
}) => {
  const { queue, isPlaying, setIsPlaying, playlists, setPlaylists, volume, setVolume, seconds, setSeconds, jamInfos: { socket, ownerId, allowCommandsByAll }, audioRef } = useContext(MusicContext)
  const router = useRouter()
  const [totalDuration, setTotalDuration] = useState(0)
  const Icon = isPlaying[0] ? MdPauseCircle : MdPlayCircle;
  const hasNotNext = currentSongIndex === queue.length - 1
  const [loadingItem, setLoadingItem] = useState<string[]>([])
  const onPlaying = async () => {
    if (audioRef.current) {
      const latestSeconds = Number(parseInt(seconds.toString()))
      const currentTime = Number(parseInt(audioRef.current.currentTime.toString()))
      if (socket && session?.user?.id === ownerId && currentTime !== latestSeconds) {
        socket.emit('action', {
          type: 'TIME_UPDATE',
          data: {
            seek: audioRef.current.currentTime
          }
        })
      }
      setSeconds(audioRef.current.currentTime)
      if (audioRef.current.currentTime >= audioRef.current.duration) {
        if (!hasNotNext) {
          if ((socket && session?.user?.id === ownerId) || !socket) {
            socket?.emit('action', {
              type: 'TIME_UPDATE',
              data: {
                seek: 0
              }
            })
            await onPlayNext()
            setIsPlaying([true, true])
            audioRef.current.currentTime = 0
            play()
          }
        } else {
          setIsPlaying([false, true])
        }
      }
    }
  }
  const play = (sec?: number) => {
    if (socket && isPlaying[1]) {
      socket.emit('action', {
        type: 'PLAY',
        isPlaying: true,
        data: {
          seek: sec ?? audioRef.current!.currentTime
        }
      })
    }
    audioRef.current?.play()
  }
  const stop = () => {
    if (socket && seconds !== 0 && isPlaying[1]) {
      socket.emit('action', {
        type: 'STOP',
        isPlaying: false,
        data: {
          seek: audioRef.current!.currentTime
        }
      })
    }
    audioRef.current?.pause()
  }
  useEffect(() => {
    if (typeof audioRef.current?.volume === 'number') {
      audioRef.current.volume = volume
    }
  }, [volume])
  useEffect(() => {
    if (audioRef.current) {
      if (seconds !== audioRef.current?.currentTime && socket) {
        audioRef.current!.currentTime = seconds
      }
      isPlaying[0] ? play() : stop()
    }
  }, [isPlaying])
  const currentMusic = queue.find(music => music.active)
  const currentMusicIndex = queue.findIndex(music => music.active)
  const pastMusics = queue.slice(0, currentMusicIndex)
  return (
    <PlayerContext.Provider
      value={{
        pastMusics,
        currentMusic,
        currentMusicIndex,
        play,
        stop,
        hasNotNext,
        totalDuration,
        onPlayNext,
        onPlayPrevious
      }}
    >
      <div>
        <audio
          controls
          ref={(input) => {
            if (input) {
              // @ts-ignore
              audioRef.current = input;
            }
          }}
          src={`/api/music/${music.id}?_id=${currentMusic?._id}`}
          onCanPlay={() => {
            if (audioRef.current) {
              setTotalDuration(audioRef.current.duration)
            }
            if (audioRef.current && !onCanPlay) {
              setOnCanPlay(true)
              audioRef.current.currentTime = seconds
              if (isPlaying[0]) {
                play()
              }
            }
          }}
          onError={() => {
            if (hasNotNext) {
              setIsPlaying([false, true])
            } else {
              onPlayNext()
            }
          }}
          onTimeUpdate={onPlaying}
          className='hidden'
        >
          Your browser does not support the audio element.
        </audio>
      </div>
      <div className='flex flex-col w-full h-full bg-gradient-to-r p-1 pb-0 md:pb-1 md:pl-3 from-base-100 to-base-200 md:bg-none rounded-lg md:rounded-none'>
        <div className='flex flex-row w-full h-full'>
          <div className='flex flex-row justify-start w-full gap-2 md:gap-0 items-center'>
            <div className='rounded-md h-12 w-12 md:h-[65px] md:w-[65px] md:min-h-[70px] md:min-w-[70px] bg-center bg-no-repeat bg-cover self-center' style={{ backgroundImage: `url('${music.thumbnail}')` }}>
            </div>
            <div className='hidden md:flex flex-col justify-center ml-2 w-full'>
              <Link 
                className='text-white font-bold text-[11.5px]'
                href={`/music/${music.id}`}
              >{music.title.slice(0, 70)}</Link>
              <div className='text-white/50 text-[10px]'>{music.artist}</div>
            </div>
            <div className='flex md:hidden relative group flex-col rounded-md overflow-hidden w-full' onClick={() => {
              (document.getElementById('player') as HTMLDialogElement).showModal()
            }}>
              <div className='text-white font-bold text-[13px] truncate'>{music.title.slice(0, 50)}</div>
              <div className='text-white/50 text-xs'>{music.artist.slice(0, 30)}</div>
            </div>
            <dialog id="player" className="modal w-full ">
              <div className="modal-box min-h-screen max-w-[100%] w-full h-full p-6 rounded-none items-center justify-center">
                <div className="flex flex-row justify-between items-center">
                  <div onClick={() => (document.getElementById('player') as HTMLDialogElement).close()} className="cursor-pointer">
                    <IoIosArrowDown className="text-white text-3xl" />
                  </div>
                  <div className='text-white font-bold text-[13px] truncate uppercase'>Tocando da Fila</div>

                  <div>
                    <MoreOptionsButton
                      gridColsNow={0}
                      index={0}
                      music={music}
                      classNameIcon='text-white text-2xl'
                      classNameButtonDropdown=''
                      idDropdown='view_more_info_player'
                      idDropdownAddPlaylist={'view_more_info_player_add_playlist'}
                    />
                  </div>
                </div>
                <div className="mt-28 relative w-full h-[300px] md:h-[400px]">
                  <Image src={music.thumbnail} layout='fill' objectFit='cover' alt={''} className='rounded-lg' />
                </div>
                <div className='absolute bottom-6 pr-6'>
                  <div className='flex flex-row justify-between items-center w-full gap-3'>
                    <div className='flex flex-col'>
                      <Marquee direction="left" className='text-white w-full' style={{
                        maxWidth: '100%',
                      }}>
                        {music.title}
                      </Marquee>
                      <div className='text-white/50 text-xs'>{music.artist.slice(0, 35)}</div>
                    </div>
                    <button
                      onClick={
                        async () => {
                          const playlistLiked = playlists.find((item) => item.title === 'Musicas Curtidas')
                          if (!playlistLiked) {
                            Notify('Você não possui uma playlist de músicas curtidas', 'Crie uma playlist de músicas curtidas para salvar músicas')
                            return
                          }
                          setLoadingItem([...loadingItem, 'like'])
                          const musicLiked = playlistLiked?.musics.find((item) => item.musicId === music.id)
                          if (musicLiked) {
                            const result = await updateMusicPlaylist({
                              playlistId: playlistLiked?.id,
                              musicId: music.id,
                              type: 'REMOVE'
                            })
                            if (result.status === 200) {
                              setPlaylists(playlists.map((item) => {
                                if (item.id === playlistLiked?.id) {
                                  return {
                                    ...item,
                                    musics: item.musics.filter((item) => item.musicId !== music.id)
                                  }
                                }
                                return item
                              }))
                            } else {
                              Notify('Ocorreu um erro ao remover das Músicas Curtidas', 'Tente novamente mais tarde')
                            }
                          } else {
                            const result = await updateMusicPlaylist({
                              playlistId: playlistLiked?.id,
                              musicId: music.id,
                              type: 'ADD'
                            })
                            if (result.status === 200) {
                              setPlaylists(playlists.map((item) => {
                                if (item.id === playlistLiked?.id) {
                                  return {
                                    ...item,
                                    musics: [...item.musics, result.body.music]
                                  }
                                }
                                return item
                              }))
                            } else {
                              Notify('Ocorreu um erro ao adicionar às Músicas Curtidas', 'Tente novamente mais tarde')
                            }
                          }
                          setLoadingItem(loadingItem.filter((item) => item !== 'like'))
                        }
                      }
                      disabled={loadingItem.includes('like')}
                    >
                      {
                        playlists.find((item) => item.title === 'Musicas Curtidas')?.musics.find((item) => item.musicId === music.id) ?
                          <FaHeart size={30} />
                          :
                          <CiHeart size={40} />
                      }
                    </button>
                  </div>
                  <div className='flex flex-row items-center w-full gap-3 mt-6'>
                    <div className='text-white text-xs'>{new Date(seconds * 1000).toISOString().substr(14, 5)}</div>
                    <input type="range" min={0} max={totalDuration} value={seconds} className="range range-xs w-full" onChange={(event) => {
                      if (audioRef.current) {
                        if (socket && session?.user?.id !== ownerId && !allowCommandsByAll) {
                          Notify('Você não tem permissão para alterar a música', 'Peça ao dono da sala para habilitar o comando')
                          return
                        }
                        audioRef.current.currentTime = parseInt(event.target.value)
                        socket?.emit('action', {
                          type: 'SEEK',
                          data: {
                            seek: parseInt(event.target.value)
                          }
                        })
                      }
                    }} />
                    <div className='text-white text-xs'>{
                      totalDuration ? new Date(totalDuration * 1000).toISOString().substr(14, 5) : ''
                    }</div>
                  </div>
                  <div className='flex flex-row justify-center items-center w-full mt-6 gap-5'>
                    <button disabled={pastMusics.length === 0 && seconds > 5} className={pastMusics.length === 0 && seconds > 5 ? 'opacity-50 cursor-not-allowed' : ''}>
                      <MdSkipPrevious className='text-white/50 hover:text-white text-5xl' onClick={() => {
                        if (seconds > 5 && audioRef.current) {
                          if (socket && session?.user?.id !== ownerId && !allowCommandsByAll) {
                            Notify('Você não tem permissão para alterar a música', 'Peça ao dono da sala para habilitar o comando')
                            return
                          }
                          socket?.emit('action', {
                            type: 'SEEK',
                            data: {
                              seek: 0
                            }
                          })
                          audioRef.current.currentTime = 0
                          if (!isPlaying[0]) {
                            play(0)
                          }
                        } else {
                          onPlayPrevious(true)
                        }
                      }} />
                    </button>
                    <button>
                      <Icon className='text-white text-7xl' onClick={() => {
                        setIsPlaying([!isPlaying[0], true])
                        isPlaying[0] ? stop() : play()
                      }} />
                    </button>
                    <button disabled={hasNotNext} className={hasNotNext ? 'opacity-50 cursor-not-allowed' : ''}>
                      <MdSkipNext className='text-white/50 hover:text-white text-5xl' onClick={() => onPlayNext(true)} />
                    </button>
                  </div>
                  <div className='flex flex-row justify-end items-center w-full mt-6 gap-3'>
                    <button className='mr-2' onClick={() => {
                      const a = document.createElement('a')
                      a.href = `/api/music/${music.id}?action=download`
                      a.download = music.title
                      a.click()
                    }}>
                      <FaDownload className='text-white/50 hover:text-white text-xl' />
                    </button>
                    <button className='mr-2' onClick={() => {
                      (document.getElementById('player') as HTMLDialogElement).close();
                      router.push('/queue');
                    }}>
                      <HiOutlineQueueList className='text-white/50 hover:text-white text-3xl' />
                    </button>
                  </div>
                </div>
              </div>
            </dialog>
            <div className='absolute right-3 bottom-3 w-10 h-10 justify-center items-center flex md:hidden'>
              <Icon className='text-white text-5xl' onClick={() => {
                setIsPlaying([!isPlaying[0], true])
                isPlaying[0] ? stop() : play()
              }} />
            </div>
          </div>
          <div className='hidden md:flex flex-col h-full justify-center items-center w-full max-w-[722px] gap-x-6'>
            <div className='flex flex-row items-center'>
              <SkipPreviousBtn />
              <StopPauseBtn />
              <SkipNextBtn />
            </div>
            <div className='flex flex-row items-center w-full gap-3'>
              <div className='text-white text-xs'>{new Date(seconds * 1000).toISOString().substr(14, 5)}</div>
              <input type="range" min={0} max={totalDuration} value={seconds} className="range range-xs w-full" onChange={(event) => {
                if (audioRef.current) {
                  if (socket && session?.user?.id !== ownerId && !allowCommandsByAll) {
                    Notify('Você não tem permissão para alterar a música', 'Peça ao dono da sala para habilitar o comando')
                    return
                  }
                  audioRef.current.currentTime = parseInt(event.target.value)
                  socket?.emit('action', {
                    type: 'SEEK',
                    data: {
                      seek: parseInt(event.target.value)
                    }
                  })
                }
              }} />
              <div className='text-white text-xs'>{
                totalDuration ? new Date(totalDuration * 1000).toISOString().substr(14, 5) : ''
              }</div>
            </div>
          </div>
          <div className='hidden md:flex w-full justify-end pr-2'>
            <div className='flex flex-row items-center'>
              <button className='mr-2' onClick={() => {
                if (!session) {
                  (document as any).getElementById('modal-login').showModal();
                  return
                }
                const a = document.createElement('a')
                a.href = `/api/music/${music.id}?action=download`
                a.download = music.title
                a.click()
              }}>
                <FaDownload className='text-white/50 hover:text-white text-xl' />
              </button>
              <button className='mr-2' onClick={() => router.push('/queue')}>
                <HiOutlineQueueList className='text-white/50 hover:text-white text-2xl' />
              </button>
              <button className='mr-2'>
                {
                  volume > 0 ? <AiFillSound className='text-white/50 hover:text-white text-2xl' onClick={() => setVolume(0)} /> : <AiOutlineSound className='bg-primary/60 hover:text-white text-2xl' onClick={() => setVolume(1)} />
                }
              </button>
              <input type="range" min={0} max="100" value={volume * 100} className="range range-xs" onChange={(event) => {
                setVolume(parseInt(event.target.value) / 100)
              }} />
            </div>
          </div>
        </div>
        <div className='md:hidden flex flex-row justify-center items-center w-full align-bottom'>
          <progress max={totalDuration} value={seconds} className="progress w-full" />
        </div>
      </div>
    </PlayerContext.Provider>
  )
}
