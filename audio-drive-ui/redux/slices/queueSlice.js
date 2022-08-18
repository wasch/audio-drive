import { createSlice } from "@reduxjs/toolkit/"

export const queueSlice = createSlice({
    name: 'queue',
    initialState: {
        value: []
    },
    reducers: {
        addAudioToList: (state, audio) => {
            state.value.push(audio.payload);
        }
    }
})

export const { addAudioToList } = queueSlice.actions

export default queueSlice.reducer