export interface Compute {
    total_duration: string
    total_overtime: string
    income: number
    overtime_income: number
    total_income: number
}

export interface Activity {
    id: number
    title: string
    project: Project
    start_date: string
    end_date: string
    start_time: string
    end_time: string
    duration: number
}

export interface Project {
    id: number
    name: string
}

export interface Employee {
    id: number
    name: string
    rate: number
}