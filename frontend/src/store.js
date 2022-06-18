import { configureStore } from '@reduxjs/toolkit'

import isOpen from './redux/reducers/isOpen'
import apiData from './redux/reducers/apiData'

export const store = configureStore({
  reducer: {
    isOpen,
    apiData
  }
})
