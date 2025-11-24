// src/pages/PvlcLoginPage.tsx
import React, { useState, useEffect } from 'react'
import { Container, Form, Button, Alert, Card, Spinner } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import type { AppDispatch, RootState } from '../store'
import { loginUser, clearError } from '../store/slices/authSlice'
import Breadcrumbs from '../components/Breadcrumbs'

const PvlcLoginPage: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>()
	const navigate = useNavigate()

	const { loading, error, isAuthenticated } = useSelector(
		(state: RootState) => state.auth
	)

	const [formData, setFormData] = useState({
		login: '',
		password: '',
	})

	// Редирект если уже авторизован
	useEffect(() => {
		if (isAuthenticated) {
			navigate('/pvlc_patients')
		}
	}, [isAuthenticated, navigate])

	// Очистка ошибки при размонтировании
	useEffect(() => {
		return () => {
			dispatch(clearError())
		}
	}, [dispatch])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		})
		// Очищаем ошибку при изменении полей
		if (error) {
			dispatch(clearError())
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!formData.login || !formData.password) {
			return
		}

		try {
			await dispatch(loginUser(formData)).unwrap()
			navigate('/pvlc_patients')
		} catch {
			// ИСПРАВЛЕНИЕ: Убрали неиспользуемую переменную error
			// Ошибка обрабатывается в слайсе
		}
	}

	return (
		<Container fluid className='px-0'>
			<Breadcrumbs items={[{ label: 'Авторизация' }]} />

			{/* Синий блок */}
			<div className='page-header'>
				<Container>
					<h1 className='page-title'>Авторизация в системе</h1>
				</Container>
			</div>

			<Container>
				<div className='d-flex justify-content-center'>
					<Card style={{ width: '400px', marginTop: '2rem' }}>
						<Card.Body>
							<h3 className='text-center mb-4'>Вход в систему</h3>

							{error && (
								<Alert variant='danger' className='mb-3'>
									{error}
								</Alert>
							)}

							<Form onSubmit={handleSubmit}>
								<Form.Group className='mb-3'>
									<Form.Label>Логин</Form.Label>
									<Form.Control
										type='text'
										name='login'
										value={formData.login}
										onChange={handleChange}
										placeholder='Введите ваш логин'
										required
										disabled={loading}
									/>
								</Form.Group>

								<Form.Group className='mb-4'>
									<Form.Label>Пароль</Form.Label>
									<Form.Control
										type='password'
										name='password'
										value={formData.password}
										onChange={handleChange}
										placeholder='Введите ваш пароль'
										required
										disabled={loading}
									/>
								</Form.Group>

								<Button
									variant='primary'
									type='submit'
									className='w-100'
									disabled={loading || !formData.login || !formData.password}
								>
									{loading ? (
										<>
											<Spinner
												as='span'
												animation='border'
												size='sm'
												role='status'
												aria-hidden='true'
												className='me-2'
											/>
											Вход...
										</>
									) : (
										'Войти'
									)}
								</Button>
							</Form>

							<div className='text-center mt-3'>
								<small className='text-muted'>
									Нет аккаунта?{' '}
									<Link to='/pvlc_register'>Зарегистрироваться</Link>
								</small>
							</div>
						</Card.Body>
					</Card>
				</div>
			</Container>
		</Container>
	)
}

export default PvlcLoginPage
