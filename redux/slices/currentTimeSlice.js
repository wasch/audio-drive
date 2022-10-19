import { createSlice } from "@reduxjs/toolkit/"

export const currentTimeSlice = createSlice({
    name: 'currentTime',
    initialState: {
        value: null
    },
    reducers: {
        setTime: (state, time) => {
            state.value = time.payload;
        }
    },
});

export default currentTimeSlice.reducer
export const { setTime } = currentTimeSlice.actions
