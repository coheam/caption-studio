import type { subtitleStateProps } from './_types'
const getDefaultState = (): subtitleStateProps => {
  return {
    timeline: [],
    state: []
  }
}

export default getDefaultState()