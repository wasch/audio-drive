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
        addAudio: (state, audio) => {
            state.value = [...state.value, audio.payload];
        },
        removeAudio: (state, id) => {
            const matchingAudio = state.value.findIndex(element => element.id === id.payload);
            let tempAudioList = [...state.value];
            tempAudioList.splice(matchingAudio, 1);
            state.value = tempAudioList;
        },
    }
})

export const { setAudio, addAudio, removeAudio } = audioSlice.actions

export default audioSlice.reducer