import React, { useState, useEffect, useRef } from 'react'
import { Container, Alert, Spinner, Form } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import type { PvlcMedFormula, CartIconResponse } from '../types'
import { apiService } from '../services/api'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { setSearchTerm, resetFilters } from '../store/slices/filterSlice'
import Breadcrumbs from '../components/Breadcrumbs'
import FormulaCard from '../components/FormulaCard'
import FilterPanel from '../components/FilterPanel'

const PvlcPatientsPage: React.FC = () => {
	const dispatch = useAppDispatch()

	// Получаем состояние фильтров из Redux
	const searchTerm = useAppSelector(state => state.filters.searchTerm)
	const filter = useAppSelector(state => state.filters.filter)

	const [searchParams, setSearchParams] = useSearchParams()
	const [formulas, setFormulas] = useState<PvlcMedFormula[]>([])
	const [filteredFormulas, setFilteredFormulas] = useState<PvlcMedFormula[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [inputValue, setInputValue] = useState('')
	const [categories, setCategories] = useState<string[]>([])
	const [genders, setGenders] = useState<string[]>([])
	const searchInputRef = useRef<HTMLInputElement>(null)

	const [cartData, setCartData] = useState<CartIconResponse>({
		med_card_id: 0,
		med_item_count: 0,
	})

	// Синхронизация с URL параметрами
	const urlSearchTerm = searchParams.get('search') || ''

	// Загружаем формулы при изменении фильтров
	useEffect(() => {
		loadFormulas()
		loadCategories()
		loadGenders()
		loadCartIcon()
	}, []) // Загружаем только при первом рендере

	// Загружаем формулы при изменении фильтров
	useEffect(() => {
		loadFormulas()
	}, [filter]) // Загружаем заново при изменении фильтров

	useEffect(() => {
		// Синхронизация Redux с URL параметрами
		if (urlSearchTerm !== searchTerm) {
			dispatch(setSearchTerm(urlSearchTerm))
			setInputValue(urlSearchTerm)
		}
	}, [urlSearchTerm, searchTerm, dispatch])

	// Применяем фильтры к уже загруженным данным
	useEffect(() => {
		applyFilters()
	}, [formulas, searchTerm]) // Применяем фильтры при изменении формул или поискового запроса

	const loadCategories = async () => {
		try {
			const categoriesData = await apiService.getCategories()
			setCategories(categoriesData)
		} catch (error) {
			console.error('Error loading categories:', error)
		}
	}

	const loadGenders = async () => {
		try {
			const gendersData = await apiService.getGenders()
			setGenders(gendersData)
		} catch (error) {
			console.error('Error loading genders:', error)
		}
	}

	const loadCartIcon = async () => {
		try {
			const data = await apiService.getCartIcon()
			setCartData(data)
		} catch (error) {
			console.error('Error loading cart icon:', error)
		}
	}

	const loadFormulas = async () => {
		try {
			setLoading(true)
			setError(null)
			// Передаем текущие фильтры в API запрос
			const data = await apiService.getFormulas(filter)
			setFormulas(data)
		} catch (err) {
			setError('Ошибка загрузки категорий пациентов')
			console.error('Error loading formulas:', err)
		} finally {
			setLoading(false)
		}
	}

	const applyFilters = () => {
		let filtered = [...formulas]

		// Применяем текстовый поиск (клиентская фильтрация)
		if (searchTerm) {
			filtered = filtered.filter(
				formula =>
					formula.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					formula.description.toLowerCase().includes(searchTerm.toLowerCase())
			)
		}

		// ИСПРАВЛЕНИЕ: Дополнительная клиентская фильтрация с проверкой на undefined
		if (filter.category) {
			filtered = filtered.filter(f => f.category === filter.category)
		}
		if (filter.gender) {
			filtered = filtered.filter(f => f.gender === filter.gender)
		}
		// ИСПРАВЛЕНИЕ: Добавляем проверку на undefined для числовых полей
		if (filter.min_age !== undefined) {
			filtered = filtered.filter(f => f.min_age >= filter.min_age!)
		}
		if (filter.max_age !== undefined) {
			filtered = filtered.filter(f => f.max_age <= filter.max_age!)
		}

		setFilteredFormulas(filtered)
	}

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value)
	}

	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		dispatch(setSearchTerm(inputValue))

		if (inputValue) {
			setSearchParams({ search: inputValue })
		} else {
			setSearchParams({})
		}
	}

	const handleClearSearch = () => {
		dispatch(setSearchTerm(''))
		dispatch(resetFilters())
		setSearchParams({})
		setInputValue('')
		if (searchInputRef.current) {
			searchInputRef.current.focus()
		}
	}

	// ИСПРАВЛЕНИЕ: Добавляем отладочную информацию
	useEffect(() => {
		console.log('🔍 DEBUG FILTERS:')
		console.log('Current filter:', filter)
		console.log('Current searchTerm:', searchTerm)
		console.log('All formulas:', formulas.length)
		console.log('Filtered formulas:', filteredFormulas.length)
		console.log('---')
	}, [filter, searchTerm, formulas, filteredFormulas])

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

				{/* Добавляем панель фильтров */}
				<FilterPanel categories={categories} genders={genders} />

				{/* Показываем активные фильтры */}
				{(filter.category ||
					filter.gender ||
					filter.min_age !== undefined ||
					filter.max_age !== undefined) && (
					<Alert variant='info' className='mb-3'>
						Активные фильтры:
						{filter.category && ` Категория: ${filter.category}`}
						{filter.gender && ` Пол: ${filter.gender}`}
						{filter.min_age !== undefined && ` Возраст от: ${filter.min_age}`}
						{filter.max_age !== undefined && ` Возраст до: ${filter.max_age}`}
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
						{searchTerm ||
						filter.category ||
						filter.gender ||
						filter.min_age !== undefined ||
						filter.max_age !== undefined
							? `По заданным параметрам категории не найдены. Попробуйте изменить параметры поиска.`
							: 'Категории не найдены.'}
					</Alert>
				) : (
					<section className='services-section'>
						<div className='services-grid'>
							{filteredFormulas.map(formula => (
								<FormulaCard key={formula.id} formula={formula} />
							))}
						</div>
					</section>
				)}

				{/* Иконка корзины */}
				{cartData.med_item_count > 0 ? (
					<a
						href={`/pvlc_med_calc/${cartData.med_card_id}`}
						className='folder-icon'
					>
						<img src='/folder.png' alt='Корзина' width='100' height='70' />
						<span className='notification-badge'>
							{cartData.med_item_count}
						</span>
					</a>
				) : (
					<div className='folder-icon inactive'>
						<img src='/folder.png' alt='Корзина' width='100' height='70' />
					</div>
				)}
			</Container>
		</Container>
	)
}

export default PvlcPatientsPage
