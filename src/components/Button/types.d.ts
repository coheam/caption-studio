export interface buttonProps {
  children?: ReactElement
  isDisable?: boolean
  type?: buttonTypeProps
  id?: string
  classList?: string[]
  title: string
  icon?: string
  click: Function
}

export type buttonTypeProps = "button" | "submit" | "reset"