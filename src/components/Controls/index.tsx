import useTranslation from 'next-translate/useTranslation'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil'
import { cloneDeep } from 'lodash'
import utils from '@/utils'
import { computeAnalysisTimeline } from '@/store/sheet/compute'
import { hotKeyHandler } from './parseHotkeys'
import store from '@/store'

import { 
	Analysis,
	ColType,
	CustomKey,
	Log,
	Position,
	TimeLine
} from '@/store/sheet/types'
import { HotKey } from './types' 

import ContentEditable, { computeVisibleScroll } from '@/components/ContentEditable'
import ControlButton from './ControlButton'
import ControlColors from './ControlColors'
import ControlSearch from './ControlSearch'

const Controls = () => {
  const { t } = useTranslation('app')

  const sheetState = store.sheet.state
  const [position, setPosition] = useRecoilState(sheetState.position)
  const [editable, setEditable] = useRecoilState(sheetState.editable)
	
  const subtitle = useRecoilValue(sheetState.subtitle)
	const analysis = useRecoilValue(sheetState.analysis)
  const scrollTop = useRecoilValue(sheetState.scrollTop)
	const format = useRecoilValue(sheetState.format)
	const viewHeight = useRecoilValue(sheetState.viewHeight)
	const timeStep = useRecoilValue(sheetState.timeStep)
	const log = useRecoilValue(sheetState.log)
	const activeLog = useRecoilValue(sheetState.activeLog)
  const colorChips = useRecoilValue(sheetState.colorChips)
  const customKeys = useRecoilValue(sheetState.customKeys)

  const [editableContainer, setEditableContainer] = useState<Element>()
  const [editClip, setEditClip] = useState<number>(Date.now())
	const [searchOpen, setSearchOpen] = useState<boolean>(false)

  const editableRef = useRef<HTMLDivElement>(null)
	const pressedRef = useRef(new Set<string>())
	const shiftRef = useRef<string>('')
	const positionRef = useRef<Position>()
	const timeStempRef = useRef<number>(Date.now())
	
	const handleSearchOpen = () => setSearchOpen(!searchOpen)
	const setTimelineSync = useRecoilCallback(({set, snapshot}) => async ($position: Position, negative: boolean) => {
    const $subtitle = cloneDeep(await snapshot.getPromise(sheetState.subtitle))
    const $log = cloneDeep(await snapshot.getPromise(sheetState.log))
    const $activeLog = await snapshot.getPromise(sheetState.activeLog)
		const timelineSync = (Number($subtitle[$position.row][$position.col]) ?? 0) + (timeStep * (negative ? -1 : 1))
		
    const backTimeline = $subtitle[$position.row]
    const forwardTimeline = {
      ...backTimeline,
			[$position.col]: timelineSync < 0 ? 0 : timelineSync
    }
		$subtitle[$position.row] = forwardTimeline
		if ($activeLog < $log.length) {
			$log.splice(0, $log.length - $activeLog)
		}
    $log.push({
      action: 'update',
      index: $position.row,
      back: backTimeline,
      forward: forwardTimeline,
      position: $position
    })
    set(sheetState.subtitle, $subtitle)
    set(sheetState.log, $log)
    set(sheetState.activeLog, $activeLog + 1)
	}, [])
	const setVisibleScroll = useCallback(($analysis: Analysis[], index: number, timelineHeight: number ): void => {
		const before = $analysis.slice(0, index)
		computeVisibleScroll(
			editableRef.current?.closest('.scroll-wrapper') as HTMLElement,
			(before.length > 0 ? before.reduce((a, { height }) => a + height, 0) : 0) - 1,
			timelineHeight,
			viewHeight
		)
	}, [viewHeight])
	const movePosition = useCallback(($position: Position) => {
		shiftRef.current = ''
		setPosition($position)
		if (analysis[$position.row]) {
			setVisibleScroll(analysis, $position.row, analysis[$position.row].height)
		}
	}, [ analysis, setPosition, setVisibleScroll ])
	const pageMovePrev = useCallback(() => {
		if (positionRef.current && positionRef.current.row > 0) {
			const before = analysis.slice(0, positionRef.current?.row)
			const startTop = (before.length > 0 ? before.reduce((a, { height }) => a + height, 0) : 0)
			const limit = scrollTop - viewHeight
			let index = positionRef.current.row
			let height = analysis[index].height
			let top = startTop
			if (top > scrollTop) {
				while (top > scrollTop) {
					if (positionRef.current.row > 0) {
						height = analysis[positionRef.current.row].height
						top -= height
						positionRef.current.row--
					} else {
						break
					}
				}
			} else {
				top = scrollTop
				while (top > limit + height) {
					if (positionRef.current.row > 0) {
						height = analysis[positionRef.current.row].height
						top -= height
						positionRef.current.row--
					} else {
						break
					}
				}
			}
			movePosition(positionRef.current)
		}
	}, [
		analysis, scrollTop, viewHeight,
		movePosition
	])
	const pageMoveNext = useCallback(() => {
		const size = analysis.length - 1
		if (positionRef.current && positionRef.current.row < size) {
			const before = analysis.slice(0, positionRef.current?.row)
			const startTop = (before.length > 0 ? before.reduce((a, { height }) => a + height, 0) : 0)
			const limit = scrollTop + viewHeight
			let index = positionRef.current.row
			let height = analysis[index].height
			let top = startTop
			if (top + height < limit) {
				while (top < limit - height) {
					if (positionRef.current.row < size) {
						height = analysis[positionRef.current.row].height
						top += height
						positionRef.current.row++
					} else {
						break
					}
				}
			} else {
				top = scrollTop
				while(top < startTop){
					if (positionRef.current.row < size) {
						positionRef.current.row++
						height = analysis[positionRef.current.row].height
						top += height
					} else {
						break
					}
				}
			}
			movePosition(positionRef.current)
		}
	}, [
		analysis, scrollTop, viewHeight,
		movePosition
	])
	const rowMoveNext = useCallback(() => {
		if (positionRef.current && positionRef.current.row < subtitle.length - 1) {
			movePosition({
				row: positionRef.current.row + 1,
				col: positionRef.current.col
			})
		}
	}, [ 
		subtitle,
		movePosition
	])
	const rowMovePrev = useCallback(() => {
		if (positionRef.current && positionRef.current.row > 0) {
			movePosition({
				row: positionRef.current.row - 1,
				col: positionRef.current.col
			})
		}
	}, [
		movePosition
	])
	const colMovePrev = useCallback(() => {
		const moveColKey: ColType[] = format == 'smi' ? ['start','text','memo'] : ['start','end','text','memo']
		if (positionRef.current) {
			let index = moveColKey.indexOf(positionRef.current.col)
			if (index > 0){
				positionRef.current.col = moveColKey[index - 1]
			} else if (positionRef.current.row > 0){
				//if (!Multiple)
				positionRef.current.row -= 1
				positionRef.current.col = moveColKey.pop() as ColType
			}
			if (position.row !== positionRef.current.row || position.col !== positionRef.current.col){
				movePosition(positionRef.current)
			}
		}
	}, [ 
		format, position,
		movePosition
	])
	const colMoveNext = useCallback(() => {
		const moveColKey: ColType[] = format == 'smi' ? ['start','text','memo'] : ['start','end','text','memo']
		const size = subtitle.length - 1
		if (positionRef.current) {
			let index = moveColKey.indexOf(positionRef.current.col)
			if (index < moveColKey.length - 1){
        positionRef.current.col = moveColKey[index + 1]
      } else if (positionRef.current.row < size){
        // if (!Multiple)
        positionRef.current.row++
        positionRef.current.col = moveColKey.shift() as ColType
      }
			if (position.row !== positionRef.current.row || position.col !== positionRef.current.col){
				movePosition(positionRef.current)
			}
		}
	},[
		format, position, subtitle,
		movePosition
	])
	const removeTimeline = useRecoilCallback(({set, snapshot}) => async ($position: Position) => {
		const $cellStyle = cloneDeep(await snapshot.getPromise(sheetState.cellStyle))
    const $subtitle = cloneDeep(await snapshot.getPromise(sheetState.subtitle))
    const $analysis = cloneDeep(await snapshot.getPromise(sheetState.analysis))
    const $log = cloneDeep(await snapshot.getPromise(sheetState.log))
    const $activeLog = await snapshot.getPromise(sheetState.activeLog)
		const backTimeline = $subtitle[$position.row]
		const logData: Log = {
			action: 'delete',
			index: $position.row,
			back: backTimeline,
			position: $position
		}
		$subtitle.splice($position.row, 1)
		$analysis.splice($position.row, 1)
		if ($activeLog < $log.length) {
			$log.splice(0, $log.length - $activeLog)
		}
		if ($subtitle.length === 0) {
			const forwardTimeline = {start:0, end: 0, text: "", memo: ""}
			const timelineAnalysis = computeAnalysisTimeline(forwardTimeline, $cellStyle)
			$subtitle.push(forwardTimeline)
			$analysis.push(timelineAnalysis)
			logData.action = 'update'
			logData.forward = forwardTimeline
		}
		$log.push(logData)
    set(sheetState.subtitle, $subtitle)
    set(sheetState.analysis, $analysis)
    set(sheetState.log, $log)
    set(sheetState.activeLog, $activeLog + 1)
		if ($position.row === $subtitle.length) {
			set(sheetState.position, {
				...$position,
				row: $position.row - 1,
			})
		}
	}, [])
	const insertTimeline = useRecoilCallback(({set, snapshot}) => async ($position: Position, timeline: TimeLine = {start:0, end: 0, text: "", memo: ""}) => {
    const $cellStyle = cloneDeep(await snapshot.getPromise(sheetState.cellStyle))
    const $subtitle = cloneDeep(await snapshot.getPromise(sheetState.subtitle))
    const $analysis = cloneDeep(await snapshot.getPromise(sheetState.analysis))
    const $log = cloneDeep(await snapshot.getPromise(sheetState.log))
    const $activeLog = await snapshot.getPromise(sheetState.activeLog)

		const timelineAnalysis = computeAnalysisTimeline(timeline, $cellStyle)
		const prevEnd = $subtitle[$position.row - 1]?.end
		const nextStart = $subtitle[$position.row]?.start
		timeline.start = prevEnd ?? nextStart ?? 0
		timeline.end = prevEnd ?? nextStart ?? 0
		$subtitle.splice($position.row, 0, timeline)
		$analysis.splice($position.row, 0, timelineAnalysis)
		if ($activeLog < $log.length) {
			$log.splice(0, $log.length - $activeLog)
		}
    $log.push({
      action: 'insert',
      index: $position.row,
      forward: timeline,
      position: $position
    })
		shiftRef.current = 'movePosition'
    set(sheetState.subtitle, $subtitle)
    set(sheetState.analysis, $analysis)
    set(sheetState.log, $log)
    set(sheetState.activeLog, $activeLog + 1)
		setTimeout(() => {
			setEditClip(Date.now())
		})
	}, [])
	const insertMoveNextRow = useCallback(() => {
		const now = Date.now()
		if (now - timeStempRef.current > 26) {
			if (positionRef.current) {
				if (positionRef.current.row < subtitle.length - 1) {
					rowMoveNext()
				} else {
					positionRef.current.row += 1
					insertTimeline({
						row: positionRef.current.row,
						col: positionRef.current.col
					})
				}
			}
		}
		timeStempRef.current = now
	}, [
		subtitle,
		insertTimeline, rowMoveNext
	])
	const backLog = useRecoilCallback(({set, snapshot}) => async () => {
    const $cellStyle = await snapshot.getPromise(sheetState.cellStyle)
    const $subtitle = cloneDeep(await snapshot.getPromise(sheetState.subtitle))
    const $analysis = cloneDeep(await snapshot.getPromise(sheetState.analysis))
    const $log = cloneDeep(await snapshot.getPromise(sheetState.log))
    const $activeLog = await snapshot.getPromise(sheetState.activeLog)

		if ($activeLog > 0) {
			const logIndex = $activeLog - 1
			const {
				action: logAction,
				index: timelineIndex,
				back: backTimeline,
				position: logPosition
			} = $log[logIndex]
			if (logAction === 'insert'){
				logPosition.row -= 1
				$subtitle.splice(timelineIndex, 1)
				$analysis.splice(timelineIndex, 1)
			}
			if (logAction === 'update'){
				$subtitle[timelineIndex] = backTimeline as TimeLine
				$analysis[timelineIndex] = computeAnalysisTimeline(backTimeline as TimeLine, $cellStyle)
			}
			if (logAction === 'delete'){
				$subtitle.splice(timelineIndex, 0, backTimeline as TimeLine)
				$analysis.splice(timelineIndex, 0, computeAnalysisTimeline(backTimeline as TimeLine, $cellStyle))
			}
			shiftRef.current = 'movePosition'
			positionRef.current = logPosition
			set(sheetState.activeLog, logIndex)
			set(sheetState.position, logPosition)
			set(sheetState.subtitle, $subtitle)
			set(sheetState.analysis, $analysis)
			setEditClip(Date.now())
		}
	}, [])
	const forwardLog = useRecoilCallback(({set, snapshot}) => async () => {
    const $cellStyle = await snapshot.getPromise(sheetState.cellStyle)
    const $subtitle = cloneDeep(await snapshot.getPromise(sheetState.subtitle))
    const $analysis = cloneDeep(await snapshot.getPromise(sheetState.analysis))
    const $log = cloneDeep(await snapshot.getPromise(sheetState.log))
    const $activeLog = await snapshot.getPromise(sheetState.activeLog)

		if ($activeLog < $log.length) {
			const logIndex = $activeLog + 1
			const {
				action: logAction,
				index: timelineIndex,
				forward: forwardTimeline,
				position: logPosition
			} = $log[logIndex - 1]

			if (logAction === 'insert'){
				$subtitle.splice(timelineIndex, 0, forwardTimeline as TimeLine)
				$analysis.splice(timelineIndex, 0, computeAnalysisTimeline(forwardTimeline as TimeLine, $cellStyle))
			}
			if (logAction === 'update'){
				$subtitle[timelineIndex] = forwardTimeline as TimeLine
				$analysis[timelineIndex] = computeAnalysisTimeline(forwardTimeline as TimeLine, $cellStyle)
			}
			if (logAction === 'delete'){
				$subtitle.splice(timelineIndex, 1)
				$analysis.splice(timelineIndex, 1)
			}
			shiftRef.current = 'movePosition'
			positionRef.current = logPosition
			set(sheetState.activeLog, logIndex)
			set(sheetState.position, logPosition)
			set(sheetState.subtitle, $subtitle)
			set(sheetState.analysis, $analysis)
			setEditClip(Date.now())
		}
	}, [])

	const shiftCoreAction = useCallback(() =>{
		switch (shiftRef.current) {
			case 'movePosition':
				positionRef.current && movePosition(positionRef.current)
				break
			case 'insertMoveNextRow':
				insertMoveNextRow()
				break
			case 'pageMovePrev':
				pageMovePrev()
				break
			case 'pageMoveNext':
				pageMoveNext()
				break
		}
	}, [
		shiftRef,
		movePosition, insertMoveNextRow, pageMoveNext, pageMovePrev,
	])
	const shiftEditAction = useCallback((key?: string, value?: string) => {
		const shift = ['exec']
		key && shift.push(key)
		value && shift.push(value)
		shiftRef.current = shift.join('/')
		setEditClip(Date.now())
	}, [])
	const initCustomKeys = useRecoilCallback(({set, snapshot}) => async () => {
		const storage = utils.storage.call()
		const $customkeys: CustomKey[] = []
		Object.keys(storage).map((storageKey, b) => {
			if (storageKey.includes('customkey-')) {
				const key = storageKey.replace('customkey-', '')
				$customkeys.push({
					key,
					value: JSON.parse(storage[storageKey])
				})
			}
		})
		set(sheetState.customKeys, $customkeys)
	}, [])

  const hotKeys: HotKey[] = [
	{
		mask : 'enter', type : 'hold', handler(e: KeyboardEvent){
			if (editable) {
				e.preventDefault()
				e.stopPropagation()
				utils.exec('enter')
			} else if (['text', 'memo'].includes(position.col)){
				e.preventDefault()
				e.stopPropagation()
				// if (!Multiple)
				setEditable(true)
			}
		}
	}, {
		mask : 'backspace', type : 'hold', handler(e: KeyboardEvent){
			if (
				//!Multiple && 
				!editable &&
				['text', 'memo'].includes(position.col)
			) {
				shiftEditAction()
			}
		}
	}, {
		mask : 'delete', type : 'hold', handler(e: KeyboardEvent){
			if (
				//!Multiple && 
				!editable &&
				['text', 'memo'].includes(position.col)
			) {
				shiftEditAction()
			}
		}
	}, {
		label : 'cut', mask : 'ctrl+x', type : 'down', handler(e: KeyboardEvent){
			if (
				//!Multiple && 
				!editable &&
				['text', 'memo'].includes(position.col)
			) {
				shiftEditAction()
			}
		}
	}, {
		label : 'copy', mask : 'ctrl+c', type : 'down', handler(e: KeyboardEvent){
			if (
				//!Multiple && 
				!editable &&
				['text', 'memo'].includes(position.col)
			) {
				shiftEditAction()
			}
		}
	}, {
		label : 'paste', mask : 'ctrl+v', type : 'down', handler(e: KeyboardEvent){
			if (
				//!Multiple && 
				!editable &&
				['text', 'memo'].includes(position.col)
			) {
				shiftEditAction()
			}
		}
	}, {
		label : 'font-bold', mask : 'ctrl+b', type : 'down', handler(e: KeyboardEvent){
			e.preventDefault()
			e.stopPropagation()
			/*
			if (Multiple){
				dispatch(setAction('input/multi/clip', 'bold'))
			} else
			*/
			if (['text', 'memo'].includes(position.col)){
				shiftEditAction('bold')
			}
		}
	}, {
		label : 'font-italic', mask : 'ctrl+i', type : 'down', handler(e: KeyboardEvent){
			e.preventDefault()
			e.stopPropagation()
			/*
			if (Multiple){
				dispatch(setAction('input/multi/clip', 'italic'))
			} else
			*/
			if (['text', 'memo'].includes(position.col)){
				shiftEditAction('italic')
			}
		}
	}, {
		label : 'font-underline', mask : 'ctrl+u', type : 'down', handler(e: KeyboardEvent){
			e.preventDefault()
			e.stopPropagation()
			/*
			if (Multiple){
				dispatch(setAction('input/multi/clip', 'underline'))
			} else
			*/
			if (['text', 'memo'].includes(position.col)){
				shiftEditAction('underline')
			}
		}
	}, {
		label : 'sheet-edit-on', mask : 'f2', type : 'hold', handler(e: KeyboardEvent){
			// if ( !Layer && !Multiple ) 
			if (!editable && ['text', 'memo'].includes(position.col)) {
				setEditable(true)
			}
		}
	}, {
		label : 'sheet-edit-off', mask : 'esc', type : 'hold', handler(e: KeyboardEvent){
			e.preventDefault()
			e.stopPropagation()
			if (editable) {
				setEditable(false)
			}
		}
	}, {
		label : 'next-row-move', mask : 'tab', type : 'hold', handler(e: KeyboardEvent){
			// if (!Layer){
			e.preventDefault()
			e.stopPropagation()
			positionRef.current = cloneDeep(position)
			if (editable) {
				setEditable(false)
				shiftRef.current = 'editable/insertMoveNextRow'
			} else {
				insertMoveNextRow()
			}
		}
	}, {
		label : 'prev-row-move', mask : 'shift+tab', type : 'hold', handler(e: KeyboardEvent){
			// if (!Layer){
			e.preventDefault()
			e.stopPropagation()
			positionRef.current = cloneDeep(position)
			if (editable) {
				setEditable(false)
			}
			rowMovePrev()
		}
	}, {
		mask : 'shift+up', type : 'hold', handler(e: KeyboardEvent){
			if (!editable){
				// if (!Layer)
				e.preventDefault()
				e.stopPropagation()
				positionRef.current = cloneDeep(position)
				rowMovePrev()
			}
		}
	}, {
		mask : 'shift+down', type : 'hold', handler(e: KeyboardEvent){
			if (!editable){
				// if (!Layer)
				e.preventDefault()
				e.stopPropagation()
				positionRef.current = cloneDeep(position)
				rowMoveNext()
			}
		}
	}, {
		mask : 'up', type : 'hold', handler(e: KeyboardEvent){
			if (!editable){
				// if (!Layer)
				e.preventDefault()
				e.stopPropagation()
				positionRef.current = cloneDeep(position)
				rowMovePrev()
			}
		}
	}, {
		mask : 'down', type : 'hold', handler(e: KeyboardEvent){
			if (!editable){
				// if (!Layer)
				e.preventDefault()
				e.stopPropagation()
				positionRef.current = cloneDeep(position)
				rowMoveNext()
			}
		}
	}, {
		mask : 'left', type : 'hold', handler(e: KeyboardEvent){
			if (!editable){
				// if (!Layer)
				e.preventDefault()
				positionRef.current = cloneDeep(position)
				colMovePrev()
			}
		}
	}, {
		mask : 'right', type : 'hold', handler(e: KeyboardEvent){
			if (!editable){
				// if (!Layer)
				e.preventDefault()
				positionRef.current = cloneDeep(position)
				colMoveNext()
			}
		}
	}, {
		mask : 'pageup', type : 'hold', handler(e: KeyboardEvent){
			// if (!Layer){
			e.preventDefault()
			e.stopPropagation()
			positionRef.current = cloneDeep(position)
			if (editable) {
				setEditable(false)
				shiftRef.current = 'editable/pageMovePrev'
			} else {
				pageMovePrev()
			}
		}
	}, {
		mask : 'pagedown', type : 'hold', handler(e: KeyboardEvent){
			// if (!Layer){
			e.preventDefault()
			e.stopPropagation()
			positionRef.current = cloneDeep(position)
			if (editable) {
				setEditable(false)
				shiftRef.current = 'editable/pageMoveNext'
			} else {
				pageMoveNext()
			}
		}
	}, {
		label:'multi-select', mask : 'space', type : 'hold', handler(e: KeyboardEvent){
		}
	}, {
		label:'undo', mask : 'ctrl+z', type : 'hold', handler(e: KeyboardEvent){
			e.preventDefault()
			e.stopPropagation()
			backLog()
		}
	}, {
		label:'redo', mask : 'ctrl+y', type : 'hold', handler(e: KeyboardEvent){
			e.preventDefault()
			e.stopPropagation()
			forwardLog()
		}
	}, {
		label : 'sheet-insert', key: 'sheet-insert', mask : 'ctrl+shift+a', type : 'hold', handler(e: KeyboardEvent){
			e.preventDefault()
			// if (!Multiple)
			positionRef.current = cloneDeep(position)
			positionRef.current.row += 1
			insertTimeline(positionRef.current)
		}
	}, {
		label : 'sheet-remove', key: 'sheet-remove', mask : 'ctrl+shift+d', type : 'hold', handler(e: KeyboardEvent){
			e.preventDefault()
			// if (!Multiple)
			positionRef.current = cloneDeep(position)
			removeTimeline(positionRef.current)
		}
	}, {
		label : 'time-plus', key: 'plus', mask : 'ctrl+plus', type : 'hold', handler(e: KeyboardEvent){
			e.preventDefault()
			// if (!Multiple)
			if (['start', 'end'].includes(position.col)){
				setTimelineSync(position, false)
			}
		}
	}, {
		label : 'time-minus', key: 'minus', mask : 'ctrl+minus', type : 'hold', handler(e: KeyboardEvent){
			e.preventDefault()
			// if (!Multiple)
			if (['start', 'end'].includes(position.col)){
				setTimelineSync(position, true)
			}
		}
	}, {
		label : 'color-1', key: 'color0', mask : 'ctrl+1', type : 'down', handler(e: KeyboardEvent){
			e.preventDefault()
			/*
			if (Multiple){
				dispatch(setAction('input/multi/clip', 'color0'))
			} else
			*/
			if (['text', 'memo'].includes(position.col)){
				shiftEditAction('color', colorChips[0])
			}
		}
	}, {
		label : 'color-2', key: 'color1', mask : 'ctrl+2', type : 'down', handler(e: KeyboardEvent){
			e.preventDefault()
			/*
			if (Multiple){
				dispatch(setAction('input/multi/clip', 'color0'))
			} else
			*/
			if (['text', 'memo'].includes(position.col)){
				shiftEditAction('color', colorChips[1])
			}
		}
	}, {
		label : 'color-3', key: 'color2', mask : 'ctrl+3', type : 'down', handler(e: KeyboardEvent){
			e.preventDefault()
			/*
			if (Multiple){
				dispatch(setAction('input/multi/clip', 'color0'))
			} else
			*/
			if (['text', 'memo'].includes(position.col)){
				shiftEditAction('color', colorChips[2])
			}
		}
	}, {
		label : 'color-4', key: 'color3', mask : 'ctrl+4', type : 'down', handler(e: KeyboardEvent){
			e.preventDefault()
			/*
			if (Multiple){
				dispatch(setAction('input/multi/clip', 'color0'))
			} else
			*/
			if (['text', 'memo'].includes(position.col)){
				shiftEditAction('color', colorChips[3])
			}
		}
	}, {
		label : 'color-5', key: 'color4', mask : 'ctrl+5', type : 'down', handler(e: KeyboardEvent){
			e.preventDefault()
			/*
			if (Multiple){
				dispatch(setAction('input/multi/clip', 'color0'))
			} else
			*/
			if (['text', 'memo'].includes(position.col)){
				shiftEditAction('color', colorChips[4])
			}
		}
	}, {
		label : 'color-6', key: 'color5', mask : 'ctrl+6', type : 'down', handler(e: KeyboardEvent){
			e.preventDefault()
			/*
			if (Multiple){
				dispatch(setAction('input/multi/clip', 'color0'))
			} else
			*/
			if (['text', 'memo'].includes(position.col)){
				shiftEditAction('color', colorChips[5])
			}
		}
	}, {
		label : 'color-7', key: 'color6', mask : 'ctrl+7', type : 'down', handler(e: KeyboardEvent){
			e.preventDefault()
			/*
			if (Multiple){
				dispatch(setAction('input/multi/clip', 'color0'))
			} else
			*/
			if (['text', 'memo'].includes(position.col)){
				shiftEditAction('color', colorChips[6])
			}
		}
	}, {
		label : 'color-8', key: 'color7', mask : 'ctrl+8', type : 'down', handler(e: KeyboardEvent){
			e.preventDefault()
			/*
			if (Multiple){
				dispatch(setAction('input/multi/clip', 'color0'))
			} else
			*/
			if (['text', 'memo'].includes(position.col)){
				shiftEditAction('color', colorChips[7])
			}
		}
	}, {
		label : 'color-clear', key: 'color_clear', mask : 'ctrl+9', type : 'down', handler(e: KeyboardEvent){
			e.preventDefault()
			/*
			if (Multiple){
				dispatch(setAction('input/multi/clip', 'color0'))
			} else
			*/
			if (['text', 'memo'].includes(position.col)){
				shiftEditAction('color', 'reset')
			}
		}
	},
  ]
	const keyDownHandler = (e: KeyboardEvent) => {
		const regexp = /[ㄱ-ㅎㅏ-ㅣ가-힣A-Za-z0-9\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"\s\n]/
		if (!pressedRef.current.has(e.code)){
			hotKeyHandler(hotKeys, customKeys, 'down', e)
		}
		pressedRef.current.add(e.code)
		hotKeyHandler(hotKeys, customKeys, 'hold', e)
		e.stopPropagation()
		// e.preventDefault()
		if (
			// 	!Interface.Layer &&
			// 	$('.ui-dialog.on').length == 0 &&
			// 	!Sheet.Multiple.State && 
			!editable &&
			['text', 'memo'].includes(position.col) &&
			!e.ctrlKey && !e.altKey && ( 
				(e.key === 'Process' && e.code.includes('Key')) || 
				(regexp.test(e.key) && 1 === e.key.length) )
		){
			setEditable(true)
			utils.exec('selectAll')
		}
	}
	const keyUpHandler = (e: KeyboardEvent) => {
		pressedRef.current.delete(e.code)
		hotKeyHandler(hotKeys, customKeys, 'up', e)
	}

	useEffect(() => {initCustomKeys()}, [ initCustomKeys ])
	useEffect(shiftCoreAction, [ analysis, editClip, shiftCoreAction ])
  useEffect(() => {
		if (!editableContainer) {
			setEditableContainer(document.querySelector('.sheet__body') as Element)
		}
  }, [ viewHeight, editableContainer ])
  useEffect(() => {
		document.addEventListener('keydown', keyDownHandler)
		document.addEventListener('keyup', keyUpHandler)
		return () => {
			document.removeEventListener('keydown', keyDownHandler)
			document.removeEventListener('keyup', keyUpHandler)
		}
	})
  return (<>
		<div className="controls">
			<div className="controls__group mr-auto">
				<ControlButton icon={'reply'} title={t('history-back')}
					disabled={activeLog === 0}
					onClick={backLog}
				/>
				<ControlButton icon={'forward'} title={t('history-forward')}
					disabled={activeLog === log.length}
					onClick={forwardLog}
				/>
			</div>
			<div className="controls__group">
				{(
					['text', 'memo'].includes(position.col)
				) && (
					<ControlButton icon={editable ? 'edit_off': 'edit'} title={t('text-edit')}
						disabled={!['text', 'memo'].includes(position.col)}
						onClick={() => {
							if (!editable && ['text', 'memo'].includes(position.col)) {
								setEditable(true)
							}
							if (editable) {
								setEditable(false)
							}
						}}
					/>
				)}
				<ControlButton icon={'add_box'} title={t('row-add')}
					disabled={false}
					onClick={() => {
						positionRef.current = cloneDeep(position)
						positionRef.current.row += 1
						insertTimeline(positionRef.current)
					}}
				/>
				<ControlButton icon={'indeterminate_check_box'} title={t('row-remove')}
					disabled={false}
					onClick={() => {
						positionRef.current = cloneDeep(position)
						removeTimeline(positionRef.current)
					}}
				/>
				<ControlButton icon={'check_box'} title={t('row-select')}
					disabled={false}
					onClick={() => {
					}}
				/>
			</div>
			{(
				['start', 'end'].includes(position.col)
			) && (<>
				<hr className="break-vertical" />
				<div className="controls__group">
					<ControlButton icon="manage_history" title={t('time-minus')}
						classList={['controls__button--time']}
						disabled={['text', 'memo'].includes(position.col)}
						onClick={() => {
							if (['start', 'end'].includes(position.col)){
							}
						}}
					></ControlButton>
					<ControlButton icon="history" title={t('time-minus')}
						disabled={['text', 'memo'].includes(position.col)}
						onClick={() => {
							if (['start', 'end'].includes(position.col)){
								setTimelineSync(position, true)
							}
						}}
					></ControlButton>
					<ControlButton icon="update" title={t('time-plus')}
						disabled={['text', 'memo'].includes(position.col)}
						onClick={() => {
							if (['start', 'end'].includes(position.col)){
								setTimelineSync(position, false)
							}
						}}
					></ControlButton>
				</div>
			</>)}
			{(
				['text', 'memo'].includes(position.col)
			) && (<>
				<hr className="break-vertical" />
				<div className="controls__group">
					<ControlButton icon={'format_bold'} title={t('font-bold')}
						iconClassList={['icon--slim']}
						disabled={!['text', 'memo'].includes(position.col)}
						onClick={() => {
							if (['text', 'memo'].includes(position.col)){
								shiftEditAction('bold')
							}
						}}
					/>
					<ControlButton icon={'format_underlined'} title={t('font-underlined')}
						classList={['controls__button--small']}
						iconClassList={['icon--slim']}
						disabled={!['text', 'memo'].includes(position.col)}
						onClick={() => {
							if (['text', 'memo'].includes(position.col)){
								shiftEditAction('underline')
							}
						}}
					/>
					<ControlButton icon={'format_italic'} title={t('font-italic')}
						iconClassList={['icon--slim']}
						disabled={!['text', 'memo'].includes(position.col)}
						onClick={() => {
							if (['text', 'memo'].includes(position.col)){
								shiftEditAction('italic')
							}
						}}
					/>
					<ControlColors action={shiftEditAction} hotKeys={hotKeys} />
				</div>
			</>)}
			<hr className="break-vertical" />
			<div className="controls__group">
				<ControlButton icon={'search'} title={t('history-back')}
					disabled={false}
					onClick={handleSearchOpen}
				/>
				<ControlSearch open={searchOpen}
					onClose={handleSearchOpen}
				 />
			</div>
		</div>
    {editableContainer && createPortal( 
      <ContentEditable ref={editableRef}
				shift={shiftRef}
				editClip={editClip}
				setEditClip={setEditClip}
      />
    , editableContainer )}
  </>)
}
export default Controls