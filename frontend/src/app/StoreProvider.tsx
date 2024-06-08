"use client"
import React from 'react'
import ThemeProvider from '@/components/ThemeProvider'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '@/lib/redux/store'
import ToastProvider from '@/components/ToastProvider'

async function getEmployee() {
    return (await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/employee')).json()
}

export default function StoreProvider({
    children
}: {
    children: React.ReactNode
}) {
    const storeRef = React.useRef<AppStore | null>(null)
    if (!storeRef.current) {
        storeRef.current = makeStore()
    }

    return (
        <Provider store={storeRef.current}>
            <ThemeProvider>
                <ToastProvider>
                    {children}
                </ToastProvider>
            </ThemeProvider>
        </Provider>
    )
}