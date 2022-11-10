import { createSlice } from "@reduxjs/toolkit/"

export const maintainPitchSlice = createSlice({
    name: 'maintainPitch',
    initialState: {
        value: true
    },
    reducers: {
        toggleShouldMaintainPitch: (state) => { 
            state.value ? state.value = false : state.value = true;
        },
    }
})

export const { toggleShouldMaintainPitch } = maintainPitchSlice.actions

export default maintainPitchSlice.reducer