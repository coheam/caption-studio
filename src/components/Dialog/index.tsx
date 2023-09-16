import { cloneElement } from 'react'
import { createPortal } from 'react-dom'
import { Dialog } from './types'

const Dialog: Dialog = ({ children, open, onClose }) => {
  return (<>
    {open && createPortal(
      <div className="dialog">
        <div className="dialog__dimmed" onClick={() => {
          onClose && onClose()
        }}></div> 
        <div className="dialog__inbox">
          {children && cloneElement(children, {onClose})}
        </div>
      </div>
    , document.querySelector('body') as Element)}
  </>)
}
export default Dialog