'use client'

import { Button } from '@/components/ui/button'
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'
import axios from 'axios'
import { useEffect, useState } from 'react'

interface Service {
	id: number
	name: string
	description: string
	duration: number
	min: number
	max: number
	price: number
	site_id: number
	category: number
	api: number
	created_at: string
	updated_at: string
	is_active: boolean
}

interface PaginatedResponse {
	count: number
	next: string | null
	previous: string | null
	results: Service[]
}

export default function ServicesPage() {
	const [services, setServices] = useState<Service[]>([])
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const servicesPerPage = 10
	useEffect(() => {
		const fetchServices = async () => {
			setIsLoading(true)
			setError(null)

			try {
				const response = await axios.get<PaginatedResponse>(
					`https://api.turbosmm.uz/api/all-services/?offset=${currentPage}&limit=${servicesPerPage}`
				)
				console.log(
					`Sahifa ${currentPage} uchun services`,
					response.data.results
				)
				const activeServices = response.data.results.filter(
					service => service.is_active
				)
				setServices(activeServices)
				setTotalPages(Math.ceil(response.data.count / servicesPerPage))
			} catch (err) {
				console.error(err)
				setError("Ma'lumotlarni yuklashda xatolik yuz berdi.")
			} finally {
				setIsLoading(false)
			}
		}

		fetchServices()
	}, [currentPage])

	const getTimeColor = (duration: number) => {
		if (duration <= 60) return 'text-blue-500'
		if (duration <= 1440) return 'text-emerald-500'
		return 'text-yellow-500'
	}

	const formatDuration = (seconds: number): string => {
		const hours = Math.floor(seconds / 3600)
		const minutes = Math.floor((seconds % 3600) / 60)
		const remainingSeconds = seconds % 60
		const parts = []
		if (hours > 0) parts.push(`${hours}h`)
		if (minutes > 0) parts.push(`${minutes}m`)
		if (remainingSeconds > 0 || parts.length === 0)
			parts.push(`${remainingSeconds}s`)
		return parts.join(' ')
	}

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page)
		}
	}

	if (isLoading) {
		return (
			<main className='max-w-screen-xl mx-auto flex items-center justify-center min-h-[50vh]'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
			</main>
		)
	}

	if (error) {
		return (
			<main className='max-w-screen-xl mx-auto flex items-center justify-center min-h-[50vh]'>
				<p className='text-red-500'>{error}</p>
			</main>
		)
	}

	return (
		<main className='max-w-screen-xl mx-auto'>
			<div className='space-y-1 container'>
				{/* Desktop View */}
				<div className='hidden sm:block rounded-lg border border-zinc-800 dark:bg-[#101013] text-white'>
					<div className='grid grid-cols-[30px,1fr,120px,120px,110px] md:grid-cols-[50px,1fr,150px,150px,140px] items-center border-b border-zinc-800'>
						<div className='p-4 text-sm font-medium dark:text-zinc-400 text-black'>
							#
						</div>
						<div className='p-4 text-sm font-medium dark:text-zinc-400 text-black'>
							ID - Xizmat
						</div>
						<div className='p-4 text-sm font-medium dark:text-zinc-400 text-black'>
							1k uchun narx
						</div>
						<div className='p-4 text-sm font-medium dark:text-zinc-400 text-black'>
							O‘rtacha vaqt
						</div>
						<div className='p-4 w-[140px]'></div>
					</div>
					<div className='divide-y divide-zinc-800'>
						{services.map((service, index) => (
							<div
								key={service.id}
								className='grid grid-cols-[30px,1fr,120px,120px,110px] md:grid-cols-[50px,1fr,150px,150px,140px] items-center dark:hover:bg-zinc-900/50 hover:bg-slate-100 transition-colors group'
							>
								<div className='p-4 text-sm font-medium text-zinc-500'>
									{(currentPage - 1) * servicesPerPage + index + 1}
								</div>
								<div className='p-4 min-w-[200px] space-y-1'>
									<div className='text-sm font-medium dark:text-zinc-200 text-black dark:group-hover:text-white group-hover:text-slate-800 transition-colors'>
										{service.name}
									</div>
									<div className='text-xs text-zinc-500'>
										Minimal buyurtma: {service.min} Maksimal buyurtma:{' '}
										{service.max}
									</div>
								</div>
								<div className='py-4 px-1 text-center text-sm dark:text-zinc-100 text-black dark:group-hover:text-white group-hover:text-slate-800 transition-colors'>
									{Number(service.price)} UZS
								</div>
								<div
									className={cn('p-4 text-sm', getTimeColor(service.duration))}
								>
									{formatDuration(service.duration)}
								</div>
								<div className='p-4'>
									<Button
										className='w-full bg-[#155DFC] hover:bg-[#155DFC]/90 text-white transition-colors'
										asChild
									>
										<a href={`/dashboard/new-order?serviceId=${service.id}`}>
											Olish
										</a>
									</Button>
								</div>
							</div>
						))}
						{services.length === 0 && (
							<div className='p-4 text-center text-zinc-500'>
								Xizmatlar topilmadi.
							</div>
						)}
					</div>
				</div>

				{/* Mobile View */}
				<div className='sm:hidden space-y-3'>
					{services.map((service, index) => (
						<div
							key={service.id}
							className='rounded-lg border border-zinc-800 overflow-hidden'
						>
							<div className='p-4 space-y-3'>
								<div className='space-y-1'>
									<div className='flex items-center gap-2'>
										<div className='text-sm font-medium text-zinc-500'>
											#{(currentPage - 1) * servicesPerPage + index + 1}
										</div>
									</div>
									<div className='text-sm font-medium text-black dark:text-zinc-500'>
										{service.name}
									</div>
									<div className='text-xs text-black dark:text-zinc-500'>
										Minimal buyurtma: {service.min} Maksimal buyurtma:{' '}
										{service.max}
									</div>
								</div>
								<div className='flex items-center justify-between text-sm'>
									<div className='text-zinc-400'>1000 ta uchun narx</div>
									<div className='text-zinc-100'>{service.price} UZS</div>
								</div>
								<div className='flex items-center justify-between text-sm'>
									<div className='text-zinc-400'>O‘rtacha vaqt</div>
									<div className={getTimeColor(service.duration)}>
										{formatDuration(service.duration)}
									</div>
								</div>
							</div>
							<div className='border-t border-zinc-800 p-3'>
								<Button
									className='w-full bg-[#155DFC] hover:bg-[#155DFC]/90 text-white transition-colors'
									asChild
								>
									<a href={`/dashboard/new-order?serviceId=${service.id}`}>
										Olish
									</a>
								</Button>
							</div>
						</div>
					))}
					{services.length === 0 && (
						<div className='p-4 text-center text-zinc-500'>
							Xizmatlar topilmadi.
						</div>
					)}
				</div>

				{/* Pagination */}
				{totalPages > 1 && (
					<div className='w-full flex justify-center pb-4 pt-2'>
						<div className='w-full overflow-auto'>
							<div className='flex justify-center min-w-[200px]'>
								<Pagination>
									<PaginationContent>
										<PaginationItem>
											<PaginationPrevious
												href='#'
												className='text-black dark:text-white dark:bg-zinc-900 bg-white border-zinc-800'
												onClick={e => {
													e.preventDefault()
													handlePageChange(currentPage - 1)
												}}
												// disabled={currentPage === 1}
											/>
										</PaginationItem>
										{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
											let pageNum
											if (totalPages <= 5) {
												pageNum = i + 1
											} else if (currentPage <= 3) {
												pageNum = i + 1
											} else if (currentPage >= totalPages - 2) {
												pageNum = totalPages - 4 + i
											} else {
												pageNum = currentPage - 2 + i
											}
											return (
												<PaginationItem key={pageNum}>
													<PaginationLink
														href='#'
														className={cn(
															'text-white border-zinc-800 transition-all duration-200 ease-in-out h-8 w-8 sm:h-9 sm:w-9 text-sm sm:text-base',
															currentPage === pageNum
																? 'bg-[#155DFC] border-[#155DFC] hover:bg-[#155DFC] hover:text-white hover:border-[#155DFC]'
																: 'text-black dark:text-white dark:bg-zinc-900 bg-white hover:bg-white hover:text-zinc-900 hover:border-zinc-300'
														)}
														onClick={e => {
															e.preventDefault()
															handlePageChange(pageNum)
														}}
													>
														{pageNum}
													</PaginationLink>
												</PaginationItem>
											)
										})}
										{totalPages > 5 && currentPage < totalPages - 2 && (
											<PaginationItem>
												<PaginationEllipsis className='text-black dark:text-white dark:bg-zinc-900 bg-white border border-zinc-800 transition-all duration-200 ease-in-out h-8 w-8 sm:h-9 sm:w-9' />
											</PaginationItem>
										)}
										<PaginationItem>
											<PaginationNext
												href='#'
												className='text-black dark:text-white dark:bg-zinc-900 bg-white border-zinc-800'
												onClick={e => {
													e.preventDefault()
													handlePageChange(currentPage + 1)
												}}
												// disabled={currentPage === totalPages}
											/>
										</PaginationItem>
									</PaginationContent>
								</Pagination>
							</div>
						</div>
					</div>
				)}
			</div>
		</main>
	)
}
