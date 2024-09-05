import { Playlist } from '@gdrmusic/models/playlist';
import { Session, authOptions } from '@gdrmusic/pages/api/auth/[...nextauth]';
import { GetServerSidePropsContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { makeGetPlaylistController } from '../../../../gdrmusic-backend/src/main/factories/get-playlist'
import prismaClient from '@gdrmusic/db/prismaClient';
import { Header } from '@gdrmusic/components/Header';
import Image from 'next/image';
import { SongItemPage } from '@gdrmusic/components/SongItemPage';
import { Queue } from '@gdrmusic/models/music';
import { FaEdit, FaRandom } from 'react-icons/fa';
import { MdDelete, MdPauseCircle, MdPlayCircle, MdShare } from 'react-icons/md';
import { useContext, useEffect, useState } from 'react';
import { SlOptions } from 'react-icons/sl';
import { deletePlaylist } from '@gdrmusic/hooks/deletePlaylist';
import { Notify } from '@gdrmusic/components/Notify';
import { useRouter } from 'next/router';
import { onPlay } from '@gdrmusic/hooks/onPlay';
import { TbPlaylistAdd } from 'react-icons/tb';
import { JamInfo } from '@gdrmusic/models/jam';
import { MusicContext } from '@gdrmusic/hooks/MusicContext';
import { getServerSession } from 'next-auth';
const grad = require('gradient-from-image')

interface PlaylistPageProps {
  playlist: Playlist & {
    musics: Playlist.Music[]
  },
  BASE_URL: string
  gradient: {
    [0]: string
    [1]: string
    [2]: string
  }
  playlistUser: {
    name: string
    id: string,
    imageUrl: string
  }
}
export default function PlaylistPage({ playlist: initalPlaylist, BASE_URL, gradient, playlistUser }: PlaylistPageProps) {
  const { queue, setQueue, isPlaying, setIsPlaying, playlists, setSeconds, setPlaylists, jamInfos: { ownerId, allowCommandsByAll, socket } } = useContext(MusicContext)
  const [playlist, setPlaylist] = useState(initalPlaylist)
  const currentMusicIndex = queue.findIndex(music => music.active)
  const { data: session } = useSession() as { data: Session | null }
  const currentMusic = queue.find(music => music.active)
  const playlistOnQueue = queue.slice(currentMusicIndex).find(music => music?.playlistId === playlist.id)
  const Icon = playlistOnQueue && isPlaying[0] ? MdPauseCircle : MdPlayCircle;
  const router = useRouter()
  const [editPlaylist, setEditPlaylist] = useState<{
    title: string
    description: string
    thumbnail: string
  }>({
    title: playlist.title,
    description: playlist.description,
    thumbnail: playlist.thumbnail
  })
  useEffect(() => {
    const playlistUpdated = playlists.find(p => p.id === playlist.id)
    if (playlistUpdated) {
      setPlaylist(playlistUpdated)
    }
  }, [playlist.id, playlists])
  return (
    <div className='bg-site bg-cover bg-no-repeat rounded-lg h-full w-full overflow-hidden overflow-y-auto transition duration-[5000ms]'>
      <Header gradientColor={`bg-gradient-to-b to-[${gradient[1]}] from-[${gradient[1]}]`}>
        <div className='flex flex-col md:flex-row gap-y-2'>
          <div className='h-full flex flex-col items-center justify-center md:w-[256px]'>
            <Image src={playlist.thumbnail || '/images/no-playlist-image.png'} alt={playlist.title} width={256} height={256} className='rounded-lg w-[256px] h-[256px]' />
          </div>
          <div className='flex flex-col gap-y-2 md:pl-6 justify-center h-full md:w-[calc(100%-256px)]' >
            <p className='hidden md:flex text-md font-medium'>
              Playlist
            </p>
            <button
              className={`hidden text-[${gradient[2]}] md:flex md:text-3xl font-bold lg:text-4xl min-[1100px]:text-5xl min-[1200px]:text-6xl`}
              onClick={() => {
                if (initalPlaylist.createdBy === 'USER') {
                  (document.getElementById('playlist_edit') as HTMLDialogElement).showModal()
                }
              }}
              disabled={initalPlaylist.createdBy !== 'USER'}
            >
              {playlist.title}
            </button>
            <dialog id="playlist_edit" className="modal modal-bottom sm:modal-middle">
              <div className="modal-box md:max-w-xl">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-2xl text-white">
                  Editar detalhes
                </h3>
                <div className='flex flex-col md:flex-row gap-6 mb-2 mt-4 md:max-h-[176px]'>
                  <div className='self-center md:self-auto'>
                    <Image src={playlist.thumbnail || '/images/no-playlist-image.png'} alt={playlist.title} width={256} height={256} className='rounded-lg w-[176px] h-[176px] min-w-[176px] min-h-[176px]' />
                  </div>
                  <div className='flex flex-col gap-y-2 w-full'>
                    <input
                      type="text"
                      id="title"
                      value={editPlaylist.title}
                      onChange={e => setEditPlaylist({ ...editPlaylist, title: e.target.value })}
                      placeholder='Título da playlist'
                      className='input input-bordered text-white'
                    />
                    <textarea
                      id="description"
                      value={editPlaylist.description}
                      onChange={e => setEditPlaylist({ ...editPlaylist, description: e.target.value })}
                      placeholder='Descrição'
                      className='textarea textarea-bordered text-white'
                    />
                  </div>
                </div>
                <div className='flex items-end justify-end'>
                  <button
                    onClick={async () => {
                      const result = await fetch('/api/playlist/edit', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                          playlistId: playlist.id,
                          title: editPlaylist.title,
                          description: editPlaylist.description,
                          thumbnail: editPlaylist.thumbnail
                        })
                      })
                      if (result.status === 200) {
                        setPlaylists(playlists.map(p => p.id === playlist.id ? { ...p, title: editPlaylist.title, description: editPlaylist.description, thumbnail: editPlaylist.thumbnail } : p))
                        setPlaylist({ ...playlist, title: editPlaylist.title, description: editPlaylist.description, thumbnail: editPlaylist.thumbnail })
                        Notify('Playlist atualizada', 'A playlist foi atualizada com sucesso');
                        (document.getElementById('playlist_edit') as HTMLDialogElement).close()
                      } else {
                        Notify('Erro ao atualizar playlist', 'Ocorreu um erro ao atualizar a playlist')
                      }
                    }}
                    className='btn rounded-3xl w-28 bg-white text-black hover:bg-gray-100 transition duration-300'
                  >
                    Salvar
                  </button>
                </div>
                <p className='text-white text-[12px] font-bold'>
                  Ao continuar, você autoriza o gdrmusic a acessar a imagem enviada. Certifique-se de que você tem o direito de fazer o upload dessa imagem.
                </p>
              </div>
            </dialog>
            <h2 className={'font-medium md:hidden text-center ' + (playlist.title.length > 50 ? 'text-2xl' : 'text-4xl')}>
              {playlist.title}
            </h2>
            <h2 className='text-md font-light text-start text-white/50'>
              {playlist.description.slice(0, 100)}{playlist.description.length > 100 ? '...' : ''}
            </h2>
            <div className='flex flex-col items-start gap-y-2'>
              <div className='text-white rounded-md py-2 text-md font-medium transition'>
                <div className='flex flex-row items-center gap-x-2'>
                  <Image src={playlistUser.imageUrl || '/images/no-user-image.png'} alt={playlistUser.name} width={32} height={32} className='rounded-full' />
                  {
                    playlist.createdBy === 'SYSTEM' && 'Criada pelo GDRMUSIC para '
                  }
                  {playlistUser.name}{' '}
                  • {playlist.musics.length} {playlist.musics.length === 1 ? 'música' : 'músicas'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Header>
      <div className='mt-2 mb-32 pb-32 px-6'>
        <div className='flex flex-row items-center gap-x-6 mb-12'>
          {
            playlist.musics.length > 0 && (
              <button onClick={() => {
                if (playlistOnQueue) {
                  setIsPlaying([!isPlaying[0], true])
                } else {
                  onPlay(playlist.musics[0].musicId, queue, setQueue, isPlaying, setIsPlaying, socket, ownerId, session?.user?.id, allowCommandsByAll, setSeconds, true, playlist.id)
                }
              }}>
                <Icon size={70} className='text-green-500 hover:text-green-600 transition duration-300' />
              </button>
            )
          }
          <div className="dropdown md:dropdown-right">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-md rounded-full gap-0 m-0 p-0">
              <SlOptions size={40} className='text-white/50 hover:text-white ml-2 transition duration-300' />
            </div>
            <ul tabIndex={0} className="dropdown-id menu shadow p-2 gap-4 dropdown-id dropdown-content z-[1] bg-base-100 overflow-y-auto rounded-box w-72 max-h-52">
              {
                playlist.musics.length > 0 && (
                  <li onClick={() => {
                    onPlay(playlist.musics[0].musicId, queue, setQueue, isPlaying, setIsPlaying, socket, ownerId, session?.user?.id, allowCommandsByAll, setSeconds, false, playlist.id)
                    closeDropdown()
                  }}>
                    <div className='flex flex-row items-center gap-x-2'>
                      <TbPlaylistAdd size={20} />
                      <a>Adicionar à fila</a>
                    </div>
                  </li>
                )
              }
              {
                session?.user?.id === playlistUser.id && (
                  <li onClick={() => {
                    (document.getElementById('playlist_edit') as HTMLDialogElement).showModal()
                    closeDropdown()
                  }}>
                    <div className='flex flex-row items-center gap-x-2'>
                      <FaEdit size={20} />
                      <a>Editar playlist</a>
                    </div>
                  </li>
                )
              }
              {
                session?.user?.id === playlistUser.id && (
                  <li onClick={async () => {
                    const result = await deletePlaylist(playlist.id)
                    if (result.status === 200) {
                      setPlaylists(playlists.filter(p => p.id !== playlist.id))
                      router.push('/')
                    } else {
                      Notify('Erro ao excluir playlist', 'Ocorreu um erro ao excluir a playlist')
                    }
                    closeDropdown()
                  }}>
                    <div className='flex flex-row items-center gap-x-2'>
                      <MdDelete size={20} />
                      <a>Excluir playlist</a>
                    </div>
                  </li>
                )
              }
              <li onClick={() => {
                navigator.clipboard.writeText(`${BASE_URL}/playlist/${playlist.id}`)
                Notify('Link copiado', 'O link da playlist foi copiado para a área de transferência')
                closeDropdown()
              }}>
                <div className='flex flex-row items-center gap-x-2'>
                  <MdShare size={20} />
                  <a>Compartilhar</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        {
          playlist.musics.length && playlist.musics.map((music, index) => {
            return (
              <SongItemPage
                key={index}
                music={music.music}
                index={index}
                onThis={playlistOnQueue && currentMusic?.id === music.musicId || false}
                playlistId={playlist.id}
                showMoreOptions={true}
                showMoreOptionsMobile={true}
                showOnHoverMobile={true}
              />
            )
          }) || (
            <div className='flex flex-col items-center justify-center h-full pt-16'>
              <h1 className='text-white text-3xl font-semibold text-center'>
                Nenhuma música nesta playlist
              </h1>
            </div>
          )
        }
      </div>
    </div>
  )
}

