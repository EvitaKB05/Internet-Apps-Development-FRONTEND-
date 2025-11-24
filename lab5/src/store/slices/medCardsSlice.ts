// src/store/slices/medCardsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../api'

// ИСПРАВЛЕНИЕ: Синхронизируем типы с DsPvlcMedCardResponse из API
interface PvlcMedCard {
	id: number
	status: string
	patient_name: string
	doctor_name: string
	total_result: number
	created_at: string
	finalized_at?: string
	completed_at?: string
}

interface MedCardsState {
	cards: PvlcMedCard[]
	loading: boolean
	error: string | null
}

const initialState: MedCardsState = {
	cards: [],
	loading: false,
	error: null,
}

// Асинхронное действие для получения списка заявок
export const getMedCards = createAsyncThunk(
	'medCards/getMedCards',
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.api.pvlcMedCardsList()
			// ИСПРАВЛЕНИЕ: Преобразуем данные API в наш тип
			const apiCards = response.data
			const cards: PvlcMedCard[] = apiCards.map(card => ({
				id: card.id || 0, // Задаем значение по умолчанию для id
				status: card.status || '',
				patient_name: card.patient_name || '',
				doctor_name: card.doctor_name || '',
				total_result: card.total_result || 0,
				created_at: card.created_at || new Date().toISOString(),
				finalized_at: card.finalized_at,
				completed_at: card.completed_at,
			}))
			return cards
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Ошибка загрузки заявок'
			return rejectWithValue(errorMessage)
		}
	}
)

const medCardsSlice = createSlice({
	name: 'medCards',
	initialState,
	reducers: {
		clearError: state => {
			state.error = null
		},
	},
	extraReducers: builder => {
		builder
			.addCase(getMedCards.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(getMedCards.fulfilled, (state, action) => {
				state.loading = false
				state.cards = action.payload
				state.error = null
			})
			.addCase(getMedCards.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload as string
			})
	},
})

export const { clearError } = medCardsSlice.actions
export default medCardsSlice.reducer
