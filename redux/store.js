import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import audioReducer from './slices/audioSlice'
import queueReducer from './slices/queueSlice'
import queueIndexReducer from './slices/queueIndexSlice'
import playbackSpeedReducer from './slices/playbackSpeedSlice'
import maintainPitchReducer from './slices/maintainPitchSlice'
import playlistsReducer from './slices/playlistsSlice'
import currentTimeReducer from './slices/currentTimeSlice'

export default configureStore({
  reducer: {
    user: userReducer,
    audio: audioReducer,
    queue: queueReducer,
    queueIndex: queueIndexReducer,
    playbackSpeed: playbackSpeedReducer,
    maintainPitch: maintainPitchReducer,
    playlists: playlistsReducer,
    currentTime: currentTimeReducer
  }
});