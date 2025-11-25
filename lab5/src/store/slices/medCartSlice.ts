// src/store/slices/medCartSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiService } from '../../services/api'

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

// ИСПРАВЛЕНИЕ: Асинхронное действие для получения иконки корзины
export const getCartIcon = createAsyncThunk(
	'medCart/getCartIcon',
	async (_, { rejectWithValue }) => {
		try {
			const response = await apiService.getCartIcon()
			return response
		} catch (error) {
			console.error('Error fetching cart icon:', error)
			return rejectWithValue('Ошибка загрузки корзины')
		}
	}
)

// ИСПРАВЛЕНИЕ: Асинхронное действие для добавления формулы в корзину
export const addToCart = createAsyncThunk(
	'medCart/addToCart',
	async (formulaId: number, { rejectWithValue }) => {
		try {
			const response = await apiService.addToCart(formulaId)
			return response
		} catch (error: unknown) {
			console.error('Error adding to cart:', error)
			const errorMessage =
				error instanceof Error ? error.message : 'Ошибка добавления в корзину'
			return rejectWithValue(errorMessage)
		}
	}
)

// ИСПРАВЛЕНИЕ: Добавляем действие для загрузки деталей заявки
export const getMedCardDetails = createAsyncThunk(
	'medCart/getMedCardDetails',
	async (cardId: number, { rejectWithValue }) => {
		try {
			const response = await apiService.getMedCard(cardId)
			return response
		} catch (error: unknown) {
			console.error('Error fetching med card details:', error)
			const errorMessage =
				error instanceof Error ? error.message : 'Ошибка загрузки заявки'
			return rejectWithValue(errorMessage)
		}
	}
)

// ИСПРАВЛЕНИЕ: Добавляем действие для удаления расчета из заявки
export const deleteCalculation = createAsyncThunk(
	'medCart/deleteCalculation',
	async (
		{ cardId, formulaId }: { cardId: number; formulaId: number },
		{ rejectWithValue }
	) => {
		try {
			await apiService.deleteCalculation(cardId, formulaId)
			return { formulaId }
		} catch (error: unknown) {
			console.error('Error deleting calculation:', error)
			const errorMessage =
				error instanceof Error ? error.message : 'Ошибка удаления расчета'
			return rejectWithValue(errorMessage)
		}
	}
)

// ИСПРАВЛЕНИЕ: Добавляем действие для обновления заявки
export const updateMedCard = createAsyncThunk(
	'medCart/updateMedCard',
	async (
		{
			cardId,
			data,
		}: {
			cardId: number
			data: { patient_name?: string; doctor_name?: string }
		},
		{ rejectWithValue }
	) => {
		try {
			await apiService.updateMedCard(cardId, data)
			return data
		} catch (error: unknown) {
			console.error('Error updating med card:', error)
			const errorMessage =
				error instanceof Error ? error.message : 'Ошибка обновления заявки'
			return rejectWithValue(errorMessage)
		}
	}
)

// ИСПРАВЛЕНИЕ: Добавляем действие для формирования заявки
export const finalizeMedCard = createAsyncThunk(
	'medCart/finalizeMedCard',
	async (cardId: number, { rejectWithValue }) => {
		try {
			await apiService.finalizeMedCard(cardId)
			return cardId
		} catch (error: unknown) {
			console.error('Error finalizing med card:', error)
			const errorMessage =
				error instanceof Error ? error.message : 'Ошибка формирования заявки'
			return rejectWithValue(errorMessage)
		}
	}
)

// ИСПРАВЛЕНИЕ: Добавляем действие для удаления заявки
export const deleteMedCard = createAsyncThunk(
	'medCart/deleteMedCard',
	async (cardId: number, { rejectWithValue }) => {
		try {
			await apiService.deleteMedCard(cardId)
			return cardId
		} catch (error: unknown) {
			console.error('Error deleting med card:', error)
			const errorMessage =
				error instanceof Error ? error.message : 'Ошибка удаления заявки'
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
			.addCase(getCartIcon.rejected, (state, action) => {
				state.loading = false
				state.cartId = null
				state.itemCount = 0
				state.error = action.payload as string
			})
			// Добавление в корзину
			.addCase(addToCart.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(addToCart.fulfilled, (state, action) => {
				state.loading = false
				state.cartId = action.payload.med_card_id
				state.itemCount += 1
				state.error = null
			})
			.addCase(addToCart.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload as string
			})
			// Получение деталей заявки
			.addCase(getMedCardDetails.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(getMedCardDetails.fulfilled, (state, action) => {
				state.loading = false
				state.cartId = action.payload.id
				state.calculations = action.payload.med_calculations || []
				state.error = null
			})
			.addCase(getMedCardDetails.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload as string
			})
			// Удаление расчета
			.addCase(deleteCalculation.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(deleteCalculation.fulfilled, (state, action) => {
				state.loading = false
				state.calculations = state.calculations.filter(
					calc => calc.pvlc_med_formula_id !== action.payload.formulaId
				)
				state.itemCount = Math.max(0, state.itemCount - 1)
				state.error = null
			})
			.addCase(deleteCalculation.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload as string
			})
			// Обновление заявки
			.addCase(updateMedCard.fulfilled, state => {
				state.error = null
			})
			.addCase(updateMedCard.rejected, (state, action) => {
				state.error = action.payload as string
			})
			// Формирование заявки
			.addCase(finalizeMedCard.fulfilled, state => {
				state.error = null
			})
			.addCase(finalizeMedCard.rejected, (state, action) => {
				state.error = action.payload as string
			})
			// Удаление заявки
			.addCase(deleteMedCard.fulfilled, state => {
				state.cartId = null
				state.itemCount = 0
				state.calculations = []
				state.error = null
			})
			.addCase(deleteMedCard.rejected, (state, action) => {
				state.error = action.payload as string
			})
	},
})

export const { clearError, clearCart } = medCartSlice.actions
export default medCartSlice.reducer
