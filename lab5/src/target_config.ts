// Конфигурация для определения среды выполнения и URL

// Безопасная проверка на Tauri environment
const isTauri = typeof window !== 'undefined' && window.__TAURI__ !== undefined

// Базовые URL для API и изображений
// ДЛЯ TAURI: используем прямой IP адрес бэкенда
// ДЛЯ WEB: используем прокси или относительные пути

// ВАШ IP: 192.168.1.14
export const API_BASE_TAURI = 'http://192.168.1.14:8080'
export const API_BASE_WEB = '/api'
export const MINIO_BASE_TAURI = 'http://192.168.1.14:9000/pics'
export const MINIO_BASE_WEB = 'http://localhost:9000/pics'

export const getApiBase = () => (isTauri ? API_BASE_TAURI : API_BASE_WEB)
export const getMinioBase = () => (isTauri ? MINIO_BASE_TAURI : MINIO_BASE_WEB)
export const getIsTauri = () => isTauri
