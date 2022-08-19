import { configureStore } from '@reduxjs/toolkit'
import queueReducer from './slices/queueSlice'
import queueIndexReducer from './slices/queueIndexSlice'

export default configureStore({
  reducer: {
    queue: queueReducer,
    queueIndex: queueIndexReducer
  }
})