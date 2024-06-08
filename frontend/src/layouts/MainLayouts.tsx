'use client'
import React from "react"
import cn from "classnames"
import Link from "next/link"
import config from "@/config"
import * as state from "@/lib/redux/slice/state.slice"
import { usePathname, useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import Export from "@/components/Export"


interface Props {
    children: React.ReactNode
    exportAction?: boolean
}

async function getEmployee() {
    const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/employee')
    const result = await response.json()
    if (!response.ok) {
        throw new Error(result?.err || "employee not found")
    }
    return result
}

export default function MainLayout({ children, exportAction }: Props) {
    const router = useRouter()
    const pathname = usePathname()
    const dispatch = useAppDispatch()
    const employee = useAppSelector(state => state.data.employee)
    const title = process.env.NEXT_PUBLIC_APP_NAME!.split(' ')

    React.useEffect(() => {
        if (!employee) {
            getEmployee().then(res => dispatch(state.save({ employee: res.data })))
                .catch(() => !pathname.match('settings')
                    && router.push('/settings?err=not found'))
        }
    }, [employee])

    return (
        <div className="drawer bg-base-300">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col gap-2">
                {/* Navbar Logo */}
                <div className="sticky top-0 w-full navbar bg-base-100 drop-shadow-md z-10">
                    <div className="flex-none lg:hidden">
                        <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </label>
                    </div>
                    <div className="hidden lg:flex px-5 mx-2 lg:my-2 text-primary">
                        <div className="flex flex-col leading-none">
                            <h1 className="font-bold text-xl">{title[0]}</h1>
                            <p className="font-bold">{title[1]}</p>
                        </div>
                    </div>
                </div>
                {/* Menu */}
                <div className="w-full navbar bg-base-100 drop-shadow-md lg:pt-5 lg:pb-0">
                    <div className="flex-1 px-5 lg:mx-2">
                        <div className="w-full flex flex-row justify-between items-center">
                            <div className="flex flex-col gap-5">
                                <h1 className="text-2xl font-bold">HH {title[0]}</h1>
                                <div className="hidden lg:join decoration-4 underline-offset-8">
                                    {config.menu.map((item, index) => (
                                        <Link
                                            key={index}
                                            href={item.href}
                                            className={cn({
                                                'btn btn-sm btn-link join-item border-none text-base': true,
                                                'no-underline text-base-content hover:text-blue/80 ': pathname !== item.href,
                                                'underline text-blue ': pathname === item.href,
                                            })}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            {pathname === '/' && exportAction && (
                                <Export />
                            )}
                        </div>
                    </div>
                </div>
                {/* Page content here */}
                <div className="w-full min-h-svh">
                    {children}
                </div>
            </div>
            <div className="drawer-side z-20">
                <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="overflow-y-auto flex min-h-full">
                    <div className="w-80 p-4 min-h-full bg-base-200">
                        <div className="flex flex-col leading-none text-primary text-center">
                            <h1 className="font-bold text-xl">{title[0]}</h1>
                            <p className="font-bold">{title[1]}</p>
                        </div>
                        <div className="divider mb-0"></div>
                        <ul className="menu">
                            {config.menu.map((item, index) => (
                                <li key={index}>
                                    <Link href={item.href} className={cn({
                                        'bg-light-blue text-blue': pathname === item.href
                                    })}>{item.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}