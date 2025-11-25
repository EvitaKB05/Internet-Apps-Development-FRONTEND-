// src/services/api.ts
import type {
	PvlcMedFormula,
	PvlcMedFormulaFilter,
	CartIconResponse,
} from '../types'
import { FORMULAS_MOCK } from '../mock/data'
import { getApiBase, getMinioBase, getIsTauri } from '../target_config'
import { api } from '../api'

// ИСПРАВЛЕНИЕ: Создаем интерфейс для конфигурации API
interface ApiConfig {
	baseURL: string
	securityWorker?: () => { headers: { Authorization: string } }
}

// Интерфейсы для ответов API
interface ApiResponse<T> {
	data?: T
}

interface ApiFormulaResponse {
	id?: number
	title?: string
	description?: string
	formula?: string
	image_url?: string
	category?: string
	gender?: string
	min_age?: number
	max_age?: number
	is_active?: boolean
}

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
		return localStorage.getItem('med_token')
	}

	// ИСПРАВЛЕНИЕ: Правильное создание авторизованного API инстанса
	private getAuthorizedApi() {
		const token = this.getAuthToken()
		const config: ApiConfig = {
			baseURL: this.getApiBase(),
		}

		// Добавляем заголовок авторизации если токен есть
		if (token) {
			// Создаем новый инстанс API с заголовками
			return new (api.constructor as new (config: ApiConfig) => typeof api)({
				...config,
				securityWorker: () => {
					return {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				},
			})
		}

		return new (api.constructor as new (config: ApiConfig) => typeof api)(
			config
		)
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
			// ИСПРАВЛЕНИЕ: Проверяем доступность бэкенда через публичный эндпоинт
			const testApi = new (api.constructor as new (
				config: ApiConfig
			) => typeof api)({
				baseURL: this.getApiBase(),
			})

			const response = await testApi.api.pvlcMedFormulasList()

			if (response.status !== 200) {
				throw new Error('Backend not available')
			}

			this.useMock = false
			console.log('Backend connected successfully')
		} catch (error) {
			this.useMock = true
			console.warn('Backend not available, using mock data:', error)
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

	// ИСПРАВЛЕНИЕ: Корзина должна возвращать 200 даже для неавторизованных
	async getCartIcon(): Promise<CartIconResponse> {
		await this.ensureBackendChecked()

		if (this.useMock) {
			return {
				med_card_id: 0,
				med_item_count: 0,
			}
		}

		try {
			const token = this.getAuthToken()

			// ИСПРАВЛЕНИЕ: Создаем API инстанс в зависимости от авторизации
			let apiInstance
			if (token) {
				apiInstance = this.getAuthorizedApi()
			} else {
				apiInstance = new (api.constructor as new (
					config: ApiConfig
				) => typeof api)({
					baseURL: this.getApiBase(),
				})
			}

			const response = await apiInstance.api.medCardIconList()

			// ИСПРАВЛЕНИЕ: Преобразуем данные API в наш тип
			const apiData = response.data
			const cartData: CartIconResponse = {
				med_card_id: apiData.med_card_id || 0,
				med_item_count: apiData.med_item_count || 0,
			}
			return cartData
		} catch (error) {
			console.error('Error fetching cart icon:', error)
			// ИСПРАВЛЕНИЕ: Возвращаем данные по умолчанию вместо ошибки
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
			const apiInstance = new (api.constructor as new (
				config: ApiConfig
			) => typeof api)({
				baseURL: this.getApiBase(),
			})

			const params: {
				category?: string
				gender?: string
				min_age?: number
				max_age?: number
				active?: boolean
			} = {}

			if (filter?.category) params.category = filter.category
			if (filter?.gender) params.gender = filter.gender
			if (filter?.min_age) params.min_age = filter.min_age
			if (filter?.max_age) params.max_age = filter.max_age
			if (filter?.active !== undefined) params.active = filter.active

			const response = await apiInstance.api.pvlcMedFormulasList(params)

			// ИСПРАВЛЕНИЕ: Правильная обработка ответа API с типизацией
			const apiData = response.data as unknown as
				| ApiResponse<ApiFormulaResponse[]>
				| ApiFormulaResponse[]

			// Проверяем формат ответа - может быть data.data или просто data
			let apiFormulas: ApiFormulaResponse[] = []

			if (apiData && typeof apiData === 'object') {
				if (Array.isArray(apiData)) {
					// Если ответ - массив формул
					apiFormulas = apiData
				} else if ('data' in apiData && Array.isArray(apiData.data)) {
					// Если ответ { data: [...] }
					apiFormulas = apiData.data
				} else {
					console.warn('Unexpected API response format:', apiData)
					apiFormulas = []
				}
			}

			const formulas: PvlcMedFormula[] = apiFormulas.map(apiFormula => ({
				id: apiFormula.id || 0,
				title: apiFormula.title || '',
				description: apiFormula.description || '',
				formula: apiFormula.formula || '',
				image_url: apiFormula.image_url || '',
				category: apiFormula.category || '',
				gender: apiFormula.gender || '',
				min_age: apiFormula.min_age || 0,
				max_age: apiFormula.max_age || 0,
				is_active: apiFormula.is_active || false,
			}))

			return formulas
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
			const apiInstance = new (api.constructor as new (
				config: ApiConfig
			) => typeof api)({
				baseURL: this.getApiBase(),
			})

			const response = await apiInstance.api.pvlcMedFormulasDetail(id)

			// ИСПРАВЛЕНИЕ: Преобразуем данные API в наш тип с правильной типизацией
			const apiData = response.data as unknown as
				| ApiResponse<ApiFormulaResponse>
				| ApiFormulaResponse

			let apiFormula: ApiFormulaResponse | undefined

			// Проверяем формат ответа
			if (apiData && typeof apiData === 'object') {
				if ('data' in apiData && apiData.data) {
					// Если ответ { data: {...} }
					apiFormula = apiData.data
				} else if ('id' in apiData) {
					// Если ответ напрямую формула
					apiFormula = apiData as ApiFormulaResponse
				}
			}

			if (!apiFormula) return null

			const formula: PvlcMedFormula = {
				id: apiFormula.id || 0,
				title: apiFormula.title || '',
				description: apiFormula.description || '',
				formula: apiFormula.formula || '',
				image_url: apiFormula.image_url || '',
				category: apiFormula.category || '',
				gender: apiFormula.gender || '',
				min_age: apiFormula.min_age || 0,
				max_age: apiFormula.max_age || 0,
				is_active: apiFormula.is_active || false,
			}

			return formula
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
