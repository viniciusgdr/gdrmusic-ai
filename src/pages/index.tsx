import { TypeAnimation } from "react-type-animation";
import { useSession } from 'next-auth/react';
import { Header } from '@gdrmusic/components/Header';
import ListItem from '@gdrmusic/components/ListItem';
import { PageContent } from '@gdrmusic/components/PageContent';
import { useContext, useEffect, useState } from 'react';
import { Music } from '@gdrmusic/models/music';
import { MusicContext } from '@gdrmusic/hooks/MusicContext';

function getGreetings() {
  const date = new Date()
  const hours = date.getHours()
  if (hours >= 0 && hours < 12) {
    return 'Bom dia'
  } else if (hours >= 12 && hours <= 18) {
    return 'Boa tarde'
  } else {
    return 'Boa noite'
  }
}

export default function Home() {
  const { playlists, queue } = useContext(MusicContext)
  const { data: session, status } = useSession()
  const greetings = getGreetings()
  const [musics, setMusics] = useState<Music[]>([])
  useEffect(() => {
    fetch('/api/musics/latest')
      .then(res => res.json())
      .then(data => setMusics(data))
  }, [])
  const currentSongIndex = queue.findIndex(music => music.active)
  const pastSounds = queue.slice(0, currentSongIndex)
  return (
    <div className='bg-site bg-cover bg-no-repeat rounded-lg h-full w-full overflow-hidden overflow-y-auto transition duration-[5000ms]'>
      <Header>
        <div className='mb-2'>
          {
            status === 'loading' ? (
              <>
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-6 py-1">
                    <div className="h-6 bg-slate-700 rounded w-96 "></div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-12 bg-slate-700 rounded"></div>
                        <div className="h-12 bg-slate-700 rounded"></div>
                        <div className="h-12 bg-slate-700 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-white text-3xl font-semibold">
                  {greetings}{session?.user?.name && `, ${session.user.name.split(' ')[0]}.`}
                </h1>
                {
                  session && (
                    <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mt-4`}>
                      {
                        playlists
                          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                          .slice(0, 6).map((playlist, index) => (
                            <ListItem
                              image={playlist.thumbnail || '/images/no-playlist-image.png'}
                              name={playlist.title}
                              href={`/playlist/${playlist.id}`}
                              key={index}
                            />
                          ))
                      }
                    </div>
                  ) || (
                    <div className='text-white/80'>
                      <TypeAnimation
                        preRenderFirstString={true}
                        sequence={[
                          "Crie sua conta já! Escute músicas com seus amigos ao mesmo tempo de onde quiser e quando quiser.",
                          5000,
                          "Crie sua conta já! Sempre Grátis.",
                          3500
                        ]}
                        wrapper="span"
                        speed={50}
                        repeat={Infinity}
                      />
                    </div>
                  )
                }
              </>
            )
          }
        </div>
      </Header>
      <div className="mt-2 mb-7 px-6">
        {
          pastSounds.length > 0 && (
            <div>
              <div className="flex items-center justify-between">
                <h1 className="text-white font-semibold text-2xl mt-4">Tocados Recentemente</h1>
              </div>
              <PageContent musics={pastSounds.reverse().filter((music, index, self) => index === self.findIndex((t) => (t.id === music.id)))} />
            </div>
          )
        }
        <div className="flex items-center justify-between">
          <h1 className="text-white font-semibold text-2xl mt-4">Pesquisados Recentemente na GDRMUSIC</h1>
        </div>
        <PageContent musics={musics} />
      </div>
    </div>
  )
}