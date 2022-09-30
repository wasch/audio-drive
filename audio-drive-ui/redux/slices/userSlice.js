import { createSlice } from "@reduxjs/toolkit/"

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        value: null
    },
    reducers: {
        setUser: (state, user) => {
            state.value = user.payload;
        },
    },
});

export default userSlice.reducer
export const { setUser } = userSlice.actions
