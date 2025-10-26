import React from 'react'
import type { PvlcMedFormula } from '../types'
import { useNavigate } from 'react-router-dom'

interface FormulaCardProps {
	formula: PvlcMedFormula
}

const FormulaCard: React.FC<FormulaCardProps> = ({ formula }) => {
	const navigate = useNavigate()

	const handleDetailsClick = () => {
		navigate(`/pvlc_patient/${formula.id}`)
	}

	const imageUrl = formula.image_url
		? `http://localhost:9000/pics/${formula.image_url}`
		: '/DefaultImage.jpg'

	return (
		<div className='service-card'>
			<div className='card-image'>
				<img
					src={imageUrl}
					alt={formula.title}
					className='service-image'
					onError={e => {
						;(e.target as HTMLImageElement).src = '/DefaultImage.jpg'
					}}
				/>
			</div>
			<div className='card-content'>
				<h3 className='card-title'>{formula.title}</h3>

				<div className='card-buttons'>
					<button className='btn btn-details' onClick={handleDetailsClick}>
						Подробнее
					</button>
				</div>
			</div>
		</div>
	)
}

export default FormulaCard
