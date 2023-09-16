import React, { ReactElement } from 'react'

export declare type Confirm = (content: string, props?: ConfirmProps) => void
export interface ConfirmProps {
  isCancel?: boolean
  labelConfirm?: string
  labelCancel?: string
  onConfirm?: () => void
  onCancel?: () => void
}
