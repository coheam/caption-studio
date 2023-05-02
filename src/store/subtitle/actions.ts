import { timelineProps, subtitleStateProps } from './_types'
import storeProps, { colStylesProps } from '@/store/app/_types'
import { 
  INJECT_TIMELINE,
  INSERT_TIMELINE,
  DELETE_TIMELINE
} from './_namespace'

const methods = {
  calcState(timeline: timelineProps, styles: colStylesProps){
    const line: number = timeline.text.split('<br').length
    const height: number = ( line * styles.lineHeight ) + ( styles.padding * 2 ) + 1
    return {
      line,
      height
    }
  }
}

export const injectSubtitle = (subtitle: subtitleStateProps) => {
  return {
    type: INJECT_TIMELINE,
    ...subtitle
  }
}

export const injectTimeline = (timeline: timelineProps[]) => ( dispatch: Function, getState: Function ) => {
  const store = getState()
  const state = timeline.map(row => methods.calcState(row, store.app.colStyles))
  dispatch(
    injectSubtitle({
      timeline,
      state
    })
  )
}

export const insertTimeline = () => {
  return {
    type: INSERT_TIMELINE
  }
}
export const deleteTimeline = () => {
  return {
    type: DELETE_TIMELINE
  }
}