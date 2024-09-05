import { Header } from '@gdrmusic/components/Header';
import { Notify } from '@gdrmusic/components/Notify';
import { RedisHelper } from '@gdrmusic/db/connection';
import { JamInfo } from '@gdrmusic/models/jam';
import { Session, authOptions } from '@gdrmusic/pages/api/auth/[...nextauth]';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function JamPage() {
  const { data: session, status } = useSession()
  const router = useRouter();
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState<string[]>([]);
  useEffect(() => {
    if (!session && status === 'unauthenticated') {
      (document as any).getElementById('modal-login').showModal()
    }
  }, [session, status])
  return (
    <div className='bg-site bg-cover bg-no-repeat rounded-lg h-full w-full overflow-hidden overflow-y-auto transition duration-[5000ms] mb-64'>
      <Header>
        <div className='mb-2'>
          <h1 className='text-white text-3xl font-semibold'>Criar Jam</h1>
          <p className='text-white'>Crie uma jam para escutar músicas com seus amigos</p>
        </div>
      </Header>
      <div className='flex flex-col mt-8 p-6'>
        <h1 className='text-white text-3xl font-semibold'>
          O que você deseja fazer?
        </h1>
        <div className='flex flex-col mt-8 justify-center items-center'>
          <div className="flex flex-col w-full border-opacity-50 max-w-2xl bg-base-300 border border-white rounded-lg p-2 md:p-6">
            <div className="grid h-20 card bg-base-300 rounded-box place-items-center">
              <button
                disabled={loading.includes('create')}
                onClick={async () => {
                  if (!session) {
                    (document as any).getElementById('modal-login').showModal()
                    return
                  }
                  setLoading((prev) => [...prev, 'create']);
                  const res = await fetch('/api/jam', {
                    method: 'POST',
                    body: JSON.stringify({
                      code: null,
                      action: 'create'
                    }),
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  });
                  if (res.status !== 200) {
                    Notify('Erro ao criar jam', 'Tente novamente')
                    setLoading((prev) => prev.filter((item) => item !== 'create'));
                    return;
                  }
                  const { idRoom } = await res.json();
                  if (idRoom) {
                    router.push(`/jam/${idRoom}`);
                  }
                  setLoading((prev) => prev.filter((item) => item !== 'create'));
                }} className='btn btn-primary w-52 md:btn-wide'>Criar Jam</button>
            </div>
            <div className="divider">Ou</div>
            <div className="grid h-36 card bg-base-300 rounded-box place-items-center">
              <input
                type="text"
                placeholder="Digite o código"
                className="input input-primary input-bordered w-52 md:btn-wide"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <button onClick={async () => {
                if (!session) {
                  (document as any).getElementById('modal-login').showModal()
                  return
                }
                setLoading((prev) => [...prev, 'join']);
                const res = await fetch('/api/jam', {
                  method: 'POST',
                  body: JSON.stringify({
                    code,
                    action: 'join'
                  }),
                  headers: {
                    'Content-Type': 'application/json'
                  }
                });
                setLoading((prev) => prev.filter((item) => item !== 'join'));
                if (res.status !== 200) {
                  setCode('');
                  Notify('Código inválido', 'Tente novamente')
                  return;
                }
                const { idRoom } = await res.json();
                if (idRoom) {
                  router.push(`/jam/${idRoom}`);
                }
              }}
                disabled={!code || loading.includes('join')}
                className='btn btn-secondary w-52 md:btn-wide'>
                {
                  loading.includes('join') ? (
                    <div className="flex flex-row items-center justify-center gap-2">
                      <span className="loading loading-spinner loading-md"></span>
                      Obtendo informações
                    </div>
                  ) : (
                    'Entrar'
                  )
                }
              </button>
            </div>
          </div>
        </div>
        <h1 className='text-white text-3xl font-semibold mt-8'>
          Como funciona?
        </h1>
        <ul className='flex flex-col mt-8 list-disc pl-8'>
          <li className='text-white text-lg'>
            Crie uma jam e compartilhe o código com seus amigos para que eles possam entrar na jam, ou entre em uma jam já existente com o código.
          </li>
          <li className='text-white text-lg'>
            Você pode adicionar músicas na fila de reprodução e elas serão tocadas para todos os participantes da jam.
          </li>
          <li className='text-white text-lg'>
            As músicas adicionadas na fila de reprodução são tocadas em ordem, e quando a última música da fila é tocada, a fila é reiniciada.
          </li>
        </ul>
      </div>
    </div>
  )
}

export async function getServerSideProps({ query, req, res }: GetServerSidePropsContext) {
  const session = await getServerSession(req, res, authOptions) as Session | null;
  await RedisHelper.connect();
  if (session) {
    const room = await getRoomUserById(session.user.id)
    if (room) {
      res.writeHead(302, { Location: `/jam/${room.roomId}` });
      res.end();
      return {
        props: {
          session
        }
      };
    }
  }
  return {
    props: {
      session
    }
  };
}

async function getRoomUserById(idUser: string): Promise<JamInfo | null> {
  const rooms = await RedisHelper.client.keys('room-*')
  for (const room of rooms) {
    const roomData = await RedisHelper.client.get(room)
    if (roomData) {
      const { users } = JSON.parse(roomData) as JamInfo
      if (users) {
        const user = users.find(user => user.userId === idUser)
        if (user) {
          return JSON.parse(roomData)
        }
      }
    }
  }
  return null
}