const controller = makeGetPlaylistController(prismaClient as any)

export const getServerSideProps = async ({ req, res, params }: GetServerSidePropsContext) => {
  const { id } = params as { id: string }
  if (!id) {
    res.writeHead(302, { Location: '/' })
    res.end()
    return { props: {} }
  }
  const session = await getServerSession(req, res, authOptions) as Session;
  const { statusCode, body }: {
    statusCode: number
    body: Playlist & {
      musics: Playlist.Music[]
    }
  } = await controller.handle({
    body: {
      userId: session.user.id
    },
    params: {
      id
    }
  })
  if (statusCode !== 200) {
    res.writeHead(302, { Location: '/' })
    res.end()
    return { props: {} }
  }
  if (body.userId !== session.user.id && body.type === 'PRIVATE') {
    res.writeHead(302, { Location: '/' })
    res.end()
    return { props: {} }
  }
  const playlistUrl = (!body?.thumbnail?.includes('http') ? process.env.NEXTAUTH_URL : '') + (body.thumbnail || '/images/no-playlist-image.png')
  let relevant = null
  try {
    const gr = await grad.gr(playlistUrl)
    relevant = gr.relevant
  } catch (e) {
    console.log(e)
  }
  const playlistUser = await prismaClient.user.findUnique({
    where: {
      id: body.userId
    },
    select: {
      id: true,
      name: true,
      imageUrl: true
    }
  })
  if (playlistUser?.id === session?.user?.id) {
    await prismaClient.playlist.update({
      where: {
        id
      },
      data: {
        updatedAt: new Date()
      }
    })
  }
  return {
    props: {
      BASE_URL: process.env.NEXTAUTH_URL,
      playlist: JSON.parse(JSON.stringify(body)),
      gradient: relevant || ['#000000', '#000000', '#fafafa'],
      playlistUser: JSON.parse(JSON.stringify(playlistUser)) || null
    } as PlaylistPageProps
  }
}

function closeDropdown() {
  for (const item of (document as any)?.getElementsByClassName('dropdown-id') ?? []) {
    item.hidden = true
  }
}