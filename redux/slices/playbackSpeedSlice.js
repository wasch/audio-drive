import { createSlice } from "@reduxjs/toolkit/"

export const playbackSpeedSlice = createSlice({
    name: 'playbackSpeed',
    initialState: {
        value: 1
    },
    reducers: {
        increment: (state) => { // Increments playback speed by 5%
            if (state.value > 0) {
                state.value += 0.05;
            }
        },
        decrement: (state) => { // Decrements playback speed by 5%
            if (state.value > 0) {
                state.value -= 0.05;
            }
        },
        setPlaybackSpeed: (state, speed) => {
            state.value = Number.parseFloat(Number.parseFloat(speed.payload).toFixed(2));
        }
    }
})

export const { increment, decrement, setPlaybackSpeed } = playbackSpeedSlice.actions

export default playbackSpeedSlice.reducer