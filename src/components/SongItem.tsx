import { Music } from '@gdrmusic/models/music';
import Image from 'next/image';
import PlayButton from './PlayButton';
import MoreOptionsButton from './MoreOptionsButton';
import Link from 'next/link';

export const SongItem = ({ data, onClick, playingContent, index, gridColsNow }: {
  data: Music;
  onClick: (id: string) => void;
  playingContent?: boolean;
  index: number;
  gridColsNow: number;
}) => {
  return (
    <div
      className="relative 
      group 
      flex 
      flex-col 
      items-center 
      justify-center 
      rounded-md 
      gap-x-4 
      bg-neutral-400/5 
      cursor-pointer 
      hover:bg-neutral-400/10 
      transition 
      p-3"
    >
      <div
        className=" relative 
          aspect-square 
          w-full
          h-full 
          rounded-md 
          overflow-hidden"
      >
        <Image
          className="object-cover"
          src={data.thumbnail || '/images/liked.png'}
          fill
          alt="cover image"
        />
      </div>
      <div className="flex flex-col items-start w-full pt-4 gap-y-1">
        <Link 
          className="font-semibold truncate w-full text-white"
          href={`/music/${data.id}`}
        >{data.title}</Link>
        <p
          className="
            text-neutral-400 
            text-sm 
            pb-2 
            w-full 
            truncate
          "
        >
          {data.artist}
        </p>
      </div>
      <div className="absolute bottom-24 right-[73px]">
        <MoreOptionsButton
          music={data}
          index={index}
          gridColsNow={gridColsNow}
        />
      </div>
      <div className="absolute bottom-24 right-5" onClick={() => onClick(data.id)}>
        <PlayButton playingContent={playingContent} />
      </div>
    </div>
  );
}