import useTranslation from 'next-translate/useTranslation'
import React, { useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { Button, Input } from '@mui/base'
import store from '@/store'
import { cloneDeep } from 'lodash'
import { pressedKey } from '@/components/Controls/parseHotkeys'
import { hexToHSL, hexToRGB, hslToHEX, invertHex } from './ConvertColor'

import { ColorPicker, HSLProps, SaturationOnChangeProps } from './types'

import Saturation from './Saturation'
import Hue from './Hue'

const ColorPicker: ColorPicker = ({ onClose }) => {
  const { t } = useTranslation('app')
  const sheetState = store.sheet.state
  
  const [colorChips, setColorChips] = useRecoilState(sheetState.colorChips)

  const [color, setColor] = useState<string>(colorChips[0] as string)
  const [invertColor, setInvertColor] = useState<string>(invertHex(color))
  const [hex, setHEX] = useState<string>(color)
  const [hue, setHUE] = useState<number | null>(null)
  const [sat, setSAT] = useState<number | null>(null)
  const [lig, setLIG] = useState<number | null>(null)
  const [codeEdit, setCodeEdit] = useState<boolean>(false)

  const hslRef = useRef<HSLProps | null>(null)
  const activeColorRef = useRef<number>(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const toggleCodeEdit = () => setCodeEdit(!codeEdit)
  const changeSatLig = ({sat, lig}: SaturationOnChangeProps) => {
    if (hslRef.current) {
      hslRef.current.s = sat
      hslRef.current.l = lig
    }
    const $hex = hslToHEX(hslRef.current as HSLProps)
    setSAT(sat)
    setLIG(lig)
    setHEX($hex)
    setInvertColor(invertHex($hex))
  }
  const changeHUE = (hue: number) => {
    if (hslRef.current) {
      hslRef.current.h = hue
      const $hex = hslToHEX(hslRef.current as HSLProps)
      setHEX($hex)
      setInvertColor(invertHex($hex))
    }
    setHUE(hue)
  }
  const onSelect = (e: React.MouseEvent) => {
    const dataset = (e.target as HTMLElement)?.dataset
    setColor(dataset?.color as string)
    activeColorRef.current = Number(dataset.index)
  }
  const onSuccess = () => {
    const $colorChips = cloneDeep(colorChips)
    $colorChips[activeColorRef.current] = hex
    setColorChips($colorChips)
    setColor(hex)
  }
  const colorCodeEventHandler = {
    onBlur: () => {
      const { h, s, l } = hexToHSL(hex)
      changeHUE(h)
      changeSatLig({
        sat: s,
        lig: l
      })
      toggleCodeEdit()
    },
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation()
      const target = e.target as HTMLInputElement
      const keys = pressedKey(e as unknown as KeyboardEvent)
      const regexp = /[0-9a-f]/
      let enableKey = true
      keys.forEach((key) => {
        if (key.length === 1){
          if (!regexp.test(key) || target.value.length >= 6) {
            enableKey = false
          }
        } else if (key.length === 0 || ['minus', 'plus', 'space'].includes(key)) {
          enableKey = false
        }
      })
      if (!enableKey) {
        e.preventDefault()
      }
    },
    onInput:(e: React.KeyboardEvent<HTMLInputElement>) => {
      const code = (e.target as HTMLInputElement).value
      if (code.length === 6){
        const codee = '#14786f'
        const { h, s, l } = hexToHSL(`#${code}`)
        changeHUE(h)
        changeSatLig({
          sat: s,
          lig: l
        })
      }
    },
    onContextMenu: (e: React.MouseEvent) => {
      e.preventDefault()
    }
  }
  useEffect(() => {
    hslRef.current = hexToHSL(color)
    setHEX(color)
    setInvertColor(invertHex(color))
    setHUE(hslRef.current.h)
    setSAT(hslRef.current.s)
    setLIG(hslRef.current.l)
  }, [color])
  useEffect(()=>{
    if (codeEdit) {
      (inputRef.current?.firstChild as HTMLInputElement).focus()
    }
  }, [codeEdit])
  return (<>
  <div className="colorpicker">
    <div className="colorpicker__header">
      <div className="colorpicker__header__color--chip" style={{
        backgroundColor: hex,
        color: invertColor
      }}></div>
      <div className="colorpicker__header__inbox">
        <span className="colorpicker__header__title" >{ t('select-color') }</span>
        {codeEdit && (
          <Input className="colorpicker__header__color--code" ref={inputRef}
            defaultValue={hex.replace('#', '')}
            {...colorCodeEventHandler}
          ></Input>
        ) || (
          <div className="colorpicker__header__color--code" onClick={() =>{
            toggleCodeEdit()
          }}>{hex.replace('#', '')}</div>
        )}
      </div>
    </div>
    <div className="colorpicker__body">
      <Saturation hex={hex}
        hue={hue as number}
        sat={sat as number}
        lig={lig as number}
        onChange={changeSatLig} />
      <Hue hue={hue as number} onChange={changeHUE} />
      <div className="colorpicker__chipset">
        {colorChips.map((colorChip, index) => {
          const invertRGB = hexToRGB(invertHex(colorChip as string))
          return (
            <Button className="button__color-chip" key={index} style={{
                backgroundColor: colorChip,
                borderColor: `rgba(${invertRGB.r},${invertRGB.g},${invertRGB.b},.5)`,
                color: `rgb(${invertRGB.r},${invertRGB.g},${invertRGB.b})`,
              }}
              data-index={index}
              data-color={colorChip}
              onClick={onSelect}
            >
              {colorChip === color && (
                <i className="icon">done</i>
              )}
              <div className="sr-only">{colorChip}</div>
            </Button>
          )
        })}
      </div>
    </div>
    <div className="colorpicker__footer">
      <div className="button__group">
        <Button className="button__text" onClick={onSuccess}>{t('button-apply')}</Button>
        <Button className="button__text" onClick={() => {
          onClose && onClose()
        }}>{t('button-close')}</Button>
      </div>
    </div>
  </div>
  </>)
}
export default ColorPicker