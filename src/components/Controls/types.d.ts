import React, { ReactElement } from 'react'

export interface HotKey {
  label?: string
  key?: string
  mask: string
  type: KeyboardEventTypes<string>
  handler(e: KeyboardEvent): void
}

export declare type ControlButton = (props: ControlButtonProps) => ReactElement
export interface ControlButtonProps {
  children?: React.ReactChild
  icon?: string
  title: string
  disabled: boolean
  classList?: string[]
  iconClassList?: string[]
  onClick: (e: React.MouseEvent) => void
}

export declare type ControlColors = (props: ControlColorsProps) => ReactElement
export interface ControlColorsProps {
  children?: React.ReactChild
  hotKeys: HotKey[]
  action: (key?: string, value?: string) => void
}

export interface StyledColorChipProps {
  $color: string
}

export declare type ControlSearch = (props: ControlSearchProps) => ReactElement
export interface ControlSearchProps {
  open: boolean
  onClose?: () => void
}


export declare type PressedKey = (e: KeyboardEvent) => Set<string>
export declare type MapKey = (key: string) => string
export type MappedKeysProps = Record<string, string>
export type KeyboardEventTypes = 'up' | 'down' | 'hold'