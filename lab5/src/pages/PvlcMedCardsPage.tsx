// src/pages/PvlcMedCardsPage.tsx
import React, { useEffect } from 'react'
import {
	Container,
	Table,
	Alert,
	Spinner,
	Badge,
	//Button,
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { AppDispatch, RootState } from '../store' // ИСПРАВЛЕН ИМПОРТ
import { getMedCards } from '../store/slices/medCardsSlice'
import Breadcrumbs from '../components/Breadcrumbs'

const PvlcMedCardsPage: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>()
	const navigate = useNavigate()

	const { cards, loading, error } = useSelector(
		(state: RootState) => state.medCards
	)
	const { isAuthenticated } = useSelector((state: RootState) => state.auth)

	useEffect(() => {
		if (isAuthenticated) {
			dispatch(getMedCards())
		}
	}, [dispatch, isAuthenticated])

	// Редирект если не авторизован
	useEffect(() => {
		if (!isAuthenticated) {
			navigate('/pvlc_login')
		}
	}, [isAuthenticated, navigate])

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
		return new Date(dateString).toLocaleDateString('ru-RU')
	}

	const handleCardClick = (cardId: number) => {
		navigate(`/pvlc_med_card/${cardId}`)
	}

	if (!isAuthenticated) {
		return null
	}

	return (
		<Container fluid className='px-0'>
			<Breadcrumbs items={[{ label: 'Мои заявки', path: '/pvlc_med_cards' }]} />

			{/* Синий блок */}
			<div className='page-header'>
				<Container>
					<h1 className='page-title'>Мои заявки на расчет ДЖЕЛ</h1>
				</Container>
			</div>

			<Container>
				{error && (
					<Alert variant='danger' className='mb-4'>
						{error}
					</Alert>
				)}

				{loading ? (
					<div className='text-center py-5'>
						<Spinner animation='border' role='status'>
							<span className='visually-hidden'>Загрузка...</span>
						</Spinner>
						<div className='mt-2'>Загрузка заявок...</div>
					</div>
				) : cards.length === 0 ? (
					<Alert variant='info'>
						У вас пока нет заявок.{' '}
						{/* <Button variant='link' onClick={() => navigate('/pvlc_patients')}>
							Создать первую заявку
						</Button> */}
					</Alert>
				) : (
					<Table responsive striped bordered hover>
						<thead>
							<tr>
								<th>ID</th>
								<th>Статус</th>
								<th>Пациент</th>
								<th>Врач</th>
								<th>Результат ДЖЕЛ</th>
								<th>Дата создания</th>
								<th>Дата завершения</th>
							</tr>
						</thead>
						<tbody>
							{cards.map(card => (
								<tr
									key={card.id}
									onClick={() => handleCardClick(card.id)}
									style={{ cursor: 'pointer' }}
								>
									<td>{card.id}</td>
									<td>
										<Badge bg={getStatusVariant(card.status)}>
											{card.status}
										</Badge>
									</td>
									<td>{card.patient_name}</td>
									<td>{card.doctor_name}</td>
									<td>
										{card.total_result
											? `${card.total_result.toFixed(2)} л`
											: '-'}
									</td>
									<td>{formatDate(card.created_at)}</td>
									<td>
										{card.completed_at ? formatDate(card.completed_at) : '-'}
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				)}
			</Container>
		</Container>
	)
}

export default PvlcMedCardsPage
