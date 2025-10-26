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
