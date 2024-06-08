import React from "react"
import Modal from "./Modal"
import utils from "@/lib/utils"
import Select from "react-tailwindcss-select"
import { Activity, Project } from "@/interfaces/data"
import * as  state from "@/lib/redux/slice/state.slice"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { Options } from "react-tailwindcss-select/dist/components/type"

interface ActionActivity {
    activityId?: number
    show?: boolean
    onClose: () => void
    onSubmit: (data: Activity) => Promise<{ data: Activity, message: string }>
    onAddProject: () => void
    onSuccessSubmit: (message: string) => void
    onErrorSubmit: (error: string) => void
}

export function ActionActivity({
    activityId,
    show,
    onClose,
    onSubmit,
    onAddProject,
    onSuccessSubmit,
    onErrorSubmit
}: ActionActivity) {
    const dispatch = useAppDispatch()
    const employee = useAppSelector(state => state.data.employee)
    const activities = useAppSelector(state => state.data.activity)
    const projectList = useAppSelector(state => state.data.project)

    const activity = activities.find(v => v.id === activityId)
    const [startDate, setStartDate] = React.useState("")
    const [selected, setSelected] = React.useState(0)

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const entries = Object.fromEntries(new FormData(e.currentTarget)) as any;
        onClose()
        onSubmit({
            ...entries,
            id: parseInt(entries?.id),
            employe_id: employee?.id,
            project_id: parseInt(entries.project_id)
        }).then(res => {
            // @ts-ignore
            e.target.reset()
            onSuccessSubmit(res.message)
            dispatch(state.save({ activity: [...activities, res.data] }))
        }).catch(e => {
            onErrorSubmit(e.message)
        })
    }

    const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === 'add_project') {
            e.target.value = "0"
            onClose()
            onAddProject()
        } else {
            setSelected(Number(e.target.value))
        }
    }

    return (
        <Modal
            disableOutside
            show={show}
            onClose={onClose}
            title="Tambah Kegiatan Baru"
            classNames={{ box: `modal-bottom sm:modal-middle w-11/12 max-w-5xl` }}
        >
            <div className="divider"></div>
            <form onSubmit={submit} className="flex flex-col gap-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                    {/* activity id */}
                    {activityId && <input type="hidden" name="id" value={activityId} />}
                    {/* start date */}
                    <label className="form-control w-full max-w-sx">
                        <div className="label">
                            <span className="label-text required">Tanggal Mulai</span>
                        </div>
                        <input required type="date" name="start_date" defaultValue={activity?.start_date.split('T')[0]} onChange={(e) => setStartDate(e.target.value)} className="input input-bordered w-full max-w-sx" />
                    </label>
                    {/* end date */}
                    <label className="form-control w-full max-w-sx">
                        <div className="label">
                            <span className="label-text required">Tanggal Berakhir</span>
                        </div>
                        <input required type="date" name="end_date" min={startDate} defaultValue={activity?.end_date.split('T')[0]} className="input input-bordered w-full max-w-sx" />
                    </label>
                    {/* start time */}
                    <label className="form-control w-full max-w-sx">
                        <div className="label">
                            <span className="label-text required">Waktu Mulai</span>
                        </div>
                        <input required type="time" name="start_time" defaultValue={utils.formatTime(activity?.start_time)} className="input input-bordered w-full max-w-sx" />
                    </label>
                    {/* end time */}
                    <label className="form-control w-full max-w-sx">
                        <div className="label">
                            <span className="label-text required">Waktu Berakhir</span>
                        </div>
                        <input required type="time" name="end_time" defaultValue={utils.formatTime(activity?.end_time)} className="input input-bordered w-full max-w-sx" />
                    </label>
                </div>
                {/* title */}
                <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text required">Judul Kegiatan</span>
                    </div>
                    <input required type="text" name="title" defaultValue={activity?.title} className="input input-bordered w-full" />
                </label>
                {/* project */}
                <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text required">Nama Proyek</span>
                    </div>
                    <select required value={activity?.project.id || selected} name="project_id" className="select select-bordered" onChange={onSelectChange}>
                        <option value={0} disabled></option>
                        <option value="add_project" className="text-primary font-semibold">+ Tambah Proyek</option>
                        {projectList.map((item, index) => (
                            <option key={index} value={item.id} className="font-semibold">{item.name}</option>
                        ))}
                    </select>
                </label>
                <div className="divider m-0"></div>
                <div className="flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="btn text-primary">Kembali</button>
                    <button type="submit" className="btn btn-primary">Simpan</button>
                </div>
            </form>
        </Modal>
    )
}

