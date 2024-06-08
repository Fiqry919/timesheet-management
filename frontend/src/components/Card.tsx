import React from "react";
import cn from "classnames";

interface Props<T extends React.ElementType> {
    /**
     * as children wrapper to specifict tag element
     */
    as?: T
    header?: React.ReactNode
    children: React.ReactNode
    classNames?: Partial<{
        base: string
        body: string
        header: string
        wrapper: string
    }>
    onSubmit?: T extends 'form' ? React.FormEventHandler<HTMLFormElement> : never;
}

type PolymorphicComponentProps<T extends React.ElementType> = Props<T> & React.ComponentPropsWithoutRef<T>;

export default function Card<T extends React.ElementType = 'div'>({
    as,
    header,
    children,
    classNames,
    ...props
}: PolymorphicComponentProps<T>) {
    const Component = as || 'div';
    return (
        <div className={cn({
            'card bg-base-100 shadow-md': true,
            [`${classNames?.base}`]: classNames?.base
        })}>
            <div className={cn({
                'card-body p-0': true,
                [`${classNames?.body}`]: classNames?.body
            })}>
                {header && (
                    <>
                        <div className={cn({
                            'flex flex-col p-5 md:mx-2 gap-5': true,
                            [`${classNames?.header}`]: classNames?.header
                        })}>
                            {header}
                        </div>
                        <div className="divider m-0" />
                    </>
                )}
                <Component className={cn({
                    'flex flex-col p-4': true,
                    'md:mx-2': !classNames?.wrapper?.match('mx-'),
                    'gap-5': !classNames?.wrapper?.match('gap-'),
                    [`${classNames?.wrapper}`]: classNames?.wrapper,
                })} {...props}>
                    {children}
                </Component>
            </div>
        </div>
    )
}