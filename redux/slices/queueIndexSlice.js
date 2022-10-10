import { createSlice } from "@reduxjs/toolkit/"

export const queueIndexSlice = createSlice({
    name: 'queueIndex',
    initialState: {
        value: 0
    },
    reducers: {
        next: (state) => {
            state.value += 1;
        },
        previous: (state) => {
            if (state.value > 0) {
                state.value -= 1;
            }
        }
    }
})

export const { next, previous } = queueIndexSlice.actions

export default queueIndexSlice.reducer