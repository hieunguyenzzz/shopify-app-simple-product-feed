import { createContext, useContext } from 'react'

const rootContext = createContext({})
export const { Provider: RootProvider, Consumer } = rootContext
export const useApp = () => {
  const context = useContext(rootContext)
  console.log({ context })
  return context.current
}
export default rootContext
