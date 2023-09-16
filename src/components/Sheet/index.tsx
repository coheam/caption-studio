'use client'
import useTranslation from 'next-translate/useTranslation'
import { useCallback, useEffect, useRef } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { debounce } from 'lodash'
import utils from '@/utils'
import store from '@/store'

import { ColType } from '@/store/sheet/types'
import {
  StyledSheetBoxProps,
  StyledCellBoxProps,
  StyledSheetColProps,
  ColRate
} from './types'

import { computeVisibleScroll } from '@/components/ContentEditable'
import SheetCol from './SheetCol'
import SheetFooter from './SheetFooter'

const colMoved = {
  smi : ['start','text','memo'],
  srt : ['start','end','text','memo']
}
const colKeys = {
  smi : ['index','start','dur','text','memo'],
  srt : ['index','start','end','dur','text','memo']
}

const StyledSheetBox = styled.div<StyledSheetBoxProps>(
  ({ $fontSize, $lineheight }) => `
    font-size: ${$fontSize}px;
    line-height: ${$lineheight}px;
  `
)
const StyledSheetCol = styled.div<StyledSheetColProps>(
  ({ $fontSize, $colKey }) => {
    const rate: ColRate = {
      index: 3.5625,
      start: 7.1875,
      end: 7.1875,
      dur: 5.1875,
      text: 25.75,
      memo: 25.75
    }
    const getRate = utils.object.getObjectValue(rate, $colKey)
    const calc = Math.ceil($fontSize * getRate)
    return `
      width: ${calc}px;
      min-width: ${calc}px;
    `
  }
)
const StyledCellBox = styled.div<StyledCellBoxProps>(
  ({ $padding }) => `
    padding: ${$padding}px;
  `
)

