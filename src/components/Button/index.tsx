import { useEffect, useRef, useState } from 'react'
import { buttonProps } from "./types"

const Button = ({children, isDisable = false, type = 'button', id, classList, title, icon, click}: buttonProps) => {
  useEffect(()=>{
    return () => {
      // console.log('distory')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDisable, JSON.stringify(classList)])
	const clickHandler = (e: React.SyntheticEvent) => {
		if (!isDisable) click(e)
	}
	const buttonClassName = (() => {
		const buttonClassList = [ ...classList as unknown as string[] ]
		if (isDisable) buttonClassList.push('disabled')
		return buttonClassList.join(' ')
	})()
  return (
    <button type={type} role="button" disabled={isDisable} id={id} className={buttonClassName} title={title} onClick={clickHandler}>
			<span className="material-symbols-rounded">{icon}</span>
			<span className="i18n tir">{children}</span>
		</button>
  )
}
export default Button