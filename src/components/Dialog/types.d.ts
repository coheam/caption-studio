import React, { ReactElement } from 'react'

export declare type Dialog = (props: DialogProps) => ReactElement
export interface DialogProps {
  children?: ReactElement
  classList?: string[]
  open: boolean
  onClose: () => void
}
