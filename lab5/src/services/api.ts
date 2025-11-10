import type {
	PvlcMedFormula,
	PvlcMedFormulaFilter,
	CartIconResponse,
} from '../types'
import { FORMULAS_MOCK } from '../mock/data'
import { getApiBase, getMinioBase, getIsTauri } from '../target_config'

class ApiService {
	private useMock = false
	private backendChecked = false

	// Используем конфигурацию из target_config
	private getApiBase(): string {
		return getApiBase()
	}

	private getMinioBase(): string {
		return getMinioBase()
	}

	private getAuthToken(): string | null {
		return localStorage.getItem('moderator_token')
	}

	private async ensureBackendChecked(): Promise<void> {
		if (this.backendChecked) return

		// Для Tauri используем реальный бэкенд
		if (getIsTauri()) {
			this.useMock = false
			this.backendChecked = true
			console.log('Tauri environment, using direct backend connection')
			return
		}

		// Для GitHub Pages используем моки
		if (window.location.hostname.includes('github.io')) {
			this.useMock = true
			this.backendChecked = true
			console.log('GitHub Pages environment, using mock data')
			return
		}

		try {
			const response = await fetch(
				`${this.getApiBase()}/pvlc-med-formulas?limit=1`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			)

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

	getImageUrl(imagePath: string | null): string {
		if (!imagePath || this.useMock) {
			return './DefaultImage.jpg'
		}
		return `${this.getMinioBase()}/${imagePath}`
	}

	isUsingMock(): boolean {
		return this.useMock
	}

	async getCartIcon(): Promise<CartIconResponse> {
		await this.ensureBackendChecked()

		if (this.useMock) {
			return {
				med_card_id: 1,
				med_item_count: 3,
			}
		}

		try {
			const token = this.getAuthToken()

			const headers: Record<string, string> = {
				'Content-Type': 'application/json',
			}

			if (token) {
				headers['Authorization'] = `Bearer ${token}`
			}

			const response = await fetch(`${this.getApiBase()}/med_card/icon`, {
				method: 'GET',
				headers,
			})

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`)
			}

			const data = await response.json()
			return data.data || data
		} catch (error) {
			console.error('Error fetching cart icon:', error)
			return {
				med_card_id: 0,
				med_item_count: 0,
			}
		}
	}

	async getFormulas(filter?: PvlcMedFormulaFilter): Promise<PvlcMedFormula[]> {
		await this.ensureBackendChecked()

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

			if (filter?.min_age !== undefined) {
				filteredFormulas = filteredFormulas.filter(
					f => f.min_age >= filter.min_age!
				)
			}

			if (filter?.max_age !== undefined) {
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

			const response = await fetch(
				`${this.getApiBase()}/pvlc-med-formulas?${params}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			)

			if (!response.ok) {
				throw new Error('Failed to fetch formulas')
			}

			const data = await response.json()
			return data.data || []
		} catch (error) {
			console.error('Error fetching formulas:', error)
			this.useMock = true
			return this.getFormulas(filter)
		}
	}

	async getFormulaById(id: number): Promise<PvlcMedFormula | null> {
		await this.ensureBackendChecked()

		if (this.useMock) {
			return FORMULAS_MOCK.find(formula => formula.id === id) || null
		}

		try {
			const response = await fetch(
				`${this.getApiBase()}/pvlc-med-formulas/${id}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			)

			if (!response.ok) {
				throw new Error('Failed to fetch formula')
			}

			const data = await response.json()
			return data.data || null
		} catch (error) {
			console.error('Error fetching formula:', error)
			this.useMock = true
			return this.getFormulaById(id)
		}
	}

	async getCategories(): Promise<string[]> {
		await this.ensureBackendChecked()

		if (this.useMock) {
			const categories = [...new Set(FORMULAS_MOCK.map(f => f.category))]
			return categories
		}

		try {
			const formulas = await this.getFormulas()
			const categories = [...new Set(formulas.map(f => f.category))]
			return categories
		} catch (error) {
			console.error('Error getting categories:', error)
			const categories = [...new Set(FORMULAS_MOCK.map(f => f.category))]
			return categories
		}
	}

	async getGenders(): Promise<string[]> {
		await this.ensureBackendChecked()

		if (this.useMock) {
			const genders = [...new Set(FORMULAS_MOCK.map(f => f.gender))]
			return genders
		}

		try {
			const formulas = await this.getFormulas()
			const genders = [...new Set(formulas.map(f => f.gender))]
			return genders
		} catch (error) {
			console.error('Error getting genders:', error)
			const genders = [...new Set(FORMULAS_MOCK.map(f => f.gender))]
			return genders
		}
	}
}

export const apiService = new ApiService()
