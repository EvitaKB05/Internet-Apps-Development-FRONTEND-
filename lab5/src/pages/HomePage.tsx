import React from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'

const HomePage: React.FC = () => {
	const navigate = useNavigate()

	const handleNavigateToFormulas = () => {
		navigate('/formulas')
	}

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

			<Row className='mb-5'>
				<Col md={6}>
					<Card className='h-100 shadow'>
						<Card.Body>
							<Card.Title>О системе</Card.Title>
							<Card.Text>
								Наша система предоставляет точные расчеты ДЖЕЛ для различных
								возрастных групп и полов. Мы используем проверенные медицинские
								формулы, рекомендованные ведущими пульмонологами.
							</Card.Text>
							<Card.Text>
								ДЖЕЛ - важный показатель функции внешнего дыхания, который
								используется для диагностики заболеваний легких и оценки
								эффективности лечения.
							</Card.Text>
						</Card.Body>
					</Card>
				</Col>

				<Col md={6}>
					<Card className='h-100 shadow'>
						<Card.Body>
							<Card.Title>Возможности</Card.Title>
							<ul>
								<li>Расчет ДЖЕЛ для 9 различных категорий пациентов</li>
								<li>Возрастные группы от 4 до 120 лет</li>
								<li>Раздельные формулы для мужчин и женщин</li>
								<li>Подробное описание каждой формулы</li>
								<li>Визуализация результатов</li>
							</ul>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col className='text-center'>
					<Button
						variant='primary'
						size='lg'
						onClick={handleNavigateToFormulas}
					>
						Перейти к расчетам ДЖЕЛ
					</Button>
				</Col>
			</Row>

			<Row className='mt-5'>
				<Col>
					<Card className='bg-light'>
						<Card.Body>
							<Card.Title>Медицинские категории</Card.Title>
							<Row>
								<Col md={4}>
									<h6>Дети</h6>
									<small className='text-muted'>
										Дошкольный и младший школьный возраст (4-12 лет)
									</small>
								</Col>
								<Col md={4}>
									<h6>Подростки</h6>
									<small className='text-muted'>
										Подростковый возраст (13-17 лет)
									</small>
								</Col>
								<Col md={4}>
									<h6>Взрослые и пожилые</h6>
									<small className='text-muted'>
										Взрослые (18-60 лет) и пожилые (60+ лет)
									</small>
								</Col>
							</Row>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	)
}

export default HomePage
