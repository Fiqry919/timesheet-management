import React from "react";
import cn from "classnames"

interface Props {
    title?: React.ReactNode
    children: React.ReactNode
    show?: boolean
    onClose: () => void
    disableCloseIcon?: true
    disableOutside?: boolean
    classNames?: {
        base?: string
        box?: string
        title?: string
    }
}

export default function Modal({
    title,
    children,
    show,
    onClose,
    disableOutside,
    disableCloseIcon,
    classNames,
}: Props) {
    return (
        <dialog open={show} onClose={onClose} className={cn({
            'modal': true,
            'bg-black/50': !classNames?.base?.match('bg-'),
            [`${classNames?.base}`]: classNames?.base
        })}>
            <div className={cn({
                'modal-box': true,
                // 'p-4': !classNames?.box?.match('p-'),
                [`${classNames?.box}`]: classNames?.box
            })}>
                {!disableCloseIcon && (
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                )}
                {title && (
                    <h3 className={cn({
                        'font-bold': !classNames?.title?.match('font-'),
                        'text-lg': !classNames?.title?.match('text-'),
                        [`${classNames?.title}`]: classNames?.title
                    })}>
                        {title}
                    </h3>
                )}
                {children}
            </div>
            {!disableOutside && <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>}
        </dialog>
    )
}