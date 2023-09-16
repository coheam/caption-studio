const Storage = {
  set: (k: string, v:any): void => {
    try {
      localStorage.setItem(k, JSON.stringify(v))
    } catch (error) {
      console.error(error)
    }
  },
  get: (k: string): any => {
    try {
      const getStorage = localStorage.getItem(k)
      return getStorage && JSON.parse(getStorage as string)
    } catch (error) {
      console.error(error)
    }
  },
  del: (k: string): void => {
    try {
      localStorage.removeItem(k)
    } catch (error) {
      console.error(error)
    }
  },
  call: () => localStorage
}
export default Storage