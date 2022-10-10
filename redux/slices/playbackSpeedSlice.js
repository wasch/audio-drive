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
                console.log(state.value);
            }
        },
        decrement: (state) => { // Decrements playback speed by 5%
            if (state.value > 0) {
                state.value -= 0.05;
                console.log(state.value);
            }
        }
    }
})

export const { increment, decrement } = playbackSpeedSlice.actions

export default playbackSpeedSlice.reducer