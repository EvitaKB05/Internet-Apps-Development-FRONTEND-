// types/global.d.ts
export {}

declare global {
	interface Window {
		__TAURI__?: {
			// Базовые свойства Tauri
			[key: string]: unknown
		}
	}
}
