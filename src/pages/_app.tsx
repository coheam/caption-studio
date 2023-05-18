import type { AppProps } from 'next/app'
import type {} from 'redux-thunk/extend-redux'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { storeProps, wrapper } from '@/store'
import { injectSubtitle } from '@/store/subtitle/actions'
import Storage from '@/util/StorageUtil'
import '@styles/common.scss'
import { emptyTimeline } from '@/util/TimelineUtils'

const App = ({ Component, pageProps }: AppProps) => {
  const format = useSelector((state: storeProps) => state.app.config.format)
  const dispatch = useDispatch()
  useEffect(()=>{
    const timelines = Storage?.get('SUBTITLE_TEMP') ?? [ emptyTimeline(format) ]

    dispatch(injectSubtitle(timelines))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <Component {...pageProps} />
}
export default wrapper.withRedux(App)