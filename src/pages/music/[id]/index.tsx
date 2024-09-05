import { Session } from '@gdrmusic/pages/api/auth/[...nextauth]';
import { GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';
import prismaClient from '@gdrmusic/db/prismaClient';
import { Header } from '@gdrmusic/components/Header';
import Image from 'next/image';
import { SongItemPage } from '@gdrmusic/components/SongItemPage';
import { Music } from '@gdrmusic/models/music';
import { MdPauseCircle, MdPlayCircle, MdShare } from 'react-icons/md';
import { useContext } from 'react';
import { SlOptions } from 'react-icons/sl';
import { Notify } from '@gdrmusic/components/Notify';
import { useRouter } from 'next/router';
import { onPlay } from '@gdrmusic/hooks/onPlay';
import { TbPlaylistAdd } from 'react-icons/tb';
import { MusicContext } from '@gdrmusic/hooks/MusicContext';
import Head from 'next/head';
import { FaDownload } from 'react-icons/fa';

interface PlaylistPageProps {
  music: Music
}
export default function PlaylistPage({ music }: PlaylistPageProps) {
  const { queue, setQueue, isPlaying, setIsPlaying, playlists, setSeconds, setPlaylists, jamInfos: { ownerId, allowCommandsByAll, socket } } = useContext(MusicContext)
  const { data: session } = useSession() as { data: Session | null }
  const currentMusic = queue.find(music => music.active)
  const Icon = isPlaying[0] ? MdPauseCircle : MdPlayCircle;
  const router = useRouter()
  return (
    <div className='bg-site bg-cover bg-no-repeat rounded-lg h-full w-full overflow-hidden overflow-y-auto transition duration-[5000ms]'>
      <Head>
        <title>{music.title} - GDR Music</title>
        <meta name="description" content={music.artist} />
        <meta property="og:title" content={music.title} />
        <meta property="og:description" content={music.artist} />
        <meta property="og:image" content={music.thumbnail} />
        <meta property="og:type" content="music.song" />
        <meta property="og:site_name" content="GDR Music" />
        <meta property="og:locale" content="pt_BR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@gdrmusic" />
        <meta name="twitter:creator" content="@gdrmusic" />
        <meta name="twitter:title" content={music.title} />
        <meta name="twitter:description" content={music.title} />
        <meta name="twitter:image" content={music.thumbnail} />
      </Head>
      <Header>
        <div className='flex flex-col md:flex-row gap-y-2'>
          <div className='h-full flex flex-col items-center justify-center md:w-[256px]'>
            <Image src={music.thumbnail || '/images/no-playlist-image.png'} alt={music.title} width={256} height={256} className='rounded-lg w-[256px] h-[256px]' />
          </div>
          <div className='flex flex-col gap-y-2 md:pl-6 justify-center h-full md:w-[calc(100%-256px)]' >
            <p className='hidden md:flex text-md font-medium'>
              Single
            </p>
            <h1
              className={`hidden text-white md:flex md:text-3xl font-bold lg:text-4xl min-[1100px]:text-5xl min-[1200px]:text-6xl`}
            >
              {music.title}
            </h1>
            <h2 className={'font-medium md:hidden text-center ' + (music.title.length > 50 ? 'text-2xl' : 'text-4xl')}>
              {music.title}
            </h2>
          </div>
        </div>
      </Header>
      <div className='mt-4 mb-32 pb-32 px-6'>
        <div className='flex flex-row items-center gap-x-6 mb-12'>
          <button onClick={() => {
            if (currentMusic?.id === music.id) {
              setIsPlaying([!isPlaying[0], true])
            } else {
              onPlay(music.id, queue, setQueue, isPlaying, setIsPlaying, socket, ownerId, session?.user?.id, allowCommandsByAll, setSeconds, true)
            }
          }}>
            <Icon size={70} className='text-green-500 hover:text-green-600 transition duration-300' />
          </button>
          <div className="dropdown md:dropdown-right">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-md rounded-full gap-0 m-0 p-0">
              <SlOptions size={40} className='text-white/50 hover:text-white ml-2 transition duration-300' />
            </div>
            <ul tabIndex={0} className="dropdown-id menu shadow p-2 gap-4 dropdown-id dropdown-content z-[1] bg-base-100 overflow-y-auto rounded-box w-72 max-h-52">
              <li onClick={() => {
                onPlay(music.id, queue, setQueue, isPlaying, setIsPlaying, socket, ownerId, session?.user?.id, allowCommandsByAll, setSeconds, false)
                closeDropdown()
              }}>
                <div className='flex flex-row items-center gap-x-2'>
                  <TbPlaylistAdd size={20} />
                  <a>Adicionar à fila</a>
                </div>
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
              }}>
                <div className='flex flex-row items-center gap-x-2'>
                  <FaDownload size={20} />
                  <a>Baixar música</a>
                </div>
              </li>
              <li onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/music/${music.id}`)
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
        <SongItemPage
          music={music}
          index={0}
          onThis={currentMusic?.id === music.id}
          showMoreOptions={true}
          showMoreOptionsMobile={true}
          showOnHoverMobile={true}
        />
      </div>
    </div>
  )
}


export const getServerSideProps = async ({ req, res, params }: GetServerSidePropsContext) => {
  const { id } = params as { id: string }
  if (!id) {
    res.writeHead(302, { Location: '/' })
    res.end()
    return { props: {} }
  }
  const music = await prismaClient.music.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      album: true,
      artist: true,
      genre: true,
      title: true,
      year: true,
      thumbnail: true
    }
  })
  return {
    props: {
      music: JSON.parse(JSON.stringify(music))
    } as PlaylistPageProps
  }
}

function closeDropdown() {
  for (const item of (document as any)?.getElementsByClassName('dropdown-id') ?? []) {
    item.hidden = true
  }
}