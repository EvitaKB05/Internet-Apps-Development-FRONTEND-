import React, { useState, useEffect } from 'react'
import {
	Container,
	Row,
	Col,
	Card,
	Alert,
	Spinner,
	Badge,
} from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import type { PvlcMedFormula } from '../types'
import { apiService } from '../services/api'
import Breadcrumbs from '../components/Breadcrumbs'

const FormulaDetailPage: React.FC = () => {
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
				setError('Формула не найдена')
			}
		} catch (err) {
			setError('Ошибка загрузки формулы')
			console.error('Error loading formula:', err)
		} finally {
			setLoading(false)
		}
	}

	const handleBackClick = () => {
		navigate('/formulas')
	}

	if (loading) {
		return (
			<Container className='text-center py-5'>
				<Spinner animation='border' role='status'>
					<span className='visually-hidden'>Загрузка...</span>
				</Spinner>
				<div className='mt-2'>Загрузка формулы...</div>
			</Container>
		)
	}

	if (error || !formula) {
		return (
			<Container>
				<Breadcrumbs
					items={[
						{ label: 'Формулы ДЖЕЛ', path: '/formulas' },
						{ label: 'Не найдено' },
					]}
				/>
				<Alert variant='danger'>{error || 'Формула не найдена'}</Alert>
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
					{ label: 'Формулы ДЖЕЛ', path: '/formulas' },
					{ label: formula.title },
				]}
			/>

			<Row>
				<Col>
					<button
						className='btn btn-outline-secondary mb-3'
						onClick={handleBackClick}
					>
						← Назад к списку
					</button>
				</Col>
			</Row>

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

							<div className='mb-4'>
								<Badge bg='primary' className='me-2 fs-6'>
									{formula.category}
								</Badge>
								<Badge bg='secondary' className='me-2 fs-6'>
									{formula.gender}
								</Badge>
								<Badge bg='info' className='fs-6'>
									{formula.min_age}-{formula.max_age} лет
								</Badge>
							</div>

							<Card.Text className='fs-5 text-muted mb-4'>
								{formula.description}
							</Card.Text>

							<div className='mb-4'>
								<h5 className='text-primary'>Формула расчета:</h5>
								<Card className='bg-light'>
									<Card.Body>
										<code className='fs-5'>{formula.formula}</code>
									</Card.Body>
								</Card>
							</div>

							<div className='mt-4'>
								<h6>Методика применения:</h6>
								<ul>
									<li>Измерьте рост пациента в сантиметрах</li>
									<li>Определите возраст пациента в годах</li>
									<li>Подставьте значения в формулу</li>
									<li>Полученный результат - ДЖЕЛ в литрах</li>
								</ul>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row className='mt-4'>
				<Col>
					<Card className='bg-light'>
						<Card.Body>
							<Card.Title>Медицинская справка</Card.Title>
							<Card.Text>
								ДЖЕЛ (должная жизненная емкость легких) - это расчетный
								показатель нормальной емкости легких для человека определенного
								пола, возраста и роста. Используется для оценки функции внешнего
								дыхания и диагностики рестриктивных заболеваний легких.
							</Card.Text>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	)
}

export default FormulaDetailPage
