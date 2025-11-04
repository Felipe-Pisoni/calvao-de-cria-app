declare module 'react-drawer' {
  import { ReactNode } from 'react'

  export interface DrawerProps {
    open: boolean
    onClose: () => void
    direction?: 'left' | 'right' | 'top' | 'bottom'
    className?: string
    children?: ReactNode
  }

  declare const Drawer: React.ComponentType<DrawerProps>
  export default Drawer
}
