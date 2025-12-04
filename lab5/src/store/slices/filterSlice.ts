//src/slices/filterSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { PvlcMedFormulaFilter } from '../../types'

interface FilterState {
	filter: PvlcMedFormulaFilter
	searchTerm: string
}

const initialState: FilterState = {
	filter: {
		category: undefined,
		gender: undefined,
		min_age: undefined,
		max_age: undefined,
		active: undefined,
	},
	searchTerm: '',
}

const filterSlice = createSlice({
	name: 'filters',
	initialState,
	reducers: {
		setFilter: (state, action: PayloadAction<PvlcMedFormulaFilter>) => {
			state.filter = { ...state.filter, ...action.payload }
		},
		setSearchTerm: (state, action: PayloadAction<string>) => {
			state.searchTerm = action.payload
		},
		resetFilters: state => {
			state.filter = initialState.filter
			state.searchTerm = ''
		},
	},
})

export const { setFilter, setSearchTerm, resetFilters } = filterSlice.actions
export default filterSlice.reducer
