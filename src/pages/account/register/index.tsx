import React, { useState } from 'react'
import validator from 'validator'
import { ToastContainer } from "react-toastify";
import { useRouter } from 'next/router';
import Link from 'next/link';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@gdrmusic/pages/api/auth/[...nextauth]';

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [agreedTerms, setAgreedTerms] = useState(false)
  const [error, setError] = useState('')
  const [buttonAsLogin, setButtonAsLogin] = useState(false)
  const router = useRouter()

  const [segurityPassword, setSegurityPassword] = useState({
    length: false,
    includesUpperCase: false,
    includesLowerCase: false,
    includesNumber: false,
  });
  const score = validator.isStrongPassword(password, {
    returnScore: true,
    pointsPerUnique: 1,
    pointsPerRepeat: 0.5,
    pointsForContainingLower: 22,
    pointsForContainingUpper: 22,
    pointsForContainingNumber: 22,
    pointsForContainingSymbol: 22
  })

  return (
      <div className="flex h-screen bg-base-100 justify-center">
        <div className="flex flex-col justify-center pr-[15px] pl-[15px] max-w-xl container">
          <div className="bg-base-200 rounded-3xl border-4 border-slate-700">
            <form className="flex flex-col items-center justify-center w-full p-5 rounded shadow-xl">
              <h1 className="mb-4 text-3xl font-bold text-center">Cadastre-se!</h1>
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
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setSegurityPassword({
                      length: validator.isLength(e.target.value, { min: 8 }),
                      includesUpperCase: e.target.value.match(/[A-Z]/g) ? true : false,
                      includesLowerCase: e.target.value.match(/[a-z]/g) ? true : false,
                      includesNumber: e.target.value.match(/[0-9]/g) ? true : false
                    })
                  }} />
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="passwordConfirmation" className="mb-2 text-sm">Confirme a senha</label>
                <input
                  id="passwordConfirmation"
                  type="password"
                  className="w-full p-2 mb-4 border border-slate-600 rounded shadow-sm bg-base-100"
                  value={passwordConfirmation}
                  minLength={8}
                  onChange={(e) => setPasswordConfirmation(e.target.value)} />
              </div>
              <div className="flex items-center w-full mb-4">
                <input
                  id="agreedTerms"
                  type="checkbox"
                  className="w-4 h-4 mr-2 border bg-base-100 rounded shadow-sm"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)} />
                <label htmlFor="agreedTerms" className="text-sm">Eu concordo com os <Link href="/terms" className="text-blue-500">termos de uso</Link></label>
              </div>
              <div className='pt-4 self-start pb-4'>
                <h3>
                  Força da Senha: <span className="badge badge-primary">{
                    score < 30 ? 'Tá fraco' : score < 60 ? 'Tá ficando bom' : 'Perfeita!'
                  }</span>
                </h3>
                <progress className="progress w-full progress-primary" value={score} max="100"></progress>
                <ul className="list-disc list-inside">
                  <li className={segurityPassword.length ? 'text-green-500' : 'text-red-500'}>Mínimo de 8 caracteres</li>
                  <li className={segurityPassword.includesUpperCase ? 'text-green-500' : 'text-red-500'}>Pelo menos uma letra maiúscula</li>
                  <li className={segurityPassword.includesLowerCase ? 'text-green-500' : 'text-red-500'}>Pelo menos uma letra minúscula</li>
                  <li className={segurityPassword.includesNumber ? 'text-green-500' : 'text-red-500'}>Pelo menos um número</li>
                  <li className={validator.equals(password, passwordConfirmation) && password.length != 0 ? 'text-green-500' : 'text-red-500'}>As senhas devem ser iguais</li>
                </ul>
              </div>
              {
                buttonAsLogin && (
                  <button
                    type="submit"
                    className="btn btn-success w-full py-2 mb-4 text-sm font-bold uppercase"
                    onClick={
                      () => {
                        router.push('/account/login')
                      }
                    }
                  >
                    Login
                  </button>
                ) || (

                  <button
                    disabled={
                      email === '' ||
                      !validator.equals(password, passwordConfirmation) ||
                      !segurityPassword.includesUpperCase ||
                      !segurityPassword.includesLowerCase ||
                      !segurityPassword.includesNumber ||
                      !segurityPassword.length ||
                      passwordConfirmation === '' ||
                      !agreedTerms
                    }
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
                        if (password !== passwordConfirmation) {
                          setError('As senhas não coincidem')
                          return
                        }
                        if (password.length < 8) {
                          setError('A senha deve ter no mínimo 8 caracteres')
                          return
                        }

                        const res = await fetch('/api/register', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({
                            email,
                            password,
                            passwordConfirmation
                          })
                        })
                        const json = await res.json()
                        if (json.error) {
                          setError(json.error)
                          setButtonAsLogin(false)
                        } else {
                          setError('')
                          setAgreedTerms(false)
                          setButtonAsLogin(true)
                          router.push('/account/login')
                        }
                      }}
                  >
                    Cadastrar
                  </button>
                )
              }
              <ToastContainer />
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
              <div className="flex flex-col items-center justify-center w-full pt-4">
                <span className="text-xs text-center text-gray-500">Já tem uma conta?</span>
                <Link href={"/account/login"} className="text-sm font-bold text-blue-500 uppercase hover:text-blue-600">Faça login!</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
  )
}


export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const session = await getServerSession(req, res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
  return {
    props: {}
  }
}