import { FC, ReactNode } from "react";

interface LayoutProp {
    children :ReactNode
} 
const Layout :FC<LayoutProp>= ({children}) => {
    return <div className='bg-slate-200 p-10 rounded-md'>{children}</div>
}

export default Layout;