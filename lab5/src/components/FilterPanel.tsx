import React from 'react'
import { Form, Row, Col, Button } from 'react-bootstrap'
import type { PvlcMedFormulaFilter } from '../types'

interface FilterPanelProps {
	filter: PvlcMedFormulaFilter
	onFilterChange: (filter: PvlcMedFormulaFilter) => void
	categories: string[]
	genders: string[]
	onReset: () => void
}

const FilterPanel: React.FC<FilterPanelProps> = ({
	filter,
	onFilterChange,
	categories,
	genders,
	onReset,
}) => {
	const handleInputChange = (
		field: keyof PvlcMedFormulaFilter,
		value: string | number | boolean | undefined
	) => {
		onFilterChange({
			...filter,
			[field]: value,
		})
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
							onClick={onReset}
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
