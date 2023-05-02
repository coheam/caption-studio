import { ActionProps, timelineProps, subtitleStateProps } from './_types';
import initialState from './_state'
import { 
  INJECT_TIMELINE,
  INSERT_TIMELINE,
  DELETE_TIMELINE
} from './_namespace'

const Reducers = (state = initialState, action: ActionProps) => {
  console.log(action)
  switch (action.type) {
    case INJECT_TIMELINE:
      return {
        timeline: action.timeline,
        state: action.state
      }
    case INSERT_TIMELINE:
      return { ...state }
    case DELETE_TIMELINE:
      return { ...state }
    default:
      return state
  }
}
export default Reducers