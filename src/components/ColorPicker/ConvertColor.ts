import { HexToHSL, HexToRGB, HSLToHEX, InvertHex } from './types'

export const hexToRGB: HexToRGB = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) as RegExpExecArray
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  }
}
export const hslToHEX: HSLToHEX = ({h,s,l}) => {
  l /= 100
  const a = s * Math.min(l, 1 - l) / 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }

  return `#${f(0)}${f(8)}${f(4)}`
}
export const hexToHSL: HexToHSL = (hex) => {
  let { r, g, b } = hexToRGB(hex)
  let h = 0, s = 0, l = 0
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  l = (max + min) / 2
  if (max != min) {
    var d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch(max){
      case r: h = (g - b) / d + (g < b ? 6 : 0);break
      case g: h = (b - r) / d + 2;break
      case b: h = (r - g) / d + 4;break
    }
    h /= 6
  }
  return {
    h: h * 360,
    s: s * 100,
    l: l * 100
  }
}

export const invertHex: InvertHex = (hex) => {
  const rgb = hexToRGB(hex)
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
  return brightness > 128 ? '#000000' : '#ffffff'
}