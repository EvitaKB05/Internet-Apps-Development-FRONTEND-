// src/store/slices/medCartSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../api' // ИСПРАВЛЕН ПУТЬ

interface MedCalculation {
	pvlc_med_formula_id: number
	title: string
	description: string
	formula: string
	image_url: string
	input_height: number
	final_result: number
}

interface MedCartState {
	cartId: number | null
	itemCount: number
	calculations: MedCalculation[]
	loading: boolean
	error: string | null
}

const initialState: MedCartState = {
	cartId: null,
	itemCount: 0,
	calculations: [],
	loading: false,
	error: null,
}

// ИСПРАВЛЕНИЕ: Асинхронное действие для получения иконки корзины (работает для всех пользователей)
export const getCartIcon = createAsyncThunk('medCart/getCartIcon', async () => {
	// ИСПРАВЛЕНИЕ: Убрали неиспользуемые параметры
	try {
		// ИСПРАВЛЕНИЕ: Правильный вызов API метода без авторизации
		const response = await api.api.medCardIconList()
		return response.data
	} catch {
		// ИСПРАВЛЕНИЕ: Возвращаем данные по умолчанию вместо ошибки
		console.warn('Cart icon request failed, using default values')
		return {
			med_card_id: 0,
			med_item_count: 0,
		}
	}
})

// Асинхронное действие для добавления формулы в корзину
export const addToCart = createAsyncThunk(
	'medCart/addToCart',
	async (formulaId: number, { rejectWithValue }) => {
		try {
			// ИСПРАВЛЕНИЕ: Правильный вызов API метода
			const response = await api.api.pvlcMedFormulasAddToCartCreate(formulaId)
			return response.data
		} catch (error: unknown) {
			// ИСПРАВЛЕНИЕ: Правильная обработка ошибок
			const errorMessage =
				error instanceof Error ? error.message : 'Ошибка добавления в корзину'
			return rejectWithValue(errorMessage)
		}
	}
)

const medCartSlice = createSlice({
	name: 'medCart',
	initialState,
	reducers: {
		clearError: state => {
			state.error = null
		},
		clearCart: state => {
			state.cartId = null
			state.itemCount = 0
			state.calculations = []
		},
	},
	extraReducers: builder => {
		builder
			// Получение иконки корзины
			.addCase(getCartIcon.pending, state => {
				state.loading = true
			})
			.addCase(getCartIcon.fulfilled, (state, action) => {
				state.loading = false
				state.cartId = action.payload.med_card_id || null
				state.itemCount = action.payload.med_item_count || 0
				state.error = null
			})
			.addCase(getCartIcon.rejected, state => {
				// ИСПРАВЛЕНИЕ: Убрали неиспользуемый action
				state.loading = false
				// ИСПРАВЛЕНИЕ: Устанавливаем значения по умолчанию вместо ошибки
				state.cartId = 0
				state.itemCount = 0
				state.error = null
			})
			// Добавление в корзину
			.addCase(addToCart.fulfilled, state => {
				state.itemCount += 1
				state.error = null
			})
			.addCase(addToCart.rejected, (state, action) => {
				state.error = action.payload as string
			})
	},
})

export const { clearError, clearCart } = medCartSlice.actions
export default medCartSlice.reducer
