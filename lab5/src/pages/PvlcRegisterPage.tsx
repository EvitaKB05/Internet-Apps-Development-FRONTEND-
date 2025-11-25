// src/pages/PvlcRegisterPage.tsx
import React, { useState, useEffect } from 'react'
import { Container, Form, Button, Alert, Card, Spinner } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'
import { apiService } from '../services/api'
import Breadcrumbs from '../components/Breadcrumbs'

const PvlcRegisterPage: React.FC = () => {
	const navigate = useNavigate()

	const { isAuthenticated } = useSelector((state: RootState) => state.auth)

	const [formData, setFormData] = useState({
		login: '',
		password: '',
		confirmPassword: '',
		is_moderator: false,
	})

	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')
	const [loading, setLoading] = useState(false)

	// Редирект если уже авторизован
	useEffect(() => {
		if (isAuthenticated) {
			navigate('/pvlc_patients')
		}
	}, [isAuthenticated, navigate])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target
		setFormData({
			...formData,
			[name]: type === 'checkbox' ? checked : value,
		})
		setError('')
		setSuccess('')
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setError('')
		setSuccess('')

		if (!formData.login || !formData.password) {
			setError('Заполните все обязательные поля')
			setLoading(false)
			return
		}

		if (formData.password !== formData.confirmPassword) {
			setError('Пароли не совпадают')
			setLoading(false)
			return
		}

		if (formData.password.length < 6) {
			setError('Пароль должен содержать минимум 6 символов')
			setLoading(false)
			return
		}

		try {
			// ИСПРАВЛЕНИЕ: Используем apiService для регистрации
			await apiService.registerUser({
				login: formData.login,
				password: formData.password,
				is_moderator: formData.is_moderator,
			})

			setSuccess('Регистрация успешна! Теперь вы можете войти в систему.')
			setFormData({
				login: '',
				password: '',
				confirmPassword: '',
				is_moderator: false,
			})

			// Автоматический редирект на страницу логина через 2 секунды
			setTimeout(() => {
				navigate('/pvlc_login')
			}, 2000)
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error
					? err.message
					: 'Ошибка регистрации. Попробуйте еще раз.'
			setError(errorMessage)
		} finally {
			setLoading(false)
		}
	}

	return (
		<Container fluid className='px-0'>
			<Breadcrumbs items={[{ label: 'Регистрация' }]} />

			{/* Синий блок */}
			<div className='page-header'>
				<Container>
					<h1 className='page-title'>Регистрация в системе</h1>
				</Container>
			</div>

			<Container>
				<div className='d-flex justify-content-center'>
					<Card style={{ width: '400px', marginTop: '2rem' }}>
						<Card.Body>
							<h3 className='text-center mb-4'>Создать аккаунт</h3>

							{error && (
								<Alert variant='danger' className='mb-3'>
									{error}
								</Alert>
							)}

							{success && (
								<Alert variant='success' className='mb-3'>
									{success}
								</Alert>
							)}

							<Form onSubmit={handleSubmit}>
								<Form.Group className='mb-3'>
									<Form.Label>Логин *</Form.Label>
									<Form.Control
										type='text'
										name='login'
										value={formData.login}
										onChange={handleChange}
										placeholder='Придумайте логин'
										required
										disabled={loading}
									/>
								</Form.Group>

								<Form.Group className='mb-3'>
									<Form.Label>Пароль *</Form.Label>
									<Form.Control
										type='password'
										name='password'
										value={formData.password}
										onChange={handleChange}
										placeholder='Придумайте пароль'
										required
										disabled={loading}
									/>
								</Form.Group>

								<Form.Group className='mb-3'>
									<Form.Label>Подтверждение пароля *</Form.Label>
									<Form.Control
										type='password'
										name='confirmPassword'
										value={formData.confirmPassword}
										onChange={handleChange}
										placeholder='Повторите пароль'
										required
										disabled={loading}
									/>
								</Form.Group>

								<Form.Group className='mb-4'>
									<Form.Check
										type='checkbox'
										name='is_moderator'
										label='Регистрация как модератор'
										checked={formData.is_moderator}
										onChange={handleChange}
										disabled={loading}
									/>
								</Form.Group>

								<Button
									variant='primary'
									type='submit'
									className='w-100'
									disabled={
										loading ||
										!formData.login ||
										!formData.password ||
										!formData.confirmPassword
									}
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
											Регистрация...
										</>
									) : (
										'Зарегистрироваться'
									)}
								</Button>
							</Form>

							<div className='text-center mt-3'>
								<small className='text-muted'>
									Уже есть аккаунт? <Link to='/pvlc_login'>Войти</Link>
								</small>
							</div>
						</Card.Body>
					</Card>
				</div>
			</Container>
		</Container>
	)
}

export default PvlcRegisterPage
