import { onPlay } from '@gdrmusic/hooks/onPlay';
import { Music, Queue } from '@gdrmusic/models/music';
import { SlOptions } from 'react-icons/sl';
import { Notify } from './Notify';
import { FaTrash, FaHeart, FaPlus, FaShare, FaDownload } from 'react-icons/fa';
import { onRemoveQueue } from '@gdrmusic/hooks/onRemoveQueue';
import { TbPlaylistAdd } from 'react-icons/tb';
import { CiHeart } from 'react-icons/ci';
import Image from 'next/image';
import { updateMusicPlaylist } from '@gdrmusic/hooks/addMusicPlaylist';
import { createPlaylist } from '@gdrmusic/hooks/createPlaylist';
import { useContext, useState } from 'react';
import { MusicContext } from '@gdrmusic/hooks/MusicContext';
import { useSession } from 'next-auth/react';
import { Session } from '@gdrmusic/pages/api/auth/[...nextauth]';


const MoreOptionsButton = ({
  music,
  index,
  gridColsNow,
  classNameIcon = 'text-black',
  classNameDropdown,
  classNameButtonDropdown,
  notify = true,
  playlistId,
  idDropdown = 'DEFAULT_more_options_' + music.id,
  idDropdownAddPlaylist = 'DEFAULT_add_playlist_more_options_' + music.id
}: {
  music: Music | Queue,
  index: number
  gridColsNow: number
  classNameIcon?: string
  classNameDropdown?: string
  classNameButtonDropdown?: string,
  notify?: boolean,
  playlistId?: string
  idDropdown?: string
  idDropdownAddPlaylist?: string
}) => {
  const { queue, setQueue, playlists, setPlaylists, isPlaying, setIsPlaying, setSeconds, jamInfos: { socket, allowCommandsByAll, ownerId } } = useContext(MusicContext)
  const currentSongIndex = queue.findIndex((item) => item.active)
  const [loadingItem, setLoadingItem] = useState<string[]>([])
  const nexts = queue.slice(currentSongIndex + 1)
  const songsInQuery = nexts.filter((item) => item.id === music.id)
  const { data: session } = useSession() as { data: Session | null }
  return (
    <>
      <div className='hidden md:flex'>
        <div className={classNameDropdown ?? ("dropdown " + ((index + 1) % gridColsNow === 0 ? 'dropdown-end' : 'dropdown-bottom'))}>

          <div tabIndex={0} role="button" className={classNameButtonDropdown ?? "transition opacity-0 rounded-full flex items-center bg-white p-2 drop-shadow-md translate translate-y-1/4 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-110"}>
            <SlOptions className={classNameIcon} />
          </div>
          <ul tabIndex={0} className="dropdown-id dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-72 gap-3">
            <li>
              <details className={"dropdown " + (gridColsNow ? (index + 1) % gridColsNow === 0 ? 'dropdown-left' : 'dropdown-right' : 'dropdown-left')} onClick={() => {
                if (!session) {
                  (document as any).getElementById('modal-login').showModal();
                  return
                }
                openDropdown2()
              }}>
                <summary>
                  <div className='flex flex-row items-center gap-x-2'>
                    <FaPlus size={20} />
                    <a>Adicionar à playlist</a>
                  </div>
                </summary>
                <ul className="p-2 gap-4 dropdown-id-2 dropdown-content z-[1] bg-base-100 overflow-y-auto rounded-box w-72 h-52 max-h-52">
                  <li onClick={async () => {
                    setLoadingItem((prev) => [...prev, 'newPlaylist'])
                    const result = await createPlaylist(music.title, music.thumbnail)
                    if (notify && result.status === 201) {
                      const musicAdded = await updateMusicPlaylist({
                        playlistId: result.response.id,
                        musicId: music.id,
                        type: 'ADD'
                      })
                      setPlaylists([...playlists, {
                        ...result.response,
                        musics: [musicAdded.body.music]
                      }])
                      Notify('Adicionado à playlist ' + music.title, ``)
                    } else {
                      Notify('Ocorreu um erro ao adicionar à playlist', 'Tente novamente mais tarde')
                    }
                    setLoadingItem((prev) => prev.filter((item) => item !== 'newPlaylist'))
                    closeDropdown()
                  }}>
                    <div className='flex flex-row items-center gap-x-2'>
                      {
                        loadingItem.includes('newPlaylist') ?
                          <div className="loading loading-spinner loading-sm"></div>
                          :
                          <FaPlus size={20} />
                      }
                      <a>Nova playlist</a>
                    </div>
                  </li>
                  <li className='divide-y'>
                  </li>
                  {
                    playlists.map((playlist, index) => (
                      <li key={index} className='p-1' onClick={
                        async () => {
                          const musicAlreadyOnPlaylist = playlist.musics.find((item) => item.musicId === music.id)
                          if (musicAlreadyOnPlaylist) {
                            Notify('A música já está salva nesta playlist', '')
                            return
                          }
                          setLoadingItem((prev) => [...prev, playlist.id])
                          const result = await updateMusicPlaylist({
                            playlistId: playlist.id,
                            musicId: music.id,
                            type: 'ADD'
                          })
                          if (result.status === 200) {
                            if (notify) Notify('Adicionado à playlist ' + playlist.title, ``)
                            setPlaylists(playlists.map((item) => {
                              if (item.id === playlist.id) {
                                return {
                                  ...item,
                                  musics: [...item.musics, result.body.music]
                                }
                              }
                              return item
                            }))
                          } else {
                            Notify('Ocorreu um erro ao adicionar à playlist', 'Tente novamente mais tarde')
                          }
                          setLoadingItem((prev) => prev.filter((item) => item !== playlist.id))
                          closeDropdown()
                        }
                      }>
                        {
                          loadingItem.includes(playlist.id) ?
                            <div className="loading loading-spinner loading-sm"></div>
                            :
                            <a>{playlist.title}</a>
                        }
                      </li>
                    ))
                  }
                </ul>
              </details>
            </li>
            {
              playlistId && (
                <li onClick={async () => {
                  setLoadingItem((prev) => [...prev, 'removePlaylist'])
                  const result = await updateMusicPlaylist({
                    playlistId,
                    musicId: music.id,
                    type: 'REMOVE'
                  })
                  if (result.status === 200) {
                    if (notify) Notify('Removido da playlist', `A música foi removida da playlist`)
                    setPlaylists(playlists.map((item) => {
                      if (item.id === playlistId) {
                        return {
                          ...item,
                          musics: item.musics.filter((item) => item.musicId !== music.id)
                        }
                      }
                      return item
                    }))
                  } else {
                    Notify('Ocorreu um erro ao remover da playlist', 'Tente novamente mais tarde')
                  }
                  setLoadingItem((prev) => prev.filter((item) => item !== 'removePlaylist'))
                  closeDropdown()
                }}>
                  <div className='flex flex-row items-center gap-x-2'>
                    {
                      loadingItem.includes('removePlaylist') ?
                        <div className="loading loading-spinner loading-sm"></div>
                        :
                        <FaTrash size={20} />
                    }
                    <a>Remover da playlist</a>
                  </div>
                </li>
              )
            }
            <li
              onClick={async () => {
                closeDropdown()
                if (!session) {
                  (document as any).getElementById('modal-login').showModal();
                  return
                };
                const playlistLiked = playlists.find((item) => item.title === 'Musicas Curtidas')
                if (!playlistLiked) {
                  Notify('Você não possui uma playlist de músicas curtidas', 'Crie uma playlist de músicas curtidas para salvar músicas')
                  return
                }
                setLoadingItem((prev) => [...prev, 'musicLiked'])
                const musicLiked = playlistLiked?.musics.find((item) => item.musicId === music.id)
                if (musicLiked) {
                  const result = await updateMusicPlaylist({
                    playlistId: playlistLiked?.id,
                    musicId: music.id,
                    type: 'REMOVE'
                  })
                  if (result.status === 200) {
                    if (notify) Notify('Removido das Músicas Curtidas', `A música foi removida das Músicas Curtidas`)
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
                    if (notify) Notify('Adicionado às Músicas Curtidas', `A música foi adicionada às Músicas Curtidas`)
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
                setLoadingItem((prev) => prev.filter((item) => item !== 'musicLiked'))
              }}
            >
              {
                playlists.find((item) => item.title === 'Musicas Curtidas')?.musics.find((item) => item.musicId === music.id) ?
                  <div className='flex flex-row items-center gap-x-2'>
                    {
                      loadingItem.includes('musicLiked') ?
                        <div className="loading loading-spinner loading-sm"></div>
                        :
                        <FaHeart size={20} />
                    }
                    <a>Remover das Músicas Curtidas</a>
                  </div>
                  :
                  <div className='flex flex-row items-center gap-x-2'>
                    {
                      loadingItem.includes('musicLiked') ?
                        <div className="loading loading-spinner loading-sm"></div>
                        :
                        <CiHeart size={20} />
                    }
                    <a>Salvar em Músicas Curtidas</a>
                  </div>
              }
            </li>
            <li onClick={() => {
              if (!session) {
                (document as any).getElementById('modal-login').showModal();
                return
              }
              const a = document.createElement('a')
              a.href = `/api/music/${music.id}?action=download`
              a.download = music.title
              a.click()
              closeDropdown()
            }}>
              <div className='flex flex-row items-center gap-x-2'>
                <FaDownload size={20} />
                <a>Baixar música</a>
              </div>
            </li>
            <li onClick={async () => {
              closeDropdown()
              await onPlay(music.id, queue, setQueue, isPlaying, setIsPlaying, socket, ownerId, session?.user?.id, allowCommandsByAll, setSeconds, false)
            }}>
              <div className='flex flex-row items-center gap-x-2'>
                <TbPlaylistAdd size={20} />
                <a>Adicionar à fila</a>
              </div>
            </li>
            {
              (songsInQuery.length > 0) && (
                <li onClick={async () => {
                  setLoadingItem((prev) => [...prev, 'removeQueue'])
                  const removeQueue = await onRemoveQueue({
                    musicId: '_id' in music ? music._id : songsInQuery.length > 1 ? songsInQuery[0]._id : songsInQuery[index]._id,
                    setQueue,
                    isPlaying,
                    socket
                  })
                  if (notify && removeQueue.status === 200) {
                    Notify('Removido da fila', `A música foi removida da fila`)
                  } else {
                    Notify('Ocorreu um erro ao remover da fila', 'Tente novamente mais tarde')
                  }
                  setLoadingItem((prev) => prev.filter((item) => item !== 'removeQueue'))
                  closeDropdown()
                }}>
                  <div className='flex flex-row items-center gap-x-2'>
                    {
                      loadingItem.includes('removeQueue') ?
                        <div className="loading loading-spinner loading-sm"></div>
                        :
                        <FaTrash size={20} />
                    }
                    <a>Remover da fila</a>
                  </div>
                </li>
              )
            }
            <li onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/music/${music.id}`)
              Notify('Link copiado', `O link da música foi copiado para a área de transferência`)
              closeDropdown()
            }}>
              <div className='flex flex-row items-center gap-x-2'>
                <FaShare size={20} />
                <a>Compartilhar</a>
              </div>
            </li>
          </ul>
        </div>
      </div >
      <div className='md:hidden self-center h-full flex'>
        <button onClick={() => (document as any).getElementById(idDropdown).showModal()} className={classNameButtonDropdown ?? "transition opacity-0 rounded-full flex items-center bg-white p-2 drop-shadow-md translate translate-y-1/4 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-110"}>
          <SlOptions className={classNameIcon} />
        </button>
        <dialog id={idDropdown} className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <div className='flex flex-row items-center gap-x-2'>
              <div className='relative min-h-[52px] min-w-[52px] h-[52px] w-[52px]'>
                <Image src={music.thumbnail} alt={music.title} className="object-cover" fill />
              </div>
              <div className='flex flex-col gap-y-1'>
                <span className='text-white text-sm font-medium '>
                  {music.title.slice(0, 100)}{music.title.length > 100 && '...'}
                </span>
                <span className='text-white/50 text-xs truncate w-full'>
                  {music.artist}
                </span>
              </div>
            </div>
            <h3 className="font-bold text-lg mt-6">Opções</h3>
            <ul className="menu p-2 shadow bg-base-100 rounded-box w-full gap-3">
              <li onClick={() => {
                (document as any).getElementById(idDropdownAddPlaylist).showModal()
              }}>
                <div className='flex flex-row items-center gap-x-2'>
                  <FaPlus size={20} />
                  <a>Adicionar à playlist</a>
                </div>
              </li>

              {
                playlistId && (
                  <li onClick={async () => {
                    const result = await updateMusicPlaylist({
                      playlistId,
                      musicId: music.id,
                      type: 'REMOVE'
                    })
                    if (notify && result.status === 200) {
                      Notify('Removido da playlist', `A música foi removida da playlist`)
                      setPlaylists(playlists.map((item) => {
                        if (item.id === playlistId) {
                          return {
                            ...item,
                            musics: item.musics.filter((item) => item.musicId !== music.id)
                          }
                        }
                        return item
                      }))
                    } else {
                      Notify('Ocorreu um erro ao remover da playlist', 'Tente novamente mais tarde')
                    }
                    closeDropdown()
                  }}>
                    <div className='flex flex-row items-center gap-x-2'>
                      <FaTrash size={20} />
                      <a>Remover da playlist</a>
                    </div>
                  </li>
                )
              }
              <li
                onClick={async () => {
                  closeDropdown()
                  const playlistLiked = playlists.find((item) => item.title === 'Musicas Curtidas')
                  if (!playlistLiked) {
                    Notify('Você não possui uma playlist de músicas curtidas', 'Crie uma playlist de músicas curtidas para salvar músicas')
                    return
                  }
                  const musicLiked = playlistLiked?.musics.find((item) => item.musicId === music.id)
                  if (musicLiked) {
                    const result = await updateMusicPlaylist({
                      playlistId: playlistLiked?.id,
                      musicId: music.id,
                      type: 'REMOVE'
                    })
                    if (notify && result.status === 200) {
                      Notify('Removido das Músicas Curtidas', `A música foi removida das Músicas Curtidas`)
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
                    if (notify && result.status === 200) {
                      Notify('Adicionado às Músicas Curtidas', `A música foi adicionada às Músicas Curtidas`)
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
                }}
              >
                {
                  playlists.find((item) => item.title === 'Musicas Curtidas')?.musics.find((item) => item.musicId === music.id) ?
                    <div className='flex flex-row items-center gap-x-2'>
                      <FaHeart size={20} />
                      <a>Remover das Músicas Curtidas</a>
                    </div>
                    :
                    <div className='flex flex-row items-center gap-x-2'>
                      <CiHeart size={20} />
                      <a>Salvar em Músicas Curtidas</a>
                    </div>
                }
              </li>
              <li onClick={() => {
                if (!session) {
                  (document as any).getElementById('modal-login').showModal();
                  return
                }
                const a = document.createElement('a')
                a.href = `/api/music/${music.id}?action=download`
                a.download = music.title
                a.click();
                (document as any).getElementById(idDropdown).close()
              }}>
                <div className='flex flex-row items-center gap-x-2'>
                  <FaDownload size={20} />
                  <a>Baixar música</a>
                </div>
              </li>
              <li onClick={async () => {
                const res = await onPlay(music.id, queue, setQueue, isPlaying, setIsPlaying, socket, ownerId, session?.user?.id, allowCommandsByAll, setSeconds, false)
                if (notify && res.status === 200) {
                  Notify('Adicionado à fila', `A música foi adicionada à fila`)
                };
                (document as any).getElementById(idDropdown).close()
              }}>
                <div className='flex flex-row items-center gap-x-2'>
                  <TbPlaylistAdd size={20} />
                  <a>Adicionar à fila</a>
                </div>
              </li>
              {
                (songsInQuery.length > 0) && (
                  <li onClick={async () => {
                    const removeQueue = await onRemoveQueue({
                      musicId: songsInQuery.length > 1 ? songsInQuery[0]._id : songsInQuery[index]._id,
                      setQueue,
                      isPlaying,
                      socket
                    })
                    if (notify && removeQueue.status === 200) {
                      Notify('Removido da fila', `A música foi removida da fila`)
                    } else {
                      Notify('Ocorreu um erro ao remover da fila', 'Tente novamente mais tarde')
                    };
                    (document as any).getElementById(idDropdown).close()
                  }}>
                    <div className='flex flex-row items-center gap-x-2'>
                      <FaTrash size={20} />
                      <a>Remover da fila</a>
                    </div>
                  </li>
                )
              }
              <li onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/music/${music.id}`)
                Notify('Link copiado', `O link da música foi copiado para a área de transferência`);
                (document as any).getElementById(idDropdown).close()
              }}>
                <div className='flex flex-row items-center gap-x-2'>
                  <FaShare size={20} />
                  <a>Compartilhar</a>
                </div>
              </li>
            </ul>
          </div>
        </dialog>

        <dialog id={idDropdownAddPlaylist} className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 className="font-bold text-lg mt-6">Adicionar à playlist</h3>
            <ul className="menu p-2 shadow bg-base-100 rounded-box w-full gap-3">
              <li onClick={async () => {
                const result = await createPlaylist(music.title, music.thumbnail)
                if (notify && result.status === 201) {
                  const musicAdded = await updateMusicPlaylist({
                    playlistId: result.response.id,
                    musicId: music.id,
                    type: 'ADD'
                  })
                  setPlaylists([...playlists, {
                    ...result.response,
                    musics: [musicAdded.body.music]
                  }])
                  Notify('Adicionado à playlist ' + music.title, ``)
                } else {
                  Notify('Ocorreu um erro ao adicionar à playlist', 'Tente novamente mais tarde')
                }
                (document as any).getElementById(idDropdownAddPlaylist).close()
              }}>
                <div className='flex flex-row items-center gap-x-2'>
                  <FaPlus size={20} />
                  <a>Nova playlist</a>
                </div>
              </li>
              <li className='divide-y'>
              </li>
              {
                playlists.map((playlist, index) => (
                  <li key={index} className='p-1' onClick={
                    async () => {
                      const musicAlreadyOnPlaylist = playlist.musics.find((item) => item.musicId === music.id)
                      if (musicAlreadyOnPlaylist) {
                        Notify('A música já está salva nesta playlist', '')
                        return
                      }
                      const result = await updateMusicPlaylist({
                        playlistId: playlist.id,
                        musicId: music.id,
                        type: 'ADD'
                      })
                      if (notify && result.status === 200) {
                        Notify('Adicionado à playlist ' + playlist.title, ``)
                        setPlaylists(playlists.map((item) => {
                          if (item.id === playlist.id) {
                            return {
                              ...item,
                              musics: [...item.musics, result.body.music]
                            }
                          }
                          return item
                        }))
                      } else {
                        Notify('Ocorreu um erro ao adicionar à playlist', 'Tente novamente mais tarde')
                      }
                      (document as any).getElementById(idDropdownAddPlaylist).close()
                    }
                  }>
                    <a>{playlist.title}</a>
                  </li>
                ))
              }
            </ul>
          </div>
        </dialog>
      </div>
    </>
  );
};

function closeDropdown() {
  for (const item of (document as any)?.getElementsByClassName('dropdown-id') ?? []) {
    item.hidden = true
  }
}
function closeDropdown2() {
  for (const item of (document as any)?.getElementsByClassName('dropdown-id-2') ?? []) {
    item.hidden = true
  }
}
function openDropdown2() {
  for (const item of (document as any)?.getElementsByClassName('dropdown-id-2') ?? []) {
    item.hidden = false
  }
}
export default MoreOptionsButton;

