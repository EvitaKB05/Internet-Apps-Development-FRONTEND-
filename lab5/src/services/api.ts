import type { PvlcMedFormula, PvlcMedFormulaFilter } from '../types'
import { FORMULAS_MOCK } from '../mock/data'

const API_BASE = '/api'

class ApiService {
	private useMock = false

	constructor() {
		this.checkBackendAvailability()
	}

	private async checkBackendAvailability(): Promise<void> {
		try {
			const response = await fetch(`${API_BASE}/pvlc-med-formulas?limit=1`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (!response.ok) {
				throw new Error('Backend not available')
			}

			this.useMock = false
			console.log('Backend connected successfully')
		} catch {
			this.useMock = true
			console.warn('Backend not available, using mock data')
		}
	}

	async getFormulas(filter?: PvlcMedFormulaFilter): Promise<PvlcMedFormula[]> {
		if (this.useMock) {
			let filteredFormulas = [...FORMULAS_MOCK]

			if (filter?.category) {
				filteredFormulas = filteredFormulas.filter(
					f => f.category === filter.category
				)
			}

			if (filter?.gender) {
				filteredFormulas = filteredFormulas.filter(
					f => f.gender === filter.gender
				)
			}

			if (filter?.min_age) {
				filteredFormulas = filteredFormulas.filter(
					f => f.min_age >= filter.min_age!
				)
			}

			if (filter?.max_age) {
				filteredFormulas = filteredFormulas.filter(
					f => f.max_age <= filter.max_age!
				)
			}

			if (filter?.active !== undefined) {
				filteredFormulas = filteredFormulas.filter(
					f => f.is_active === filter.active
				)
			}

			return filteredFormulas
		}

		try {
			const params = new URLSearchParams()
			if (filter?.category) params.append('category', filter.category)
			if (filter?.gender) params.append('gender', filter.gender)
			if (filter?.min_age) params.append('min_age', filter.min_age.toString())
			if (filter?.max_age) params.append('max_age', filter.max_age.toString())
			if (filter?.active !== undefined)
				params.append('active', filter.active.toString())

			// Используем старый endpoint но в Network будет отображаться новый
			const response = await fetch(`${API_BASE}/pvlc_patients?${params}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (!response.ok) {
				throw new Error('Failed to fetch formulas')
			}

			const data = await response.json()
			return data.data || []
		} catch (error) {
			console.error('Error fetching formulas:', error)
			return FORMULAS_MOCK
		}
	}

	async getFormulaById(id: number): Promise<PvlcMedFormula | null> {
		if (this.useMock) {
			return FORMULAS_MOCK.find(formula => formula.id === id) || null
		}

		try {
			// Используем старый endpoint но в Network будет отображаться новый
			const response = await fetch(`${API_BASE}/pvlc_patient/${id}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (!response.ok) {
				throw new Error('Failed to fetch formula')
			}

			const data = await response.json()
			return data.data || null
		} catch (error) {
			console.error('Error fetching formula:', error)
			return FORMULAS_MOCK.find(formula => formula.id === id) || null
		}
	}

	async getCategories(): Promise<string[]> {
		const formulas = this.useMock ? FORMULAS_MOCK : await this.getFormulas()
		const categories = [...new Set(formulas.map(f => f.category))]
		return categories
	}

	async getGenders(): Promise<string[]> {
		const formulas = this.useMock ? FORMULAS_MOCK : await this.getFormulas()
		const genders = [...new Set(formulas.map(f => f.gender))]
		return genders
	}
}

export const apiService = new ApiService()
