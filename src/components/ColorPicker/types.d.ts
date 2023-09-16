import React from 'react'

export declare type ColorPicker = (props: ColorPickerProps) => ReactElement
export interface ColorPickerProps {
  onClose?: () => void
}

export declare type HexToHSL = (hex: string) => HSLProps
export interface HSLProps {
  h: number
  s: number
  l: number
}
export declare type HexToRGB = (hex: string) => RGBProps
export interface RGBProps {
  r: number
  g: number
  b: number
}
export declare type InvertHex = (hex: string) => string
export declare type HSLToHEX = (hsl: HSLProps) => string

export declare type Saturation = (props: SaturationProps) => ReactElement
export interface SaturationProps {
  hex: string
  hue: number
  sat: number
  lig: number
  classList?: string[]
  onChange: (props: SaturationOnChangeProps) => void
}
export interface SaturationOnChangeProps {
  sat: number
  lig: number
}
export declare type Hue = (props: HueProps) => ReactElement
export interface HueProps {
  hue: number
  vertical?: boolean
  classList?: string[]
  onChange: (hue: number) => void
}
export interface PosProps {
  x: number,
  y: number
}