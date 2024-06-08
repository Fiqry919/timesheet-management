'use client'
import React from "react";
import utils from "@/lib/utils";
import Card from "@/components/Card";
import { Activity, Project } from "@/interfaces/data";
import MainLayout from "@/layouts/MainLayouts";
import * as state from "@/lib/redux/slice/state.slice"
import { Icon } from "@iconify/react/dist/iconify.js";
import Alert, { Alert as AlertMessage } from "@/components/Alert";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { ActionActivity, ActionFilter, ActionProject } from "@/components/Action";

export const dynamic = 'force-dynamic'

async function getActivity(data?: any) {
  const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/activity', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  const result = await response.json()
  if (!response.ok) {
    throw new Error(result?.err)
  }
  return result
}

async function saveActivity(data: Activity) {
  const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/activity/save', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  const result = await response.json()
  if (!response.ok) {
    throw new Error(result?.err)
  }
  return result
}

async function deleteActivity(id: number) {
  return (await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/activity/' + id, {
    method: 'POST',
  })).json()
}

async function getOrSaveProject(data?: Omit<Project, 'id'>) {
  const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/project', data && {
    method: 'POST',
    body: JSON.stringify(data)
  })
  const result = await response.json()
  if (!response.ok) {
    throw new Error(result?.err)
  }
  return result
}

