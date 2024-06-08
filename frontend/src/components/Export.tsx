import React from "react";
import * as XLSX from 'xlsx';
import utils from "@/lib/utils";
import { CSVLink } from 'react-csv';
import { saveAs } from 'file-saver';
import { useAppSelector } from "@/lib/redux/hooks";
import { Icon } from "@iconify/react/dist/iconify.js";

interface Props {
    // 
}

export default function Export({ }: Props) {
    const filename = `${utils.formatTimestamp('yyyy-MM-dd')}-timesheet`
    const data = useAppSelector(state => state.data.activity).
        map(v => ({
            ...v,
            project: v.project.name,
            start_time: utils.formatTime(v.start_time),
            end_time: utils.formatTime(v.end_time),
            duration: utils.secondsToDuration(v.duration)
        }))

    const headers = [
        { key: "id", label: "ID" },
        { key: "title", label: "Judul Kegiatan" },
        { key: "project", label: "Nama Proyek" },
        { key: "start_date", label: "Tanggal Mulai" },
        { key: "end_date", label: "Tanggal Berakhir" },
        { key: "start_time", label: "Waktu Mulai" },
        { key: "end_time", label: "Waktu Berakhir" },
        { key: "duration", label: "Durasi" },
    ]

    const exportToExcel = () => {
        const worksheetData = data.map((item) =>
            headers.reduce((acc, header) => {
                // @ts-ignore
                acc[header.label] = item[header.key];
                return acc;
            }, {} as any)
        );

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(dataBlob, `${filename}.xlsx`);
    }

    return (
        <div className="dropdown dropdown-left">
            <button role="button" tabIndex={0} className="btn btn-xs sm:btn-sm md:btn-md btn-primary">Export Laporan</button>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-48">
                <li>
                    <CSVLink data={data} headers={headers} filename={`${filename}.csv`}>
                        <button className="flex flex-row items-center gap-2 text-xs">
                            <Icon icon="mdi:file-csv-outline" width={16} height={16} />
                            Export to CSV
                        </button>
                    </CSVLink>
                </li>
                <li>
                    <button className="flex flex-row items-center gap-2 text-xs" onClick={exportToExcel}>
                        <Icon icon="mdi:file-excel-outline" width={16} height={16} />
                        Export to Excel
                    </button>
                </li>
            </ul>
        </div>
    )
}