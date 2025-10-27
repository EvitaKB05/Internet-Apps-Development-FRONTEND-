import type { PvlcMedFormula, PvlcMedFormulaFilter } from '../types'
import { FORMULAS_MOCK } from '../mock/data'

const API_BASE = '/api'

class ApiService {
	private useMock = false
	private backendChecked = false

	constructor() {
		// Не проверяем сразу, а отложим до первого вызова
	}

	private async ensureBackendChecked(): Promise<void> {
		if (this.backendChecked) return

		try {
			// Проверяем доступность именно того endpoint, который будем использовать
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
		} finally {
			this.backendChecked = true
		}
	}

	async getFormulas(filter?: PvlcMedFormulaFilter): Promise<PvlcMedFormula[]> {
		// Проверяем доступность бэкенда при первом вызове
		await this.ensureBackendChecked()

		if (this.useMock) {
			console.log('Using mock data for getFormulas')
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

		// Только если useMock = false, делаем реальный запрос
		try {
			const params = new URLSearchParams()
			if (filter?.category) params.append('category', filter.category)
			if (filter?.gender) params.append('gender', filter.gender)
			if (filter?.min_age) params.append('min_age', filter.min_age.toString())
			if (filter?.max_age) params.append('max_age', filter.max_age.toString())
			if (filter?.active !== undefined)
				params.append('active', filter.active.toString())

			const response = await fetch(`${API_BASE}/pvlc-med-formulas?${params}`, {
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
			// При ошибке переключаемся на mock данные
			this.useMock = true
			// Возвращаем mock данные
			return this.getFormulas(filter)
		}
	}

	async getFormulaById(id: number): Promise<PvlcMedFormula | null> {
		// Проверяем доступность бэкенда при первом вызове
		await this.ensureBackendChecked()

		if (this.useMock) {
			console.log('Using mock data for getFormulaById')
			return FORMULAS_MOCK.find(formula => formula.id === id) || null
		}

		// Только если useMock = false, делаем реальный запрос
		try {
			const response = await fetch(`${API_BASE}/pvlc-med-formulas/${id}`, {
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
			// При ошибке переключаемся на mock данные
			this.useMock = true
			// Возвращаем mock данные
			return this.getFormulaById(id)
		}
	}

	async getCategories(): Promise<string[]> {
		// Проверяем доступность бэкенда при первом вызове
		await this.ensureBackendChecked()

		if (this.useMock) {
			// Используем mock данные напрямую
			const categories = [...new Set(FORMULAS_MOCK.map(f => f.category))]
			return categories
		}

		try {
			// Получаем категории из бэкенда
			const formulas = await this.getFormulas()
			const categories = [...new Set(formulas.map(f => f.category))]
			return categories
		} catch (error) {
			console.error('Error getting categories:', error)
			// При ошибке возвращаем категории из mock данных
			const categories = [...new Set(FORMULAS_MOCK.map(f => f.category))]
			return categories
		}
	}

	async getGenders(): Promise<string[]> {
		// Проверяем доступность бэкенда при первом вызове
		await this.ensureBackendChecked()

		if (this.useMock) {
			// Используем mock данные напрямую
			const genders = [...new Set(FORMULAS_MOCK.map(f => f.gender))]
			return genders
		}

		try {
			// Получаем полы из бэкенда
			const formulas = await this.getFormulas()
			const genders = [...new Set(formulas.map(f => f.gender))]
			return genders
		} catch (error) {
			console.error('Error getting genders:', error)
			// При ошибке возвращаем полы из mock данных
			const genders = [...new Set(FORMULAS_MOCK.map(f => f.gender))]
			return genders
		}
	}
}

export const apiService = new ApiService()
