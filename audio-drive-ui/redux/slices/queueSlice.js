import { createSlice } from "@reduxjs/toolkit/"

export const queueSlice = createSlice({
    name: 'queue',
    initialState: {
        value: []
    },
    reducers: {
        addAudioToEndOfList: (state, audio) => {
            state.value.push(audio.payload);
        },
        addAudioToStartOfList: (state, audio) => {
            if (state.value.length === 0) {
                state.value.push(audio.payload);
            } else {
                state.value[0] = audio.payload;
            }
        }
    }
})

export const { addAudioToEndOfList, addAudioToStartOfList } = queueSlice.actions

export default queueSlice.reducer