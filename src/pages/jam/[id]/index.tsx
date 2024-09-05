import { Header } from '@gdrmusic/components/Header';
import { Login } from '@gdrmusic/components/Login';
import { Notify } from '@gdrmusic/components/Notify';
import { RedisHelper } from '@gdrmusic/db/connection';
import { MusicContext } from '@gdrmusic/hooks/MusicContext';
import { JamInfo, JamInfoProps } from '@gdrmusic/models/jam';
import { Session, authOptions } from '@gdrmusic/pages/api/auth/[...nextauth]';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { getSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client'

export default function JamPage({
  jamInfoProp: initialJamInfo,
  WS_URL,
  session
}: {
  jamInfoProp: JamInfo;
  WS_URL: string;
  session: Session | null;
}) {
  const { setIsPlaying, jamInfos: { socket, setSocket, allowCommandsByAll, ownerId, onRoom, setOnRoom, users, setAllowCommandsByAll, setOwnerId, roomId, setRoomId, setUsers } } = useContext(MusicContext)
  const [roomNotFound, setRoomNotFound] = useState(false)
  const [actionToCloseOrExit, setActionToCloseOrExit] = useState<'close' | 'exit' | null>(null)
  const [confirmation, setConfirmation] = useState(initialJamInfo.users.length === 0)
  const router = useRouter()
  useEffect(() => {
    if (socket || !WS_URL || !session || !initialJamInfo?.roomId || actionToCloseOrExit || roomNotFound || !confirmation) return
    function connect() {
      setRoomId(initialJamInfo?.roomId)
      const newSocket = io(WS_URL, {
        transports: ['websocket']
      })
      newSocket.on('room-not-found', async () => {
        setRoomNotFound(true)
        newSocket?.close()
      })
      setSocket(newSocket)
    }
    connect()
  }, [WS_URL, session, setSocket, socket, setRoomId, router, roomId, actionToCloseOrExit, roomNotFound, setIsPlaying, initialJamInfo?.roomId, confirmation])
  useEffect(() => {
    if (!session) {
      (document as any).getElementById('custom-login-jam').showModal()
    }
  }, [session])
  useEffect(() => {
    if (session && !confirmation && !socket) {
      (document as any).getElementById('confirmation').showModal()
    }
  }, [session, confirmation, socket])
  const nameSession = initialJamInfo?.users?.find((user) => user.userId === initialJamInfo.ownerId)?.name ?? session?.user?.name ?? ''

  return (
    <div className='bg-site bg-cover bg-no-repeat rounded-lg h-full w-full overflow-hidden overflow-y-auto transition duration-[5000ms] mb-64 md:mb-auto'>
      <Login redirectUrl={`/jam/${initialJamInfo?.roomId}`} id='custom-login-jam' />
      <dialog id='confirmation' className="modal w-full">
        <div className="modal-box md:w-[700px] h-[550px] flex flex-col justify-center items-center">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <section className="flex flex-col justify-center items-center w-full">
            <div className="w-full text-center">
              <h1 className="h1 text-5xl text-center text-white">
                Jam de {nameSession}
              </h1>
              <h2 className="h2 text-2xl">
                Há {initialJamInfo.users?.length} {initialJamInfo.users?.length === 1 ? 'participante' : 'participantes'} na sala
              </h2>
            </div>
            <div className='flex flex-col gap-y-2 mt-4 w-full'>
              <button onClick={() => {
                setConfirmation(true);
                (document as any).getElementById('confirmation').close()
              }} className='btn btn-success text-white w-full'>Entrar</button>
              <button onClick={() => {
                setConfirmation(false)
                router.push('/jam')
              }} className='btn btn-error text-white w-full'>Cancelar</button>
            </div>
          </section>
        </div>
      </dialog>
      <Header>
        <h1 className='text-white text-3xl font-semibold'>
          Jam{
            nameSession ? ` de ${nameSession}` : ''
          }
        </h1>
        <div className='flex flex-row gap-x-2 mt-4'>
          <button onClick={() => {
            try {
              if (navigator?.canShare()) {
                navigator.share({
                  title: 'gdrmusic.',
                  text: 'Escolha e escute músicas juntos em tempo real.',
                  url: `${window.location.origin}/jam/${initialJamInfo?.roomId}`
                })
              } else {
                navigator.clipboard.writeText(`${window.location.origin}/jam/${initialJamInfo?.roomId}`)
                Notify('Link copiado', 'Compartilhe com seus amigos')
              }
            } catch (err) {
              navigator.clipboard.writeText(`${window.location.origin}/jam/${initialJamInfo?.roomId}`)
              Notify('Link copiado', 'Compartilhe com seus amigos')
            }
          }} className='btn btn-outline btn-sm text-white'>Compartilhar</button>
          <button onClick={() => {
            setActionToCloseOrExit('close')
            if (socket && onRoom) {
              socket.emit('leave-room')
            } else {
              socket?.emit('leave-room')
              socket?.close()
              socket?.io?._close()
              setOnRoom(false)
              setRoomId('')
              setUsers([])
              setSocket(null)
              setOwnerId('')
              router.push('/jam')
            }
          }} className='btn btn-outline btn-sm text-white'>
            {
              ownerId === session?.user?.id ? 'Encerrar Jam' : 'Sair'
            }
          </button>
        </div>
        <div className='flex flex-row gap-x-2 mt-4'>
          <input
            type="checkbox"
            checked={allowCommandsByAll}
            onChange={() => {
              socket?.emit('action', {
                type: allowCommandsByAll ? 'AUTH_REMOVE' : 'AUTH_ADD',
                data: {}
              })
              setAllowCommandsByAll(!allowCommandsByAll)
            }}
            className="toggle toggle-primary"
            disabled={!socket || !onRoom || ownerId !== session?.user?.id}
          />
          <p className='text-white'>Permitir que todos controlem o estado da música</p>
        </div>
      </Header>
      <div className='flex flex-col p-6 gap-4'>
        <h1 className='text-white text-3xl font-semibold'>
          Dados da Sessão
        </h1>
        <div className="collapse collapse-arrow bg-base-200">
          <input type="radio" name="my-accordion-2" />
          <div className="collapse-title text-xl font-medium text-white">
            Participantes
          </div>
          <div className="collapse-content bg-base-200">
            <ul className='flex flex-col gap-y-2 pl-4'>
              {
                users && users?.map((user, index) => (
                  <li key={index} className='flex flex-row items-center gap-x-2'>
                    <Image src={user.imageUrl} className='rounded-full w-8 h-8' width={32} height={32} alt='' />
                    <p className='text-white'>{user.name}</p>
                    <p className='text-white'>{user.userId === ownerId ? '(Dono)' : ''}</p>
                    {
                      (user.userId !== ownerId && ownerId === session?.user.id) && (
                        <button onClick={async () => {
                          if (!initialJamInfo.socket) {
                            Notify('Ocorreu um erro ao remover o usuário', 'Tente novamente mais tarde')
                            return
                          }
                          socket?.emit('action', {
                            type: 'KICK_USER',
                            data: {
                              userId: user.userId
                            }
                          })
                        }}
                          className='btn btn-outline btn-sm'>Remover</button>
                      )
                    }
                  </li>
                )) || (
                  <li className='text-white'>
                    Obtendo participantes...
                  </li>
                )
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps({ query, req, res }: GetServerSidePropsContext) {
  const session = await getServerSession(req, res, authOptions) as Session | null;
  const { id } = query as { id: string }
  if (!id) {
    res.writeHead(302, { Location: '/jam' });
    res.end();
    return { props: {} };
  }
  await RedisHelper.connect();
  const jam = await RedisHelper.client.get(id);
  if (!jam) {
    res.writeHead(302, { Location: '/jam' });
    res.end();
    return { props: { session } };
  }
  return {
    props: {
      jamInfoProp: JSON.parse(jam),
      WS_URL: process.env.WS_URL,
      session
    },
  };
}