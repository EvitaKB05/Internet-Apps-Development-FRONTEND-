//src/target_config.ts
// Конфигурация для определения среды выполнения и URL
// Безопасная проверка на Tauri environment
const isTauri = false
// Базовые URL для API и изображений
export const API_BASE_TAURI = 'http://localhost:8080'
export const API_BASE_WEB = '/api'
export const MINIO_BASE_TAURI = 'http://localhost:9000/pics'
export const MINIO_BASE_WEB = 'http://localhost:9000/pics'

export const getApiBase = () => (isTauri ? API_BASE_TAURI : API_BASE_WEB)
export const getMinioBase = () => (isTauri ? MINIO_BASE_TAURI : MINIO_BASE_WEB)
export const getIsTauri = () => isTauri
