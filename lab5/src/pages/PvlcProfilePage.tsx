import React from 'react'
import { Container, Card, Row, Col, Badge, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { RootState } from '../store'
import Breadcrumbs from '../components/Breadcrumbs'

const PvlcProfilePage: React.FC = () => {
	const navigate = useNavigate()
	const { user, isAuthenticated } = useSelector(
		(state: RootState) => state.auth
	)

	// Редирект если не авторизован
	React.useEffect(() => {
		if (!isAuthenticated) {
			navigate('/pvlc_login')
		}
	}, [isAuthenticated, navigate])

	if (!isAuthenticated || !user) {
		return null
	}

	return (
		<Container fluid className='px-0'>
			<Breadcrumbs items={[{ label: 'Личный кабинет' }]} />

			{/* Синий блок */}
			<div className='page-header'>
				<Container>
					<h1 className='page-title'>Личный кабинет</h1>
				</Container>
			</div>

			<Container>
				<Row className='justify-content-center'>
					<Col md={8} lg={6}>
						<Card>
							<Card.Header>
								<h4 className='mb-0'>Информация о пользователе</h4>
							</Card.Header>
							<Card.Body>
								<Row className='mb-3'>
									<Col sm={4}>
										<strong>Логин:</strong>
									</Col>
									<Col sm={8}>{user.login}</Col>
								</Row>

								<Row className='mb-3'>
									<Col sm={4}>
										<strong>ID пользователя:</strong>
									</Col>
									<Col sm={8}>{user.id}</Col>
								</Row>

								<Row className='mb-3'>
									<Col sm={4}>
										<strong>Роль:</strong>
									</Col>
									<Col sm={8}>
										{user.is_moderator ? (
											<Badge bg='warning' text='dark'>
												Модератор
											</Badge>
										) : (
											<Badge bg='secondary'>Пользователь</Badge>
										)}
									</Col>
								</Row>

								<Row className='mt-4'>
									<Col>
										<Button
											variant='primary'
											onClick={() => navigate('/pvlc_med_cards')}
										>
											Мои заявки
										</Button>{' '}
										<Button
											variant='outline-secondary'
											onClick={() => navigate('/pvlc_patients')}
										>
											Калькулятор ДЖЕЛ
										</Button>
									</Col>
								</Row>
							</Card.Body>
						</Card>

						{/* Дополнительная информация */}
						<Card className='mt-4'>
							<Card.Header>
								<h5 className='mb-0'>Управление аккаунтом</h5>
							</Card.Header>
							<Card.Body>
								<p>Здесь можно добавить функционал для:</p>
								<ul>
									<li>Смены пароля</li>
									<li>Редактирования профиля</li>
									<li>Истории действий</li>
									<li>Настроек уведомлений</li>
								</ul>
								<Button variant='outline-primary' disabled>
									Изменить пароль (в разработке)
								</Button>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		</Container>
	)
}

export default PvlcProfilePage
