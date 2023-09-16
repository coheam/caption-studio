'use client'
import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { useRecoilCallback, useRecoilValue } from 'recoil'
import styled from 'styled-components'
import store from '@/store'
import utils from '@/utils'
import { cloneDeep } from 'lodash'

import { Position, PositionState } from '@/store/sheet/types'
import { computeAnalysisTimeline } from '@/store/sheet/compute'
import { ContentEditableProps, StyledInputProps } from './types'

const StyledInput = styled.div<StyledInputProps>(
  ({ $width, $height, $padding }) => `
    min-width: ${$width}px;
    min-height: ${$height}px;
    padding: ${$padding}px;
    border: 1px solid #000;
  `
)
export const computeVisibleScroll = (el: HTMLElement, top: number, height: number, $viewHeight: number) => {
  const maximum = top + height - $viewHeight
  const scrollTop = el.scrollTop ?? 0
  if (el.children[1].clientHeight - $viewHeight < maximum) {
    el.style.paddingBottom = `${height}px`
  } else {
    el.style.paddingBottom = 'unset'
  }
  if (top < scrollTop) {
    el.scrollTop = top + 1
  } else if (scrollTop < maximum) {
    el.scrollTop = maximum + 1
  }
}

const ContentEditable = ({ shift, editClip, setEditClip }: ContentEditableProps, ref: React.ForwardedRef<HTMLDivElement>) => {
  const sheetState = store.sheet.state

  const editable = useRecoilValue(sheetState.editable)
  const cellStyle = useRecoilValue(sheetState.cellStyle)
  const viewHeight = useRecoilValue(sheetState.viewHeight)
  const position = useRecoilValue(sheetState.position)
  const positionState = useRecoilValue(sheetState.positionState)
  
  const [stockedPos, setStockedPos] = useState<Position>(position)
  const [stockedPosState, setStockedPosState] = useState<PositionState>(positionState)
  const [stockedEditable, setStockedEditable] = useState(false)

  const inputRef = ref as React.MutableRefObject<HTMLDivElement>
  const inputChange = useRef(false)
  const inputContent = useRef<string>('')

  const editClassName = (className: string): string => {
    const classNames = [className]
    stockedEditable && classNames.push('set-editable')
    return classNames.join(' ')
  }

  const changeInputContent = (target: HTMLDivElement) => {
    let content: string = target.innerHTML
    let size = content.length
    if (size >= 4){
      content = content.lastIndexOf('<br>') == size - 4 ? content.slice(0, (size - 4)) : content;
    }
    inputContent.current = content
  }
  /**
   * stockedPosState 가 변경될 때, SheetInput 의 html 을 변경하고 focus 처리
   */
  const changeInputState = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.innerHTML = `${stockedPosState.data}<br>`
      inputRef.current.focus()
    }
  }, [ inputRef, stockedPosState ])

  /**
   * 변경된 내용을 subtitle 에 저장
   */
  const updateSubtitle = useRecoilCallback(({set, snapshot}) => async () => {
    const $cellStyle = await snapshot.getPromise(sheetState.cellStyle)
    const $subtitle = cloneDeep(await snapshot.getPromise(sheetState.subtitle))
    const $analysis = cloneDeep(await snapshot.getPromise(sheetState.analysis))
    const $log = cloneDeep(await snapshot.getPromise(sheetState.log))
    const $activeLog = await snapshot.getPromise(sheetState.activeLog)
    const backTimeline = $subtitle[stockedPos.row]
    const forwardTimeline = {
      ...backTimeline,
      [stockedPos.col]: inputContent.current
    }
    $subtitle[stockedPos.row] = forwardTimeline
    $analysis[stockedPos.row] = computeAnalysisTimeline($subtitle[stockedPos.row], $cellStyle)
		if ($activeLog < $log.length) {
			$log.splice(0, $log.length - $activeLog)
		}
    $log.push({
      action: 'update',
      index: stockedPos.row,
      back: backTimeline,
      forward: forwardTimeline,
      position: stockedPos
    })
    set(sheetState.subtitle, $subtitle)
    set(sheetState.analysis, $analysis)
    set(sheetState.log, $log)
    set(sheetState.activeLog, $activeLog + 1)
    inputChange.current = false
  }, [ stockedPos ])
  /**
   * subtitle이 업데이트 되었는지 확인 하고 Stock 최신화
   */
  const diffChecker = useRecoilCallback(({ snapshot }) => async () => {
    const $subtitle = cloneDeep(await snapshot.getPromise(sheetState.subtitle))
    const timeline = $subtitle[stockedPos.row]
    if (!timeline || timeline[stockedPos.col] === inputContent.current) {
      setStockedPos(position)
      setStockedPosState(positionState)
    }
  }, [ position, positionState, stockedPos ])
  /**
   * etidable = false 일때, 변경된 내용이 있는지에 대한 상태에 따른 함수 호출
   */
  const changeEditable = useCallback(() => {
    if (!inputChange.current) {
      setStockedEditable(editable)
    } else if (stockedPosState.data !== inputContent.current) {
      updateSubtitle()
      setStockedEditable(editable)
    }
    if (shift.current.includes('editable/')) {
      shift.current = shift.current.split('editable/')[1]
      !inputChange.current && setEditClip(Date.now())
    }
    changeInputState()
  }, [
    shift, editable, stockedPosState,
    changeInputState, setEditClip, setStockedEditable, updateSubtitle
  ])

  const inputEventHandler = {
    onInput: (e: React.SyntheticEvent) => {
      const target = e.target as HTMLDivElement
      if ( editable ) {
        changeInputContent(target)
        inputChange.current = stockedPosState.data !== inputContent.current
        computeVisibleScroll(
          inputRef.current?.closest('.scroll-wrapper') as HTMLElement,
          stockedPosState.top,
          stockedPosState.height,
          viewHeight
        )
      }
    },
    onContextMenu: (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
    }
  }
  useEffect(changeInputState, [ changeInputState ])
  useEffect(() => {
    if (position !== stockedPos) {
      diffChecker()
    }
  }, [
    position, stockedPos,
    diffChecker
  ])
  useEffect(() => {
    if (shift.current.includes('exec')) {
      const key = shift.current.split('/')[1]
      const value = shift.current.split('/')[2]
      if (!editable) {
        changeInputState()
        utils.exec('selectAll')
      }
      key && utils.exec(key, value)
      if (!editable) {
        setTimeout(() => {
          changeInputContent(inputRef.current)
          if (stockedPosState.data !== inputContent.current) {
            updateSubtitle()
          }
          shift.current = ''
          setEditClip(Date.now())
        })
      }
    }
  }, [
    editable, editClip, inputRef, shift, stockedPosState, 
    changeInputState, setEditClip, updateSubtitle
  ])
  useEffect(()=> {
    if (!inputChange.current) {
      setStockedPos(position)
      setStockedPosState(positionState)
    }
  }, [
    position, positionState
  ])
  useEffect(()=> { 
    if (editable) {
      setStockedEditable(editable)
      utils.exec('selectAll')
    } else {
      changeEditable()
    }
  }, [
    editable, inputRef, stockedPosState, viewHeight,
    changeEditable, setStockedEditable
  ])
  useEffect(()=> {
    computeVisibleScroll(
      inputRef.current?.closest('.scroll-wrapper') as HTMLElement,
      stockedPosState.top,
      stockedPosState.height,
      viewHeight
    )
  }, [
    inputRef, stockedPosState, viewHeight
  ])

  return (<>
    <div className={editClassName('sheet__edit')} tabIndex={-1} style={{
      top: `${stockedPosState.top}px`,
      left: `${stockedPosState.left}px`,
      right: `${stockedPos.col == 'memo' ? '0' : 'unset'}`
    }}>
      <StyledInput className={editClassName('sheet__edit__input')}
        ref={inputRef}
        contentEditable
        suppressContentEditableWarning
        $width={stockedPosState.width}
        $height={stockedPosState.height}
        $padding={cellStyle.padding}
        { ...inputEventHandler }
      ></StyledInput>
    </div>
  </>
  )
}
export default forwardRef(ContentEditable)