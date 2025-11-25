// src/api/index.ts
import { Api } from './Api'

// Используем конфигурацию из target_config для определения базового URL
const getApiBaseUrl = () => {
	// ИСПРАВЛЕНИЕ: Всегда используем прямой URL для разработки
	// Убираем дублирование /api в URL
	return 'http://localhost:8080'
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
