// src/services/api.ts
import { api, createAuthorizedApi } from '../api'
import type {
	ApiLoginRequest,
	DsCartIconResponse,
	DsPvlcMedCardResponse,
	DsPvlcMedFormulaResponse,
	DsMedUserResponse,
} from '../api/Api'

// Интерфейс для обновления заявки
interface UpdateMedCardRequest {
	patient_name?: string
	doctor_name?: string
}

// Интерфейс для ответа добавления в корзину
interface AddToCartResponse {
	message: string
	med_card_id: number
}

// Интерфейс для данных в обертке
interface DataWrapper {
	data: unknown
}

class ApiService {
	private getAuthorizedApi() {
		const token = localStorage.getItem('med_token')
		if (!token) {
			throw new Error('No authentication token found')
		}
		return createAuthorizedApi(token)
	}

	// Аутентификация
	async login(
		credentials: ApiLoginRequest
	): Promise<{ token: string; user: DsMedUserResponse; expires_at: string }> {
		const response = await api.api.authLoginCreate(credentials)
		// ИСПРАВЛЕНИЕ: Гарантируем что все поля будут заполнены
		const data = response.data
		return {
			token: data.token || '',
			user: {
				id: data.user?.id || 0,
				login: data.user?.login || '',
				is_moderator: data.user?.is_moderator || false,
			},
			expires_at: data.expires_at || new Date().toISOString(),
		}
	}

	async logout(): Promise<void> {
		const token = localStorage.getItem('med_token')
		if (token) {
			try {
				const authorizedApi = this.getAuthorizedApi()
				await authorizedApi.api.authLogoutCreate({ token })
			} catch (error) {
				console.warn(
					'Logout API call failed, but clearing local storage anyway:',
					error
				)
			}
		}
	}

	async getProfile(): Promise<DsMedUserResponse> {
		const authorizedApi = this.getAuthorizedApi()
		const response = await authorizedApi.api.authProfileList()
		return response.data
	}

	// Формулы ДЖЕЛ
	async getFormulas(params?: {
		category?: string
		gender?: string
		min_age?: number
		max_age?: number
		active?: boolean
	}): Promise<DsPvlcMedFormulaResponse[]> {
		try {
			const response = await api.api.pvlcMedFormulasList(params)
			console.log('Full API response:', response)

			// ИСПРАВЛЕНИЕ: Обрабатываем разные форматы ответа без any
			const responseData = response.data

			// Если ответ уже массив - возвращаем его
			if (Array.isArray(responseData)) {
				console.log('API returned array directly:', responseData)
				return responseData
			}

			// Если ответ в формате {data: array} - извлекаем data
			if (
				responseData &&
				typeof responseData === 'object' &&
				'data' in responseData
			) {
				const dataWrapper = responseData as DataWrapper
				if (Array.isArray(dataWrapper.data)) {
					console.log('API returned data object with array:', dataWrapper.data)
					return dataWrapper.data as DsPvlcMedFormulaResponse[]
				}
			}

			// Если формат непонятный
			console.warn('Unknown API response format:', responseData)
			return []
		} catch (error) {
			console.error('Error fetching formulas:', error)
			return []
		}
	}

	async getFormulaById(id: number): Promise<DsPvlcMedFormulaResponse> {
		const response = await api.api.pvlcMedFormulasDetail(id)
		// ИСПРАВЛЕНИЕ: Обрабатываем формат ответа без any
		const responseData = response.data
		if (
			responseData &&
			typeof responseData === 'object' &&
			'data' in responseData
		) {
			const dataWrapper = responseData as DataWrapper
			return dataWrapper.data as DsPvlcMedFormulaResponse
		}
		return responseData as DsPvlcMedFormulaResponse
	}

	// Корзина и заявки
	async getCartIcon(): Promise<DsCartIconResponse> {
		const response = await api.api.medCardIconList()
		// ИСПРАВЛЕНИЕ: Обрабатываем формат ответа без any
		const responseData = response.data
		if (
			responseData &&
			typeof responseData === 'object' &&
			'data' in responseData
		) {
			const dataWrapper = responseData as DataWrapper
			return dataWrapper.data as DsCartIconResponse
		}
		return responseData as DsCartIconResponse
	}

