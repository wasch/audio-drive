import { createSlice } from "@reduxjs/toolkit/"

export const playlistsSlice = createSlice({
    name: 'playlists',
    initialState: {
        value: []
    },
    reducers: {
        addPlaylist: (state, playlist) => {
            state.value.push(playlist.payload);
        },
        setPlaylists: (state, playlists) => {
            state.value = playlists.payload;
        }
    }
})

export const { addPlaylist, setPlaylists } = playlistsSlice.actions

export default playlistsSlice.reducer