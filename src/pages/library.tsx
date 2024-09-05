import { Header } from '@gdrmusic/components/Header';
import { Notify } from '@gdrmusic/components/Notify';
import { MusicContext } from '@gdrmusic/hooks/MusicContext';
import { createPlaylist } from '@gdrmusic/hooks/createPlaylist';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { FaBorderAll, FaCheck, FaList, FaPlus, FaSearch } from 'react-icons/fa';
import { MdOutlineSort } from 'react-icons/md';

export default function Library() {
  const router = useRouter()
  const { playlists, setPlaylists } = useContext(MusicContext)
  const { data: session } = useSession()
  const [classify, setClassify] = useState<'recent' | 'alphabetically'>('recent')
  const [displayType, setDisplayType] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    if (classify === 'recent') {
      setPlaylists(playlists.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    } else {
      setPlaylists(playlists.sort((a, b) => a.title.localeCompare(b.title)))
    }
  }, [classify, playlists, setPlaylists])
  // const [search, setSearch] = useState('')
  return (
    <div className='bg-neutral-950 rounded-lg h-full w-full overflow-hidden overflow-y-auto'>
      <Header gradientColor='' className='pb-2'>
        <div className='mb-2 flex flex-col'>
          <div className='flex items-center justify-between h-full pt-4 gap-3'>
            <h1 className="text-white text-3xl font-semibold">
              Sua Biblioteca
            </h1>
            <div className='flex gap-x-2'>
              <button onClick={() => setDisplayType(displayType === 'grid' ? 'list' : 'grid')}>
                <div className='flex flex-row gap-x-2 items-center text-white'>
                  {displayType === 'grid' ? <FaBorderAll size={30} /> : <FaList size={30} />}
                </div>
              </button>
              <button onClick={async () => {
                if (!session?.user) {
                  (document as any).getElementById('modal-login').showModal()
                  return
                }
                const newPlaylist = await createPlaylist()
                if (newPlaylist.status === 201) {
                  setPlaylists([...playlists, {
                    ...newPlaylist.response,
                    musics: []
                  }])
                  router.push(`/playlist/${newPlaylist.response.id}`)
                } else {
                  Notify('Ocorreu um erro ao criar a playlist', 'Tente novamente mais tarde')
                }
              }} className='p-2'>
                <FaPlus size={30} className='text-white' />
              </button>
            </div>
          </div>
          <div className='flex flex-row justify-between gap-x-2 text-white mt-2'>
            <button onClick={() => (document as any).getElementById('modal_type_classify').showModal()}>
              <div className='flex flex-row gap-x-2 items-center'>
                <MdOutlineSort size={15} />
                <h1 className='text-[15px] font-semibold'>
                  {classify === 'recent' ? 'Recentes' : 'Alfabeticamente'}
                </h1>
              </div>
            </button>
          </div>
        </div>
      </Header>
      <dialog id="modal_type_classify" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-center">Classificar por</h3>
          <div className='divider'></div>
          <div className='flex flex-col gap-y-2 mt-2'>
            <button onClick={() => {
              setClassify('recent');
              (document as any).getElementById('modal_type_classify').close()
            }} className='flex flex-row items-center justify-between w-full hover:bg-white/10 p-2 rounded-lg'>
              <h1 className='text-lg font-semibold'>Recentes</h1>
              {
                classify === 'recent' && (
                  <FaCheck size={20} className='text-green-500' />
                )
              }
            </button>
            <button onClick={() => {
              setClassify('alphabetically');
              (document as any).getElementById('modal_type_classify').close()
            }} className='flex flex-row items-center justify-between w-full hover:bg-white/10 p-2 rounded-lg'>
              <h1 className='text-lg font-semibold'>Alfabeticamente</h1>
              {
                classify === 'alphabetically' && (
                  <FaCheck size={20} className='text-green-500' />
                )
              }
            </button>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
          </div>
        </div>
      </dialog>
      <div className='mb-2 p-3 pt-6 md:p-6 pb-64'>
        {
          displayType === 'grid' && (
            <div className='grid grid-cols-3 lg:grid-cols-4'>
              {
                playlists.map((playlist, index) => (
                  <div key={index} onClick={() => router.push(`/playlist/${playlist.id}`)} className='flex flex-col gap-y-2 h-full hover:bg-white/10 p-2 rounded-lg cursor-pointer'>
                    <div className='relative h-0 pb-[100%]'>
                      <Image src={playlist.thumbnail || '/images/no-playlist-image.png'} fill objectFit='cover' alt='playlist image' />
                    </div>
                    <h1 className='text-white text-sm font-semibold'>{playlist.title.slice(0, 35)}</h1>
                  </div>
                ))
              }
            </div>
          ) || (
            <div className='flex flex-col gap-y-2'>
              {
                playlists.map((playlist, index) => (
                  <div key={index} onClick={() => router.push(`/playlist/${playlist.id}`)} className='flex flex-row gap-x-2 items-center hover:bg-white/10 p-2 rounded-lg cursor-pointer'>
                    <Image src={playlist.thumbnail || '/images/no-playlist-image.png'} objectFit='cover' className='rounded-lg h-20 w-20' alt='playlist image' width={128} height={128} />
                    <div className='flex flex-col gap-y-1'>
                      <h1 className='text-white text-sm font-semibold'>{playlist.title}</h1>
                      <h2 className='text-white/50 text-xs'>{playlist.musics.length} músicas</h2>
                    </div>
                  </div>
                ))
              }
            </div>
          )
        }
      </div>
    </div>
  )
}