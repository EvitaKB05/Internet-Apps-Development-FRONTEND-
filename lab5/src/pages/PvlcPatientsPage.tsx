import React, { useState, useEffect, useRef } from 'react'
import { Container, Alert, Spinner, Form } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import type { PvlcMedFormula, CartIconResponse } from '../types'
import { apiService } from '../services/api'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { setSearchTerm, resetFilters } from '../store/slices/filterSlice'
import Breadcrumbs from '../components/Breadcrumbs'
import FormulaCard from '../components/FormulaCard'
// import FilterPanel from '../components/FilterPanel' // КОММЕНТИРУЕМ ИМПОРТ

const PvlcPatientsPage: React.FC = () => {
	const dispatch = useAppDispatch()

	// Получаем состояние фильтров из Redux
	const searchTerm = useAppSelector(state => state.filters.searchTerm)
	//const filter = useAppSelector(state => state.filters.filter)

	const [searchParams, setSearchParams] = useSearchParams()
	const [formulas, setFormulas] = useState<PvlcMedFormula[]>([])
	const [filteredFormulas, setFilteredFormulas] = useState<PvlcMedFormula[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [inputValue, setInputValue] = useState('')
	//const [categories, setCategories] = useState<string[]>([])
	//const [genders, setGenders] = useState<string[]>([])
	const searchInputRef = useRef<HTMLInputElement>(null)

	const [cartData, setCartData] = useState<CartIconResponse>({
		med_card_id: 0,
		med_item_count: 0,
	})

	// Загружаем формулы при первом рендере
	useEffect(() => {
		loadFormulas()
		loadCartIcon()
	}, []) // Загружаем только при первом рендере

	// ИНИЦИАЛИЗАЦИЯ: Восстанавливаем поиск ТОЛЬКО из URL параметров при первом рендере
	useEffect(() => {
		const urlSearchTerm = searchParams.get('search') || ''

		// Синхронизируем Redux с URL параметрами только при первом рендере
		if (urlSearchTerm && urlSearchTerm !== searchTerm) {
			dispatch(setSearchTerm(urlSearchTerm))
			setInputValue(urlSearchTerm)
		}
	}, []) // Только при первом рендере

	// Синхронизация inputValue с searchTerm из Redux
	useEffect(() => {
		setInputValue(searchTerm)
	}, [searchTerm])

	// Применяем фильтры к уже загруженным данным
	useEffect(() => {
		applyFilters()
	}, [formulas, searchTerm]) // Применяем фильтры при изменении формул или поискового запроса

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
			// Загружаем ВСЕ формулы (без фильтров)
			const data = await apiService.getFormulas()
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

		// Применяем ТОЛЬКО текстовый поиск (клиентская фильтрация)
		if (searchTerm) {
			filtered = filtered.filter(
				formula =>
					formula.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					formula.description.toLowerCase().includes(searchTerm.toLowerCase())
			)
		}

		setFilteredFormulas(filtered)
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
						<img src='./folder.png' alt='Корзина' width='100' height='70' />
						<span className='notification-badge'>
							{cartData.med_item_count}
						</span>
					</a>
				) : (
					<div className='folder-icon inactive'>
						<img src='./folder.png' alt='Корзина' width='100' height='70' />
					</div>
				)}
			</Container>
		</Container>
	)
}

export default PvlcPatientsPage
