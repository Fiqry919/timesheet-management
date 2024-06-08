import { configureStore } from '@reduxjs/toolkit'
import state from './slice/state.slice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            data: state
        }
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']