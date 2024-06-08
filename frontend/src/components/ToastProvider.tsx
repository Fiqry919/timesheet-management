'use client'
import React from "react"
import { ToastContainer } from "react-toastify"

type Props = {
    children: React.ReactNode
}

export default function ToastProvider({ children }: Props) {
    const contextClass = {
        success: "bg-green-100 text-green-600",
        error: "bg-red-100 text-red-600",
        info: "bg-cyan-100 text-cyan-600",
        warning: "bg-orange-100 text-orange-600",
        default: "bg-base-100 text-base-content",
        dark: "bg-base-100 text-base-content",
    };

    return (
        <React.Fragment>
            {children}
            <ToastContainer
                stacked
                draggable
                icon={false}
                hideProgressBar
                closeButton={false}
                position="top-center"
                containerId="toasify"
                bodyClassName={() => "relative flex items-center text-xs font-semibold p-2"}
                toastClassName={(context) => `${contextClass[context?.type || "default"]} p-1 min-h-10 rounded-box justify-between overflow-hidden cursor-pointer shadow-xl`}
            />
        </React.Fragment>
    )
}