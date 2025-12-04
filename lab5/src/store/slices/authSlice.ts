// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../api'

// Типы для аутентификации
interface LoginRequest {
	login: string
	password: string
}

interface LoginResponse {
	token: string
	user: MedUserResponse
	expires_at: string
}

// ИСПРАВЛЕНИЕ: Синхронизируем типы с DsMedUserResponse из API
interface MedUserResponse {
	id: number
	login: string
	is_moderator: boolean
}

interface AuthState {
	user: MedUserResponse | null
	token: string | null
	isAuthenticated: boolean
	loading: boolean
	expires_at?: string
	error: string | null
}

const initialState: AuthState = {
	user: null,
	token: localStorage.getItem('med_token'),
	isAuthenticated: !!localStorage.getItem('med_token'),
	loading: false,
	error: null,
}

// Асинхронное действие для авторизации
export const loginUser = createAsyncThunk(
	'auth/loginUser',
	async (credentials: LoginRequest, { rejectWithValue }) => {
		try {
			const response = await api.api.authLoginCreate(credentials)
			const data = response.data as LoginResponse

			//  токен в localStorage
			localStorage.setItem('med_token', data.token)
			localStorage.setItem('med_user', JSON.stringify(data.user))

			console.log('Token saved to localStorage:', data.token) //

			return data
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Ошибка авторизации'
			return rejectWithValue(errorMessage)
		}
	}
)

// Асинхронное действие для выхода
export const logoutUser = createAsyncThunk(
	'auth/logoutUser',
	async (_, { rejectWithValue }) => {
		try {
			const token = localStorage.getItem('med_token')
			if (token) {
				await api.api.authLogoutCreate({ token })
			}

			// Очищаем localStorage
			localStorage.removeItem('med_token')
			localStorage.removeItem('med_user')

			return null
		} catch (error: unknown) {
			// Все равно очищаем localStorage даже при ошибке
			localStorage.removeItem('med_token')
			localStorage.removeItem('med_user')
			const errorMessage =
				error instanceof Error ? error.message : 'Ошибка при выходе'
			return rejectWithValue(errorMessage)
		}
	}
)

// Асинхронное действие для получения профиля
export const getProfile = createAsyncThunk(
	'auth/getProfile',
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.api.authProfileList()
			// ИСПРАВЛЕНИЕ: Преобразуем данные API в наш тип
			const apiData = response.data
			const userData: MedUserResponse = {
				id: apiData.id || 0, // Задаем значение по умолчанию для id
				login: apiData.login || '',
				is_moderator: apiData.is_moderator || false,
			}
			return userData
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Ошибка загрузки профиля'
			return rejectWithValue(errorMessage)
		}
	}
)

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		clearError: state => {
			state.error = null
		},
	},
	extraReducers: builder => {
		builder
			// Логин
			.addCase(loginUser.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.loading = false
				state.isAuthenticated = true // ВАЖНО: устанавливаем флаг аутентификации
				state.user = action.payload.user
				state.token = action.payload.token
				state.expires_at = action.payload.expires_at
				state.error = null

				// Устанавливаем security data для API
				api.setSecurityData({ accessToken: action.payload.token })

				console.log('Login successful, isAuthenticated set to:', true) // ДЛЯ ОТЛАДКИ
			})
			/*.addCase(loginUser.fulfilled, (state, action) => {
				const { user, token, expires_at } = action.payload
				state.user = user
				state.token = token
				state.expires_at = expires_at || undefined
				api.setSecurityData({ accessToken: token || '' })
			}) */
			.addCase(loginUser.rejected, (state, action) => {
				state.loading = false
				state.isAuthenticated = false
				state.error = action.payload as string
			})
			// Логаут
			.addCase(logoutUser.fulfilled, state => {
				state.user = null
				state.token = null
				state.isAuthenticated = false
				state.error = null
				api.setSecurityData(null)
			})
			.addCase(logoutUser.rejected, state => {
				state.user = null
				state.token = null
				state.isAuthenticated = false
				state.error = null
			})
			// Профиль
			.addCase(getProfile.fulfilled, (state, action) => {
				state.user = action.payload
			})
	},
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
