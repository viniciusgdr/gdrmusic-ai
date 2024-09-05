import { Music } from '@gdrmusic/models/music';
import { SongItem } from './SongItem';
import { onPlay } from '@gdrmusic/hooks/onPlay';
import { useContext, useEffect, useState } from 'react';
import { MusicContext } from '@gdrmusic/hooks/MusicContext';
import { Session } from '@gdrmusic/pages/api/auth/[...nextauth]';
import { useSession } from 'next-auth/react';

export const PageContent = ({ musics }: { 
  musics: Music[]
}) => {
  const { data: session } = useSession() as { data: Session | null }
  const { queue, setQueue, isPlaying, setIsPlaying, setSeconds, jamInfos: { socket, ownerId, allowCommandsByAll } } = useContext(MusicContext)
  const [gridColsNow, setGridColsNow] = useState(2)
  useEffect(() => {
    const resize = () => {

      if (window.innerWidth < 640) {
        setGridColsNow(2)
      } else if (window.innerWidth < 960) {
        setGridColsNow(3)
      } else if (window.innerWidth < 1200) {
        setGridColsNow(4)
      } else if (window.innerWidth < 1600) {
        setGridColsNow(5)
      } else {
        setGridColsNow(6)
      }
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])
  if (musics.length === 0) {
    return <div className="mt-4 text-neutral-400">
      Nenhuma música encontrada
    </div>
  }

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 min-[1600px]:grid-cols-6 gap-4 mt-4"
    >
      {musics.map((item, index) => (
        <SongItem
          data={item}
          key={index}
          onClick={(id: string) => onPlay(id, queue, setQueue, isPlaying, setIsPlaying, socket, ownerId, session?.user?.id, allowCommandsByAll, setSeconds)}
          playingContent={isPlaying[0] ? (queue.find((item) => item.active)?.id === item.id) : false}
          index={index}
          gridColsNow={gridColsNow}
        />
      ))}
    </div>
  );
}