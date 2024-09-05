import { Music, Queue } from '@gdrmusic/models/music'
import Image from 'next/image'
import { useContext, useState } from 'react'
import { FaPause, FaPlay } from 'react-icons/fa'
import MoreOptionsButton from './MoreOptionsButton'
import { onPlay } from '@gdrmusic/hooks/onPlay'
import { MdMenu } from 'react-icons/md'
import { onRemoveQueue } from '@gdrmusic/hooks/onRemoveQueue'
import { MusicContext } from '@gdrmusic/hooks/MusicContext'
import { useSession } from 'next-auth/react'
import { Session } from '@gdrmusic/pages/api/auth/[...nextauth]'
import Link from 'next/link'

export const SongItemPage = ({
  music,
  index,
  onThis,
  indexMocked,
  ableToMove = false,
  showMoreOptions = true,
  showMoreOptionsMobile = false,
  showCircle = false,
  showOnHoverMobile = false,
  showImage = true,
  playlistId
}: {
  music: Queue | Music
  index: number,
  indexMocked?: number,
  onThis: boolean
  ableToMove?: boolean
  showMoreOptions?: boolean
  showMoreOptionsMobile?: boolean
  showOnHoverMobile?: boolean
  showCircle?: boolean
  playlistId?: string
  showImage?: boolean
}) => {
  const { queue, setQueue, isPlaying, setIsPlaying, setSeconds, jamInfos: { allowCommandsByAll, ownerId, socket } } = useContext(MusicContext)
  const Icon = (onThis && isPlaying[0]) ? FaPause : FaPlay;
  const [isHover, setIsHover] = useState(false)
  const { data: session } = useSession() as { data: Session | null }

  const currentSongIndex = queue.findIndex((item) => item.active)
  const nexts = queue.slice(currentSongIndex + 1)
  const songsInQuery = nexts.filter((item) => item.id === music.id)
  return (
    <div className='flex flex-row justify-between hover:bg-neutral-100/10 rounded-lg transition p-2' onMouseMove={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
      <div className='w-full md:w-auto flex flex-row md:pl-6 gap-x-6'>
        <div className={`${isHover && showOnHoverMobile ? 'flex' : 'hidden'} md:flex flex-row h-full justify-center items-center`}>
          {
            !isHover ? (
              <span className={'text-xl' + (onThis ? ' text-green-500' : ' text-white/50')}>
                {
                  (onThis && isPlaying[0]) ? (
                    <span className='loading loading-ring loading-lg'></span>
                  ) : (
                    <span className='pl-3 pr-3'>{indexMocked ?? index + 1}</span>
                  )
                }
              </span>
            ) : (
              <button
                onClick={() => {
                  if (onThis) {
                    setIsPlaying([!isPlaying[0], true])
                  } else {
                    onPlay(music.id, queue, setQueue, isPlaying, setIsPlaying, socket, ownerId, session?.user?.id, allowCommandsByAll, setSeconds, true, playlistId)
                  }
                }}
                className='transition rounded-full flex items-center bg-green-500 p-3'
              >
                <Icon className="text-black" />
              </button>
            )
          }
        </div>
        {
          (!onThis && showCircle) && (
            <div className='md:hidden flex flex-row h-full justify-center items-center'>
              <button className={'w-5 h-5 rounded-full border-2 border-white/50'} onClick={() => {
                (document.getElementById("my_modal_" + music.id) as HTMLDialogElement).showModal()
              }}></button>
              <dialog id={"my_modal_" + music.id} className="modal">
                <div className="modal-box">
                  <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                  </form>
                  <h3 className="font-bold text-xl pb-2">Ações</h3>
                  <div className='flex flex-col gap-y-2'>
                    <button className='btn text-white' onClick={async () => {
                      await onPlay(music.id, queue, setQueue, isPlaying, setIsPlaying, socket, ownerId, session?.user?.id, allowCommandsByAll, setSeconds, false);
                      (document.getElementById("my_modal_" + music.id) as HTMLDialogElement).close()
                    }}>
                      Adicionar à fila
                    </button>
                    {
                      (songsInQuery.length > 0) && (
                        <button className='btn text-white' onClick={async () => {
                          await onRemoveQueue({
                            musicId: '_id' in music ? music._id : songsInQuery.length > 1 ? songsInQuery[0]._id : songsInQuery[index]._id,
                            setQueue,
                            isPlaying,
                            socket
                          });
                          (document.getElementById("my_modal_" + music.id) as HTMLDialogElement).close()
                        }}>
                          Remover da fila
                        </button>
                      )
                    }
                  </div>
                </div>
              </dialog>
            </div>
          )
        }
        <div className='flex flex-row items-center gap-x-2'>
          {
            showImage && (
              <div className='relative min-h-[52px] min-w-[52px] h-[52px] w-[52px]'>
                <Image src={music.thumbnail} alt={music.title} className="object-cover" fill />
              </div>
            )
          }
          <div className='flex flex-col gap-y-1'>
            <Link className='text-white text-xs md:text-sm font-medium ' href={`/music/${music.id}`}>
              {music.title.slice(0, 75)}{music.title.length > 75 && '...'}
            </Link>
            <span className='text-white/50 text-xs truncate w-full'>
              {music.artist}
            </span>
          </div>
        </div>
      </div>
      <div className='flex flex-row md:pr-2 gap-5 items-center justify-center'>
        {
          showMoreOptions && (
            <div className={showMoreOptionsMobile ? '' : 'hidden md:flex flex-row gap-x-2'}>
              <MoreOptionsButton
                music={music}
                index={index}
                gridColsNow={0}
                classNameIcon='text-white text-xl'
                classNameDropdown='dropdown dropdown-end'
                classNameButtonDropdown='text-white'
                playlistId={playlistId}
                idDropdown={`dropdown_${music.id}`}
                idDropdownAddPlaylist={`dropdown_add_playlist_${music.id}`}
              />
            </div>
          )
        }
        {
          ableToMove && <MdMenu className='text-white text-xl' />
        }
      </div>
    </div>
  )
}