interface ActionProject {
    show?: boolean
    onClose: () => void
    onBack: () => void
    onSubmit: (data: Omit<Project, "id">) => Promise<{ data: Project, message: string }>
    onSuccessSubmit: (message: string) => void
    onErrorSubmit: (error: string) => void
}

export function ActionProject({
    show,
    onClose,
    onBack,
    onSubmit,
    onSuccessSubmit,
    onErrorSubmit
}: ActionProject) {
    const dispatch = useAppDispatch()
    const projectList = useAppSelector(state => state.data.project)

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const entries = Object.fromEntries(new FormData(e.currentTarget)) as any;
        const data = { name: entries.project_name }
        onClose() // need handle back to prev onlywhen success
        onSubmit(data).then(res => {
            (e.target as any)?.reset()
            dispatch(state.save({ project: [...projectList, res.data] }))
            onSuccessSubmit(res.message)
        }).catch(e => onErrorSubmit(e.message))
    }

    return (
        <Modal
            disableOutside
            title="Tambah Proyek Baru"
            show={show}
            onClose={onClose}
            classNames={{
                box: `modal-bottom sm:modal-middle w-11/12 max-w-5xl`
            }}
        >
            <div className="divider"></div>
            <form onSubmit={submit} className="flex flex-col gap-5">
                {/* title */}
                <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text required">Nama Proyek</span>
                    </div>
                    <input type="text" autoComplete="off" name="project_name" className="input input-bordered w-full" />
                </label>
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => { onClose(); onBack() }}
                        className="btn text-primary"
                    >
                        Kembali
                    </button>
                    <button type="submit" className="btn btn-primary">Simpan</button>
                </div>
            </form>
        </Modal>
    )
}

interface ActionFilter {
    show?: boolean
    onClose: () => void
    onChange: (selected: number[]) => void
}

export function ActionFilter({
    show,
    onClose,
    onChange
}: ActionFilter) {
    const projects = useAppSelector(state => state.data.project)
    const options: Options = projects.map(v => ({ value: String(v.id), label: v.name }))
    const [selected, setSelected] = React.useState<any[] | null>(null);

    const handleChange = (e: any[]) => {
        onChange(e?.map(v => Number(v.value)) || [])
        setSelected(e)
    }

    const onSave = () => {
        onClose()
    }

    return (
        <Modal
            disableOutside
            title="Filter"
            show={show}
            onClose={onClose}
            classNames={{
                box: `modal-bottom sm:modal-middle max-w-xl`
            }}
        >
            <div className="divider"></div>
            {/*  */}
            <div className="min-h-32">
                <Select
                    primaryColor="sky"
                    isSearchable
                    isMultiple
                    value={selected}
                    // @ts-ignore
                    onChange={handleChange}
                    options={options}
                    classNames={{
                        tagItem: () => "flex flex-row-reverse bg-gray-200 rounded-box py-1 pl-1 pr-2 gap-1",
                        tagItemIconContainer: "flex items-center px-1 cursor-pointer rounded-full bg-gray-400 text-white hover:bg-gray-500"
                    }}
                    formatGroupLabel={data => (
                        <div className={`py-2 text-xs flex items-center justify-between`}>
                            <span className="font-bold">{data.label}</span>
                            <span className="bg-gray-200 h-5 p-1.5 flex items-center justify-center rounded-full">
                                {data.options.length}
                            </span>
                        </div>
                    )}
                />
            </div>
            <div className="divider m-0"></div>
            <div className="flex justify-end gap-2">
                <button type="button" onClick={onClose} className="btn text-primary">Kembali</button>
                <button type="button" onClick={onSave} className="btn btn-primary">Simpan</button>
            </div>
        </Modal>
    )
}