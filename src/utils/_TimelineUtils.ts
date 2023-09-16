import { getObjectValue } from './_ObjectUtils'

export const emptyTimeline = (format: string) => {
  return getObjectValue({
    smi : {start: 0, text: '', memo: ''},
    srt : {start: 0, end: 0, text: '', memo: ''}
  }, format)
}