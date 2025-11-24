// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import filterReducer from './slices/filterSlice'
import authReducer from './slices/authSlice' // НОВЫЙ СЛАЙС
import medCardsReducer from './slices/medCardsSlice' // НОВЫЙ СЛАЙС
import medCartReducer from './slices/medCartSlice' // НОВЫЙ СЛАЙС

export const store = configureStore({
	reducer: {
		filters: filterReducer,
		auth: authReducer, // ДОБАВЛЕНО
		medCards: medCardsReducer, // ДОБАВЛЕНО
		medCart: medCartReducer, // ДОБАВЛЕНО
	},
})

// Экспортируем типы
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
