import React, { useCallback, useEffect, useRef, useState } from 'react'
import { hexToHSL, hslToHEX } from './ConvertColor'
import { HSLProps, PosProps, Saturation, SaturationOnChangeProps } from './types'

const Saturation: Saturation = ({hex, hue, sat, lig, classList = [], onChange}) => {
  const [pos, setPos] = useState<PosProps | null>(null)
  const [bgHEX, setBgHEX] = useState<string>(hex)
  const [bgHUE, setBgHUE] = useState<string>()
  const saturationRef = useRef<HTMLDivElement>(null)
  const rect = useRef<DOMRect>()

  const satClassName = () => {
    const classNameList = ['colorpicker__saturation', ...classList]
    return classNameList.join(' ')
  }
  const interactive = (e: MouseEvent | TouchEvent | React.SyntheticEvent) => {
    const clientX = (e as TouchEvent).touches ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX
    const clientY = (e as TouchEvent).touches ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY
    if (rect.current) {
      const x = Math.min(rect.current.width, Math.max(clientX - rect.current.left, 0))
      const y = Math.min(rect.current.height, Math.max(clientY - rect.current.top, 0))

      setPos({x, y})
      setSatLig({x, y})
    }
  }
  const calcHSL = useCallback((pos: PosProps): HSLProps => {
    const hsv_value = 1 - Math.round((pos?.y ?? 0) / (saturationRef.current?.clientHeight ?? 0) * 100) / 100
    const hsv_saturation =  Math.round((pos?.x ?? 0) / (saturationRef.current?.clientWidth ?? 0) * 100) / 100
    const lightness = (hsv_value / 2) * (2 - hsv_saturation)
    const saturation = (hsv_value * hsv_saturation) / (1 - Math.abs(2 * lightness - 1))
    return {
      h: hue,
      s: isNaN(saturation) ? 0 : Math.round(saturation * 100),
      l: Math.round(lightness * 100)
    }
  }, [hue])
  const setSatLig = useCallback((pos: PosProps) => {
    const hsl = calcHSL(pos)
    const satLig = {
      sat: hsl.s,
      lig: hsl.l
    }
    setBgHEX(hslToHEX(hsl))
    onChange(satLig)
  }, [calcHSL, setBgHEX, onChange])
  const changeHUE = useCallback((hue: number) => {
    setBgHEX(hslToHEX({ h: hue, s: sat, l: lig }))
    setBgHUE(hslToHEX({ h: hue, s: 100, l: 50 }))
  }, [sat, lig])
  
  const changePOS = ({sat, lig}: SaturationOnChangeProps) => {
    if (lig !== undefined && sat !== undefined) {
      const lightness = lig / 100
      const saturation = sat / 100
  
      const hsv_value = saturation * (1 - Math.abs(2 * lightness - 1)) / 2 + lightness
      const hsv_saturation = lightness === 0 && hsv_value === 0 ? 0 : 2 - lightness * 2 / hsv_value
      const x = Math.round(hsv_saturation * (saturationRef.current?.clientWidth ?? 0))
      const y = Math.round((1 - hsv_value) * (saturationRef.current?.clientHeight ?? 0))

      setPos({x,y})
    }
  }
  const InterActiveEvent = () => {
    const clearInterActive = (e: MouseEvent | TouchEvent) => {
      rect.current = undefined
      document.removeEventListener('mousemove', interactive)
      document.removeEventListener('touchmove', interactive)
      document.removeEventListener('mouseup', clearInterActive)
      document.removeEventListener('touchend', clearInterActive)
    }
    saturationRef.current?.focus()
    document.addEventListener('mousemove', interactive)
    document.addEventListener('touchmove', interactive)
    document.addEventListener('mouseup', clearInterActive)
    document.addEventListener('touchend', clearInterActive)
  }
  const iaEventHandler = {
    onMouseDown: (e: React.SyntheticEvent) => {
      e.preventDefault()
      e.stopPropagation()
      rect.current = (e.target as HTMLElement)?.getBoundingClientRect()
      interactive(e)
      InterActiveEvent()
    },
    onTouchStart: (e: React.SyntheticEvent) => {
      rect.current = (e.target as HTMLElement)?.getBoundingClientRect()
      interactive(e)
      InterActiveEvent()
    },
  }
  useEffect(() => {
    changeHUE(hue)
  }, [hue, changeHUE])
  useEffect(() => {
    if (bgHEX) {
      const hsl = hexToHSL(bgHEX)
      if (hsl.s !== sat || hsl.l !== lig) {
        changePOS({sat, lig})
      }
    }
  }, [bgHEX, sat, lig])
  return (<>
    <div className={satClassName()}>
      <div className="colorpicker__saturation__interactive" ref={saturationRef} tabIndex={-1} style={{
          backgroundColor: bgHUE,
        }}
        {...iaEventHandler}
      ></div>
      {pos && (
        <div className="colorpicker--pointer" style={{
          backgroundColor: bgHEX,
          top: pos?.y,
          left: pos?.x
        }}></div>
      )}
    </div>
  </>)
}
export default Saturation