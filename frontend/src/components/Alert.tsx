import React from "react"
import Modal from "./Modal"
import { Icon } from "@iconify/react/dist/iconify.js"

export interface Alert {
    show?: boolean
    icon?: string
    autClose?: number
    onClose: () => void
    action?: React.ReactNode
    disableOutside?: boolean
    disableAutoClose?: true
    classNames?: {
        base?: string
        action?: string
    }
    type: 'success' | 'error' // warning, etc here...
    title: string
    message: string
}

export default function Alert({
    show,
    icon,
    autClose = 5000,
    onClose,
    action,
    disableOutside,
    disableAutoClose,
    classNames,
    type,
    title,
    message
}: Alert) {
    const render = (renderType: 'color' | 'icon') => {
        switch (type) {
            case 'success':
                return renderType === 'icon'
                    ? 'flat-color-icons:ok' : 'bg-green-200 text-green-500'
            case 'error':
                return renderType === 'icon'
                    ? 'flat-color-icons:cancel' : 'bg-red-200 text-red-500'
        }
    }

    if (!disableAutoClose) {
        setTimeout(() => {
            onClose()
        }, autClose);
    }

    return (
        <Modal disableCloseIcon disableOutside={disableOutside} show={show} onClose={onClose} classNames={classNames}>
            <div className="flex flex-col items-center gap-4 py-8">
                <button className={`btn btn-circle btn-lg ${render('color')} mb-4`}>
                    <Icon icon={icon || render('icon')} className="w-14 h-14" />
                </button>
                <p className="font-bold text-xl">{title}</p>
                <p className="text-base leading-none">{message}</p>
                {action && (
                    <div className={`modal-action ${classNames?.action}`}>
                        {action}
                    </div>
                )}
            </div>
        </Modal>
    )
}