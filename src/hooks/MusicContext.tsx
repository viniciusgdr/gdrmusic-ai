import { JamInfoProps } from '@gdrmusic/models/jam';
import { Queue } from '@gdrmusic/models/music';
import { Playlist } from '@gdrmusic/models/playlist';
import { RefObject, createContext } from 'react';
import { Socket } from 'socket.io-client';

export const MusicContext = createContext<{
  queue: Queue[];
  setQueue: React.Dispatch<React.SetStateAction<Queue[]>>;
  volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  isPlaying: [boolean, boolean]
  setIsPlaying: React.Dispatch<React.SetStateAction<[boolean, boolean]>>;
  playlists: (Playlist & {
    musics: Playlist.Music[]
  })[];
  setPlaylists: React.Dispatch<React.SetStateAction<(Playlist & {
    musics: Playlist.Music[]
  })[]>>;
  seconds: number;
  setSeconds: React.Dispatch<React.SetStateAction<number>>;
  sizeSideBar: number;
  setSizeSideBar: React.Dispatch<React.SetStateAction<number>>;
  jamInfos: {
    onRoom: boolean;
    setOnRoom: React.Dispatch<React.SetStateAction<boolean>>;
    socket: Socket | null;
    setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
    roomId: string;
    setRoomId: React.Dispatch<React.SetStateAction<string>>;
    ownerId: string;
    setOwnerId: React.Dispatch<React.SetStateAction<string>>;
    allowCommandsByAll: boolean;
    setAllowCommandsByAll: React.Dispatch<React.SetStateAction<boolean>>;
    users: JamInfoProps['users'];
    setUsers: React.Dispatch<React.SetStateAction<JamInfoProps['users']>>;
  }
  audioRef: RefObject<HTMLAudioElement>
}>({
  queue: [],
  setQueue: () => { },
  volume: 1,
  setVolume: () => { },
  // Valor 1: Rodando. Valor 2: Se true feito pelo usuário, se false feito pelo socket
  isPlaying: [false, true],
  setIsPlaying: () => { },
  playlists: [],
  setPlaylists: () => { },
  seconds: 0,
  setSeconds: () => { },
  sizeSideBar: 300,
  setSizeSideBar: () => { },
  jamInfos: {
    onRoom: false,
    setOnRoom: () => { },
    socket: null as any,
    setSocket: () => { },
    roomId: '',
    setRoomId: () => { },
    ownerId: '',
    setOwnerId: () => { },
    allowCommandsByAll: false,
    setAllowCommandsByAll: () => { },
    users: [],
    setUsers: () => { }
  },
  audioRef: null as any
})