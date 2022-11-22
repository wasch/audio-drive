import { createSlice } from "@reduxjs/toolkit/"

export const queueIndexSlice = createSlice({
    name: 'queueIndex',
    initialState: {
        value: 0
    },
    reducers: {
        next: (state) => {
            state.value += 1;
            restartAudio();
        },
        previous: (state) => {
            if (state.value > 0) {
                state.value -= 1;
                restartAudio();
            }
        },
        setQueueIndex: (state, index) => {
            state.value = index.payload;
            restartAudio();
        }
    }
})

const restartAudio = () => {
    if (document.querySelector('audio').currentTime) {  // Don't try to restart audio if nothing is playing
        document.querySelector('audio').pause();
        document.querySelector('audio').currentTime = 0;
        document.querySelector('audio').play();
    }
}

export const { next, previous, setQueueIndex } = queueIndexSlice.actions

export default queueIndexSlice.reducer