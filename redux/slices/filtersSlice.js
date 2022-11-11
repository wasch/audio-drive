import { createSlice } from "@reduxjs/toolkit/"

export const filtersSlice = createSlice({
    name: 'filters',
    initialState: {
        value: {
            highpass: {
                freq: 0,
                q: 0
            },
            lowpass: {
                freq: 10000,
                q: 0
            },
            highshelf: {
                freq: 800,
                gain: 0
            },
            lowshelf: {
                freq: 0,
                gain: 0
            },
        }
    },
    reducers: {
        setHighpass: (state, input) => {
            if (input.payload.freq !== undefined) state.value.highpass.freq = input.payload.freq;
            if (input.payload.q !== undefined) state.value.highpass.q = input.payload.q;
        },
        setLowpass: (state, input) => {
            if (input.payload.freq !== undefined) state.value.lowpass.freq = input.payload.freq;
            if (input.payload.q !== undefined) state.value.lowpass.q = input.payload.q;
        },
        setHighshelf: (state, input) => {
            if (input.payload.freq !== undefined) state.value.highshelf.freq = input.payload.freq;
            if (input.payload.gain !== undefined) state.value.highshelf.gain = input.payload.gain;
        },
        setLowshelf: (state, input) => {
            if (input.payload.freq !== undefined) state.value.lowshelf.freq = input.payload.freq;
            if (input.payload.gain !== undefined) state.value.lowshelf.gain = input.payload.gain;
        },
    }
})

export const { setHighpass, setLowpass, setHighshelf, setLowshelf } = filtersSlice.actions

export default filtersSlice.reducer