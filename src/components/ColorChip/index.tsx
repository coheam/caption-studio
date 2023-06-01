import { storeProps } from '@/store'
import { setAction } from '@/store/app/actions'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { colorChipProps } from './types'

const ColorChip = ({ index, color }: colorChipProps) => {
  useEffect(()=>{
    return () => {
      // console.log('distory')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const current = useSelector((state: storeProps) => state.app.current)
  const dispatch = useDispatch()
  
  const clickHandler = () => {
    if (['text', 'memo'].includes(current.col)){
      dispatch(setAction('input/clip', `color/${color}`))
    }
  }
  return (
    <button id={`color-${index}`} className="btn-color-chip" title={`색상 ${index}`} onClick={clickHandler}>
      <span className="color" style={{backgroundColor: color}} title={color}></span>
      <span className="hex tup">{color}</span>
    </button>
  )
}
export default ColorChip