const Sheet = () => {
  const { t } = useTranslation('app')
  const sheetState = store.sheet.state
  const [position, setPosition] = useRecoilState(sheetState.position)
  const [editable, setEditable] = useRecoilState(sheetState.editable)
  const [scrollTop, setScrollTop] = useRecoilState(sheetState.scrollTop)
  const [paging, setPaging] = useRecoilState(sheetState.paging)
  const [viewHeight, setViewHeight] = useRecoilState(sheetState.viewHeight)
  
  const format = useRecoilValue(sheetState.format)
  const subtitle = useRecoilValue(sheetState.subtitle)
  const analysis = useRecoilValue(sheetState.analysis)
  const error = useRecoilValue(sheetState.error)
  const search = useRecoilValue(sheetState.search)
  const sheetHeight = useRecoilValue(sheetState.offsetHeight)
  const cellStyle = useRecoilValue(sheetState.cellStyle)
  const { offsetTop, timelines } = useRecoilValue(sheetState.drawSheet)

  const wrapRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef<number>()

  const wrapScrollHandler = (e: React.SyntheticEvent) => {
    const wrapScrollTop = (e.target as HTMLDivElement).scrollTop
    setScrollTop(wrapScrollTop)
    const scrollPaging = Math.ceil(wrapScrollTop / (viewHeight ?? 0))
    if (scrollPaging !== paging) {
      setPaging(scrollPaging)
    }
  }
  const colEventHandler = {
    onMouseDown: (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
    },
    onClick: (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const target = (e.target as HTMLDivElement)
      const { row, col } = target.dataset
      if (editable) {
        setEditable(false)
      }
      if (!['index', 'dur'].includes(col as string)) {
        // activeRef.current = target
        setPosition({
          row: Number(row),
          col: col as ColType
        })
        computeVisibleScroll(
          wrapRef.current as HTMLElement,
          (target.offsetTop + offsetTop - 1),
          target.offsetHeight,
          viewHeight
        )
      }
    },
    onDoubleClick: (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const { row, col } = (e.target as HTMLDivElement).dataset
      if(['text', 'memo'].includes(col as string)){
        setEditable(true)
      }
    },
    onContextMenu: (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const { row, col } = (e.target as HTMLDivElement).dataset
      if (editable) {
        setEditable(false)
      }
      if (!['index', 'dur'].includes(col as string)) {
        // activeRef.current = target
        setPosition({
          row: Number(row),
          col: col as ColType
        })
      }
      if(['text', 'memo'].includes(col as string)){
        setTimeout(()=>{
          setEditable(true)
        })
      }
    }
  }

  const changeActiveTab = useCallback(() => {
    if (wrapRef.current) {
      wrapRef.current.scrollTop = scrollTop
    }
  }, [scrollTop])
  const changeStickyTop = useCallback(() => {
    return {top: `${offsetTop - scrollTop}px`}
  }, [offsetTop, scrollTop])
  const updateScreenState = debounce(() => {
    const wrapHeight = wrapRef.current?.clientHeight ?? window.innerHeight
    const intervalHeight = wrapRef.current?.querySelector('.sheet__head')?.clientHeight ?? 0
    setViewHeight(wrapHeight - intervalHeight)
  }, 100)

  useEffect(() => changeActiveTab(), [changeActiveTab])
  useEffect(() => {
    updateScreenState()
    window.addEventListener('resize', updateScreenState)
    if ('onorientationchange' in window) {
      window.addEventListener('orientationchange', updateScreenState, false)
    }
    return () => {
      window.removeEventListener('resize', updateScreenState)
      if ('onorientationchange' in window) {
        window.removeEventListener('orientationchange', updateScreenState, false)
      }
    }
  }, [updateScreenState])
  
  return (
    <>
      {timelines.length === 0 ? (<>
        { t('sheet-loading') }
      </>) : (<>
        <StyledSheetBox className="sheet scroll-wrapper"
          ref={wrapRef}
          $fontSize={cellStyle.fontSize}
          $lineheight={cellStyle.lineheight}
          onScroll={wrapScrollHandler}
        >
          <div className="sheet__head">
            <div className="sheet__panel capitalize">
              <div className="sheet__row">
                {colKeys[format].map((colKey: string, eq: number) => {
                  const colClassName = (() => {
                    const classNames = [`sheet__col--${colKey}`]
                    position.col === colKey && classNames.push('sheet__current--head')
                    return classNames.join(' ')
                  })()
                  return (
                    <StyledSheetCol key={colKey} className={colClassName}
                      $fontSize={cellStyle.fontSize}
                      $colKey={colKey}
                    >
                      <StyledCellBox className={colKey === 'memo' ? 'line-clamp-1': ''}
                        $padding={cellStyle.padding}
                      >{ t(`sheet-head-${colKey}`) }</StyledCellBox>
                    </StyledSheetCol>
                  )
                })}
              </div>
            </div>
          </div>
          <div ref={bodyRef} className="sheet__body"
            style={{
              paddingTop: `${offsetTop}px`,
              height: `${sheetHeight === 0 ? 'auto' : `${sheetHeight}px`}`
            }}
          >
            <div className="sheet__panel" style={changeStickyTop()}>
              {timelines.map((timeline, index) => {
                const seq = timeline.index ?? index
                const next = subtitle[seq + 1]?.start ?? 0
                const end = format === 'smi' ? next : timeline.end ?? next
                const timelineData = { ...timeline, end, index: seq }
                return (<div className="sheet__row--box" key={seq}>
                  <div className={error.includes(seq) ? 'sheet__row--error' : 'sheet__row'}>
                    {colKeys[format].map((colKey: string, eq: number) => {
                      const colClassList: string[] = []
                      if (search.find(({row, col}) => row === seq && col === colKey)){
                        colClassList.push('sheet__col--find')
                      }
                      return (
                        <SheetCol key={Number(`${timelineData.index}${eq}`)}
                          classList={colClassList}
                          fontSize={cellStyle.fontSize}
                          padding={cellStyle.padding}
                          colKey={colKey}
                          position={position}
                          timeline={timelineData}
                          analysis={analysis[seq]}
                          {...colEventHandler}
                        ></SheetCol>
                      )}
                    )}
                  </div>
                  <div className="sheet__row--controls"></div>
                </div>)
              })}
            </div>
          </div>
        </StyledSheetBox>
        <StyledSheetBox className="sheet__footer"
          $fontSize={cellStyle.fontSize}
          $lineheight={cellStyle.lineheight}
        >
          <SheetFooter />
        </StyledSheetBox>
      </>)}
    </>
  )
}
export default Sheet