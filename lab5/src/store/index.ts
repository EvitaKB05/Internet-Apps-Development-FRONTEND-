import { configureStore } from '@reduxjs/toolkit'
import filterReducer from './slices/filterSlice'

export const store = configureStore({
	reducer: {
		filters: filterReducer,
	},
})

// Экспортируем типы
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
