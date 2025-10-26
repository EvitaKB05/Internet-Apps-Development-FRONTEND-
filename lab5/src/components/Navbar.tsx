import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'

const CustomNavbar: React.FC = () => {
	const location = useLocation()

	return (
		<Navbar bg='light' expand='lg' className='mb-4'>
			<Container>
				<Navbar.Brand as={Link} to='/'>
					<img
						src='/lung.png'
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
						<Nav.Link as={Link} to='/'>
							Главная
						</Nav.Link>
						<Nav.Link as={Link} to='/formulas'>
							Формулы ДЖЕЛ
						</Nav.Link>
					</Nav>
					<Nav>
						<Nav.Link
							href='http://localhost:8080/swagger/index.html'
							target='_blank'
						>
							API Docs
						</Nav.Link>
						<Nav.Link href='http://localhost:8081' target='_blank'>
							Adminer
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}

export default CustomNavbar
