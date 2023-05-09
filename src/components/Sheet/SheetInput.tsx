import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { storeProps } from '@/store'
import { inputDataProps } from './types'
import { setEdit } from '@/store/app/actions'

const SheetInput = (active: inputDataProps) => {
  const dispatch = useDispatch()
  const isEdit = useSelector((state: storeProps) => state.app.edit)
  // const current = useSelector((state: storeProps) => state.app.current)
  const input = useRef<HTMLDivElement | null>(null)
  const activeRef = useRef({
    index: 0,
    col: '',
    data: active.data
  })
  const methods = {
    triggerClassName(){
      const className = ['sheet-trigger']
      if (isEdit) className.push('on')
      return className.join(' ')
    },
    keyDownHandler(e: React.SyntheticEvent){
      // e.preventDefault()
      // e.stopPropagation()
      // console.log(e)
    },
    inputHandler(e: React.SyntheticEvent){
      e.preventDefault()
      // console.log('inputHandler', e)
      const target = e.target as HTMLInputElement
      let html = target.innerHTML
      let size = html.length
      if (size >= 4){
        html = html.lastIndexOf('<br>') == size - 4 ? html.slice(0, (size - 4)) : html;
      }
      
      activeRef.current = {
        ...activeRef.current,
        data : html
      }
      return false
    },
    setContent(newContent: string) {
      if (input.current) {
        input.current.innerHTML = `${newContent}<br>`
      }
    }
  }
  useEffect(() => {
    if (isEdit) {
      dispatch(setEdit(false))
    }
    methods.setContent(active.data)
    input.current?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(active)])
  useEffect(()=>{
    if (isEdit) {
      input.current?.focus()
      document.execCommand('selectAll')
    } else {
      console.log(activeRef)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[isEdit])
  return (
    <div className={methods.triggerClassName()} tabIndex={-1} style={{ top: active.top - 1, left: active.left - 1 }}>
      <div className="sheet-input"
        tabIndex={-1}
        contentEditable
        suppressContentEditableWarning
        style={{ minWidth: active.width + 1, minHeight: active.height + 1, whiteSpace: 'pre-wrap' }}
        ref={input}
      onInput={methods.inputHandler}
      onKeyDown={methods.keyDownHandler}
    ></div>
    </div>
  )
}
export default SheetInput