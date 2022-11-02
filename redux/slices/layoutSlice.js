import { createSlice } from "@reduxjs/toolkit/"

export const layoutSlice = createSlice({
    name: 'audio',
    initialState: {
        value: false
    },
    reducers: {
        toggleIsExpandedLayout: (state) => {
            state.value = !state.value;
        },
        setIsExpandedLayout: (state, isExpanded) => {
            state.value = isExpanded.payload;
        },
    }
})

export const { toggleIsExpandedLayout, setIsExpandedLayout } = layoutSlice.actions

export default layoutSlice.reducer