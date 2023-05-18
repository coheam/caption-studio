import type { subtitleStateProps } from './_types'
const getDefaultState = (): subtitleStateProps => {
  return {
    timeline: [],
    state: [],
    height: 0,
    stamp: 0
  }
}

export default getDefaultState()