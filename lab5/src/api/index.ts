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

export const api = new Api({
	baseURL: getApiBaseUrl(),
})
