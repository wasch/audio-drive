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
        },
        removeFromPlaylists: (state, id) => {
            for (let i = 0; i < state.value.length; i++) {
                for (let j = 0; j < state.value[i].audioList.length; j++) {
                    if (state.value[i].audioList[j].id === id.payload) {
                        state.value[i].audioList.splice(j, 1);
                    }
                }
            }
        },
        editNameInPlaylists: (state, audioObj) => {
            for (let i = 0; i < state.value.length; i++) {
                for (let j = 0; j < state.value[i].audioList.length; j++) {
                    if (state.value[i].audioList[j].id === audioObj.payload.id) {
                        state.value[i].audioList[j].name = audioObj.payload.newName;
                    }
                }
            }
        }
    }
})

export const { addPlaylist, setPlaylists, removeFromPlaylists, editNameInPlaylists } = playlistsSlice.actions

export default playlistsSlice.reducer