import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { pressedKey } from './parseHotkeys'
import { storeProps } from '@/store'
import { backHistory, forwardHistory, setAction, setEdit } from '@/store/app/actions'
import { getObjectValue } from '@/util/ObjectUtils'
import Storage from '@/util/StorageUtil'
import { syncDispatch } from '@/mixins'

const Hotkeys = () => {
	const dispatch = useDispatch()
	const pressedRef = useRef(new Set<string>())
	const appConfig = useSelector((state: storeProps) => state.app.config)
  const current = useSelector((state: storeProps) => state.app.current)
	const isEdit = useSelector((state: storeProps) => state.app.edit)
	const appConfigRef = useRef(appConfig)
	const currentRef = useRef(current)
	const isEditRef = useRef(isEdit)

	const nomalKeys = [
		{
			name : 'next-row-move', mask : 'tab', type : 'hold', handler(e: KeyboardEvent){
				// if (!Layer){
				e.preventDefault()
				e.stopPropagation()
				dispatch(setAction('sheet/row/next/insert'))
			}
		}, {
			name : 'prev-row-move', mask : 'shift+tab', type : 'hold', handler(e: KeyboardEvent){
				// if (!Layer){
				e.preventDefault()
				e.stopPropagation()
				dispatch(setAction('sheet/row/prev'))
			}
		}, {
			name : 'sheet-edit-on', mask : 'f2', type : 'hold', handler(e: KeyboardEvent){
				// if ( !Layer && !Multiple ) 
				if (!isEditRef.current && ['text', 'memo'].includes(currentRef.current.col)){
					dispatch(setEdit(true))
				}
			}
		},  {
			name : 'sheet-edit-off', mask : 'esc', type : 'hold', handler(e: KeyboardEvent){
				e.preventDefault()
				e.stopPropagation()
				if (isEditRef.current) {
					dispatch(setEdit(false))
				}
			}
		}, {
			mask : 'enter', type : 'hold', handler(e: KeyboardEvent){
				if (isEditRef.current) {
					e.preventDefault()
					e.stopPropagation()
					dispatch(setAction('input/clip', 'enter'))
				} else if (['text', 'memo'].includes(currentRef.current.col)){
					e.preventDefault()
					e.stopPropagation()
					// if (!Multiple)
					dispatch(setEdit(true))
				}
			}
		}, {
			mask : 'pageup', type : 'hold', handler(e: KeyboardEvent){
				// if (!Layer)
				e.preventDefault()
				dispatch(setAction('sheet/page/prev'))
			}
		}, {
			mask : 'pagedown', type : 'hold', handler(e: KeyboardEvent){
				// if (!Layer)
				e.preventDefault()
				dispatch(setAction('sheet/page/next'))
			}
		}, {
			mask : 'up', type : 'hold', handler(e: KeyboardEvent, dispatch: Function){
				if (!isEditRef.current){
					// if (!Layer)
					e.preventDefault()
					dispatch(setAction('sheet/row/prev'))
				}
			}
		}, {
			mask : 'down', type : 'hold', handler(e: KeyboardEvent, dispatch: Function){
				if (!isEditRef.current){
					// if (!Layer)
					e.preventDefault()
					dispatch(setAction('sheet/row/next'))
				}
			}
		}, {
			mask : 'left', type : 'hold', handler(e: KeyboardEvent){
				if (!isEditRef.current){
					// if (!Layer)
					e.preventDefault()
					dispatch(setAction('sheet/col/prev'))
				}
			}
		}, {
			mask : 'right', type : 'hold', handler(e: KeyboardEvent){
				if (!isEditRef.current){
					// if (!Layer)
					e.preventDefault()
					dispatch(setAction('sheet/col/next'))
				}
			}
		}, {
			mask : 'shift+up', type : 'hold', handler(e: KeyboardEvent){
				// Shift = true
				if (!isEditRef.current){
					// if (!Layer)
					e.preventDefault()
					dispatch(setAction('sheet/row/prev'))
				}
			}
		}, {
			mask : 'shift+down', type : 'hold', handler(e: KeyboardEvent){
				// Shift = true;
				if (!isEditRef.current){
					// if (!Layer)
					e.preventDefault()
					dispatch(setAction('sheet/row/next'))
				}
			}
		}, {
			mask : 'space', type : 'hold', handler(e: KeyboardEvent){
			}
		}, {
			name : 'font-bold', mask : 'ctrl+b', type : 'down', handler(e: KeyboardEvent){
				e.preventDefault()
				/*
				if (Multiple){
					dispatch(setAction('input/multi/clip', 'bold'))
				} else
				*/
				if (['text', 'memo'].includes(currentRef.current.col)){
					dispatch(setAction('input/clip', 'bold'))
				}
			}
		}, {
			name : 'font-italic', mask : 'ctrl+i', type : 'down', handler(e: KeyboardEvent){
				e.preventDefault()
				/*
				if (Multiple){
					dispatch(setAction('input/multi/clip', 'italic'))
				} else
				*/
				if (['text', 'memo'].includes(currentRef.current.col)){
					dispatch(setAction('input/clip', 'italic'))
				}
			}
		}, {
			name : 'font-underline', mask : 'ctrl+u', type : 'down', handler(e: KeyboardEvent){
				e.preventDefault()
				/*
				if (Multiple){
					dispatch(setAction('input/multi/clip', 'underline'))
				} else
				*/
				if (['text', 'memo'].includes(currentRef.current.col)){
					dispatch(setAction('input/clip', 'underline'))
				}
			}
		}, {
			name : 'undo', mask : 'ctrl+z', type : 'hold', handler(e: KeyboardEvent){
				e.preventDefault()
				if (!isEditRef.current){
					// if (!Layer)
					dispatch(backHistory())
				}
			}
		}, {
			name : 'redo', mask : 'ctrl+y', type : 'hold', handler(e: KeyboardEvent){
				e.preventDefault()
				if (!isEditRef.current){
					// if (!Layer)
					dispatch(forwardHistory())
				}
			}
		}, {
			name : 'volume-up', mask : 'ctrl+up', type : 'hold', handler(e: KeyboardEvent){
				
			}
		}, {
			name : 'volume-down', mask : 'ctrl+down', type : 'hold', handler(e: KeyboardEvent){
				
			}
		}, {
			mask : 'backspace', type : 'hold', handler(){
				if (
					//!Multiple && 
					!isEditRef.current &&
					['text', 'memo'].includes(currentRef.current.col)
				) {
					dispatch(setAction('input/clip', 'clear'))
				}
			}
		}, {
			mask : 'delete', type : 'hold', handler(e: KeyboardEvent){
				if (
					//!Multiple && 
					!isEditRef.current &&
					['text', 'memo'].includes(currentRef.current.col)
				) {
					dispatch(setAction('input/clip', 'clear'))
				}
			}
		}, {
			name : 'cut', mask : 'ctrl+x', type : 'down', handler(e: KeyboardEvent){
				if (
					//!Multiple && 
					!isEditRef.current &&
					['text', 'memo'].includes(currentRef.current.col)
				) {
					dispatch(setAction('input/clip', 'cut'))
				}
			}
		}, {
			name : 'copy', mask : 'ctrl+c', type : 'down', handler(e: KeyboardEvent){
				if (
					//!Multiple && 
					!isEditRef.current &&
					['text', 'memo'].includes(currentRef.current.col)
				) {
					dispatch(setAction('input/clip', 'copy'))
				}
			}
		}, {
			name : 'paste', mask : 'ctrl+v', type : 'down', handler(e: KeyboardEvent){
				if (
					//!Multiple && 
					!isEditRef.current &&
					['text', 'memo'].includes(currentRef.current.col)
				) {
					dispatch(setAction('input/clip', 'paste'))
				}
			}
		}
	]
	const customKeys = {
			'color0' : {
				name : 'color-1', mask : 'ctrl+1', type : 'down', handler(e: KeyboardEvent){
					e.preventDefault()
					/*
					if (Multiple){
						dispatch(setAction('input/multi/clip', 'color0'))
					} else
					*/
					if (['text', 'memo'].includes(currentRef.current.col)){
						dispatch(setAction('input/clip', 'color0'))
					}
				}
			},
			'color1' : {
				name : 'color-2', mask : 'ctrl+2', type : 'down', handler(e: KeyboardEvent){
					e.preventDefault()
					/*
					if (Multiple){
						dispatch(setAction('input/multi/clip', 'color2'))
					} else
					*/
					if (['text', 'memo'].includes(currentRef.current.col)){
						dispatch(setAction('input/clip', 'color1'))
					}
				}
			},
			'color2' : {
				name : 'color-3', mask : 'ctrl+3', type : 'down', handler(e: KeyboardEvent){
					e.preventDefault()
					/*
					if (Multiple){
						dispatch(setAction('input/multi/clip', 'color2'))
					} else
					*/
					if (['text', 'memo'].includes(currentRef.current.col)){
						dispatch(setAction('input/clip', 'color2'))
					}
				}
			},
			'color3' : {
				name : 'color-4', mask : 'ctrl+4', type : 'down', handler(e: KeyboardEvent){
					e.preventDefault()
					/*
					if (Multiple){
						dispatch(setAction('input/multi/clip', 'color3'))
					} else
					*/
					if (['text', 'memo'].includes(currentRef.current.col)){
						dispatch(setAction('input/clip', 'color3'))
					}
				}
			},
			'color4' : {
				name : 'color-5', mask : 'ctrl+5', type : 'down', handler(e: KeyboardEvent){
					e.preventDefault()
					/*
					if (Multiple){
						dispatch(setAction('input/multi/clip', 'color4'))
					} else
					*/
					if (['text', 'memo'].includes(currentRef.current.col)){
						dispatch(setAction('input/clip', 'color4'))
					}
				}
			},
			'color5' : {
				name : 'color-6', mask : 'ctrl+6', type : 'down', handler(e: KeyboardEvent){
					e.preventDefault()
					/*
					if (Multiple){
						dispatch(setAction('input/multi/clip', 'color5'))
					} else
					*/
					if (['text', 'memo'].includes(currentRef.current.col)){
						dispatch(setAction('input/clip', 'color5'))
					}
				}
			},
			'color6' : {
				name : 'color-7', mask : 'ctrl+7', type : 'down', handler(e: KeyboardEvent){
					e.preventDefault()
					/*
					if (Multiple){
						dispatch(setAction('input/multi/clip', 'color6'))
					} else
					*/
					if (['text', 'memo'].includes(currentRef.current.col)){
						dispatch(setAction('input/clip', 'color6'))
					}
				}
			},
			'color7' : {
				name : 'color-8', mask : 'ctrl+8', type : 'down', handler(e: KeyboardEvent){
					e.preventDefault()
					/*
					if (Multiple){
						dispatch(setAction('input/multi/clip', 'color7'))
					} else
					*/
					if (['text', 'memo'].includes(currentRef.current.col)){
						dispatch(setAction('input/clip', 'color7'))
					}
				}
			},
			'color_clear' : {
				name : 'color-reset', mask : 'ctrl+9', type : 'down', handler(e: KeyboardEvent){
					e.preventDefault()
					/*
					if (Multiple){
						dispatch(setAction('input/multi/clip', 'resetColor'))
					} else
					*/
					if (['text', 'memo'].includes(currentRef.current.col)){
						dispatch(setAction('input/clip', 'resetColor'))
					}
				}
			},
			'sheet-insert' : {
				name : 'sheet-insert', mask : 'ctrl+shift+a', type : 'hold', handler(e: KeyboardEvent){
					e.preventDefault()
					// if (!Multiple)
					dispatch(setAction('sheet/row/insert'))
				}
			},
			'sheet-remove' : {
				name : 'sheet-remove', mask : 'ctrl+shift+d', type : 'hold', handler(e: KeyboardEvent){
					e.preventDefault()
					if (
						//!Multiple && 
						!isEditRef.current
					){
						dispatch(setAction('sheet/row/delete'))
					}
				}
			},
			'plus' :  {
				name : 'time-plus', mask : 'ctrl+plus', type : 'hold', handler(e: KeyboardEvent){
					e.preventDefault()
					/*
					if (Multiple){
						dispatch(setAction('input/multi/clip', 'plus'))
					} else
					*/
					if (['start', 'end'].includes(currentRef.current.col)){
						dispatch(setAction('input/time/plus'))
					}
				}
			},
			'minus' :  {
				name : 'time-minus', mask : 'ctrl+minus', type : 'hold', handler(e: KeyboardEvent){
					e.preventDefault()
					/*
					if (Multiple){
						dispatch(setAction('input/multi/clip', 'minus'))
					} else
					*/
					if (['start', 'end'].includes(currentRef.current.col)){
						dispatch(setAction('input/time/minus'))
					}
				}
			}, 
			'carve' : {
				name : 'time-carve', mask : 'ctrl+`', type : 'down', handler(e: KeyboardEvent){
				}
			},
			'sheetJump' : {
				name : 'move-current', mask : 'alt+q', type : 'down', handler(e: KeyboardEvent){
				}
			},
			'videoJump' : {
				name : 'timeline-current', mask : 'ctrl+q', type : 'down', handler(e: KeyboardEvent){
				}
			},
			'play' : {
				name : 'play-stop', mask : 'ctrl+space', type : 'hold', handler(e: KeyboardEvent){
				}
			},
			'prev' : {
				name : 'video-prev', mask : 'ctrl+left', type : 'hold', handler(e: KeyboardEvent){
				}
			},
			'next' : {
				name : 'video-next', mask : 'ctrl+right', type : 'hold', handler(e: KeyboardEvent){
				}
			}
		}
	const methods = {
		keyDown(e: KeyboardEvent){
			const regexp = /[A-Za-z0-9\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"\s\n]/
			const keycode = e.keyCode ? e.keyCode : e.which
			
			if (!pressedRef.current.has(e.code)){
				methods.run('down', e)
			}
			pressedRef.current.add(e.code)
			methods.run('hold', e)
			if (
				// 	!Interface.Layer &&
				// 	$('.ui-dialog.on').length == 0 &&
				// 	!Sheet.Multiple.State && 
				!isEditRef.current &&
				['text', 'memo'].includes(currentRef.current.col) &&
				!e.ctrlKey && !e.altKey && ( 
					(e.key === 'Process' && e.code.includes('Key')) || 
					(regexp.test(e.key) && 1 === e.key.length) )
			){
				dispatch(setEdit(true))
			}
		},
		keyUp(e: KeyboardEvent){
			pressedRef.current.delete(e.code)
			methods.run('up', e)
		},
		isPressed(pressedKeys: Set<string>, mask: string, splitKey: string){
  		const hotkeyArray = (Array.isArray(mask) ? mask : mask.split(splitKey)).sort().join('+')
			const pressedKey = Array.from(pressedKeys).sort().join('+')
			return hotkeyArray === pressedKey
		},
		isInput(target: HTMLInputElement){
			const name = target.tagName.toLowerCase()
			const type = target.type
			const editable = target.contentEditable
			return (editable || name === 'input' && ['text', 'password', 'file', 'search', 'number', 'url'].includes(type) || name === 'textarea')
		},
		run(type: 'up' | 'down' | 'hold', e: KeyboardEvent){
			const shortcuts = [
				...nomalKeys,
				...Object.keys(customKeys).map(key => {
					const customkey = Storage.get(`customkey-${key}`)
					const shortcut = getObjectValue(customKeys, key)
					customkey && (shortcut.mask = customkey)
					return shortcut
				})
			]

			const shortcut = shortcuts.find(shortcut => shortcut.type == type && methods.isPressed(pressedKey(e), shortcut.mask,'+'))
			
			if (!e.isComposing && shortcut) {
				shortcut.handler(e, dispatch)
			}
		}
	}

	useEffect(() => {
		document.addEventListener('keydown', methods.keyDown)
		document.addEventListener('keyup', methods.keyUp)
		return () => {
			document.removeEventListener('keydown', methods.keyDown)
			document.removeEventListener('keyup', methods.keyUp)
		}
    // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		appConfigRef.current = appConfig
		return () => {
		}
    // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(appConfig)])
	useEffect(() => {
		currentRef.current = current
		return () => {
		}
    // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(current)])
	useEffect(() => {
		isEditRef.current = isEdit
		return () => {
		}
    // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isEdit])
}
export default Hotkeys