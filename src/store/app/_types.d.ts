export interface stateProps {
  ready: boolean
  action: actionProps
  config: configProps
  colStyles: colStylesProps
  current: currentProps
  edit: boolean
}

export interface actionProps {
  type: string
  param?: string
  stamp: number
}

export interface currentProps {
  col: colProps
  row: number
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

export interface payloadProps extends stateProps {
  type: string
}

export type colProps = 'start' | 'end' | 'text' | 'memo'