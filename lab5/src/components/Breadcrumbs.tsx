//src/components/Breadcrumbs.tsx
import React from 'react'
import { Breadcrumb } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import type { BreadcrumbItem } from '../types'

interface BreadcrumbsProps {
	items: BreadcrumbItem[]
	onPatientsClick?: () => void
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
	items,
	onPatientsClick,
}) => {
	const navigate = useNavigate()

	const handlePatientsClick = (e: React.MouseEvent) => {
		e.preventDefault()
		if (onPatientsClick) {
			onPatientsClick() //поиск сброс
		}
		navigate('/pvlc_patients')
	}

	return (
		<Breadcrumb className='mb-4'>
			<Breadcrumb.Item linkAs={Link} linkProps={{ to: '/pvlc_home_page' }}>
				Главная
			</Breadcrumb.Item>
			{items.map((item, index) => (
				<Breadcrumb.Item
					key={index}
					linkAs={item.path ? Link : undefined}
					linkProps={
						item.path
							? {
									to: item.path,
									onClick:
										item.path === '/pvlc_patients'
											? handlePatientsClick
											: undefined,
							  }
							: undefined
					}
					active={index === items.length - 1}
				>
					{item.label}
				</Breadcrumb.Item>
			))}
		</Breadcrumb>
	)
}

export default Breadcrumbs
