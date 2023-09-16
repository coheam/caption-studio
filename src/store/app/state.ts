import { atom } from 'recoil'

export const fontSize = atom<number>({
  key: 'fontSize',
  default: 14,
  effects: [
    ({setSelf, onSet }) => {
      onSet((new_value, old_value) => {
        console.log(new_value)
        console.log(old_value)
      })
    }
  ]
})