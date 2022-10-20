import { createSlice } from "@reduxjs/toolkit/"

export const pausedSlice = createSlice({
    name: 'isPaused',
    initialState: {
        value: false
    },
    reducers: {
        setIsPaused: (state, isPaused) => {
            state.value = isPaused.payload;
        },
    }
})

export const { setIsPaused } = pausedSlice.actions

export default pausedSlice.reducer