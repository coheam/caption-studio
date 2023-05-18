import { 
  payloadProps,
  timelineProps,
  subtitleStateProps,
  injectSubtitleProps,
  updateTimelineProps,
  stateProps
} from './_types'
import initialState from './_state'
import { 
  INJECT_TIMELINE,
  INSERT_TIMELINE,
  UPDATE_TIMELINE,
  DELETE_TIMELINE
} from './_namespace'
import { colStylesProps } from '@/store/app/_types'
import { getObjectValue, setObjectValue } from '@/util/ObjectUtils'
import Storage from '@/util/StorageUtil';
import { appStateProps } from '../app'
import { emptyTimeline } from '@/util/TimelineUtils'

const methods = {
  calcState(timeline: timelineProps, styles: colStylesProps): stateProps{
    const line: number = timeline.text.split('<br').length
    const height: number = ( line * styles.lineHeight ) + ( styles.padding * 2 ) + 1
    return {
      line,
      height
    }
  }
}
const mutations = {}
setObjectValue(mutations, 
  INJECT_TIMELINE, 
  ({ app, timeline }: injectSubtitleProps): subtitleStateProps => {
    const state = timeline.map(row => methods.calcState(row, app.colStyles))
    return {
      timeline,
      state,
      height: state.reduce((a, {height}) => a + height, 0),
      stamp: Date.now()
    }
  }
)
setObjectValue(mutations, 
  INSERT_TIMELINE,
  ({ app, row, data }: updateTimelineProps, subtitleState: subtitleStateProps) => {
    data = data as unknown as timelineProps
    const { colStyles, config: { format } } = app as unknown as appStateProps
    const store = { ...subtitleState }
    const size = store.timeline.length - 1
    const prev = row - 1
    const state = methods.calcState(data, colStyles)

    let prevTimeline: timelineProps
    let nextTimeline: timelineProps
    if (row < size) {
      nextTimeline = { ...store.timeline[row] }
      if (format === 'srt' && data.start === 0) data.start = nextTimeline.end as unknown as number
      if (format === 'srt' && data.end === 0) data.end = nextTimeline.end
      if (format === 'smi' && data.start === 0) data.start = nextTimeline.start
    } else if (prev > -1) {
      prevTimeline = { ...store.timeline[prev] }
      if (format === 'srt' && data.start === 0) data.start = prevTimeline.end as unknown as number
      if (format === 'srt' && data.end === 0) data.end = prevTimeline.end
      if (format === 'smi' && data.start === 0) data.start = prevTimeline.start
    }
		store.timeline.splice(row, 0, data)
		store.state.splice(row, 0, state)
    store.height += state.height
    store.stamp = Date.now()
    return store
  }
)
setObjectValue(mutations, 
  UPDATE_TIMELINE,
  ({ app, row, data }: updateTimelineProps, subtitleState: subtitleStateProps): subtitleStateProps  => {
    // subtitleState.timeline
    data = data as unknown as timelineProps
    const { colStyles } = app as unknown as appStateProps
    const store = { ...subtitleState }
    const nState = methods.calcState(data, colStyles)
    const oState = store.state[row] ?? 0
    const calc = nState.height - oState.height
    if (oState) {
      store.timeline[row] = data
      store.state[row] = nState
      store.height += calc
      store.stamp = Date.now()
    }
    return store
  }
)
setObjectValue(mutations, 
  DELETE_TIMELINE,
  ({ app, row }: updateTimelineProps, subtitleState: subtitleStateProps): subtitleStateProps  => {
    // subtitleState.timeline
    const { config: { format } } = app as unknown as appStateProps
    const store = { ...subtitleState }
    const oData = { ...store.timeline[row] }
    store.height -= store.state[row].height
    store.timeline.splice(row, 1)
    store.state.splice(row, 1)
    store.stamp = Date.now()
    if (store.timeline.length === 0) {
      return getObjectValue(mutations, INJECT_TIMELINE)({
        app, timeline: [ emptyTimeline(format) ]
      })
    }
    return store
  }
)

const Reducers = (subtitleState = initialState, payload: payloadProps) => {
  const mutation = getObjectValue(mutations, payload.type)
  if (typeof mutation === 'function') {
    const result = mutation(payload, subtitleState)
    Storage?.set('SUBTITLE_TEMP', result.timeline)
    return result
  } else {
    return subtitleState
  }
}
export default Reducers