import { useRouter } from 'next/router'
import { FaHome, FaSearch } from 'react-icons/fa'
import { VscLibrary } from 'react-icons/vsc'

export const Navigation = () => {
  const router = useRouter()
  return (
    <div className="btm-nav bg-transparent bg-gradient-to-t from-[#050505] h-[62px] md:hidden">
      <button onClick={() => router.push('/')} className='w-full'>
        <div className={"flex flex-col items-center justify-center gap-1  " + (router.pathname === '/' ? 'text-white' : 'hover:text-white')}>
          <FaHome size={25} />
          <span className="text-xs">Início</span>
        </div>
      </button>
      <button onClick={() => router.push('/search')} className='w-full'>
        <div className={"flex flex-col items-center justify-center gap-1 " + (router.pathname === '/search' ? 'text-white' : 'hover:text-white')}>
          <FaSearch size={25} />
          <span className="text-xs">Buscar</span>
        </div>
      </button>
      <button onClick={() => router.push('/library')} className='w-full'>
        <div className={"flex flex-col items-center justify-center gap-1 " + (router.pathname === '/library' ? 'text-white' : 'hover:text-white')}>
          <VscLibrary size={25} />
          <span className="text-xs">Biblioteca</span>
        </div>
      </button>
    </div>
  )
}