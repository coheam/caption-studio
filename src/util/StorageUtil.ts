const Storage = {
  set: (k: string, v:any) => {
    try {
      return localStorage.setItem(k, JSON.stringify(v))
    } catch (error) {
      console.error(error)
    }
  },
  get: (k: string) => {
    try {
      return JSON.parse(localStorage.getItem(k) as string)
    } catch (error) {
      console.error(error)
    }
  },
  del: (k: string) => {
    try {
      localStorage.removeItem(k)
    } catch (error) {
      console.error(error)
    }
  },
  call: () => localStorage
}
export default Storage