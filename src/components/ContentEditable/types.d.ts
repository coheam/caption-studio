import React from 'react'
export interface ContentEditableProps {
  shift: React.MutableRefObject<string>
  editClip: number
  setEditClip: React.Dispatch<React.SetStateAction<number>>
}
export interface StyledInputProps {
  $width: number
  $height: number
  $padding: number
}