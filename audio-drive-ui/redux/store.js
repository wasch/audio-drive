import { configureStore } from '@reduxjs/toolkit'
import queueReducer from './slices/queueSlice'

export default configureStore({
  reducer: {
    queue: queueReducer
  }
})