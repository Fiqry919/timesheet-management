import { createSlice } from "@reduxjs/toolkit";
import { Activity, Project, Employee, Compute } from "@/interfaces/data";

type State = {
    employee?: Employee,
    compute?: Compute
    activity: Activity[]
    project: Project[]
}

type SaveProps = {
    payload: {
        [K in keyof State]?: State[K]
    }
}

export const state = createSlice({
    name: 'state',
    initialState: <State>{
        employee: undefined,
        compute: undefined,
        activity: [],
        project: []
    },
    reducers: {
        initialize(state, props) { },
        save(state, props: SaveProps) {
            Object.keys(props.payload).forEach((key) => {
                const value = props.payload[key as keyof State]
                if (value != undefined) {
                    (state[key as keyof State] as any) = value;
                }
            })
        },
        reset(state) {
            state.employee = undefined
            state.activity = []
            state.project = []
        },
    }
})

export const {
    initialize,
    save,
    reset
} = state.actions

export default state.reducer