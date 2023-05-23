export const syncDispatch = (callback: Function, dispatch: Function) => new Promise((resolve: Function, reject: Function) => {
  dispatch(callback())
  resolve()
})
