'use client'

import { useStore } from '@/lib/store'
// import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button'
import { getCategoryById, getServiceById } from '@/lib/data'
// import { getSocialIcon } from "@/components/sidebar"
import { ExternalLink } from 'lucide-react'
import { getSocialIcon } from '../sidebar'
import { Badge } from '../ui/badge'

export function OrdersView() {
	const { orders } = useStore()

	// Format date
	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		}).format(date)
	}
	
	return (
		<div className='p-6'>
			<div className='mb-6'>
				<h3 className='text-lg font-medium mb-2'>Your Orders</h3>
				<p className='text-sm text-muted-foreground'>
					View and track all your orders
				</p>
			</div>

			{orders.length === 0 ? (
				<div className='rounded-lg border border-dashed p-8 text-center'>
					<h4 className='font-medium mb-2'>No orders yet</h4>
					<p className='text-sm text-muted-foreground mb-4'>
						{/* You haven't placed any orders yet. */}
					</p>
					<Button asChild>
						<a href='/new-order'>Place Your First Order</a>
					</Button>
				</div>
			) : (
				<div className='space-y-4'>
					{orders.map(order => {
						const service = getServiceById(order.serviceId)
						const category = getCategoryById(order.categoryId)
						const Icon = category ? getSocialIcon(category.icon) : null

						return (
							<div key={order.id} className='rounded-lg border bg-card p-4'>
								<div className='flex items-center justify-between mb-2'>
									<div className='flex items-center gap-2'>
										<Badge
											variant={
												order.status === 'completed'
													? 'default'
													: order.status === 'processing'
													? 'secondary'
													: order.status === 'pending'
													? 'outline'
													: 'destructive'
											}
										>
											{order.status}
										</Badge>
										<span className='text-xs text-muted-foreground'>
											{formatDate(order.createdAt)}
										</span>
									</div>
									<span className='text-sm font-medium'>
										#{order.id.substring(0, 8)}
									</span>
								</div>

								<div className='mb-2'>
									<h4 className='font-medium'>{service?.name}</h4>
									{category && Icon && (
										<div className='flex items-center gap-1 text-xs text-muted-foreground'>
											<Icon className='h-3 w-3' />
											<span>{category.name}</span>
										</div>
									)}
								</div>

								<div className='grid grid-cols-2 gap-2 mb-2 text-sm'>
									<div>
										<p className='text-xs text-muted-foreground'>Quantity</p>
										<p>{order.quantity}</p>
									</div>
									<div>
										<p className='text-xs text-muted-foreground'>Total</p>
										<p>${order.totalPrice.toFixed(2)}</p>
									</div>
								</div>

								<div className='flex items-center justify-between text-sm'>
									<div className='truncate max-w-[200px]'>
										<p className='text-xs text-muted-foreground'>Link</p>
										<p className='truncate'>{order.link}</p>
									</div>
									<Button variant='ghost' size='sm' className='ml-2 shrink-0'>
										<ExternalLink className='h-4 w-4 mr-1' />
										Details
									</Button>
								</div>
							</div>
						)
					})}
				</div>
			)}
		</div>
	)
}
