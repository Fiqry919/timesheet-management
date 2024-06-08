'use client'
import { ReactNode } from "react"

interface Props {
    children: ReactNode
}

export default function ThemeProvider({ children }: Props) {
    return (
        <div data-theme={'light'}>
            {children}
        </div>
    )
}