	async addToCart(formulaId: number): Promise<AddToCartResponse> {
		const authorizedApi = this.getAuthorizedApi()
		const response = await authorizedApi.api.pvlcMedFormulasAddToCartCreate(
			formulaId
		)
		// ИСПРАВЛЕНИЕ: Обрабатываем формат ответа без any
		const responseData = response.data
		let data: AddToCartResponse

		if (
			responseData &&
			typeof responseData === 'object' &&
			'data' in responseData
		) {
			const dataWrapper = responseData as DataWrapper
			data = dataWrapper.data as AddToCartResponse
		} else {
			data = responseData as AddToCartResponse
		}

		return {
			message: data.message || 'Формула добавлена в заявку',
			med_card_id: data.med_card_id || 0,
		}
	}

	// Медицинские карты
	async getMedCards(params?: {
		status?: string
		date_from?: string
		date_to?: string
	}): Promise<DsPvlcMedCardResponse[]> {
		try {
			const authorizedApi = this.getAuthorizedApi()
			const response = await authorizedApi.api.pvlcMedCardsList(params)

			// ИСПРАВЛЕНИЕ: Обрабатываем разные форматы ответа без any
			const responseData = response.data

			// Если ответ уже массив - возвращаем его
			if (Array.isArray(responseData)) {
				return responseData
			}

			// Если ответ в формате {data: array} - извлекаем data
			if (
				responseData &&
				typeof responseData === 'object' &&
				'data' in responseData
			) {
				const dataWrapper = responseData as DataWrapper
				if (Array.isArray(dataWrapper.data)) {
					return dataWrapper.data as DsPvlcMedCardResponse[]
				}
			}

			// Если формат непонятный
			console.warn('Unknown API response format for med cards:', responseData)
			return []
		} catch (error) {
			console.error('Error fetching med cards:', error)
			return []
		}
	}

	async getMedCard(cardId: number): Promise<DsPvlcMedCardResponse> {
		const authorizedApi = this.getAuthorizedApi()
		const response = await authorizedApi.api.pvlcMedCardsDetail(cardId)
		// ИСПРАВЛЕНИЕ: Обрабатываем формат ответа без any
		const responseData = response.data
		if (
			responseData &&
			typeof responseData === 'object' &&
			'data' in responseData
		) {
			const dataWrapper = responseData as DataWrapper
			return dataWrapper.data as DsPvlcMedCardResponse
		}
		return responseData as DsPvlcMedCardResponse
	}

	async updateMedCard(
		cardId: number,
		data: UpdateMedCardRequest
	): Promise<void> {
		const authorizedApi = this.getAuthorizedApi()
		await authorizedApi.api.pvlcMedCardsUpdate(cardId, data)
	}

	async finalizeMedCard(cardId: number): Promise<void> {
		const authorizedApi = this.getAuthorizedApi()
		await authorizedApi.api.pvlcMedCardsFormUpdate(cardId)
	}

	async deleteMedCard(cardId: number): Promise<void> {
		const authorizedApi = this.getAuthorizedApi()
		await authorizedApi.api.pvlcMedCardsDelete(cardId)
	}

	async deleteCalculation(cardId: number, formulaId: number): Promise<void> {
		const authorizedApi = this.getAuthorizedApi()
		// Используем прямой вызов API для удаления расчета
		await authorizedApi.request({
			method: 'DELETE',
			path: '/api/med-mm-pvlc-calculations',
			body: {
				card_id: cardId,
				pvlc_med_formula_id: formulaId,
			},
			secure: true,
		})
	}

	// Вспомогательные методы
	getImageUrl(imageUrl: string | undefined): string {
		if (!imageUrl) {
			return '/DefaultImage.jpg'
		}
		return `http://localhost:9000/pics/${imageUrl}`
	}
}

export const apiService = new ApiService()
