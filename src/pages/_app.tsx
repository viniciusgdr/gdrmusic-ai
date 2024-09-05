import Layout from "@gdrmusic/components/Layout";
import "@gdrmusic/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { SessionProvider, getSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { Player } from "@gdrmusic/components/Player/Player";
import { Navigation } from "@gdrmusic/components/Navigation";
import { Queue } from "@gdrmusic/models/music";
import { FaHouse } from "react-icons/fa6";
import { FaMusic, FaPlus, FaSearch } from "react-icons/fa";
import { VscLibrary } from "react-icons/vsc";
import { Playlist } from "@gdrmusic/models/playlist";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { createPlaylist } from "@gdrmusic/hooks/createPlaylist";
import { Notify } from "@gdrmusic/components/Notify";
import { Login } from "@gdrmusic/components/Login";
import { JamInfo, JamInfoProps } from "@gdrmusic/models/jam";
import { MusicContext } from "@gdrmusic/hooks/MusicContext";
import { Socket } from "socket.io-client";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import { WiStars } from "react-icons/wi";
import { BsStars } from "react-icons/bs";

const DEFAULT_VALUE = 300;
const MOD_VALUE = 125;
export type ActionType =
  | "SKIP"
  | "PLAY"
  | "STOP"
  | "SEEK"
  | "BACK"
  | "AUTH_ADD"
  | "AUTH_REMOVE"
  | "KICK_USER";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [queue, setQueue] = useState<Queue[]>([]);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState<[boolean, boolean]>([false, true]);
  const [playlists, setPlaylists] = useState<
    (Playlist & {
      musics: Playlist.Music[];
    })[]
  >([]);
  const [seconds, setSeconds] = useState(0);
  const [sizeSideBar, setSizeSideBar] = useState(DEFAULT_VALUE);
  const [loadingItems, setLoadingItems] = useState<string[]>([]);
  const [onRoom, setOnRoom] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomId, setRoomId] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [allowCommandsByAll, setAllowCommandsByAll] = useState(false);
  const [users, setUsers] = useState<JamInfoProps["users"]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    async function closeJam(leaved: boolean = false) {
      if (!leaved) {
        await fetch("/api/jam/cleanup", {
          method: "POST",
        });
      }
      setRoomId("");
      setOnRoom(false);
      setOwnerId("");
      setSocket(null);
      setAllowCommandsByAll(false);
      setUsers([]);
      socket?.close();
      if (router.asPath.startsWith("/jam/")) {
        router.push("/jam");
      }
    }
    if (pageProps.session?.user?.id && socket && roomId) {
      socket.on("connect", () => {
        socket.emit("join-room", {
          idRoom: roomId,
          userId: pageProps.session?.user?.id,
          isPlaying: isPlaying[0],
        });
      });
      socket.on("validation-error", (error: string) => {
        console.log(error);
      });
      socket.on(
        "queue",
        async ({
          queue: receivedQueue,
          isPlaying,
          seekTime,
          from,
        }: {
          queue: Queue[];
          isPlaying: boolean;
          seekTime: number;
          from: string;
        }) => {
          if (from !== pageProps.session?.user?.id) {
            if (seekTime) {
              setSeconds(seekTime + 1);
            }
            setQueue(receivedQueue);
            setIsPlaying([isPlaying, false]);
            if (JSON.stringify(receivedQueue) !== JSON.stringify(queue)) {
              await fetch("/api/queue/replace", {
                method: "POST",
                body: JSON.stringify({
                  queue: receivedQueue,
                }),
                headers: {
                  "Content-Type": "application/json",
                },
              });
            }
          }
        }
      );
      socket.on("room-joined", ({ ownerId, allowedCommandsByAll }) => {
        setOnRoom(true);
        setOwnerId(ownerId);
        setAllowCommandsByAll(allowedCommandsByAll);
      });
      socket.on(
        "updated-participants",
        ({ users }: { users: JamInfo["users"] }) => {
          setUsers(users);
        }
      );
      socket.on("room-leaved", () => {
        closeJam(true);
      });
      socket.on("room-closed", () => {
        closeJam(true);
      });
      socket.on("room-not-found", () => {
        closeJam();
      });
      socket.on(
        "action",
        ({
          from,
          type,
          data,
        }: {
          from: string;
          type: ActionType;
          data: any;
        }) => {
          if (from !== pageProps?.session?.user?.id) {
            switch (type) {
              case "AUTH_ADD":
                setAllowCommandsByAll(true);
                break;
              case "AUTH_REMOVE":
                setAllowCommandsByAll(false);
                break;
              case "PLAY":
                setIsPlaying([true, false]);
                if (audioRef.current) {
                  audioRef.current.currentTime = data.seek;
                }
                break;
              case "STOP":
                setIsPlaying([false, false]);
                if (audioRef.current) {
                  audioRef.current.currentTime = data.seek;
                }
                break;
              case "SEEK":
                if (audioRef.current) {
                  audioRef.current.currentTime = data.seek;
                }
                break;
            }
          }
        }
      );
    }
  }, [
    pageProps.session?.user?.id,
    socket,
    roomId,
    router,
    isPlaying,
    queue,
    ownerId,
  ]);
  useEffect(() => {
    const getQueue = async () => {
      const response = await fetch("/api/queue/list");
      const data = await response.json();
      if (!Array.isArray(data)) {
        return;
      }
      setQueue(data);
    };
    getQueue();
    const getPlaylists = async () => {
      const response = await fetch("/api/playlist");
      const data = await response.json();
      if (!data.message && Array.isArray(data)) {
        setPlaylists(data);
      }
    };
    getPlaylists();
  }, [pageProps.session]);

  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <title>
          {queue.find((music) => music.active)?.title || "gdrmusic"}
        </title>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="gdrmusic" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.json" />
        <meta
          name="description"
          content="Escute musicas em tempo real com seus amigos. Crie e gerencie playlists!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="icon"
          href={
            queue.find((music) => music.active)?.thumbnail ||
            "/images/gdrmusic.png"
          }
        />
        <meta
          property="og:image"
          content={
            queue.find((music) => music.active)?.thumbnail ||
            "/images/gdrmusic.png"
          }
        />
        <meta property="og:title" content="gdrmusic" />
        <meta
          property="og:description"
          content="Escute musicas em tempo real com seus amigos. Crie e gerencie playlists!"
        />
        <meta property="og:url" content="https://gdrmusic.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="gdrmusic" />
      </Head>
      <MusicContext.Provider
        value={{
          queue,
          setQueue,
          volume,
          setVolume,
          isPlaying,
          setIsPlaying,
          playlists,
          setPlaylists,
          seconds,
          setSeconds,
          sizeSideBar,
          setSizeSideBar,
          jamInfos: {
            onRoom,
            setOnRoom,
            socket,
            setSocket,
            roomId,
            setRoomId,
            ownerId,
            setOwnerId,
            allowCommandsByAll,
            setAllowCommandsByAll,
            users,
            setUsers,
          },
          audioRef,
        }}
      >
        <Layout>
          <div className="drawer md:drawer-open">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col md:py-2 md:pr-2 md:pl-0 bg-black h-full min-h-screen md:max-h-screen">
              <NextNProgress color="linear-gradient(90deg, #ff0080, #7928ca)" />
              <div className="h-full" key={router.asPath}>
                <Component {...pageProps} />
                <Navigation />
                <ToastContainer />
              </div>
            </div>
            <div className="drawer-side hidden md:none pt-2 bg-black">
              <label
                htmlFor="my-drawer-3"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <ul
                className={`flex flex-col h-full pt-0 gap-y-2 rounded-lg text-white resize-x w-full md:w-[${sizeSideBar}px] p-2`}
                style={{
                  width: sizeSideBar,
                }}
              >
                <div className="bg-neutral-900 rounded-lg h-fit w-full">
                  <div className={`flex flex-col gap-y-4 px-5 py-4`}>
                    <div
                      onClick={() => router.push("/")}
                      className={
                        "flex flex-row items-center h-auto w-full gap-x-4 text-md font-medium cursor-pointer hover:text-white transition py-1 " +
                        (router.asPath !== "/"
                          ? "text-neutral-400"
                          : "text-white") +
                        (sizeSideBar !== DEFAULT_VALUE
                          ? " justify-center"
                          : " ")
                      }
                    >
                      <FaHouse className="text-2xl" />
                      {sizeSideBar === DEFAULT_VALUE && (
                        <span className="truncate w-full">Início</span>
                      )}
                    </div>
                    {/* <div
                      onClick={() => router.push("/search")}
                      className={
                        "flex flex-row items-center h-auto w-full gap-x-4 text-md font-medium cursor-pointer hover:text-white transition py-1 " +
                        (router.asPath !== "/search"
                          ? "text-neutral-400"
                          : "text-white") +
                        (sizeSideBar !== DEFAULT_VALUE
                          ? " justify-center"
                          : " ")
                      }
                    >
                      <FaSearch className="text-2xl" />
                      {sizeSideBar === DEFAULT_VALUE && (
                        <span className="truncate w-full">Pesquisar</span>
                      )}
                    </div> */}
                    <div
                      onClick={() => router.push("/search-with-ai")}
                      className={
                        "flex flex-row items-center h-auto w-full gap-x-4 text-md font-medium cursor-pointer hover:text-white transition py-1 " +
                        (router.asPath !== "/search"
                          ? "text-neutral-400"
                          : "text-white") +
                        (sizeSideBar !== DEFAULT_VALUE
                          ? " justify-center"
                          : " ")
                      }
                    >
                      <BsStars className="text-5xl" />
                      {sizeSideBar === DEFAULT_VALUE && (
                        <>
                          <span className="truncate w-full flex flex-row gap-3 items-center">
                            Pesquisar
                          </span>
                          <span className="badge badge-accent">Novo</span>
                        </>
                      )}
                    </div>
                    <div
                      onClick={() => {
                        if (roomId && onRoom) {
                          router.push(`/jam/${roomId}`);
                        } else {
                          router.push("/jam");
                        }
                      }}
                      className={
                        "flex flex-row items-center h-auto w-full gap-x-4 text-md font-medium cursor-pointer hover:text-white transition py-1 " +
                        (!router.asPath.startsWith("/jam")
                          ? "text-neutral-400"
                          : "text-white") +
                        (sizeSideBar !== DEFAULT_VALUE
                          ? " justify-center"
                          : " ")
                      }
                    >
                      <FaMusic className="text-2xl" />
                      {sizeSideBar === DEFAULT_VALUE && (
                        <span className="truncate w-full">Jam</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-neutral-900 rounded-lg w-full overflow-y-auto h-full">
                  <div
                    className={`flex flex-col mb-3 gap-4 px-5 ${
                      sizeSideBar !== DEFAULT_VALUE &&
                      "items-center justify-center"
                    }`}
                  >
                    <button className="flex items-center justify-between pt-4 gap-3">
                      <div
                        className="inline-flex items-center gap-x-2 text-neutral-400 hover:text-white"
                        onClick={() => {
                          if (sizeSideBar === DEFAULT_VALUE) {
                            setSizeSideBar(MOD_VALUE);
                          } else {
                            setSizeSideBar(DEFAULT_VALUE);
                          }
                        }}
                      >
                        <VscLibrary className="text-2xl" />
                        {sizeSideBar === DEFAULT_VALUE && (
                          <span className="text-md font-medium">
                            Sua Biblioteca
                          </span>
                        )}
                      </div>
                      <FaPlus
                        size={16}
                        className="text-neutral-400 hover:text-white"
                        onClick={async () => {
                          setLoadingItems([...loadingItems, "playlist"]);
                          const session = await getSession();
                          if (!session) {
                            (document as any)
                              .getElementById("modal-login")
                              .showModal();
                            setLoadingItems(
                              loadingItems.filter((item) => item !== "playlist")
                            );
                            return;
                          }
                          const newPlaylist = await createPlaylist();
                          if (newPlaylist.status === 201) {
                            setPlaylists([
                              ...playlists,
                              {
                                ...newPlaylist.response,
                                musics: [],
                              },
                            ]);
                            setLoadingItems(
                              loadingItems.filter((item) => item !== "playlist")
                            );
                            router.push(`/playlist/${newPlaylist.response.id}`);
                          } else {
                            Notify(
                              "Ocorreu um erro ao criar a playlist",
                              "Tente novamente mais tarde"
                            );
                          }
                          setLoadingItems(
                            loadingItems.filter((item) => item !== "playlist")
                          );
                        }}
                      />
                    </button>
                    <ul className="flex flex-col gap-y-2">
                      {playlists.map((playlist, index) => (
                        <li
                          key={index}
                          className="flex flex-row items-center ite gap-x-2 text-md font-medium cursor-pointer hover:text-white transition py-1"
                          onClick={(e) => {
                            e.preventDefault();
                            router.push(`/playlist/${playlist.id}`);
                          }}
                        >
                          <Image
                            src={
                              playlist.thumbnail ||
                              "/images/no-playlist-image.png"
                            }
                            className="w-14 h-14 rounded-md"
                            width={128}
                            height={128}
                            alt={playlist.title}
                          />
                          {sizeSideBar === DEFAULT_VALUE && (
                            <span className="truncate w-full">
                              {playlist.title}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ul>
            </div>
          </div>
          {!pageProps?.session?.user && <Login />}
          {queue.length > 0 && <Player />}
        </Layout>
      </MusicContext.Provider>
    </SessionProvider>
  );
}
