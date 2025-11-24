// src/pages/PvlcMedCardPage.tsx
import React, { useEffect, useState, useCallback } from 'react' // ИСПРАВЛЕНИЕ: Добавлен useCallback
import {
	Container,
	Alert,
	Spinner,
	Card,
	Row,
	Col,
	Badge,
	Button,
} from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'
import Breadcrumbs from '../components/Breadcrumbs'
import { apiService } from '../services/api'

interface MedCalculation {
	pvlc_med_formula_id: number
	title: string
	description: string
	formula: string
	image_url: string
	input_height: number
	final_result: number
}

interface MedCardDetail {
	id: number
	status: string
	patient_name: string
	doctor_name: string
	total_result: number
	created_at: string
	finalized_at?: string
	completed_at?: string
	med_calculations: MedCalculation[]
}

const PvlcMedCardPage: React.FC = () => {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()

	const { isAuthenticated } = useSelector((state: RootState) => state.auth)

	const [medCard, setMedCard] = useState<MedCardDetail | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// ИСПРАВЛЕНИЕ: Выносим loadMedCard в useCallback
	const loadMedCard = useCallback(async () => {
		if (!id || !isAuthenticated) return

		try {
			setLoading(true)
			setError(null)

			// Здесь будет вызов API для получения детальной информации о заявке
			// const response = await api.pvlcMedCards.pvlcMedCardsRead(id!)
			// setMedCard(response.data)

			// Временные мок-данные
			const mockMedCard: MedCardDetail = {
				id: parseInt(id!),
				status: 'черновик',
				patient_name: 'Иванов Иван',
				doctor_name: 'Петрова А.С.',
				total_result: 4.2,
				created_at: new Date().toISOString(),
				med_calculations: [
					{
						pvlc_med_formula_id: 1,
						title: 'Мужчины 18-60 лет',
						description: 'Расчет ДЖЕЛ для взрослых мужчин',
						formula: 'ДЖЕЛ (л) = (0.052 × Рост) - (0.022 × Возраст) - 3.60',
						image_url: 'men_18_60.png',
						input_height: 180,
						final_result: 4.2,
					},
				],
			}

			setMedCard(mockMedCard)
		} catch (err) {
			setError('Ошибка загрузки заявки')
			console.error('Error loading med card:', err)
		} finally {
			setLoading(false)
		}
	}, [id, isAuthenticated]) // ИСПРАВЛЕНИЕ: Добавлены зависимости

	// ИСПРАВЛЕНИЕ: Теперь используем loadMedCard в useCallback
	useEffect(() => {
		if (!isAuthenticated) {
			navigate('/pvlc_login')
			return
		}

		loadMedCard()
	}, [loadMedCard, isAuthenticated, navigate]) // ИСПРАВЛЕНИЕ: Добавлены правильные зависимости

	const getStatusVariant = (status: string) => {
		switch (status) {
			case 'черновик':
				return 'secondary'
			case 'сформирован':
				return 'primary'
			case 'завершен':
				return 'success'
			case 'отклонен':
				return 'danger'
			default:
				return 'secondary'
		}
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('ru-RU', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		})
	}

	const isDraft = medCard?.status === 'черновик'

	if (!isAuthenticated) {
		return null
	}

	if (loading) {
		return (
			<Container className='text-center py-5'>
				<Spinner animation='border' role='status'>
					<span className='visually-hidden'>Загрузка...</span>
				</Spinner>
				<div className='mt-2'>Загрузка заявки...</div>
			</Container>
		)
	}

	if (error || !medCard) {
		return (
			<Container>
				<Breadcrumbs
					items={[
						{ label: 'Мои заявки', path: '/pvlc_med_cards' },
						{ label: 'Не найдено' },
					]}
				/>
				<Alert variant='danger'>{error || 'Заявка не найдена'}</Alert>
				<Button variant='primary' onClick={() => navigate('/pvlc_med_cards')}>
					Вернуться к списку
				</Button>
			</Container>
		)
	}

	return (
		<Container fluid className='px-0'>
			<Breadcrumbs
				items={[
					{ label: 'Мои заявки', path: '/pvlc_med_cards' },
					{ label: `Заявка #${medCard.id}` },
				]}
			/>

			{/* Синий блок */}
			<div className='page-header'>
				<Container>
					<h1 className='page-title'>Заявка на расчет ДЖЕЛ #{medCard.id}</h1>
				</Container>
			</div>

			<Container>
				<Card className='mb-4'>
					<Card.Header>
						<Row className='align-items-center'>
							<Col>
								<h4 className='mb-0'>Информация о заявке</h4>
							</Col>
							<Col xs='auto'>
								<Badge bg={getStatusVariant(medCard.status)}>
									{medCard.status}
								</Badge>
							</Col>
						</Row>
					</Card.Header>
					<Card.Body>
						<Row>
							<Col md={6}>
								<p>
									<strong>Пациент:</strong> {medCard.patient_name}
								</p>
								<p>
									<strong>Врач:</strong> {medCard.doctor_name}
								</p>
							</Col>
							<Col md={6}>
								<p>
									<strong>Дата создания:</strong>{' '}
									{formatDate(medCard.created_at)}
								</p>
								<p>
									<strong>Общий результат ДЖЕЛ:</strong>{' '}
									{medCard.total_result
										? `${medCard.total_result.toFixed(2)} л`
										: 'Не рассчитан'}
								</p>
								{medCard.completed_at && (
									<p>
										<strong>Дата завершения:</strong>{' '}
										{formatDate(medCard.completed_at)}
									</p>
								)}
							</Col>
						</Row>

						{isDraft && (
							<div className='mt-3'>
								<Button variant='primary' className='me-2'>
									Редактировать
								</Button>
								<Button variant='outline-danger'>Удалить заявку</Button>
							</div>
						)}
					</Card.Body>
				</Card>

				<Card>
					<Card.Header>
						<h4 className='mb-0'>Расчеты ДЖЕЛ в заявке</h4>
					</Card.Header>
					<Card.Body>
						{medCard.med_calculations.length === 0 ? (
							<Alert variant='info'>
								В заявке пока нет расчетов.{' '}
								<Button
									variant='link'
									onClick={() => navigate('/pvlc_patients')}
								>
									Добавить расчеты
								</Button>
							</Alert>
						) : (
							<Row>
								{medCard.med_calculations.map(calc => (
									<Col key={calc.pvlc_med_formula_id} md={6} className='mb-3'>
										<Card>
											<Card.Body>
												<Row>
													<Col xs={4}>
														<img
															src={apiService.getImageUrl(calc.image_url)}
															alt={calc.title}
															className='img-fluid rounded'
															style={{ maxHeight: '100px' }}
															onError={e => {
																;(e.target as HTMLImageElement).src =
																	'/DefaultImage.jpg'
															}}
														/>
													</Col>
													<Col xs={8}>
														<h6>{calc.title}</h6>
														<p className='text-muted small mb-1'>
															{calc.description}
														</p>
														<p className='small mb-1'>
															<strong>Формула:</strong> {calc.formula}
														</p>
														<p className='small mb-1'>
															<strong>Рост:</strong> {calc.input_height} см
														</p>
														<p className='small mb-0'>
															<strong>Результат:</strong>{' '}
															{calc.final_result.toFixed(2)} л
														</p>
													</Col>
												</Row>
											</Card.Body>
										</Card>
									</Col>
								))}
							</Row>
						)}
					</Card.Body>
				</Card>
			</Container>
		</Container>
	)
}

export default PvlcMedCardPage
