import { timelineProps } from "../subtitle/_types"

export interface appStateProps {
  ready: boolean
  action: actionProps
  config: configProps
  colStyles: colStylesProps
  current: currentProps
  edit: boolean
  history: historyProps
}

export interface actionProps {
  type: string
  param?: string
  stamp: number
}

export interface configProps {
  language: string
  theme: string
  format: string
  timeInterval: number
}

export interface colStylesProps {
  fontSize: number
  lineHeight: number
  padding: number
}

export interface currentProps {
  tab: number
  row: number
  col: colProps
}

export interface historyProps {
  index: number[]
  logs: Array<Array<logProps>>
  current: Array<logProps>
}

export interface logProps {
  action: logActionProps
  index: number
  back?: timelineProps
  forward?: timelineProps
  current: currentProps
  moved?: currentProps
}

export interface historyActionProps {
  callback?: Function
  dispatch?: Function
}

export interface historyPayloadProps {
  type: string
  log: logProps
}

export interface payloadProps extends appStateProps {
  type: string
}

export type colProps = 'start' | 'end' | 'text' | 'memo'
export type logActionProps = 'insert' | 'update' | 'delete'