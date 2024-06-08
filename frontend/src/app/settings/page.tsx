'use client'
import React from "react";
import Card from "@/components/Card";
import { toast } from "react-toastify";
import Alert from "@/components/Alert";
import Validator from "privy-validator";
import { Employee } from "@/interfaces/data";
import MainLayout from "@/layouts/MainLayouts";
import { useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react/dist/iconify.js";
import * as state from "@/lib/redux/slice/state.slice"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import Link from "next/link";

export const dynamic = 'force-dynamic'

type Data = Omit<Employee, 'id'>

type ErrorSubmit<T = Data> = {
    [K in keyof T]?: string[]
}

type AlertMessage = {
    type: 'success' | 'error'
    title: string
    message: string
}

async function saveEmployee(data: Data) {
    return (await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/employee', {
        method: 'POST',
        body: JSON.stringify(data)
    })).json()
}

export default function Page() {
    const searchParams = useSearchParams()
    const err = searchParams.get('err')
    const dispatch = useAppDispatch()

    const employee = useAppSelector(state => state.data.employee)
    const [rate, setRate] = React.useState("")

    const [showAlert, setShowAlert] = React.useState(false)
    const [error, setError] = React.useState<ErrorSubmit>()
    const [alert, setAlert] = React.useState<AlertMessage>()

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(undefined)
        const entries = Object.fromEntries(new FormData(e.currentTarget)) as any;
        const data: Data = {
            name: entries.name,
            rate: Number(rate.replace(/\./g, ""))
        }
        const validator = await Validator.make(data, {
            name: 'required|type:string',
            rate: 'required|type:number',
        })

        if (!validator.validate()) {
            return setError(validator.errors())
        }

        const result = await saveEmployee(data)
        // dispatch data when success
        result?.message && dispatch(state.save({
            employee: { id: 1, ...data }
        }))
        // show alert
        handleAlert(true, {
            type: result?.message ? 'success' : 'error',
            title: result?.message ? 'Berhasil' : 'Gagal',
            message: result?.message || result?.err || 'Data gagal disimpan'
        })
    }

    const formatRp = (e: string) => {
        const n = parseFloat(e.replace(/[^\d]/g, ''))
        if (!isNaN(n)) {
            const format = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR"
            }).format(n).replace(/^Rp\s+|,00$/g, '')
            setRate(format)
        } else {
            if (rate.length === 1) setRate("")
        }
    }

    const handleAlert = (isOpen: boolean, alert?: AlertMessage) => {
        setAlert(alert)
        setShowAlert(isOpen)
    }

    React.useEffect(() => {
        if (err && !employee) {
            toast.success('Silahkan tambahkan data karyawan terlebih dahulu', {
                toastId: 'employee-alert',
                containerId: 'toasify',
                icon: <Icon icon="mdi:info-outline" className="w-6 h-6" />,
            })
        }
        employee && formatRp(employee.rate.toString())
    }, [err, employee])

    return (
        <MainLayout>
            <div className="flex flex-col min-h-[calc(100vh_/_1.5)] justify-center items-center space-y-5 p-2 sm:p-5">
                <Card as='form' onSubmit={submit} classNames={{ base: 'w-full md:w-3/4 lg:w-1/4', wrapper: 'gap-5 p-5 md:p-12' }}>
                    {/* name */}
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text required">Nama Karyawan</span>
                        </div>
                        <input type="text" name="name" defaultValue={employee?.name} placeholder="Masukan nama karyawan" className="input input-bordered w-full" />
                        <div className="label">
                            <span className="label-text-alt text-red-500">{error?.name?.[0]}</span>
                        </div>
                    </label>
                    {/* rate */}
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text required">Rate</span>
                        </div>
                        <label className="input input-bordered flex items-center gap-2">
                            Rp.
                            <input type="text" value={rate} onChange={(e) => formatRp(e.target.value)} className="grow" placeholder="12.000" />
                            <span className="text-base-content/50">/jam</span>
                        </label>
                        <div className="label">
                            <span className="label-text-alt text-red-500">{error?.rate?.[0]}</span>
                        </div>
                    </label>
                    {/* actons */}
                    <div className="flex flex-col md:flex-row justify-between gap-2">
                        <Link href="/" className={`btn btn-block md:w-1/2 text-blue text-base order-last md:order-first ${!employee && 'btn-disabled'}`}>Batalkan</Link>
                        <button type="submit" className="btn btn-block md:w-1/2 bg-blue text-white">Simpan</button>
                    </div>
                </Card>
            </div>

            {alert && <Alert {...alert} show={showAlert} onClose={() => handleAlert(false)} />}
        </MainLayout>
    );
}
