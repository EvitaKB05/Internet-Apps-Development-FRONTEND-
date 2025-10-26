import React, { useState, useEffect } from 'react'
import { Container, Alert, Spinner, Form } from 'react-bootstrap'
import type { PvlcMedFormula } from '../types'
import { apiService } from '../services/api'
import Breadcrumbs from '../components/Breadcrumbs'
import FormulaCard from '../components/FormulaCard'

const PvlcPatientsPage: React.FC = () => {
	const [formulas, setFormulas] = useState<PvlcMedFormula[]>([])
	const [filteredFormulas, setFilteredFormulas] = useState<PvlcMedFormula[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [searchTerm, setSearchTerm] = useState('')

	useEffect(() => {
		loadFormulas()
	}, [])

	useEffect(() => {
		applyFilters()
	}, [formulas, searchTerm])

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
		setSearchTerm(e.target.value)
	}

	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		applyFilters()
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
			{' '}
			{/* Убираем отступы для полной ширины */}
			<Breadcrumbs items={[{ label: 'Категории пациентов' }]} />
			{/* Заголовок страницы как в исходнике */}
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

				{/* Поисковая строка с кнопкой как в исходнике */}
				<section className='search-section'>
					<Form onSubmit={handleSearchSubmit} className='search-form'>
						<div className='search-group'>
							<input
								type='text'
								name='query'
								placeholder='Поиск категорий...'
								value={searchTerm}
								onChange={handleSearchChange}
								className='search-input'
							/>
							<button type='submit' className='search-button'>
								Найти
							</button>
						</div>
					</Form>
				</section>

				{/* Сетка карточек */}
				{filteredFormulas.length === 0 ? (
					<Alert variant='info'>
						По выбранным фильтрам категории не найдены. Попробуйте изменить
						параметры поиска.
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
