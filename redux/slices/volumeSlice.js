import { createSlice } from "@reduxjs/toolkit/"

export const volumeSlice = createSlice({
    name: 'volume',
    initialState: {
        value: 0.5
    },
    reducers: {
        setVolume: (state, volume) => {
            state.value = volume.payload;
        },
    }
})

export const { setVolume } = volumeSlice.actions

export default volumeSlice.reducer