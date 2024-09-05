import { Sora } from 'next/font/google'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800']
})

const Layout = ({ children }: {
  children: React.ReactNode
}) => {
  return (
    <div className={`page ${sora.variable} font-sora relative h-full`}>
      {children}
    </div>
  )
};

export default Layout;