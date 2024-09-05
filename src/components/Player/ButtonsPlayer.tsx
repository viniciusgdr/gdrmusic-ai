import { MdPauseCircle, MdPlayCircle, MdSkipPrevious } from "react-icons/md";
import { useContext } from 'react';
import { PlayerContext } from '@gdrmusic/hooks/PlayerContext';
import { MusicContext } from '@gdrmusic/hooks/MusicContext';
import { Notify } from '../Notify';
import { MdSkipNext } from "react-icons/md";

export const StopPauseBtn = () => {
  const { play, stop } = useContext(PlayerContext);
  const { isPlaying, setIsPlaying } = useContext(MusicContext);

  const Icon = isPlaying[0] ? MdPauseCircle : MdPlayCircle;

  return (
    <button>
      <Icon
        className="text-white text-5xl hover:text-[49px]"
        onClick={() => {
          setIsPlaying([!isPlaying[0], true]);
          isPlaying[0] ? stop() : play();
        }}
      />
    </button>
  );
};

export const SkipPreviousBtn = () => {
  const { pastMusics, play, onPlayPrevious, session } = useContext(PlayerContext);
  const { seconds, audioRef, isPlaying, jamInfos: { socket, ownerId, allowCommandsByAll } } = useContext(MusicContext);
  return (
    <button
      disabled={pastMusics.length === 0 && seconds > 5}
      className={
        pastMusics.length === 0 && seconds > 5
          ? "opacity-50 cursor-not-allowed"
          : ""
      }
    >
      <MdSkipPrevious
        className="text-white/50 hover:text-white text-4xl"
        onClick={() => {
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
          }
          if (seconds > 5) {
            if (
              socket &&
              session?.user?.id !== ownerId &&
              !allowCommandsByAll
            ) {
              Notify(
                "Você não tem permissão para alterar a música",
                "Peça ao dono da sala para habilitar o comando"
              );
              return;
            }
            socket?.emit("action", {
              type: "SEEK",
              data: {
                seek: 0,
              },
            });
            if (!isPlaying[0]) {
              play(0);
            }
          } else {
            onPlayPrevious(true);
          }
        }}
      />
    </button>
  );
};

export const SkipNextBtn = () => {
  const { onPlayNext, hasNotNext } = useContext(PlayerContext);

  return (
    <button
      disabled={hasNotNext}
      className={hasNotNext ? "opacity-50 cursor-not-allowed" : ""}
    >
      <MdSkipNext
        className="text-white/50 hover:text-white text-4xl"
        onClick={() => onPlayNext(true)}
      />
    </button>
  );
};

