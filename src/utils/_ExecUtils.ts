import { detect } from 'detect-browser'
import { getObjectValue } from './_ObjectUtils'
const browser = detect()
const Process = {
  command: (attr: string, value?: string): boolean => {
    return document.execCommand(attr, false, value)
  },
  color: (value = 'reset'): boolean => {
    if ('reset' === value){
      return Process.command('removeFormat', 'foreColor')
    } else {
      return Process.command('foreColor', value)
    }
  },
  enter: (): boolean => {
    if ('ie' === browser?.name){
      let textRange
      let range
      let tempEl
      try {
        Process.command('ms-beginUndoUnit', '')
      } catch(e){}
      if (document.hasOwnProperty('selection')) {
        textRange = getObjectValue(document, 'selection').createRange()
      } else if (window.hasOwnProperty('getSelection')) {
        range = getObjectValue(window, 'getSelection').getRangeAt(0)
        tempEl = document.createElement('span')
        tempEl.innerHTML = '&#FEFF;'
        range.deleteContents()
        range.insertNode(tempEl)
        textRange = getObjectValue(document.body, 'createTextRange')()
        textRange.moveToElementText(tempEl)
        tempEl.parentNode?.removeChild(tempEl)
      }
      textRange.text = '\r\n'
      textRange.collapse(false)
      textRange.select()
      try {
        return Process.command('ms-endUndoUnit')
      } catch (e) {}
    } else if ('firefox' === browser?.name){
      return Process.command('insertHTML', '<br>')
    }
    return Process.command('insertLineBreak')
  }
}
const ExecCommand = (attr: string, value?: string): boolean => {
  if ('color' === attr){
    return Process.color(value)
  } else if ('enter' === attr){
    return Process.enter()
  } else {
    return Process.command(attr, value)
  }
}
export default ExecCommand