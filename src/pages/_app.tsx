import type { AppProps } from 'next/app'
import type {} from 'redux-thunk/extend-redux'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { wrapper } from '@/store'
import { injectTimeline } from '@/store/subtitle/actions'
import { timelineProps } from '@/store/subtitle/_types'
import '@styles/common.scss'

const App = ({ Component, pageProps }: AppProps) => {
  const store = useSelector(state => state)
  const dispatch = useDispatch()
  useEffect(()=>{
    const timelines = ((): timelineProps[] => {
      const timelines = window.localStorage.getItem('SUBTITLE_TEMP')
      return timelines ?
        JSON.parse(timelines) :
        [ {start: 0, end: 0, text: '', memo: '' } ]
    })()
    dispatch(injectTimeline(timelines))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <Component {...pageProps} />
}
export default wrapper.withRedux(App)