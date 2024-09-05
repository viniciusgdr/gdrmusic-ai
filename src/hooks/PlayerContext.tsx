import { Queue } from '@gdrmusic/models/music';
import { Session } from '@gdrmusic/pages/api/auth/[...nextauth]';
import { createContext } from 'react';

export const PlayerContext = createContext<{
  pastMusics: Queue[];
  currentMusic: Queue | undefined;
  currentMusicIndex: number;
  play: (sec?: number) => void;
  stop: () => void;
  hasNotNext: boolean;
  totalDuration: number;
  onPlayNext: (clicked?: boolean) => Promise<void>;
  onPlayPrevious: (clicked?: boolean) => void;
  session?: Session | null;
}>(
  {
    pastMusics: [],
    currentMusic: undefined,
    currentMusicIndex: 0,
    play: () => { },
    stop: () => { },
    hasNotNext: false,
    totalDuration: 0,
    onPlayNext: async () => { },
    onPlayPrevious: () => { },
    session: null
  }
)
