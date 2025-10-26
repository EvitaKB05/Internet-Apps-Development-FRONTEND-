import React from 'react'
import { Card, Button, Badge } from 'react-bootstrap'
import type { PvlcMedFormula } from '../types'
import { useNavigate } from 'react-router-dom'

interface FormulaCardProps {
	formula: PvlcMedFormula
}

const FormulaCard: React.FC<FormulaCardProps> = ({ formula }) => {
	const navigate = useNavigate()

	const handleDetailsClick = () => {
		navigate(`/formulas/${formula.id}`)
	}

	const imageUrl = formula.image_url
		? `http://localhost:9000/pics/${formula.image_url}`
		: '/DefaultImage.jpg'

	return (
		<Card className='h-100 shadow-sm'>
			<Card.Img
				variant='top'
				src={imageUrl}
				style={{ height: '200px', objectFit: 'contain', padding: '10px' }}
				onError={e => {
					;(e.target as HTMLImageElement).src = '/DefaultImage.jpg'
				}}
			/>
			<Card.Body className='d-flex flex-column'>
				<Card.Title className='fs-6'>{formula.title}</Card.Title>

				<div className='mb-2'>
					<Badge bg='primary' className='me-1'>
						{formula.category}
					</Badge>
					<Badge bg='secondary' className='me-1'>
						{formula.gender}
					</Badge>
					<Badge bg='info'>
						{formula.min_age}-{formula.max_age} лет
					</Badge>
				</div>

				<Card.Text className='flex-grow-1 small text-muted'>
					{formula.description}
				</Card.Text>

				<Button
					variant='outline-primary'
					size='sm'
					onClick={handleDetailsClick}
				>
					Подробнее
				</Button>
			</Card.Body>
		</Card>
	)
}

export default FormulaCard
