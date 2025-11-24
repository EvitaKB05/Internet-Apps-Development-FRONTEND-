// src/api/index.ts
import { Api } from './Api'

// Используем конфигурацию из target_config для определения базового URL
const getApiBaseUrl = () => {
	// Для Tauri используем прямой URL, для web - прокси
	if (window.location.protocol === 'https:') {
		return '/api' // Прокси через Vite
	}
	return 'http://localhost:8080' // Прямое подключение для разработки
}

// Создаем базовый инстанс API
export const api = new Api({
	baseURL: getApiBaseUrl(),
})

// Функция для создания авторизованного инстанса API
export const createAuthorizedApi = (token: string) => {
	return new Api({
		baseURL: getApiBaseUrl(),
		securityWorker: () => {
			return {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		},
	})
}
