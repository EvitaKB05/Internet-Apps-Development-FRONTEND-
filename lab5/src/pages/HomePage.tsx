import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Breadcrumbs from '../components/Breadcrumbs'

const HomePage: React.FC = () => {
	return (
		<Container fluid className='px-0'>
			{' '}
			{/* Убираем отступы для полной ширины */}
			<Breadcrumbs items={[]} />
			{/* Заголовок страницы как в исходнике */}
			<div className='page-header'>
				<Container>
					<h1 className='page-title'>
						Расчёт должной жизненной емкости лёгких (ДЖЕЛ)
					</h1>
				</Container>
			</div>
			<Container>
				<Row className='mb-5'>
					<Col>
						<div className='text-center mb-5'>
							<p className='lead'>
								Система для расчета должной жизненной емкости легких (ДЖЕЛ) с
								использованием современных медицинских формул
							</p>
						</div>
					</Col>
				</Row>
			</Container>
		</Container>
	)
}

export default HomePage
