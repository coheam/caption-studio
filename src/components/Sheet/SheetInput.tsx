import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { storeProps } from '@/store'
import { inputDataProps } from './types'
import { updateTimeline } from '@/store/subtitle/actions'
import { timelineProps, updateTimelineProps } from '@/store/subtitle/_types'
import { getObjectValue, setObjectValue } from '@/util/ObjectUtils'
import { setEdit, syncDispatch } from '@/store/app/actions'
import { toCamelCase } from '@/util/StringUtils'
import ExecCommand from '@/util/ExecUtils'

const SheetInput = (active: inputDataProps) => {
  const dispatch = useDispatch()
  const action = useSelector((state: storeProps) => state.app.action)
  const isEdit = useSelector((state: storeProps) => state.app.edit)
  const current = useSelector((state: storeProps) => state.app.current)
  const isClip = useRef(false)
  const isChange = useRef(false)
  const inputRef = useRef<HTMLDivElement | null>(null)
  const activeRef = useRef<updateTimelineProps>({
    ...current,
    data: {
      ...active.data
    }
  })
  const computed = {
    triggerClassName: (()=>{
      const className = ['sheet-trigger']
      if (isEdit) className.push(isClip.current ? 'clip' : 'on')
      return className.join(' ')
    })(),
    top: active.top ? active.top - 1 : -1,
    left: active.left ? active.left - 1 : 0,
    width: active.width ? active.width + 1 : 0,
    height: active.height ? active.height + 1 : 0
  }
  const methods = {
    inputHandler(e: React.SyntheticEvent){
      const target = e.target as HTMLInputElement
      let content: number | string = target.innerHTML
      let size = content.length
      if (size >= 4){
        content = content.lastIndexOf('<br>') == size - 4 ? content.slice(0, (size - 4)) : content;
      }
      if (['start', 'end'].includes(current.col)) {
        content = Number(content)
      }
      if (activeRef.current) {
        setObjectValue(activeRef.current.data as unknown as timelineProps, current.col, content)
        isChange.current = true
      }
    },
    setContent(newContent: number | string) {
      if (inputRef.current) {
        inputRef.current.innerHTML = `${newContent}<br>`
      }
    },
    onEdit(){
      inputRef.current?.focus()
      ExecCommand('selectAll')
    },
    changeActive(){
      if (active.data) {
        methods.setContent(getObjectValue(active.data, current.col))
        inputRef.current?.focus()
        if (!isChange.current) {
          activeRef.current = {
            ...current,
            data: {
              ...active.data
            }
          }
        }
      }
    },
    clip(attr: string, value?: string){
      if (isEdit) {
        methods.execCmd(attr, value)
      } else {
        isClip.current = true
        dispatch(setEdit(true))
        methods.onEdit()
        if (attr){
          methods.execCmd(attr, value)
          setTimeout(() => {
            isClip.current = false
            dispatch(setEdit(false))
          })
        }
      }
    },
    execCmd(attr: string, value?: string){
      if (attr === 'resetColor'){
        attr = 'removeFormat'
        value = 'foreColor'
      } else if (attr.indexOf('color') == 0){
        attr = 'foreColor'
        // value = Number(attr.replace('color',''))
      }
      ExecCommand(attr, value)
    },
    callAction(){
      const actionState = action.type.split('/')
      if (actionState[0] === 'input') {
        const actionType = toCamelCase(actionState.slice(1).join('_'))
        getObjectValue(methods, actionType)(action?.param)
      }
    },
  }
  useEffect(() => {
    if (isEdit && isChange.current && activeRef.current) {
        isChange.current = false
        syncDispatch(() => updateTimeline(activeRef.current), dispatch).then(() => {
          methods.changeActive()
        })
    } else {
      methods.changeActive()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(active)])
  useEffect(()=>{
    if (isEdit) {
      methods.onEdit()
    } else if (isChange.current && activeRef.current) {
      syncDispatch(() => updateTimeline(activeRef.current), dispatch).then(() => {
        isChange.current = false
        activeRef.current = {
          ...current,
          data: active.data
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[isEdit])
  useEffect(()=>{
    methods.callAction()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[action.stamp])
  return (
    <div className={computed.triggerClassName} tabIndex={-1} style={{ top: computed.top, left: computed.left }}>
      <div className="sheet-input"
        tabIndex={-1}
        contentEditable
        suppressContentEditableWarning
        style={{ minWidth: computed.width, minHeight: computed.height }}
        ref={inputRef}
      onInput={methods.inputHandler}
    ></div>
    </div>
  )
}
export default SheetInput