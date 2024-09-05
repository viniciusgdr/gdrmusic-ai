import { Session } from '@gdrmusic/pages/api/auth/[...nextauth]';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { BiSearch } from 'react-icons/bi';
import { FaUserAlt } from 'react-icons/fa';
import { HiHome } from 'react-icons/hi';
import { RxCaretLeft, RxCaretRight } from 'react-icons/rx';
import { Button } from './Button';
import Image from 'next/image';
import { MdOutlineDevices } from 'react-icons/md';
import { useContext } from 'react';
import { MusicContext } from '@gdrmusic/hooks/MusicContext';

export const Header = ({ children, className = '', childrenButtons, gradientColor = 'bg-gradient-to-b to-emerald-800 from-blue-800' }: {
  children?: React.ReactNode,
  className?: string
  childrenButtons?: React.ReactNode
  gradientColor?: string
}) => {
  const musicContext = useContext(MusicContext)
  const { data: session } = useSession() as {
    data: Session | null
  };
  const router = useRouter()
  return (
    <div className={'h-fit p-6 pb-12 transition duration-[5000ms] ' + className + ' ' + gradientColor}>
      <div className="w-full mb-4 flex items-center justify-between flex-row-reverse md:flex-row">
        <div className="hidden md:flex items-center gap-x-2">
          <button
            onClick={() => {
              try {
                router.back()
              } catch {
              }
            }}
            className="cursor-pointer hover:opacity-75 transition rounded-full bg-black flex items-center justify-center "
          >
            <RxCaretLeft size={35} className="text-white" />
          </button>
          <button
            onClick={() => {
              try {
                router.forward()
              } catch {
                router.push('/')
              }
            }}
            className="cursor-pointer hover:opacity-75 transition rounded-full bg-black flex items-center justify-center"
          >
            <RxCaretRight size={35} className="text-white" />
          </button>
          {childrenButtons}
        </div>
        <div className="flex md:hidden gap-x-2 items-center">
          <button
            className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition"
            onClick={() => router.push('/')}
          >
            <HiHome className="text-black" size={26} />
          </button>
          <button
            className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition"
            onClick={() => router.push('/search')}
          >
            <BiSearch className="text-black" size={26} />
          </button>
          <button
            className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition"
            onClick={() => {
              if (musicContext.jamInfos?.roomId) {
                router.push(`/jam/${musicContext.jamInfos.roomId}`)
              } else {
                router.push('/jam')
              }
            }}
          >
            <MdOutlineDevices className="text-black" size={26} />
          </button>
        </div>
        <div className="md:hidden flex justify-between items-center gap-x-4">
          {session ? (
            <div className={"dropdown"}>
              <div tabIndex={0} role="img" className="">
                {
                  session.user.imageUrl ? (
                    <Button
                      className="bg-white"
                    >
                      <Image
                        src={session.user.imageUrl}
                        width={48}
                        height={48}
                        className="rounded-full"
                        alt='user image'
                      />
                    </Button>
                  ) : (
                    <Button className="bg-white px-3.5 py-3.5">
                      <FaUserAlt />
                    </Button>
                  )
                }
              </div>
              <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                <li>
                  <a onClick={() => signOut({
                    callbackUrl: '/'
                  })}>Sair</a>
                </li>
              </ul>
            </div>
          ) : (
            <div>
              <Button
                onClick={() => (document as any).getElementById('modal-login').showModal()}
                className="bg-white px-6 py-2"
              >
                Log In
              </Button>
            </div>
          )}
        </div>
        <div className="hidden md:flex justify-between items-center gap-x-4">
          {session ? (
            <div className={"dropdown dropdown-end"}>
              <div tabIndex={0} role="img" className="">
                {
                  session.user.imageUrl ? (
                    <Button
                      className="bg-white"
                    >
                      <Image
                        src={session.user.imageUrl}
                        width={48}
                        height={48}
                        className="rounded-full"
                        alt='user image'
                      />
                    </Button>
                  ) : (
                    <Button className="bg-white px-3.5 py-3.5">
                      <FaUserAlt />
                    </Button>
                  )
                }
              </div>
              <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                <li>
                  <a onClick={() => signOut({
                    callbackUrl: '/'
                  })}>Sair</a>
                </li>
              </ul>
            </div>
          ) : (
            <div>
              <Button
                onClick={() => (document as any).getElementById('modal-login').showModal()}
                className="bg-white px-6 py-2"
              >
                Log In
              </Button>
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}
