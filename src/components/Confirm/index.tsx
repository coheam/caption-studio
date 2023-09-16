import { useEffect, useState } from 'react'
import { Button, NoSsr, Portal } from '@mui/base'
import * as ReactDOMClient from 'react-dom/client'
import Dialog from '../Dialog'
import { Confirm } from './types'

const Confirm: Confirm = (content, props) => {
  const isCancel = props?.isCancel ?? false
  const labelConfirm = props?.labelConfirm ?? 'Confirm'
  const labelCancel = props?.labelCancel ?? 'Cancel'
  const onConfirm = props?.onConfirm
  const onCancel = props?.onCancel

  const container = document.createElement( 'div' )
  const root = ReactDOMClient.createRoot(container as HTMLElement)

  const ConfirmModal = () => {
    const [open, setOpen] = useState<boolean>(true)
    const handleOpen = () => setOpen(!open)
    const cancelClickHandler = () => {
      handleOpen()
      onCancel && onCancel()
    }
    const confirmClickHandler = () => {
      handleOpen()
      onConfirm && onConfirm()
    }

    return (<Dialog open={open} onClose={handleOpen}>
      <div className="confirm">
        <div className="confirm__content" dangerouslySetInnerHTML={{__html: `${content}`}}></div>
        <div className="confirm__footer justify-end">
          <div className="button__group">
            {isCancel && (
              <Button className="button__text--cancel" onClick={cancelClickHandler}>{labelCancel}</Button>
            )}
            <Button className="button__text" onClick={confirmClickHandler}>{labelConfirm}</Button>
          </div>
        </div>
      </div>
    </Dialog>)
  }
  root.render(
    <NoSsr>
      <Portal>
        <ConfirmModal></ConfirmModal>
      </Portal>
    </NoSsr>
  )
}
export default Confirm