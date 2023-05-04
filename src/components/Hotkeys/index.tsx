import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHotkeys,isHotkeyPressed } from 'react-hotkeys-hook'
import { storeProps } from '@/store'
import { appStateProps } from '@/store/app'
import { setTheme } from '@/store/app/actions'

const nomalKeys = [
	{
		name : 'next-row-move', mask : 'tab', type : 'hold', isPrevented : true,
		handler(e: KeyboardEvent){
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
		name : 'prev-row-move', mask : 'shift+tab', type : 'hold', isPrevented : true,
		handler(e: KeyboardEvent){
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
		name : 'sheet-edit-on', mask : 'f2', type : 'hold', isPrevented : true,
		handler(e: KeyboardEvent){
			/*
			if (!Sheet.Edit.State && !Interface.Layer && !Sheet.Multiple.State && (Sheet.Current.target == 'text' || Sheet.Current.target == 'memo')) Sheet.Edit.On();
			*/
		}
	},  {
		name : 'sheet-edit-off', mask : 'esc', type : 'hold', isPrevented : true, isStopProp: false,
		handler(e: KeyboardEvent){
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
		mask : 'enter', type : 'hold', isPrevented : true, isStopProp: false,
		handler(e: KeyboardEvent){
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
		mask : 'pageup', type : 'hold', isPrevented : true, isStopProp: false,
		handler(e: KeyboardEvent){
			/*
			e.preventDefault();
			if (!Interface.Layer){
				Sheet.Move.Page.Prev('true');
			}
			*/
		}
	}, {
		mask : 'pagedown', type : 'hold', isPrevented : true, isStopProp: false,
		handler(e: KeyboardEvent){
			/*
			e.preventDefault();
			if (!Interface.Layer){
				Sheet.Move.Page.Next(false,'true');
			}
			*/
		}
	}, {
		mask : 'up', type : 'hold', isPrevented : true, isStopProp: false,
		handler(e: KeyboardEvent){
			/*
			Sheet.Shift = false;
			if (Interface.Layer){
			} else {
				if (!Sheet.Edit.State){
					e.preventDefault();
					Sheet.Move.Row.Prev('true');
				}
			}
			*/
		}
	}, {
		mask : 'down', type : 'hold', isPrevented : true, isStopProp: false,
		handler(e: KeyboardEvent){
			/*
			Sheet.Shift = false;
			if (Interface.Layer){
			} else {
				if (!Sheet.Edit.State){
					e.preventDefault();
					Sheet.Move.Row.Next(false,'true');
				}
			}
			*/
		}
	}, {
		mask : 'left', type : 'hold', isPrevented : true, isStopProp: false,
		handler(e: KeyboardEvent){
			/*
			if (Interface.Layer){
			} else {
				if (!Sheet.Edit.State){
					e.preventDefault();
					Sheet.Move.Col.Prev('true');
				}
			}
			*/
		}
	}, {
		mask : 'right', type : 'hold', isPrevented : true, isStopProp: false,
		handler(e: KeyboardEvent){
			/*
			if (Interface.Layer){
			} else {
				if (!Sheet.Edit.State){
					e.preventDefault();
					Sheet.Move.Col.Next('true');
				}
			}
			*/
		}
	}, {
		mask : 'shift+up', type : 'hold', isPrevented : true, isStopProp: false,
		handler(e: KeyboardEvent){
			/*
			Sheet.Shift = true;
			if (Interface.Layer){
				e.preventDefault();
			} else {
				if (!Sheet.Edit.State){
					e.preventDefault();
					Sheet.Move.Row.Prev('false');
				}
			}
			*/
		}
	}, {
		mask : 'shift+down', type : 'hold', isPrevented : true, isStopProp: false,
		handler(e: KeyboardEvent){
			/*
			Sheet.Shift = true;
			if (Interface.Layer){
				e.preventDefault();
			} else {
				if (!Sheet.Edit.State){
					e.preventDefault();
					Sheet.Move.Row.Next(false,'false');
				}
			}
			*/
		}
	}, {
		mask : 'space', type : 'hold', isPrevented : true, isStopProp: false,
		handler(e: KeyboardEvent){
			/*
			Sheet.Shift = false;
			if (Sheet.Multiple.State){
				e.preventDefault();
				Sheet.Multiple.Checking(Sheet.Current.row);
			}
			*/
		}
	}, {
		name : 'font-bold', mask : 'ctrl+b', type : 'down', isPrevented : true, isStopProp: false,
		handler(e: KeyboardEvent){
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
		name : 'font-italic', mask : 'ctrl+i', type : 'down', isPrevented : true, isStopProp: false,
		handler(e: KeyboardEvent){
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
		name : 'font-underline', mask : 'ctrl+u', type : 'down', isPrevented : true, isStopProp: false,
		handler(e: KeyboardEvent){
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
		name : 'undo', mask : 'ctrl+z', type : 'hold', isPrevented : true, isStopProp: false,
		handler(e: KeyboardEvent){
			/*
			e.preventDefault();
			if (!Interface.Layer && !Sheet.Edit.State){
				Sheet.Undo();
			}
			*/
		}
	}, {
		name : 'redo', mask : 'ctrl+y', type : 'hold', isPrevented : true, isStopProp: false,
		handler(e: KeyboardEvent){
			/*
			e.preventDefault();
			if (!Interface.Layer && !Sheet.Edit.State){
				Sheet.Redo();
			}
			*/
		}
	}, {
		name : 'volume-up', mask : 'ctrl+up', type : 'hold', isPrevented : true, isStopProp: true,
		handler(e: KeyboardEvent){
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
		name : 'volume-down', mask : 'ctrl+down', type : 'hold', isPrevented : true, isStopProp: true,
		handler(e: KeyboardEvent){
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
		mask : 'backspace', type : 'hold', isPrevented : true,
		handler(){
			/*
			if (!Sheet.Multiple.State && (Sheet.Current.target == 'text' || Sheet.Current.target == 'memo') && !Sheet.Edit.State){
				Sheet.Edit.Clip('clear');
			}
			*/
		}
	}, {
		mask : 'delete', type : 'hold', isPrevented : true,
		handler(){
			/*
			if (!Sheet.Multiple.State && (Sheet.Current.target == 'text' || Sheet.Current.target == 'memo') && !Sheet.Edit.State){
				Sheet.Edit.Clip('clear');
			}
			*/
		}
	}, {
		name : 'cut', mask : 'ctrl+x', type : 'down', isPrevented : true,
		handler(){
			/*
			if (!Sheet.Multiple.State && (Sheet.Current.target == 'text' || Sheet.Current.target == 'memo') && !Sheet.Edit.State){
				Sheet.Edit.Clip();
			}
			*/
		}
	}, {
		name : 'copy', mask : 'ctrl+c', type : 'down', isPrevented : true,
		handler(){
			/*
			if (!Sheet.Multiple.State && (Sheet.Current.target == 'text' || Sheet.Current.target == 'memo') && !Sheet.Edit.State){
				Sheet.Edit.Clip();
			}
			*/
		}
	}, {
		name : 'paste', mask : 'ctrl+v', type : 'down', isPrevented : true,
		handler(){
			/*
			if (!Sheet.Multiple.State && (Sheet.Current.target == 'text' || Sheet.Current.target == 'memo') && !Sheet.Edit.State){
				Sheet.Edit.Clip();
			}
			*/
		}
	}
]

const Hotkeys = () => {
	const pressedRef = useRef(false)
	const appConfig = useSelector((state: storeProps) => state.app.config)
	const appTheme = useSelector((state: storeProps) => state.app.config.theme)
	const dispatch = useDispatch()

	// useHotkeys('a', () => {
	// 	if (appTheme === 'black') {
	// 		dispatch(setTheme('white'))
	// 	}
	// 	if (appTheme === 'white') {
	// 		dispatch(setTheme('black'))
	// 	}
	// })
	// useHotkeys('b', () => {
	// 	dispatch(setTheme('black'))
	// })
	const methods = {
		keyDown(e: KeyboardEvent){
			if (!pressedRef.current){
				methods.run('down', e)
			}
			pressedRef.current = true
			methods.run('hold', e)
		},
		keyUp(e: KeyboardEvent){
			pressedRef.current = false
			methods.run('up', e)
		},
		run(type: 'up' | 'down' | 'hold', e: KeyboardEvent){
			nomalKeys.map(shortcut => {
				if (shortcut.type == type && isHotkeyPressed(shortcut.mask,"+")) {
					shortcut.isPrevented && e.preventDefault()
					shortcut.isStopProp && e.stopPropagation()
					shortcut.handler(e)
					console.log(shortcut)
				}
			})
		}
	}

	useEffect(() => {
		console.log(appTheme)
		document.addEventListener('keydown', methods.keyDown)
		return () => {
			console.log('Hotkeys distory')
			document.removeEventListener('keydown', methods.keyUp)
		}
    // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(appConfig)])
}
export default Hotkeys