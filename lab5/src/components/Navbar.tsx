// src/components/Navbar.tsx
import React from 'react'
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../store'
import { logoutUser } from '../store/slices/authSlice'
import { clearCart } from '../store/slices/medCartSlice'
import { resetFilters } from '../store/slices/filterSlice'

const CustomNavbar: React.FC = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const dispatch = useDispatch<AppDispatch>()

	const { isAuthenticated, user } = useSelector(
		(state: RootState) => state.auth
	)
	// ИСПРАВЛЕНИЕ: Убрали неиспользуемую переменную itemCount
	//const { itemCount } = useSelector((state: RootState) => state.medCart)

	const handleLogout = async () => {
		try {
			await dispatch(logoutUser()).unwrap()
			dispatch(clearCart())
			dispatch(resetFilters())
			navigate('/pvlc_patients')
		} catch (error) {
			console.error('Logout error:', error)
		}
	}

	return (
		<Navbar bg='light' expand='lg' className='mb-4'>
			<Container>
				<Navbar.Brand as={Link} to='/pvlc_home_page'>
					<img
						src='./lung.png'
						width='30'
						height='30'
						className='d-inline-block align-top me-2'
						alt='Лёгкая Жизнь'
					/>
					Лёгкая Жизнь - Расчет ДЖЕЛ
				</Navbar.Brand>
				<Navbar.Toggle aria-controls='basic-navbar-nav' />
				<Navbar.Collapse id='basic-navbar-nav'>
					<Nav className='me-auto' activeKey={location.pathname}>
						<Nav.Link as={Link} to='/pvlc_home_page'>
							Главная
						</Nav.Link>
						<Nav.Link as={Link} to='/pvlc_patients'>
							Категории пациентов
						</Nav.Link>

						{/* ДОБАВЛЕНЫ НОВЫЕ ПУНКТЫ МЕНЮ */}
						{isAuthenticated && (
							<>
								<Nav.Link as={Link} to='/pvlc_med_cards'>
									Мои заявки
								</Nav.Link>
								<Nav.Link as={Link} to='/pvlc_profile'>
									Личный кабинет
								</Nav.Link>
							</>
						)}
					</Nav>
					<Nav>
						{isAuthenticated ? (
							<>
								{/* Отображение имени пользователя */}
								<Nav.Item className='d-flex align-items-center me-3'>
									<span className='text-dark'>
										<strong>{user?.login}</strong>
										{user?.is_moderator && (
											<Badge bg='warning' text='dark' className='ms-1'>
												Модератор
											</Badge>
										)}
									</span>
								</Nav.Item>

								{/* Кнопка выхода */}
								<Button
									variant='outline-danger'
									size='sm'
									onClick={handleLogout}
								>
									Выйти
								</Button>
							</>
						) : (
							<>
								{/* Кнопки входа и регистрации */}
								<Nav.Link as={Link} to='/pvlc_login' className='me-2'>
									Войти
								</Nav.Link>
								{/* ИСПРАВЛЕНИЕ: Убрали as={Link} для Button, используем onClick */}
								<Button
									variant='primary'
									size='sm'
									onClick={() => navigate('/pvlc_register')}
								>
									Регистрация
								</Button>
							</>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}

export default CustomNavbar
