// src/components/FormulaCard.tsx
import React from 'react'
import type { PvlcMedFormula } from '../types'
import { useNavigate } from 'react-router-dom'
import { apiService } from '../services/api'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../store' // ИСПРАВЛЕН ИМПОРТ
import { addToCart } from '../store/slices/medCartSlice'

interface FormulaCardProps {
	formula: PvlcMedFormula
}

const FormulaCard: React.FC<FormulaCardProps> = ({ formula }) => {
	const navigate = useNavigate()
	const dispatch = useDispatch<AppDispatch>()

	const { isAuthenticated } = useSelector((state: RootState) => state.auth)
	const { loading } = useSelector((state: RootState) => state.medCart)

	const handleDetailsClick = () => {
		navigate(`/pvlc_patient/${formula.id}`)
	}

	const handleAddToCart = async () => {
		if (!isAuthenticated) {
			navigate('/pvlc_login')
			return
		}

		try {
			await dispatch(addToCart(formula.id)).unwrap()
			// Можно добавить уведомление об успешном добавлении
		} catch (error) {
			console.error('Error adding to cart:', error)
		}
	}

	const imageUrl = apiService.getImageUrl(formula.image_url)

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

					{/* ДОБАВЛЕНА КНОПКА "ДОБАВИТЬ" */}
					{isAuthenticated && (
						<button
							className='btn btn-select'
							onClick={handleAddToCart}
							disabled={loading}
						>
							{loading ? 'Добавление...' : 'Добавить'}
						</button>
					)}
				</div>
			</div>
		</div>
	)
}

export default FormulaCard
