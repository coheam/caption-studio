import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHotkeys, isHotkeyPressed } from 'react-hotkeys-hook'
import { storeProps } from '@/store'
import { appStateProps } from '@/store/app'
import { setAction, setEdit, setTheme } from '@/store/app/actions'

const Hotkeys = () => {
	const dispatch = useDispatch()
	const pressedRef = useRef(false)
	const state = useSelector((state: storeProps) => state)
	const appConfig = useSelector((state: storeProps) => state.app.config)
	const appTheme = useSelector((state: storeProps) => state.app.config.theme)
  const current = useSelector((state: storeProps) => state.app.current)
	const isEdit = useSelector((state: storeProps) => state.app.edit)
	const isReady = useSelector((state: storeProps) => state.app.ready)

	const nomalKeys = [
		{
			name : 'next-row-move', mask : 'tab', type : 'hold', handler(e: KeyboardEvent){
				/*
				if (!Interface.Layer){
					e.preventDefault();
					Sheet.Edit.State && Sheet.Edit.Off();
					Sheet.Move.Row.Next(true);
					return false;
				}
				*/
			}
		}, {
			name : 'prev-row-move', mask : 'shift+tab', type : 'hold', handler(e: KeyboardEvent){
				/*
				if (!Interface.Layer){
					e.preventDefault();
					Sheet.Edit.State && Sheet.Edit.Off();
					Sheet.Move.Row.Prev();
					return false;
				}
				*/
			}
		}, {
			name : 'sheet-edit-on', mask : 'f2', type : 'hold', handler(e: KeyboardEvent){
				// if ( !Interface.Layer && !Sheet.Multiple.State ) 
				if (!isEdit && ['text', 'memo'].includes(current.col)){
					dispatch(setEdit(true))
				}
			}
		},  {
			name : 'sheet-edit-off', mask : 'esc', type : 'hold', handler(e: KeyboardEvent){
				e.preventDefault()
				e.stopPropagation()
				if (isEdit) {
					dispatch(setEdit(false))
				}
				/*
				e.preventDefault();
				if (Interface.Layer){
					Interface.Layout.find('.overlay').trigger('click');
				} else if (Sheet.Multiple.State){
					Sheet.Multiple.Toggle();
				} else if (Sheet.Edit.State) {
					Sheet.Edit.Off();
				}
				*/
			}
		}, {
			mask : 'enter', type : 'hold', handler(e: KeyboardEvent){
				if(isEdit) {
					// e.preventDefault()
				} else {
					e.preventDefault()
					e.stopPropagation()
					dispatch(setEdit(true))
				}
				/*
				if (Interface.Layer){
					e.preventDefault();
					Interface.Layout.find('.dialog.on').find('.btn-submit').trigger('click');
				} else if (Sheet.Edit.State){
					e.preventDefault();
					Sheet.Edit.Cmd('enter');
				} else if (!Sheet.Multiple.State && (Sheet.Current.target == 'text' || Sheet.Current.target == 'memo')) {
					Sheet.Edit.On();
				}
				*/
			}
		}, {
			mask : 'pageup', type : 'hold', handler(e: KeyboardEvent){
				// if (!Interface.Layer)
				e.preventDefault()
				dispatch(setAction('sheet/page/prev'))
			}
		}, {
			mask : 'pagedown', type : 'hold', handler(e: KeyboardEvent){
				// if (!Interface.Layer)
				e.preventDefault()
				dispatch(setAction('sheet/page/next'))
			}
		}, {
			mask : 'up', type : 'hold', handler(e: KeyboardEvent, dispatch: Function){
				if (!isEdit){
					// if (!Interface.Layer)
					e.preventDefault()
					dispatch(setAction('sheet/row/prev'))
				}
			}
		}, {
			mask : 'down', type : 'hold', handler(e: KeyboardEvent, dispatch: Function){
				if (!isEdit){
					// if (!Interface.Layer)
					e.preventDefault()
					dispatch(setAction('sheet/row/next'))
				}
			}
		}, {
			mask : 'left', type : 'hold', handler(e: KeyboardEvent){
				if (!isEdit){
					// if (!Interface.Layer)
					e.preventDefault()
					dispatch(setAction('sheet/col/prev'))
				}
			}
		}, {
			mask : 'right', type : 'hold', handler(e: KeyboardEvent){
				if (!isEdit){
					// if (!Interface.Layer)
					e.preventDefault()
					dispatch(setAction('sheet/col/next'))
				}
			}
		}, {
			mask : 'shift+up', type : 'hold', handler(e: KeyboardEvent){
				/*
				Sheet.Shift = true;
				if (Interface.Layer){
					e.preventDefault();
				} else {
				*/
				if (!isEdit){
					e.preventDefault()
					dispatch(setAction('sheet/row/prev'))
				}
				/*
				}
				*/
			}
		}, {
			mask : 'shift+down', type : 'hold', handler(e: KeyboardEvent){
				/*
				Sheet.Shift = true;
				if (Interface.Layer){
					e.preventDefault();
				} else {
				*/
				if (!isEdit){
					e.preventDefault()
					dispatch(setAction('sheet/row/next'))
				}
				/*
				}
				*/
			}
		}, {
			mask : 'space', type : 'hold', handler(e: KeyboardEvent){
				/*
				Sheet.Shift = false;
				if (Sheet.Multiple.State){
					e.preventDefault();
					Sheet.Multiple.Checking(Sheet.Current.row);
				}
				*/
			}
		}, {
			name : 'font-bold', mask : 'ctrl+b', type : 'down', handler(e: KeyboardEvent){
				/*
				e.preventDefault();
				if (Sheet.Multiple.State){
					Sheet.Edit.MultiClip('bold');
				} else if (Sheet.Current.target == 'text' || Sheet.Current.target == 'memo'){
					Sheet.Edit.Clip('bold');
				}
				*/
			}
		}, {
			name : 'font-italic', mask : 'ctrl+i', type : 'down', handler(e: KeyboardEvent){
				/*
				e.preventDefault();
				if (Sheet.Multiple.State){
					Sheet.Edit.MultiClip('italic');
				} else if (Sheet.Current.target == 'text' || Sheet.Current.target == 'memo'){
					Sheet.Edit.Clip('italic');
				}
				*/
			}
		}, {
			name : 'font-underline', mask : 'ctrl+u', type : 'down', handler(e: KeyboardEvent){
				/*
				e.preventDefault();
				if (Sheet.Multiple.State){
					Sheet.Edit.MultiClip('underline');
				} else if (Sheet.Current.target == 'text' || Sheet.Current.target == 'memo'){
					Sheet.Edit.Clip('underline');
				}
				*/
			}
		}, {
			name : 'undo', mask : 'ctrl+z', type : 'hold', handler(e: KeyboardEvent){
				/*
				e.preventDefault();
				if (!Interface.Layer && !Sheet.Edit.State){
					Sheet.Undo();
				}
				*/
			}
		}, {
			name : 'redo', mask : 'ctrl+y', type : 'hold', handler(e: KeyboardEvent){
				/*
				e.preventDefault();
				if (!Interface.Layer && !Sheet.Edit.State){
					Sheet.Redo();
				}
				*/
			}
		}, {
			name : 'volume-up', mask : 'ctrl+up', type : 'hold', handler(e: KeyboardEvent){
				/*
				try{
					e.preventDefault();
					Video.Volume(Video.Volume() + 0.1);
				} catch (error){
					console.log(error);
				}
				return false;
				*/
			}
		}, {
			name : 'volume-down', mask : 'ctrl+down', type : 'hold', handler(e: KeyboardEvent){
				/*
				try{
					e.preventDefault();
					Video.Volume(Video.Volume() - 0.1);
				} catch (error){
					console.log(error);
				}
				return false;
				*/
			}
		}, {
			mask : 'backspace', type : 'hold', handler(){
				/*
				if (!Sheet.Multiple.State && (Sheet.Current.target == 'text' || Sheet.Current.target == 'memo') && !Sheet.Edit.State){
					Sheet.Edit.Clip('clear');
				}
				*/
			}
		}, {
			mask : 'delete', type : 'hold',
			handler(){
				/*
				if (!Sheet.Multiple.State && (Sheet.Current.target == 'text' || Sheet.Current.target == 'memo') && !Sheet.Edit.State){
					Sheet.Edit.Clip('clear');
				}
				*/
			}
		}, {
			name : 'cut', mask : 'ctrl+x', type : 'down', handler(){
				/*
				if (!Sheet.Multiple.State && (Sheet.Current.target == 'text' || Sheet.Current.target == 'memo') && !Sheet.Edit.State){
					Sheet.Edit.Clip();
				}
				*/
			}
		}, {
			name : 'copy', mask : 'ctrl+c', type : 'down', handler(){
				/*
				if (!Sheet.Multiple.State && (Sheet.Current.target == 'text' || Sheet.Current.target == 'memo') && !Sheet.Edit.State){
					Sheet.Edit.Clip();
				}
				*/
			}
		}, {
			name : 'paste', mask : 'ctrl+v', type : 'down', handler(){
				/*
				if (!Sheet.Multiple.State && (Sheet.Current.target == 'text' || Sheet.Current.target == 'memo') && !Sheet.Edit.State){
					Sheet.Edit.Clip();
				}
				*/
			}
		}
	]
	
	const methods = {
		keyDown(e: KeyboardEvent){
			const regexp = /[A-Za-z0-9\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"\s\n]/
			const keycode = e.keyCode ? e.keyCode : e.which
			if (!pressedRef.current){
				methods.run('down', e)
			}
			pressedRef.current = true
			methods.run('hold', e)
			if (
				// 	!Interface.Layer &&
				// 	$('.ui-dialog.on').length == 0 &&
				// 	!Sheet.Multiple.State && 
				!isEdit &&
				(current.col === 'text' || current.col === 'memo') &&
				!e.ctrlKey && !e.altKey && ( 
					(e.key === 'Process' && e.code.includes('Key')) || 
					(regexp.test(e.key) && 1 === e.key.length) )
			){
				dispatch(setEdit(true))
			}
		},
		keyUp(e: KeyboardEvent){
			pressedRef.current = false
			methods.run('up', e)
		},
		isPressed(mask: string, splitKey: string){
			const maskMap = {
				'esc': 'escape',
				'.': 'period',
				',': 'comma',
				'-': 'slash',
				' ': 'space',
				'`': 'backquote',
				'#': 'backslash',
				'+': 'bracketright'
			}
			const convertMask = mask.split(splitKey).map(key => {
				const convertKey = Object.getOwnPropertyDescriptor(maskMap, key)?.value
				return convertKey || key
			}).join(splitKey)
			return isHotkeyPressed(convertMask, splitKey)
		},
		isInput(target: HTMLInputElement){
			const name = target.tagName.toLowerCase()
			const type = target.type
			const editable = target.contentEditable
			return (editable || name === 'input' && ['text', 'password', 'file', 'search', 'number', 'url'].includes(type) || name === 'textarea')
		},
		run(type: 'up' | 'down' | 'hold', e: KeyboardEvent){
			const shortcuts = [...nomalKeys]
			const shortcut = shortcuts.find(shortcut => shortcut.type == type && methods.isPressed(shortcut.mask,'+'))

			if (shortcut) {
				// console.log(!methods.isInput(e.target as HTMLInputElement))
				// shortcut.isPrevented && e.preventDefault()
				// shortcut.isStopProp && e.stopPropagation()
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
	}, [JSON.stringify(appConfig), JSON.stringify(current), isEdit])
}
export default Hotkeys