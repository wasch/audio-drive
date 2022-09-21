import { createSlice } from "@reduxjs/toolkit/"

export const audioSlice = createSlice({
    name: 'audio',
    initialState: {
        value: []
    },
    reducers: {
        setAudio: (state, audio) => {
            state.value = audio.payload;
        },
    }
})

export const { setAudio } = audioSlice.actions

export default audioSlice.reducer