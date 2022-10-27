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
            const queueIndex = audio.payload.currentIndex;
            const audioObj = {
                name: audio.payload.name,
                audioSource: audio.payload.audioSource,
                audioDuration: audio.payload.audioDuration,
                user: audio.payload.user
            }
            // Clears the upcoming audio in the queue and adds the new audio to the end of the new queue
            state.value = [...state.value.slice(0, queueIndex), audioObj];
        },
        replaceQueue: (state, audio) => {
            state.value = audio.payload;
        }
    }
})

export const { addAudioToEndOfList, addAudioToStartOfList, replaceQueue } = queueSlice.actions

export default queueSlice.reducer