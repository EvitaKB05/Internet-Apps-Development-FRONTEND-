//src/components/FilterPanel.tsx
import React from 'react'
import { Form, Row, Col, Button } from 'react-bootstrap'
import type { PvlcMedFormulaFilter } from '../types'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { setFilter, resetFilters } from '../store/slices/filterSlice'

interface FilterPanelProps {
	categories: string[]
	genders: string[]
}

const FilterPanel: React.FC<FilterPanelProps> = ({ categories, genders }) => {
	const dispatch = useAppDispatch()

	// ИЗМЕНЕНИЕ: Правильное извлечение состояния с типизацией
	const filter = useAppSelector(state => state.filters.filter)

	const handleInputChange = (
		field: keyof PvlcMedFormulaFilter,
		value: string | number | boolean | undefined
	) => {
		dispatch(
			setFilter({
				...filter,
				[field]: value,
			})
		)
	}

	const handleReset = () => {
		dispatch(resetFilters())
	}

	return (
		<div className='bg-light p-3 rounded mb-4'>
			<h5 className='mb-3'>Фильтры</h5>
			<Form>
				<Row className='g-3'>
					<Col md={3}>
						<Form.Group>
							<Form.Label>Категория</Form.Label>
							<Form.Select
								value={filter.category || ''}
								onChange={e =>
									handleInputChange('category', e.target.value || undefined)
								}
							>
								<option value=''>Все категории</option>
								{categories.map(category => (
									<option key={category} value={category}>
										{category}
									</option>
								))}
							</Form.Select>
						</Form.Group>
					</Col>

					<Col md={3}>
						<Form.Group>
							<Form.Label>Пол</Form.Label>
							<Form.Select
								value={filter.gender || ''}
								onChange={e =>
									handleInputChange('gender', e.target.value || undefined)
								}
							>
								<option value=''>Все</option>
								{genders.map(gender => (
									<option key={gender} value={gender}>
										{gender}
									</option>
								))}
							</Form.Select>
						</Form.Group>
					</Col>

					<Col md={2}>
						<Form.Group>
							<Form.Label>Возраст от</Form.Label>
							<Form.Control
								type='number'
								placeholder='0'
								value={filter.min_age || ''}
								onChange={e =>
									handleInputChange(
										'min_age',
										e.target.value ? parseInt(e.target.value) : undefined
									)
								}
							/>
						</Form.Group>
					</Col>

					<Col md={2}>
						<Form.Group>
							<Form.Label>Возраст до</Form.Label>
							<Form.Control
								type='number'
								placeholder='120'
								value={filter.max_age || ''}
								onChange={e =>
									handleInputChange(
										'max_age',
										e.target.value ? parseInt(e.target.value) : undefined
									)
								}
							/>
						</Form.Group>
					</Col>

					<Col md={2} className='d-flex align-items-end'>
						<Button
							variant='outline-secondary'
							onClick={handleReset}
							className='w-100'
						>
							Сбросить
						</Button>
					</Col>
				</Row>
			</Form>
		</div>
	)
}

export default FilterPanel
