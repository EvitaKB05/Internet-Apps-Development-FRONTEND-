// src/services/api.ts
import type {
	PvlcMedFormula,
	PvlcMedFormulaFilter,
	CartIconResponse,
} from '../types'
import { FORMULAS_MOCK } from '../mock/data'
import { getApiBase, getMinioBase, getIsTauri } from '../target_config'
import { api } from '../api'

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

// Интерфейс для деталей заявки
interface MedCardDetail {
	id: number
	status: string
	patient_name: string
	doctor_name: string
	total_result: number
	created_at: string
	finalized_at?: string
	completed_at?: string
	med_calculations: Array<{
		pvlc_med_formula_id: number
		title: string
		description: string
		formula: string
		image_url: string
		input_height: number
		final_result: number
	}>
}

// Интерфейс для ответа регистрации
interface RegisterResponse {
	message: string
	user_id: number
}

// Интерфейс для security worker
interface SecurityHeaders {
	headers: {
		Authorization: string
	}
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

		// Создаем новый инстанс API с заголовками авторизации
		const ApiClass = api.constructor as new (config: {
			baseURL: string
			securityWorker?: (
				securityData: unknown | null
			) => Promise<SecurityHeaders> | SecurityHeaders
		}) => typeof api

		return new ApiClass({
			baseURL: this.getApiBase(),
			securityWorker: (): SecurityHeaders => {
				if (token) {
					return {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				}
				// Возвращаем пустые заголовки если токена нет
				return {
					headers: {
						Authorization: '',
					},
				}
			},
		})
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
			// Проверяем доступность бэкенда через публичный эндпоинт
			const testApi = this.getAuthorizedApi()
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
			const apiInstance = this.getAuthorizedApi()
			const response = await apiInstance.api.medCardIconList()

			// Преобразуем данные API в наш тип
			const apiData = response.data
			const cartData: CartIconResponse = {
				med_card_id: apiData.med_card_id || 0,
				med_item_count: apiData.med_item_count || 0,
			}
			return cartData
		} catch (error) {
			console.error('Error fetching cart icon:', error)
			// Возвращаем данные по умолчанию вместо ошибки
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
			const apiInstance = this.getAuthorizedApi()

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

			// Правильная обработка ответа API с типизацией
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
			const apiInstance = this.getAuthorizedApi()
			const response = await apiInstance.api.pvlcMedFormulasDetail(id)

			// Преобразуем данные API в наш тип с правильной типизацией
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

	// ИСПРАВЛЕНИЕ: Добавляем метод для добавления в корзину
	async addToCart(
		formulaId: number
	): Promise<{ message: string; med_card_id: number }> {
		await this.ensureBackendChecked()

		if (this.useMock) {
			return {
				message: 'пациент добавлен в мед-карту',
				med_card_id: 1,
			}
		}

		try {
			const apiInstance = this.getAuthorizedApi()
			const response = await apiInstance.api.pvlcMedFormulasAddToCartCreate(
				formulaId
			)

			return response.data as { message: string; med_card_id: number }
		} catch (error) {
			console.error('Error adding to cart:', error)
			throw error
		}
	}

	// ИСПРАВЛЕНИЕ: Добавляем метод для получения деталей заявки
	async getMedCard(id: number): Promise<MedCardDetail> {
		await this.ensureBackendChecked()

		if (this.useMock) {
			// Мок данные для заявки
			return {
				id: id,
				status: 'черновик',
				patient_name: 'Иванов Иван',
				doctor_name: 'Петрова А.С.',
				total_result: 0,
				created_at: new Date().toISOString(),
				med_calculations: [],
			}
		}

		try {
			const apiInstance = this.getAuthorizedApi()
			const response = await apiInstance.api.pvlcMedCardsDetail(id)
			return response.data as MedCardDetail
		} catch (error) {
			console.error('Error fetching med card:', error)
			throw error
		}
	}

	// ИСПРАВЛЕНИЕ: Добавляем метод для удаления формулы из заявки
	// ИСПРАВЛЕНИЕ: Используем правильный метод API - медикаменты удаляются через DELETE /med-mm-pvlc-calculations
	async deleteCalculation(cardId: number, formulaId: number): Promise<void> {
		await this.ensureBackendChecked()

		if (this.useMock) {
			return
		}

		try {
			const apiInstance = this.getAuthorizedApi()
			// ИСПРАВЛЕНИЕ: Используем правильный метод API для удаления расчета
			// В сгенерированном API нет отдельного метода, используем общий подход
			// Создаем запрос вручную через instance
			await apiInstance.instance.delete('/api/med-mm-pvlc-calculations', {
				data: {
					card_id: cardId,
					pvlc_med_formula_id: formulaId,
				},
			})
		} catch (error) {
			console.error('Error deleting calculation:', error)
			throw error
		}
	}

	// ИСПРАВЛЕНИЕ: Добавляем метод для обновления заявки
	async updateMedCard(
		id: number,
		data: { patient_name?: string; doctor_name?: string }
	): Promise<void> {
		await this.ensureBackendChecked()

		if (this.useMock) {
			return
		}

		try {
			const apiInstance = this.getAuthorizedApi()
			await apiInstance.api.pvlcMedCardsUpdate(id, data)
		} catch (error) {
			console.error('Error updating med card:', error)
			throw error
		}
	}

	// ИСПРАВЛЕНИЕ: Добавляем метод для формирования заявки
	async finalizeMedCard(id: number): Promise<void> {
		await this.ensureBackendChecked()

		if (this.useMock) {
			return
		}

		try {
			const apiInstance = this.getAuthorizedApi()
			await apiInstance.api.pvlcMedCardsFormUpdate(id)
		} catch (error) {
			console.error('Error finalizing med card:', error)
			throw error
		}
	}

	// ИСПРАВЛЕНИЕ: Добавляем метод для удаления заявки
	async deleteMedCard(id: number): Promise<void> {
		await this.ensureBackendChecked()

		if (this.useMock) {
			return
		}

		try {
			const apiInstance = this.getAuthorizedApi()
			await apiInstance.api.pvlcMedCardsDelete(id)
		} catch (error) {
			console.error('Error deleting med card:', error)
			throw error
		}
	}

	// ИСПРАВЛЕНИЕ: Добавляем метод для регистрации пользователя
	async registerUser(userData: {
		login: string
		password: string
		is_moderator: boolean
	}): Promise<RegisterResponse> {
		await this.ensureBackendChecked()

		if (this.useMock) {
			return {
				message: 'Пользователь успешно зарегистрирован',
				user_id: Date.now(),
			}
		}

		try {
			const apiInstance = this.getAuthorizedApi()
			// ИСПРАВЛЕНИЕ: Используем правильный метод API для регистрации
			// В сгенерированном API нет метода register, используем общий подход
			// Создаем запрос вручную через instance
			const response = await apiInstance.instance.post(
				'/api/med-users/register',
				userData
			)
			return response.data as RegisterResponse
		} catch (error) {
			console.error('Error registering user:', error)
			throw error
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
