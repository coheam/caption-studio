import React, { useCallback, useEffect, useRef, useState } from 'react'
import { hslToHEX } from './ConvertColor'
import { HSLProps, Hue } from './types'

const Hue: Hue = ({ hue, vertical = false, classList = [], onChange }) => {
  const [pos, setPos] = useState<number>()
  const [bgHUE, setBgHUE] = useState<string>()
  const hueRef = useRef<HTMLDivElement>(null)
  const rect = useRef<DOMRect>()

  const hueClassName = () => {
    const classNameList = ['colorpicker__hue', ...classList]
    return classNameList.join(' ')
  }
  const interactive = (e: MouseEvent | TouchEvent | React.SyntheticEvent) => {
    const clientX = (e as TouchEvent).touches ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX
    const clientY = (e as TouchEvent).touches ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY
    if (rect.current) {
      const x = Math.min(rect.current.width, Math.max(clientX - rect.current.left, 0))
      const y = Math.min(rect.current.height, Math.max(clientY - rect.current.top, 0))
      setPos(vertical ? y : x)
      calcHUE(vertical ? y : x)
    }
  }
  const calcHUE = useCallback((pos: number) => {
    if (rect.current) {
      const size = vertical ? rect.current.height : rect.current.width
      const h = Math.round((pos ?? 0) / size * 360)
      setBgHUE(hslToHEX({h, s: 100, l: 50}))
      onChange(h)
    }
  }, [vertical, onChange])
  const InterActiveEvent = () => {
    hueRef.current?.focus()
    const clearInterActive = (e: MouseEvent | TouchEvent) => {
      rect.current = undefined
      document.removeEventListener('mousemove', interactive)
      document.removeEventListener('touchmove', interactive)
      document.removeEventListener('mouseup', clearInterActive)
      document.removeEventListener('touchend', clearInterActive)
    }
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
    const x = Math.round(hue / 360 * (hueRef.current?.clientWidth ?? 0))
    const y = Math.round(hue / 360 * (hueRef.current?.clientHeight ?? 0))
    setPos(vertical ? y : x)
    calcHUE(vertical ? y : x)
    setBgHUE(hslToHEX({h: hue, s: 100, l: 50}))
  }, [hue, vertical, calcHUE])
  return (<>
    <div className={hueClassName()}>
      <div className={vertical ? 'colorpicker__hue__interactive--vertical' : "colorpicker__hue__interactive"} ref={hueRef} tabIndex={-1}
        {...iaEventHandler}
      ></div>
      {pos !== undefined && (
        <div className="colorpicker--pointer" style={vertical ? {
          backgroundColor: bgHUE,
          top: pos,
          left: '50%'
        }: {
          backgroundColor: bgHUE,
          top: '50%',
          left: pos
        }}></div>
      )}
    </div>
  </>)
}
export default Hue