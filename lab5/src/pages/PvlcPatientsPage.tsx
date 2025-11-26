// src/pages/PvlcPatientsPage.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Container, Alert, Spinner, Form } from 'react-bootstrap'
import { useSearchParams, useNavigate } from 'react-router-dom'
import type { PvlcMedFormula } from '../types'
import { apiService } from '../services/api'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { setSearchTerm, resetFilters } from '../store/slices/filterSlice'
import { getCartIcon } from '../store/slices/medCartSlice'
import Breadcrumbs from '../components/Breadcrumbs'
import FormulaCard from '../components/FormulaCard'

const PvlcPatientsPage: React.FC = () => {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	// Получаем состояние фильтров из Redux
	const searchTerm = useAppSelector(state => state.filters.searchTerm)

	const [searchParams, setSearchParams] = useSearchParams()
	const [formulas, setFormulas] = useState<PvlcMedFormula[]>([])
	const [filteredFormulas, setFilteredFormulas] = useState<PvlcMedFormula[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [inputValue, setInputValue] = useState('')
	const searchInputRef = useRef<HTMLInputElement>(null)

	const { cartId, itemCount } = useAppSelector(state => state.medCart)
	const { isAuthenticated } = useAppSelector(state => state.auth)

	// ИСПРАВЛЕНИЕ: Вынесем applyFilters в useCallback чтобы избежать exhaustive-deps
	const applyFilters = useCallback(() => {
		let filtered = [...formulas]

		// Применяем ТОЛЬКО текстовый поиск (клиентская фильтрация)
		if (searchTerm) {
			filtered = filtered.filter(
				formula =>
					formula.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					formula.description.toLowerCase().includes(searchTerm.toLowerCase())
			)
		}

		setFilteredFormulas(filtered)
	}, [formulas, searchTerm])

	// Загружаем формулы при первом рендере
	// ИСПРАВЛЕНИЕ: Загружаем корзину для ВСЕХ пользователей (авторизованных и нет)
	useEffect(() => {
		loadFormulas()
		// ИСПРАВЛЕНИЕ: Всегда загружаем иконку корзины, независимо от авторизации
		dispatch(getCartIcon())
	}, [dispatch])

	// ИНИЦИАЛИЗАЦИЯ: Восстанавливаем поиск ТОЛЬКО из URL параметров при первом рендере
	useEffect(() => {
		const urlSearchTerm = searchParams.get('search') || ''

		// Синхронизируем Redux с URL параметрами только при первом рендере
		if (urlSearchTerm && urlSearchTerm !== searchTerm) {
			dispatch(setSearchTerm(urlSearchTerm))
			setInputValue(urlSearchTerm)
		}
	}, [searchParams, searchTerm, dispatch])

	// Синхронизация inputValue с searchTerm из Redux
	useEffect(() => {
		setInputValue(searchTerm)
	}, [searchTerm])

	// Применяем фильтры к уже загруженным данным
	useEffect(() => {
		applyFilters()
	}, [applyFilters])

	const loadFormulas = async () => {
		try {
			setLoading(true)
			setError(null)
			// Загружаем ВСЕ формулы (без фильтров)
			const data = await apiService.getFormulas()
			// ИСПРАВЛЕНИЕ: Преобразуем DsPvlcMedFormulaResponse в PvlcMedFormula
			const transformedFormulas: PvlcMedFormula[] = data.map(formula => ({
				id: formula.id || 0, // Гарантируем number
				title: formula.title || '',
				description: formula.description || '',
				formula: formula.formula || '',
				image_url: formula.image_url || '',
				category: formula.category || '',
				gender: formula.gender || '',
				min_age: formula.min_age || 0,
				max_age: formula.max_age || 0,
				is_active: formula.is_active || false,
			}))
			setFormulas(transformedFormulas)
		} catch (err) {
			console.error('Error loading formulas:', err)
			setError('Ошибка загрузки категорий пациентов')
			// Устанавливаем пустой массив при ошибке
			setFormulas([])
		} finally {
			setLoading(false)
		}
	}

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value)
	}

	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		// Обновляем URL только при отправке формы
		if (inputValue) {
			setSearchParams({ search: inputValue })
		} else {
			setSearchParams({})
		}
		dispatch(setSearchTerm(inputValue))
	}

	const handleClearSearch = () => {
		dispatch(setSearchTerm(''))
		dispatch(resetFilters())
		setInputValue('')
		setSearchParams({})
		if (searchInputRef.current) {
			searchInputRef.current.focus()
		}
	}

	const handleCartClick = () => {
		if (isAuthenticated && cartId) {
			navigate(`/pvlc_med_card/${cartId}`)
		} else if (!isAuthenticated) {
			navigate('/pvlc_login')
		}
	}

	// ИСПРАВЛЕНИЕ: Функция для обновления корзины после добавления
	const refreshCart = async () => {
		await dispatch(getCartIcon())
	}

	if (loading) {
		return (
			<Container className='text-center py-5'>
				<Spinner animation='border' role='status'>
					<span className='visually-hidden'>Загрузка...</span>
				</Spinner>
				<div className='mt-2'>Загрузка категорий пациентов...</div>
			</Container>
		)
	}

	return (
		<Container fluid className='px-0'>
			<Breadcrumbs
				items={[{ label: 'Категории пациентов', path: '/pvlc_patients' }]}
				onPatientsClick={handleClearSearch}
			/>

			<div className='page-header'>
				<Container>
					<h1 className='page-title'>
						Расчёт должной жизненной емкости лёгких (ДЖЕЛ)
					</h1>
				</Container>
			</div>
			<Container>
				{error && (
					<Alert variant='warning' className='mb-4'>
						{error}
					</Alert>
				)}

				<section className='search-section'>
					<Form onSubmit={handleSearchSubmit} className='search-form'>
						<div className='search-group'>
							<input
								ref={searchInputRef}
								type='text'
								name='query'
								placeholder='Поиск категорий...'
								value={inputValue}
								onChange={handleSearchChange}
								className='search-input'
							/>
							<button type='submit' className='search-button'>
								Найти
							</button>
						</div>
					</Form>
				</section>

				{filteredFormulas.length === 0 ? (
					<Alert variant='info'>
						{searchTerm
							? `По запросу "${searchTerm}" категории не найдены. Попробуйте изменить параметры поиска.`
							: 'Категории не найдены.'}
					</Alert>
				) : (
					<section className='services-section'>
						<div className='services-grid'>
							{filteredFormulas.map(formula => (
								<FormulaCard
									key={formula.id}
									formula={formula}
									onAddToCart={refreshCart}
								/>
							))}
						</div>
					</section>
				)}

				{/* ИСПРАВЛЕНИЕ: Иконка корзины отображается ВСЕГДА, но активна только для авторизованных */}
				<div
					className={`folder-icon ${
						isAuthenticated && cartId ? 'active' : 'inactive'
					}`}
					onClick={handleCartClick}
					title={
						isAuthenticated
							? 'Перейти к заявке'
							: 'Войдите для доступа к корзине'
					}
				>
					<img src='./folder.png' alt='Корзина' width='100' height='70' />
					{isAuthenticated && itemCount > 0 && (
						<span className='notification-badge'>{itemCount}</span>
					)}
				</div>
			</Container>
		</Container>
	)
}

export default PvlcPatientsPage
