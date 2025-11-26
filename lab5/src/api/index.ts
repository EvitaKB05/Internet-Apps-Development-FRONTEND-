// src/api/index.ts
import { Api } from './Api'

// Используем конфигурацию из target_config для определения базового URL
const getApiBaseUrl = () => {
	return 'http://localhost:8080'
}

// Создаем базовый инстанс API
export const api = new Api({
	baseURL: getApiBaseUrl(),
})

// Функция для создания авторизованного инстанса API
export const createAuthorizedApi = (token: string) => {
	console.log('Creating authorized API with token length:', token.length)

	const authorizedApi = new Api({
		baseURL: getApiBaseUrl(),
		securityWorker: securityData => {
			console.log('Security worker called with:', securityData)
			// Используем securityData который мы установим через setSecurityData
			if (
				securityData &&
				typeof securityData === 'object' &&
				'accessToken' in securityData
			) {
				return {
					headers: {
						Authorization: `Bearer ${securityData.accessToken}`,
					},
				}
			}
			return {}
		},
	})

	// Устанавливаем securityData чтобы securityWorker мог его использовать
	authorizedApi.setSecurityData({ accessToken: token })

	return authorizedApi
}
