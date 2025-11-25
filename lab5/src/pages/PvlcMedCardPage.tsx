// src/pages/PvlcMedCardPage.tsx
import React, { useEffect, useState } from 'react'
import {
	Container,
	Alert,
	Spinner,
	Card,
	Row,
	Col,
	Badge,
	Button,
	Form,
} from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../store'
import {
	getMedCardDetails,
	deleteCalculation,
	updateMedCard,
	finalizeMedCard,
	deleteMedCard,
	clearError,
} from '../store/slices/medCartSlice'
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
	const dispatch = useDispatch<AppDispatch>()

	const { isAuthenticated } = useSelector((state: RootState) => state.auth)
	const { calculations, loading, error } = useSelector(
		(state: RootState) => state.medCart
	)

	const [medCard, setMedCard] = useState<MedCardDetail | null>(null)
	const [doctorName, setDoctorName] = useState('')
	const [isEditing, setIsEditing] = useState(false)

	// Загрузка данных заявки
	useEffect(() => {
		if (!id || !isAuthenticated) {
			navigate('/pvlc_login')
			return
		}

		const cardId = parseInt(id)
		dispatch(getMedCardDetails(cardId))
	}, [id, isAuthenticated, navigate, dispatch])

	// Обновление локального состояния при изменении данных из Redux
	useEffect(() => {
		if (calculations.length > 0 && id) {
			const cardId = parseInt(id)
			setMedCard({
				id: cardId,
				status: 'черновик', // По умолчанию, пока не загрузим реальный статус
				patient_name: 'Не указано',
				doctor_name: doctorName || 'Не указано',
				total_result: 0,
				created_at: new Date().toISOString(),
				med_calculations: calculations,
			})
		}
	}, [calculations, id, doctorName])

	// Очистка ошибок при размонтировании
	useEffect(() => {
		return () => {
			dispatch(clearError())
		}
	}, [dispatch])

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

	const handleDeleteCalculation = async (formulaId: number) => {
		if (!id) return

		try {
			await dispatch(
				deleteCalculation({
					cardId: parseInt(id),
					formulaId,
				})
			).unwrap()
		} catch (err) {
			console.error('Error deleting calculation:', err)
		}
	}

	const handleSaveDoctor = async () => {
		if (!id || !doctorName.trim()) return

		try {
			await dispatch(
				updateMedCard({
					cardId: parseInt(id),
					data: { doctor_name: doctorName },
				})
			).unwrap()
			setIsEditing(false)
		} catch (err) {
			console.error('Error updating doctor name:', err)
		}
	}

	const handleFinalize = async () => {
		if (!id) return

		try {
			await dispatch(finalizeMedCard(parseInt(id))).unwrap()
			// Обновляем данные заявки после формирования
			dispatch(getMedCardDetails(parseInt(id)))
		} catch (err) {
			console.error('Error finalizing med card:', err)
		}
	}

	const handleDelete = async () => {
		if (!id) return

		try {
			await dispatch(deleteMedCard(parseInt(id))).unwrap()
			navigate('/pvlc_patients')
		} catch (err) {
			console.error('Error deleting med card:', err)
		}
	}

	const isDraft = medCard?.status === 'черновик'

	if (!isAuthenticated) {
		return null
	}

	if (loading && !medCard) {
		return (
			<Container className='text-center py-5'>
				<Spinner animation='border' role='status'>
					<span className='visually-hidden'>Загрузка...</span>
				</Spinner>
				<div className='mt-2'>Загрузка заявки...</div>
			</Container>
		)
	}

	if (error && !medCard) {
		return (
			<Container>
				<Breadcrumbs
					items={[
						{ label: 'Мои заявки', path: '/pvlc_med_cards' },
						{ label: 'Не найдено' },
					]}
				/>
				<Alert variant='danger'>{error}</Alert>
				<Button variant='primary' onClick={() => navigate('/pvlc_med_cards')}>
					Вернуться к списку
				</Button>
			</Container>
		)
	}

	if (!medCard) {
		return (
			<Container>
				<Breadcrumbs
					items={[
						{ label: 'Мои заявки', path: '/pvlc_med_cards' },
						{ label: 'Не найдено' },
					]}
				/>
				<Alert variant='warning'>Заявка не найдена</Alert>
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
				{error && (
					<Alert variant='danger' className='mb-4'>
						{error}
					</Alert>
				)}

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

						{/* Поле для ввода врача */}
						<Card className='mt-3'>
							<Card.Body>
								<h5>Укажите врача</h5>
								<Row className='align-items-center'>
									<Col md={8}>
										<Form.Group>
											<Form.Control
												type='text'
												placeholder='Введите ФИО врача'
												value={doctorName}
												onChange={e => setDoctorName(e.target.value)}
												disabled={!isDraft || !isEditing}
											/>
										</Form.Group>
									</Col>
									<Col md={4}>
										{isEditing ? (
											<Button
												variant='success'
												onClick={handleSaveDoctor}
												className='w-100'
											>
												Сохранить
											</Button>
										) : (
											<Button
												variant='outline-primary'
												onClick={() => setIsEditing(true)}
												className='w-100'
												disabled={!isDraft}
											>
												Изменить
											</Button>
										)}
									</Col>
								</Row>
							</Card.Body>
						</Card>

						{/* Кнопки управления заявкой */}
						{isDraft && (
							<div className='mt-3 d-flex gap-2'>
								<Button
									variant='primary'
									onClick={handleFinalize}
									disabled={!doctorName.trim() || calculations.length === 0}
								>
									Сформировать заявку
								</Button>
								<Button variant='outline-danger' onClick={handleDelete}>
									Удалить заявку
								</Button>
							</div>
						)}
					</Card.Body>
				</Card>

				{/* Расчеты ДЖЕЛ в заявке */}
				<Card>
					<Card.Header>
						<h4 className='mb-0'>Расчеты ДЖЕЛ в заявке</h4>
					</Card.Header>
					<Card.Body>
						{calculations.length === 0 ? (
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
								{calculations.map(calc => (
									<Col key={calc.pvlc_med_formula_id} md={6} className='mb-3'>
										<Card>
											<Card.Body>
												<Row>
													<Col xs={3}>
														<img
															src={apiService.getImageUrl(calc.image_url)}
															alt={calc.title}
															className='img-fluid rounded'
															style={{ maxHeight: '80px' }}
															onError={e => {
																;(e.target as HTMLImageElement).src =
																	'/DefaultImage.jpg'
															}}
														/>
													</Col>
													<Col xs={7}>
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
													<Col
														xs={2}
														className='d-flex align-items-start justify-content-end'
													>
														{isDraft && (
															<Button
																variant='outline-danger'
																size='sm'
																onClick={() =>
																	handleDeleteCalculation(
																		calc.pvlc_med_formula_id
																	)
																}
																title='Удалить расчет'
															>
																🗑️
															</Button>
														)}
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
