import { configureStore } from '@reduxjs/toolkit'
import queueReducer from './slices/queueSlice'
import queueIndexReducer from './slices/queueIndexSlice'
import playbackSpeedReducer from './slices/playbackSpeedSlice'
import maintainPitchSlice from './slices/maintainPitchSlice'

export default configureStore({
  reducer: {
    queue: queueReducer,
    queueIndex: queueIndexReducer,
    playbackSpeed: playbackSpeedReducer,
    maintainPitch: maintainPitchSlice
  }
})