export default function Page() {
  const dispatch = useAppDispatch()
  const employee = useAppSelector(state => state.data.employee)
  const compute = useAppSelector(state => state.data.compute)
  const activityList = useAppSelector(state => state.data.activity)
  const projectList = useAppSelector(state => state.data.project)

  const [search, setSearch] = React.useState<string>('')
  const [activityId, setActivityId] = React.useState<number>()
  const [showActionActivity, setShowActionActivity] = React.useState(false)
  const [showActionProject, setShowActionProject] = React.useState(false)
  const [showActionFilter, setShowActionFilter] = React.useState(false)
  const [showAlert, setShowAlert] = React.useState(false)
  const [alert, setAlert] = React.useState<Partial<AlertMessage>>()

  const [filter, setFilter] = React.useState<number[]>()

  const table = React.useMemo(() => ({
    header: [
      { name: "Judul Kegiatan", colspan: 2 },
      { name: "Nama Proyek", colspan: 2 },
      { name: "Tanggal Mulai" },
      { name: "Tanggal Berakhir" },
      { name: "Waktu Mulai" },
      { name: "Waktu Berakhir" },
      { name: "Durasi" },
      { name: "Aksi" },
    ],
    footer: [
      {
        name: "Total Durasi",
        value: compute?.total_duration || '-'
      },
      {
        name: "Total Overtime",
        value: compute?.total_overtime
      },
      {
        name: "Pendapatan",
        value: compute?.income && compute?.overtime_income ? `Rp. ${utils.formatRp(compute.income)}` : undefined
      },
      {
        name: "Pendapatan Overtime",
        value: compute?.overtime_income ? `Rp. ${utils.formatRp(compute.overtime_income)}` : undefined
      },
      {
        name: "Total Pendapatan",
        value: compute?.total_income ? `Rp. ${utils.formatRp(compute.total_income)}` : '-',
        className: "text-base mt-1",
      },
    ],
  }), [activityList, compute])

  const setActivity = (data?: any) => {
    getActivity(data).then(res => {
      dispatch(state.save({
        compute: utils.omit(res, ['data']) as any,
        activity: res.data
      }))
    }).catch(e => console.log(e))
  }

  const onDelete = (id: number) => {
    handleAlert(true, {
      type: 'error',
      icon: 'mdi:trash',
      title: 'Hapus Kegiatan',
      message: 'Apakah anda yakin ingin?',
      disableAutoClose: true,
      action: <div onClick={() => {
        deleteActivity(id).then(
          (res) => handleSuccessSubmitActivity(res.message)
        ).catch(e => console.log(e))
      }} className="btn btn-primary">Hapus</div>
    })
  }

  const handleAlert = (isOpen: boolean, alert?: Partial<AlertMessage>) => {
    setAlert(alert)
    setShowAlert(isOpen)
  }

  const handleSuccessSubmitActivity = (message: string) => {
    handleAlert(true, { type: 'success', title: 'Berhasil', message })
    setActivity()
  }

  const debounceSearch = React.useCallback(utils.debounce(setActivity, 300), [])

  React.useEffect(() => {
    if (!activityList.length) {
      setActivity()
    }
    if (!projectList?.length) {
      getOrSaveProject().then(res => dispatch(state.save({ project: res.data })))
    }
  }, [])

  React.useEffect(() => {
    if (filter !== undefined) {
      setActivity(filter.length ? { filter } : undefined)
    }
  }, [filter])

  React.useEffect(() => {
    if (search) {
      debounceSearch({ search })
    } else {
      setActivity()
    }
  }, [search, debounceSearch])

  return (
    <MainLayout exportAction={activityList.length > 0}>
      <div className="space-y-5 p-2 sm:p-5">
        <Card
          classNames={{
            base: 'min-h-[calc(100vh_/_1.5)]',
            body: 'gap-0',
            header: 'md:flex-row md:items-center md:gap-12'
          }}
          header={<>
            <div className="flex flex-col">
              <p className="text-xs md:text-sm text-base-content/50">Nama Karyawan</p>
              <p className="text-sm md:text-base">{employee?.name || 'N/A'}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs md:text-sm text-base-content/50">Rate</p>
              <p className="text-sm md:text-base">{employee?.rate ? `Rp.${employee?.rate?.toLocaleString('id-ID')}/jam` : 'N/A'}</p>
            </div>
          </>}
        >
          {/* actions */}
          <div className="flex flex-col md:flex-row justify-between gap-5">
            {/* action */}
            <div className="flex flex-row justify-between items-center gap-5">
              <h1 className="text-sm md:text-lg font-bold">Daftar Kegiatan</h1>
              <button onClick={() => setShowActionActivity(true)} className="btn btn-xs md:btn-sm btn-secondary font-bold md:px-4">
                <Icon icon="mdi:add-circle-outline" className="w-5 h-5" />
                Tambah Kegiatan
              </button>
            </div>
            {/* search */}
            <div className="flex flex-row justify-between items-center gap-2">
              <label className="input input-sm md:input-md input-bordered flex items-center gap-2">
                <Icon icon="mdi:search" className="w-5 h-5 text-base-content/50" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="grow" placeholder="Search" />
              </label>
              <button onClick={() => setShowActionFilter(true)} className="btn btn-sm md:btn-md btn-square btn-outline border-base-content/30 text-primary">
                <div className="relative inline-flex justify-center items-center">
                  {filter && filter.length > 0 && (
                    <span className="absolute bottom-0 left-0.5 md:left-1 badge badge-xs bg-blue z-10"></span>
                  )}
                  <Icon icon="mdi:filter-variant" className="absolute w-5 md:w-6 h-5 md:h-6" />
                </div>
              </button>
            </div>
          </div>
          {/* table */}
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead className="text-sm text-base-content">
                <tr>
                  {table.header.map((item, index) => (
                    <th key={index} colSpan={item.colspan}>
                      <div className="flex flex-row items-center gap-3">
                        {item.name}
                        <Icon icon="fa-solid:sort" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activityList.length ? activityList.map((item, index) => (
                  <tr key={index}>
                    <td colSpan={2}>{item.title}</td>
                    <td colSpan={2}>{item.project.name}</td>
                    <td>{utils.formatDate(item.start_date)}</td>
                    <td>{utils.formatDate(item.end_date)}</td>
                    <td>{utils.formatTime(item.start_time)}</td>
                    <td>{utils.formatTime(item.end_time)}</td>
                    <td>{utils.secondsToDuration(item.duration)}</td>
                    <td>
                      <div className="flex py-2 gap-1">
                        <button onClick={() => {
                          setActivityId(item.id)
                          setShowActionActivity(true)
                        }} className="btn btn-xs btn-square text-primary">
                          <Icon icon="mdi:edit-outline" className="w-4 h-4" />
                        </button>
                        <button onClick={() => onDelete(item.id)} className="btn btn-xs btn-square text-primary">
                          <Icon icon="mdi:trash-outline" className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={10} className="text-center text-base-content/50 h-24">Belum ada kegiatan</td>
                  </tr>
                )}
              </tbody>
              {/* foot */}
              <tfoot>
                <tr style={{ backgroundColor: "#f3f4f6" }}>
                  <th colSpan={10}>
                    <div className="flex flex-col gap-1">
                      {table.footer.map((item, index) => item.value && (
                        <div key={index} className="flex flex-row justify-between">
                          <p className={`${item.className} text-blue`}>{item.name}</p>
                          <p className={`${item.className} text-blue text-right`}>{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      </div >

      {/* alert */}
      {alert && <Alert {...alert as AlertMessage} show={showAlert} onClose={() => handleAlert(false)} />}
      {/* action activity */}
      <ActionActivity
        activityId={activityId}
        show={showActionActivity}
        onSubmit={saveActivity}
        onAddProject={() => setShowActionProject(true)}
        onSuccessSubmit={handleSuccessSubmitActivity}
        onClose={() => { setActivityId(undefined); setShowActionActivity(false) }}
        onErrorSubmit={(message) => handleAlert(true, { type: 'error', title: 'Gagal', message })}
      />
      {/* action project */}
      <ActionProject
        show={showActionProject}
        onSubmit={getOrSaveProject}
        onClose={() => setShowActionProject(false)}
        onBack={() => setShowActionActivity(true)}
        onSuccessSubmit={(message) => handleAlert(true, { type: 'success', title: 'Berhasil', message })}
        onErrorSubmit={(message) => handleAlert(true, { type: 'error', title: 'Gagal', message })}
      />
      {/* action filter */}
      <ActionFilter show={showActionFilter} onClose={() => setShowActionFilter(false)} onChange={setFilter} />
    </MainLayout >
  );
}
