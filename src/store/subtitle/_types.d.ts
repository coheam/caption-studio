export interface reducersActionProps extends subtitleStateProps {
  type: string
}

export interface subtitleStateProps {
  timeline: timelineProps[]
  state: stateProps[]
}

export interface timelineProps {
  index?: Nullable<number>
  start: number
  end?: Nullable<number>
  text: string
  memo: string
}

export interface stateProps {
  line: number
  height: number
}

type Nullable<T> = T | null