import { createSlice } from "@reduxjs/toolkit/"

export const pannerRefSlice = createSlice({
    name: 'pannerRef',
    initialState: {
        value: 0
    },
    reducers: {
        setPannerRef: (state, ref) => {
            state.value = ref.payload;
        },
    }
})

export const { setPannerRef } = pannerRefSlice.actions

export default pannerRefSlice.reducer