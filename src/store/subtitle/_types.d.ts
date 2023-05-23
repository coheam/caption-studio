import { currentProps, stateProps as appStateProps } from "../app/_types"
export interface payloadProps extends subtitleStateProps {
  type: string
}

export interface injectSubtitleProps {
  app: appStateProps
  timeline: timelineProps[]
}

export interface updateTimelineProps extends currentProps {
  app?: appStateProps
  data?: timelineProps
}

export interface deleteTimelineProps {
  app?: appStateProps
  index: number
}

export interface subtitleStateProps {
  timeline: timelineProps[]
  state: stateProps[]
  height: number
  stamp: number
}

export interface timelineProps {
  index?: number
  start: number
  end?: number
  text: string
  memo: string
}

export interface stateProps {
  line: number
  height: number
}

type Nullable<T> = T | null