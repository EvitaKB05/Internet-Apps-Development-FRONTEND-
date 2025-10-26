import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Breadcrumbs from '../components/Breadcrumbs'

const HomePage: React.FC = () => {
	return (
		<Container>
			<Breadcrumbs items={[]} />

			<Row className='mb-5'>
				<Col>
					<div className='text-center mb-5'>
						<h1 className='display-4 text-primary mb-3'>
							Лёгкая Жизнь - Расчет ДЖЕЛ
						</h1>
						<p className='lead'>
							Система для расчета должной жизненной емкости легких (ДЖЕЛ) с
							использованием современных медицинских формул
						</p>
					</div>
				</Col>
			</Row>
		</Container>
	)
}

export default HomePage
