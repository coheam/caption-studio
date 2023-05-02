import { applyMiddleware, combineReducers, createStore, Middleware, StoreEnhancer } from "redux"
import { MakeStore, createWrapper } from "next-redux-wrapper"
import thunk from "redux-thunk"
import type { storeProps } from "./type"
import app from "./app"
import subtitle from "./subtitle"

const bindMiddleware = (middleware: Middleware[]): StoreEnhancer => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension')
    return composeWithDevTools(applyMiddleware(...middleware))
  }
  return applyMiddleware(...middleware)
}
const makeStore: MakeStore<{}> = () => {
  const Store = createStore(combineReducers<storeProps>({
    app,
    subtitle
  }), {}, bindMiddleware([thunk]))
  return Store
}

export const wrapper = createWrapper<{}>(makeStore, { debug: true })
export {
  storeProps
}