import { timelineProps, subtitleStateProps, injectSubtitleProps, updateTimelineProps } from './_types'
import storeProps, { colStylesProps, currentProps } from '@/store/app/_types'
import { 
  INJECT_TIMELINE,
  INSERT_TIMELINE,
  UPDATE_TIMELINE,
  DELETE_TIMELINE,
} from './_namespace'
import { setCurrent, syncDispatch } from '../app/actions'

export const injectSubtitle = ( timeline: timelineProps[] ) => ( dispatch: Function, getState: Function ) => {
  dispatch({
    type: INJECT_TIMELINE,
    app: getState().app,
    timeline
  })
}

export const insertTimeline = ( props: updateTimelineProps ) => ( dispatch: Function, getState: Function ) => {
  dispatch({
    type: INSERT_TIMELINE,
    app: getState().app,
    ...props
  })
  dispatch(setCurrent({
    row: props.row,
    col: props.col
  }))
}
export const updateTimeline = ( props: updateTimelineProps ) => ( dispatch: Function, getState: Function ) => {
  dispatch({
    type: UPDATE_TIMELINE,
    app: getState().app,
    ...props
  })
}
export const deleteTimeline = (props: updateTimelineProps) => ( dispatch: Function, getState: Function ) => {
  dispatch({
    type: DELETE_TIMELINE,
    app: getState().app,
    ...props
  })
  const row = props.row - 1
  dispatch(setCurrent({
    row: row > 0 ? row : 0,
    col: props.col
  }))
}