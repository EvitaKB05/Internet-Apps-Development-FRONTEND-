import React, { useState, useEffect, useRef } from 'react'
import { Container, Alert, Spinner, Form } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import type { PvlcMedFormula, CartIconResponse } from '../types'
import { apiService } from '../services/api'
import Breadcrumbs from '../components/Breadcrumbs'
import FormulaCard from '../components/FormulaCard'

const PvlcPatientsPage: React.FC = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const [formulas, setFormulas] = useState<PvlcMedFormula[]>([])
	const [filteredFormulas, setFilteredFormulas] = useState<PvlcMedFormula[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [inputValue, setInputValue] = useState('')
	const searchInputRef = useRef<HTMLInputElement>(null)

	// НАЧАЛО ИЗМЕНЕНИЙ - добавляем состояние для корзины
	const [cartData, setCartData] = useState<CartIconResponse>({
		med_card_id: 0,
		med_item_count: 0,
	})
	// КОНЕЦ ИЗМЕНЕНИЙ

	const searchTerm = searchParams.get('search') || ''

	useEffect(() => {
		loadFormulas()
		loadCartIcon()
	}, [])

	useEffect(() => {
		applyFilters()
	}, [formulas, searchTerm])

	useEffect(() => {
		setInputValue(searchTerm)
	}, [searchTerm])

	// НАЧАЛО ИЗМЕНЕНИЙ - упрощаем функцию загрузки корзины
	const loadCartIcon = async () => {
		try {
			const data = await apiService.getCartIcon()
			setCartData(data)
		} catch (error) {
			console.error('Error loading cart icon:', error)
		}
	}
	// КОНЕЦ ИЗМЕНЕНИЙ

	const loadFormulas = async () => {
		try {
			setLoading(true)
			setError(null)
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

		if (inputValue) {
			setSearchParams({ search: inputValue })
		} else {
			setSearchParams({})
		}
	}

	const handleClearSearch = () => {
		setSearchParams({})
		setInputValue('')
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
