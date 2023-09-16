import React from 'react'
import { Button } from '@mui/base'
import { ControlButton } from './types'

const ControlButton: ControlButton = ({
  children,
  icon = '',
  title,
  disabled,
  classList = [],
  iconClassList = [],
  onClick }) => {
  const buttonEventHandler = {
    onMouseDown: (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
    },
    onClick: (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled && onClick) onClick(e)
    }
  }
	const buttonClassName = () => {
		const List = [ 'controls__button', ...classList ]
		return List.join(' ')
	}
  const iconClassName = () => {
		const List = [ 'icon', ...iconClassList ]
		return List.join(' ')
  }
  return (
    <Button type="button" title={title}
      className={buttonClassName()}
      disabled={disabled}
      {...buttonEventHandler}
    >
      <i className={iconClassName()}>{icon}</i>
      {children}
    </Button>
  )
}
export default ControlButton