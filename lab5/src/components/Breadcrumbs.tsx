import React from 'react'
import { Breadcrumb } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import type { BreadcrumbItem } from '../types'

interface BreadcrumbsProps {
	items: BreadcrumbItem[]
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
	return (
		<Breadcrumb className='mb-4'>
			<Breadcrumb.Item linkAs={Link} linkProps={{ to: '/pvlc_home_page' }}>
				Главная
			</Breadcrumb.Item>
			{items.map((item, index) => (
				<Breadcrumb.Item
					key={index}
					linkAs={item.path ? Link : undefined}
					linkProps={item.path ? { to: item.path } : undefined}
					active={index === items.length - 1}
				>
					{item.label}
				</Breadcrumb.Item>
			))}
		</Breadcrumb>
	)
}

export default Breadcrumbs
