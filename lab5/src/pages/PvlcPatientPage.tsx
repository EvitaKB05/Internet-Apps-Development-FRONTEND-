import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap'
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
		<Container>
			<Breadcrumbs
				items={[
					{ label: 'Категории пациентов', path: '/pvlc_patients' },
					{ label: formula.title },
				]}
			/>

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

			<Row>
				<Col lg={6}>
					<Card className='mb-4'>
						<Card.Img
							variant='top'
							src={imageUrl}
							style={{ height: '400px', objectFit: 'contain', padding: '20px' }}
							onError={e => {
								;(e.target as HTMLImageElement).src = '/DefaultImage.jpg'
							}}
						/>
					</Card>
				</Col>

				<Col lg={6}>
					<Card className='h-100'>
						<Card.Body>
							<Card.Title className='h2 mb-3'>{formula.title}</Card.Title>

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
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	)
}

export default PvlcPatientPage
