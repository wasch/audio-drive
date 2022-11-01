import { createSlice } from "@reduxjs/toolkit/"

export const loopSlice = createSlice({
    name: 'loopInfo',
    initialState: {
        value: {
            isLooping: false,
            loopStart: null,
            loopEnd: null
        }
    },
    reducers: {
        setIsLooping: (state, looping) => {
            state.value.isLooping = looping.payload;
        },
        setLoopStart: (state, looping) => {
            state.value.loopStart = looping.payload;
        },
        setLoopEnd: (state, looping) => {
            state.value.loopEnd = looping.payload;
        },
    }
})

export const { setIsLooping, setLoopStart, setLoopEnd } = loopSlice.actions

export default loopSlice.reducer