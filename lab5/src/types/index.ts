export interface PvlcMedFormula {
	id: number
	title: string
	description: string
	formula: string
	image_url: string
	category: string
	gender: string
	min_age: number
	max_age: number
	is_active: boolean
}

export interface PvlcMedFormulaFilter {
	category?: string
	gender?: string
	min_age?: number
	max_age?: number
	active?: boolean
}

export interface BreadcrumbItem {
	label: string
	path?: string
}

export interface MedUser {
	id: number
	login: string
	is_moderator: boolean
}

// НАЧАЛО НОВЫХ ДОБАВЛЕНИЙ - тип для ответа корзины
export interface CartIconResponse {
	med_card_id: number
	med_item_count: number
}

// ИСПРАВЛЕНИЕ: Добавляем интерфейсы для API ошибок
export interface ApiError {
	status?: number
	message?: string
	code?: string
}

// Интерфейсы для API ответов
export interface ApiResponse<T> {
	data?: T
	error?: string
	status?: string
}
