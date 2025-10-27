import React, { useState, useEffect, useRef } from 'react'
import { Container, Alert, Spinner, Form } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import type { PvlcMedFormula } from '../types'
import { apiService } from '../services/api'
import Breadcrumbs from '../components/Breadcrumbs'
import FormulaCard from '../components/FormulaCard'

const PvlcPatientsPage: React.FC = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const [formulas, setFormulas] = useState<PvlcMedFormula[]>([])
	const [filteredFormulas, setFilteredFormulas] = useState<PvlcMedFormula[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [inputValue, setInputValue] = useState('') // Состояние для поля ввода
	const searchInputRef = useRef<HTMLInputElement>(null)

	// Берем поисковый запрос из URL параметров
	const searchTerm = searchParams.get('search') || ''

	useEffect(() => {
		loadFormulas()
	}, [])

	useEffect(() => {
		applyFilters()
	}, [formulas, searchTerm])

	// Синхронизируем значение поля ввода с URL параметром
	useEffect(() => {
		setInputValue(searchTerm)
	}, [searchTerm])

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
		setInputValue(e.target.value) // Обновляем состояние поля ввода
	}

	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (inputValue) {
			setSearchParams({ search: inputValue }) // Устанавливаем параметр поиска
		} else {
			setSearchParams({}) // Очищаем параметры при пустом поиске
		}
	}

	const handleClearSearch = () => {
		setSearchParams({}) // Полностью очищаем URL параметры
		setInputValue('') // Очищаем поле ввода
		// Фокус на поле ввода после очистки
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
			{/* Передаем функцию сброса в Breadcrumbs */}
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
								value={inputValue} // Теперь используем value вместо defaultValue
								onChange={handleSearchChange} // Добавляем обработчик изменений
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
			</Container>
		</Container>
	)
}

export default PvlcPatientsPage
