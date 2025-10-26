import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Alert, Spinner, Form } from 'react-bootstrap'
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
		<Container>
			<Breadcrumbs items={[{ label: 'Категории пациентов' }]} />

			<Row className='mb-4'>
				<Col>
					<h1>Категории пациентов</h1>
					{/*<p className='text-muted'>
						Выберите подходящую категорию для расчета должной жизненной емкости
						легких
					</p>*/}
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
							placeholder='Поиск категорий...'
							value={searchTerm}
							onChange={handleSearchChange}
						/>
					</Form.Group>
				</Col>
				<Col md={4} className='text-end'>
					<small className='text-muted'>
						Найдено: {filteredFormulas.length} категорий
					</small>
				</Col>
			</Row>

			{filteredFormulas.length === 0 ? (
				<Alert variant='info'>
					По выбранным фильтрам категории не найдены. Попробуйте изменить
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

export default PvlcPatientsPage
