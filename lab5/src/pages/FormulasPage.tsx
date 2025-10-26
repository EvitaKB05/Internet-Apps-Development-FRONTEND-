import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Alert, Spinner, Form } from 'react-bootstrap'
import type { PvlcMedFormula, PvlcMedFormulaFilter } from '../types'
import { apiService } from '../services/api'
import Breadcrumbs from '../components/Breadcrumbs'
import FilterPanel from '../components/FilterPanel'
import FormulaCard from '../components/FormulaCard'

const FormulasPage: React.FC = () => {
	const [formulas, setFormulas] = useState<PvlcMedFormula[]>([])
	const [filteredFormulas, setFilteredFormulas] = useState<PvlcMedFormula[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [categories, setCategories] = useState<string[]>([])
	const [genders, setGenders] = useState<string[]>([])
	const [searchTerm, setSearchTerm] = useState('')

	const [filter, setFilter] = useState<PvlcMedFormulaFilter>({
		active: true,
	})

	useEffect(() => {
		loadFormulas()
		loadFilterOptions()
	}, [])

	useEffect(() => {
		applyFilters()
	}, [formulas, filter, searchTerm])

	const loadFormulas = async () => {
		try {
			setLoading(true)
			setError(null)
			const data = await apiService.getFormulas(filter)
			setFormulas(data)
		} catch (err) {
			setError('Ошибка загрузки формул')
			console.error('Error loading formulas:', err)
		} finally {
			setLoading(false)
		}
	}

	const loadFilterOptions = async () => {
		try {
			const [categoriesData, gendersData] = await Promise.all([
				apiService.getCategories(),
				apiService.getGenders(),
			])
			setCategories(categoriesData)
			setGenders(gendersData)
		} catch (err) {
			console.error('Error loading filter options:', err)
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

	const handleFilterChange = (newFilter: PvlcMedFormulaFilter) => {
		setFilter(newFilter)
	}

	const handleResetFilters = () => {
		setFilter({ active: true })
		setSearchTerm('')
	}

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value)
	}

	if (loading) {
		return (
			<Container className='text-center py-5'>
				<Spinner animation='border' role='status'>
					<span className='visually-hidden'>Загрузка...</span>
				</Spinner>
				<div className='mt-2'>Загрузка формул ДЖЕЛ...</div>
			</Container>
		)
	}

	return (
		<Container>
			<Breadcrumbs items={[{ label: 'Формулы ДЖЕЛ' }]} />

			<Row className='mb-4'>
				<Col>
					<h1>Формулы расчета ДЖЕЛ</h1>
					<p className='text-muted'>
						Выберите подходящую формулу для расчета должной жизненной емкости
						легких
					</p>
				</Col>
			</Row>

			{error && (
				<Alert variant='warning' className='mb-4'>
					{error}
				</Alert>
			)}

			<Row className='mb-4'>
				<Col md={8}>
					<Form.Group>
						<Form.Control
							type='text'
							placeholder='Поиск по названию или описанию...'
							value={searchTerm}
							onChange={handleSearchChange}
						/>
					</Form.Group>
				</Col>
				<Col md={4} className='text-end'>
					<small className='text-muted'>
						Найдено: {filteredFormulas.length} формул
					</small>
				</Col>
			</Row>

			<FilterPanel
				filter={filter}
				onFilterChange={handleFilterChange}
				categories={categories}
				genders={genders}
				onReset={handleResetFilters}
			/>

			{filteredFormulas.length === 0 ? (
				<Alert variant='info'>
					По выбранным фильтрам формулы не найдены. Попробуйте изменить
					параметры поиска.
				</Alert>
			) : (
				<Row>
					{filteredFormulas.map(formula => (
						<Col key={formula.id} xs={12} sm={6} lg={4} className='mb-4'>
							<FormulaCard formula={formula} />
						</Col>
					))}
				</Row>
			)}
		</Container>
	)
}

export default FormulasPage
