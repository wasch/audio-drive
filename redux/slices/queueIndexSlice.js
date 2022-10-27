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
        },
        setQueueIndex: (state, index) => {
            state.value = index.payload;
        }
    }
})

export const { next, previous, setQueueIndex } = queueIndexSlice.actions

export default queueIndexSlice.reducer