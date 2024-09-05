import { Header } from '@gdrmusic/components/Header';
import { SongItemPage } from '@gdrmusic/components/SongItemPage';
import { Music } from '@gdrmusic/models/music';
import { useEffect, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
const recommendations = [
  'Marília Mendonça - Graveto',
  'Marília Mendonça - Supera',
  'Marília Mendonça - Todo Mundo Vai Sofrer',
  'Simone & Simaria - Regime Fechado',
  'Simone & Simaria - Duvido Você Não Tomar Uma',
  'Simone & Simaria - Loka',
  'Gustavo Mioto - Com ou Sem Mim',
  'Gustavo Mioto - Anti-Amor',
  'Gustavo Mioto - Impressionando os Anjos',
  'Henrique & Juliano - Liberdade Provisória',
  'Henrique & Juliano - Até Você Voltar',
  'Henrique & Juliano - Aquela Pessoa',
  'Zé Neto & Cristiano - Largado às Traças',
  'Zé Neto & Cristiano - Notificação Preferida',
  'Zé Neto & Cristiano - Seu Polícia',
  'Maiara & Maraisa - Medo Bobo',
  'Maiara & Maraisa - 10%',
  'Maiara & Maraisa - Quem Ensinou Fui Eu',
  'Jorge & Mateus - Sosseguei',
  'Coldplay - Viva La Vida',
  'Coldplay - The Scientist',
  'Coldplay - Yellow',
  'Dj Arana - Montagem ANOS 2000',
  'Ghost - Mary On A Cross',
  'Tá rocheda - Os Barões da Pisadinha',
  'Os Barões da Pisadinha - Recairei'
]

export default function Search() {
  const [search, setSearch] = useState('')
  const [musics, setMusics] = useState<Music[]>([])
  const [loading, setLoading] = useState(false)
  const recommendationMapped = recommendations
    .sort(() => Math.random() - 0.5)
    .flatMap((recommendation, index) => {
      return [
        recommendation,
        1500
      ]
    })
  useEffect(() => {
    setMusics([])
    setLoading(true)
    const delayDebounceFn = setTimeout(async () => {
      if (search.length) {
        const response = await fetch(`/api/musics/search?query=${encodeURIComponent(search)}`)
        const data = await response.json()
        setMusics(data)
      } else {
        setMusics([])
      }
      setLoading(false)
    }, 700)
    return () => clearTimeout(delayDebounceFn)
  }, [search, setMusics])
  return (
    <div className='bg-site bg-cover bg-no-repeat rounded-lg h-full w-full overflow-hidden overflow-y-auto'>
      <Header>
        <div className='mb-2'>
          <h1 className="text-white text-3xl font-semibold">
            Pesquisar
          </h1>
        </div>
        <div className='flex flex-col justify-center items-center w-full mt-6'>
          <h1 className="text-white text-3xl font-light">
            O que você quer ouvir?
          </h1>
          <div className='flex flex-col w-full max-w-[722px] mt-4'>
            <div className='flex flex-row justify-center text-white/90 text-[16px] md:text-xl font-extralight'>
              <TypeAnimation
                sequence={
                  recommendationMapped
                }
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </div>
            <input
              type="text"
              value={search}
              onChange={async (e) => {
                setSearch(e.target.value)
              }}
              placeholder='Pesquisar'
              className="bg-transparent rounded-lg w-full h-12 px-4 text-white text-xl border border-white focus:outline-none"
            />
          </div>
        </div>
      </Header>
      {
        musics.length && (
          <div className="mt-2 mb-7 px-6">
            <div className="flex items-center justify-between">
              <h1 className="text-white font-semibold text-2xl mt-4">Resultados</h1>
            </div>
            {
              musics.map((music, index) => (
                <SongItemPage
                  key={index}
                  music={music}
                  index={index}
                  onThis={false}
                  ableToMove={false}
                  showCircle={false}
                  showMoreOptionsMobile={true}
                  showOnHoverMobile={true}
                  showMoreOptions={true}
                />
              ))
            }
          </div>
        ) || (
          loading && (
            <div className="flex flex-col items-center justify-center h-1/2">
              <div className="loading loading-spinner loading-lg"></div>
            </div>
          )
        )
      }
    </div>
  )
}

export function getStaticProps() {
  return {
    props: {
      BASE_URL: process.env.NEXTAUTH_URL
    },
  };
}