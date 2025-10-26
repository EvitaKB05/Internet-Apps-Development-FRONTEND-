import React, { useState, useEffect } from 'react'
import { Container, Alert, Spinner } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import type { PvlcMedFormula } from '../types'
import { apiService } from '../services/api'
import Breadcrumbs from '../components/Breadcrumbs'

const PvlcPatientPage: React.FC = () => {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const [formula, setFormula] = useState<PvlcMedFormula | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (id) {
			loadFormula(parseInt(id))
		}
	}, [id])

	const loadFormula = async (formulaId: number) => {
		try {
			setLoading(true)
			setError(null)
			const data = await apiService.getFormulaById(formulaId)
			if (data) {
				setFormula(data)
			} else {
				setError('Категория не найдена')
			}
		} catch (err) {
			setError('Ошибка загрузки категории')
			console.error('Error loading formula:', err)
		} finally {
			setLoading(false)
		}
	}

	const handleBackClick = () => {
		navigate('/pvlc_patients')
	}

	if (loading) {
		return (
			<Container className='text-center py-5'>
				<Spinner animation='border' role='status'>
					<span className='visually-hidden'>Загрузка...</span>
				</Spinner>
				<div className='mt-2'>Загрузка категории...</div>
			</Container>
		)
	}

	if (error || !formula) {
		return (
			<Container>
				<Breadcrumbs
					items={[
						{ label: 'Категории пациентов', path: '/pvlc_patients' },
						{ label: 'Не найдено' },
					]}
				/>
				<Alert variant='danger'>{error || 'Категория не найдена'}</Alert>
				<button className='btn btn-primary' onClick={handleBackClick}>
					Вернуться к списку
				</button>
			</Container>
		)
	}

	const imageUrl = formula.image_url
		? `http://localhost:9000/pics/${formula.image_url}`
		: '/DefaultImage.jpg'

	return (
		<Container fluid className='px-0'>
			<Breadcrumbs
				items={[
					{ label: 'Категории пациентов', path: '/pvlc_patients' },
					{ label: formula.title },
				]}
			/>

			<Container>
				{/*<Row>
					<Col>
						<button
							className='btn btn-outline-secondary mb-3'
							onClick={handleBackClick}
						>
							← Назад к списку
						</button>
					</Col>
				</Row> */}

				<div className='service-detail'>
					<div className='service-content-wrapper'>
						<div className='service-image-container'>
							<img
								src={imageUrl}
								alt={formula.title}
								className='service-main-image'
								onError={e => {
									;(e.target as HTMLImageElement).src = '/DefaultImage.jpg'
								}}
							/>
						</div>

						<div className='service-info-container'>
							<h2 className='service-title'>{formula.title}</h2>

							<div className='service-meta'>
								<p className='meta-item'>
									<strong>Категория:</strong> {formula.category}
								</p>
								<p className='meta-item'>
									<strong>Пол:</strong> {formula.gender}
								</p>
								<p className='meta-item'>
									<strong>Возраст:</strong> {formula.min_age}-{formula.max_age}{' '}
									лет
								</p>
								<p className='meta-item'>
									<strong>Формула расчёта:</strong> {formula.formula}
								</p>
								<p className='meta-item'>
									<strong>Описание:</strong> {formula.description}
								</p>
							</div>
						</div>
					</div>
				</div>
			</Container>
		</Container>
	)
}

export default PvlcPatientPage
