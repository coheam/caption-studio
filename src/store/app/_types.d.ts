export interface stateProps {
  ready: boolean
  config: configProps
  colStyles: colStylesProps
  current: currentProps
}

export interface currentProps {
  row: number
  col: 'start' | 'end' | 'text' | 'memo'
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

export interface ActionProps extends stateProps {
  type: string
}
