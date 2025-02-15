import { createContext } from 'react'

export interface LayoutContextType {
    isSidebarOpen: boolean
    toggleSidebar: () => void
}

export const LayoutContext = createContext<LayoutContextType>({
    isSidebarOpen: true,
    toggleSidebar: () => { },
})