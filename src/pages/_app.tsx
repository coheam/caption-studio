import type { AppProps } from 'next/app'
import { Suspense } from 'react'
import { RecoilRoot } from 'recoil'
import '@/assets/styles/common.scss'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  )
}
export default App