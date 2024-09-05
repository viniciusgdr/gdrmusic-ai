import { Header } from '@gdrmusic/components/Header'
import { Notify } from '@gdrmusic/components/Notify'
import { SongItemPage } from '@gdrmusic/components/SongItemPage'
import { MusicContext } from '@gdrmusic/hooks/MusicContext'
import { deleteQueueMany } from '@gdrmusic/hooks/deleteMany'
import { onChangePositionQueue } from '@gdrmusic/hooks/onChangePositionQueue'
import { JamInfo } from '@gdrmusic/models/jam'
import { Queue } from '@gdrmusic/models/music'
import { Playlist } from '@gdrmusic/models/playlist'
import { useContext, useEffect, useState } from 'react'
import { ReactSortable } from "react-sortablejs";
import { Socket } from 'socket.io-client'

export default function QueueZ() {
  const { queue, setQueue, isPlaying, seconds, jamInfos: { socket } } = useContext(MusicContext)
  const [page, setPage] = useState<'queue' | 'recent'>('queue')
  const playingNowIndex = queue.findIndex((music) => music.active)
  const [nexts, setNexts] = useState<Queue[]>([])
  useEffect(() => {
    if (playingNowIndex >= 0) {
      setNexts(queue.slice(playingNowIndex + 1) || [])
    }
    if (playingNowIndex === -1) {
      setNexts([])
    }
  }, [playingNowIndex, queue])
  useEffect(() => {
    (async () => {
      const nextsIsEqual = nexts.every((next, index) => next.id === queue[playingNowIndex + 1 + index]?.id)
      if (!nextsIsEqual && queue.slice(playingNowIndex + 1).length > 0) {
        const request = await onChangePositionQueue({ setQueue, nexts })
        if (request.status !== 200) {
          Notify('Erro ao atualizar a fila', 'Ocorreu um erro ao atualizar a fila')
          setNexts(queue.slice(playingNowIndex + 1) || [])
        } else {
          if (socket) {
            socket.emit('queue', {
              updatedQueue: request.response,
              isPlaying: isPlaying[0]
            })
          }
        }
      }
    })()
  }, [nexts, queue, playingNowIndex, setQueue, socket, isPlaying])
  return (
    <div className='bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto'>
      <Header
        className='bg-none pb-2'
        childrenButtons={
          <div className='flex gap-x-2 text-white'>
            <button className={'p-2 px-6 flex items-center justify-center rounded-lg ' + (page === 'queue' && 'bg-white/30')} onClick={() => setPage('queue')}>
              Fila
            </button>
            <button className={'p-2 px-6 flex items-center justify-center rounded-lg ' + (page === 'recent' && 'bg-white/30')} onClick={() => setPage('recent')}>
              Tocado Recentemente
            </button>
          </div>
        }
      >
      </Header>

      <div className='mb-2 p-3 md:p-6'>
        <h1 className='text-white text-3xl font-semibold'>
          {page === 'queue' ? 'Fila' : 'Tocado Recentemente'}
        </h1>
        {
          page === 'queue' ? (
            <QueuePage queue={queue} setQueue={setQueue} seconds={seconds} nexts={nexts} setNexts={setNexts} socket={socket} isPlaying={isPlaying} />
          ) : (
            <RecentPage queue={queue} />
          )
        }
      </div>
    </div>
  )
}

function QueuePage({
  queue,
  setQueue,
  nexts,
  setNexts,
  socket,
  isPlaying
}: {
  socket: Socket | null,
  isPlaying: [boolean, boolean]
  queue: Queue[]
  setQueue: React.Dispatch<React.SetStateAction<Queue[]>>
  seconds: number
  nexts: Queue[]
  setNexts: React.Dispatch<React.SetStateAction<Queue[]>>
}) {
  const playingNow = queue.find((music) => music.active)
  const playingNowIndex = queue.findIndex((music) => music.active)
  return (
    <div className='flex flex-col gap-y-2 pt-5'>
      {
        (playingNow) && (
          <div className='flex flex-col gap-y-2'>
            <h2 className='text-white/50 text-lg font-semibold'>
              Tocando agora
            </h2>
            <SongItemPage
              music={playingNow}
              index={playingNowIndex}
              indexMocked={1}
              onThis={true}
              showMoreOptions={false}
            />
          </div>
        )
      }
      {
        nexts.length > 0 && (
          <div className='flex flex-col gap-y-2'>
            <div className='flex flex-row justify-between'>
              <h2 className='text-white/50 text-lg font-semibold'>
                A seguir
              </h2>
              <button className='btn rounded-2xl btn-sm border border-white/50 text-white hover:border-white' onClick={async () => {
                (document as any).getElementById('modal_delete_queue').showModal()
              }}>
                Limpar fila
              </button>
              <dialog id="modal_delete_queue" className="modal">
                <div className="modal-box">
                  <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                  </form>
                  <h3 className="font-bold text-lg">Remover da sua fila?</h3>
                  <p className="py-4">Não é possível desfazer essa ação.</p>
                  <div className="modal-action">
                    <button className="btn rounded-2xl btn-outline " onClick={() => {
                      (document as any).getElementById('modal_delete_queue').close()
                    }}>Cancelar</button>
                    <button className="btn btn-success rounded-2xl" onClick={async () => {
                      const { data, status } = await deleteQueueMany(setQueue);
                      if (status === 200 && socket) {
                        socket.emit('queue', {
                          updatedQueue: data,
                          isPlaying: isPlaying[0]
                        })
                      };
                      (document as any).getElementById('modal_delete_queue').close();
                    }}>Limpar fila</button>
                  </div>
                </div>
              </dialog>
            </div>
            <ReactSortable
              list={nexts}
              setList={setNexts}
              animation={150}
              delay={2}
              direction={'vertical'}
            >
              {
                nexts.map((music, index) => (
                  <SongItemPage
                    music={music}
                    index={index}
                    indexMocked={index + 1}
                    onThis={false}
                    key={music._id}
                    ableToMove={true}
                    showMoreOptions={true}
                    showMoreOptionsMobile={false}
                    showCircle={true}
                  />
                ))
              }
            </ReactSortable>
          </div>
        )
      }
    </div>
  )
}

function RecentPage({
  queue
}: {
  queue: Queue[]
}) {
  const playingNow = queue.find((music) => music.active)
  const playingNowIndex = queue.findIndex((music) => music.active)
  const lasts = queue.slice(0, playingNowIndex)
    .filter((music) => music.id !== playingNow?.id)
    .reverse().filter((music, index, self) => index === self.findIndex((t) => (t.id === music.id)))

  return (
    <div className='flex flex-col gap-y-2 pt-5'>
      {
        lasts.length > 0 && (
          <div className='flex flex-col gap-y-2'>
            {
              lasts.map((music, index) => (
                <SongItemPage
                  music={music}
                  index={index}
                  indexMocked={index + 1}
                  onThis={false}
                  key={index}
                />
              ))
            }
          </div>
        ) || (
          <div className='flex flex-col gap-y-2'>
            <h2 className='text-white/50 text-lg font-semibold'>
              Nada tocado recentemente
            </h2>
          </div>
        )
      }
    </div>
  )
}