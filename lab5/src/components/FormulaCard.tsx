// src/components/FormulaCard.tsx
import React from 'react'
import type { PvlcMedFormula } from '../types'
import { useNavigate } from 'react-router-dom'
import { apiService } from '../services/api'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../store'
import { addToCart } from '../store/slices/medCartSlice'

interface FormulaCardProps {
	formula: PvlcMedFormula
}

// Интерфейс для ошибки API
interface ApiError {
	status?: number
	message?: string
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
			// ИСПРАВЛЕНИЕ: Перенаправляем на страницу логина при ошибке 401 с правильной типизацией
			const apiError = error as ApiError
			if (apiError.status === 401) {
				navigate('/pvlc_login')
			}
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
