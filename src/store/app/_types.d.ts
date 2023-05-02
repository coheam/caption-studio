export interface stateProps {
  config: configProps
  colStyles: colStylesProps
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

export interface ActionProps {
  type: string
}
