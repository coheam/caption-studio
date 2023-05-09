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
  stamp: number
}

export interface currentProps {
  row: number
  col: currentColProps
}

export type currentColProps = 'start' | 'end' | 'text' | 'memo'

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

export interface reducersActionProps extends stateProps {
  type: string
}
