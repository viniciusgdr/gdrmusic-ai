import validator from 'validator';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';

export const Login = ({
  id = 'modal-login',
  redirectUrl = '/'
}: {
  id?: string;
  redirectUrl?: string;
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreedTerms, setAgreedTerms] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  return (
    <dialog id={id} className="modal w-full">
      <div className="modal-box md:w-[700px] h-[55ca0px] flex flex-col justify-center items-center">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div className="flex flex-col items-center justify-center w-full p-5 rounded shadow-xl">
          <h1 className="mb-4 text-3xl font-bold text-center">Login</h1>
          <div className="flex flex-col w-full">
            <label htmlFor="email" className="mb-2 text-sm">Email</label>
            <input
              id="email"
              type="email"
              className="w-full p-2 mb-4 border border-slate-600 rounded shadow-sm bg-base-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="password" className="mb-2 text-sm">Senha</label>
            <input
              id="password"
              type="password"
              className="w-full p-2 mb-4 border border-slate-600 rounded shadow-sm bg-base-100"
              value={password}
              minLength={8}
              onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="flex items-center w-full mb-4">
            <input
              id="agreedTerms"
              type="checkbox"
              className="w-4 h-4 mr-2 text-blue-500 border border-slate-600 rounded shadow-sm bg-base-100"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)} />
            <label htmlFor="agreedTerms" className="text-sm">Eu concordo com os <Link href="/terms" className="text-blue-500">termos de uso</Link></label>
          </div>
          <button
            disabled={email === '' || password === '' || !agreedTerms}
            type="submit"
            className="w-full py-2 mb-4 text-sm font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded shadow-sm hover:bg-blue-600 disabled:opacity-50 "
            onClick={
              async (e) => {
                e.preventDefault()
                const isEmail = validator.isEmail(email)
                if (!isEmail) {
                  setError('Email inválido')
                  return
                }
                const signResponse = await signIn('credentials', {
                  email,
                  password,
                  callbackUrl: `${window.location.origin}`,
                  redirect: false
                })
                if (signResponse?.error) {
                  setError(signResponse.error)
                } else {
                  router.push('/')
                }
              }
            }
          >
            Entrar
          </button>
          {error !== '' && (
            <div className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
              <button
                className="ml-auto"
                onClick={() => setError('')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

            </div>
          )}
          <div className="flex items-center justify-between w-full">
            <Link
              href={"/account/register"}
              className="text-sm text-blue-500 hover:underline"
            >Criar conta</Link>
            <Link
              href="/account/forgot-password"
              className="text-sm text-blue-500 hover:underline"
            >Esqueci minha senha</Link>
          </div>
          <div className='flex flex-col justify-center items-center pt-12'>
            <button
              className="btn btn-accent btn-block mb-4"
              onClick={() => signIn('google', { callbackUrl: '/' })}
            >
              <FcGoogle className="mr-2" />
              <span>Entrar com Google</span>
            </button>
          </div>
        </div>
      </div>
    </dialog>
  )
}