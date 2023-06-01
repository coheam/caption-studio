import { timelineProps, subtitleStateProps, injectSubtitleProps, updateTimelineProps } from './_types'
import storeProps, { colStylesProps, currentProps } from '@/store/app/_types'
import { 
  INJECT_TIMELINE,
  INSERT_TIMELINE,
  UPDATE_TIMELINE,
  DELETE_TIMELINE
} from './_namespace'
import { clearHistory, setCurrent, setHistory } from '../app/actions'
import { emptyTimeline } from '@/util/TimelineUtils'

export const injectSubtitle = ( timeline: timelineProps[] ) => ( dispatch: Function, getState: Function ) => {
  dispatch({
    type: INJECT_TIMELINE,
    app: getState().app,
    timeline
  })
}
export const initialSubtitle = () => ( dispatch: Function, getState: Function ) => {
  const { app } = getState()
  dispatch({
    type: INJECT_TIMELINE,
    app,
    timeline: [ emptyTimeline(app.config.format) ]
  })
  dispatch(clearHistory())
}
export const insertTimeline = ( { tab, row, col, data }: updateTimelineProps, history: boolean = false ) => ( dispatch: Function, getState: Function ) => {
  const { app } = getState()
  if (!history){
    dispatch(setHistory({
      action: 'insert',
      index: row,
      forward: data as unknown as timelineProps,
      current: app.current
    }))
  }
  dispatch({
    type: INSERT_TIMELINE,
    app: app,
    row,
    data
  })
  dispatch(setCurrent({ tab, row, col }))
}
export const updateTimeline = ( { row, col, data }: updateTimelineProps, history: boolean = false ) => ( dispatch: Function, getState: Function ) => {
  const { app, subtitle: { timeline } } = getState()
  if (!history){
    dispatch(setHistory({
      action: 'update',
      index: row,
      back: timeline[row],
      forward: data as unknown as timelineProps,
      current: app.current
    }))
  }
  dispatch({
    type: UPDATE_TIMELINE,
    app: app,
    row,
    data
  })
  console.log(row, col, data, history)
}
export const deleteTimeline = (index: number, current?: currentProps, history: boolean = false) => ( dispatch: Function, getState: Function ) => {
  const { app, subtitle: { timeline } } = getState()
  if (!history){
    dispatch(setHistory({
      action: 'delete',
      index,
      back: timeline[index],
      current: current ?? app.current
    }))
  }
  dispatch({
    type: DELETE_TIMELINE,
    app,
    index
  })
  const row = index - 1
  dispatch(setCurrent(current ?? {
    tab: app.current.tab,
    row: row > 0 ? row : 0,
    col: app.current.col
  }))
}