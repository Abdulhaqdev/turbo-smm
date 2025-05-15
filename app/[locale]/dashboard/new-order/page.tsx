'use client'

import SocialIcon from '@/components/shared/SocialIcon'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useLocale } from '@/hooks/useLocale'
import { useSession, useStore } from '@/hooks/useSession'
import axios from '@/lib/axios'
import { newOrder, SavedOrder, Service } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslations } from 'use-intl'
import { FormError } from '../_components/common/FormError'
import { Header } from '../_components/header'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../_components/ui/select'

export default function NewOrderPage() {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const { session } = useSession()
	const { categories, services, isLoading, error, fetchData } = useStore()
	const { locale } = useLocale()
	const t = useTranslations('newOrder')

	const [categoryId, setCategoryId] = useState<string>('')
	const [serviceId, setServiceId] = useState<string>('')
	const [link, setLink] = useState<string>('')
	const [quantity, setQuantity] = useState<string>('0')
	const [quantityError, setQuantityError] = useState<string | null>(null)
	const [linkError, setLinkError] = useState<string | null>(null)
	const [formSubmitted, setFormSubmitted] = useState(false)
	const [selectedService, setSelectedService] = useState<Service | null>(null)
	const [totalPrice, setTotalPrice] = useState<number>(0)
	const [currentUrlLocale, setCurrentUrlLocale] = useState<string>('')

	const socialPlatforms = [
		'Instagram',
		'Facebook',
		'Twitter',
		'Spotify',
		'TikTok',
		'LinkedIn',
		'Google',
		'Telegram',
		'Discord',
		'Snapchat',
		'Twitch',
		'Youtube',
	]

	// Track current URL locale
	useEffect(() => {
		const urlParts = pathname.split('/')
		if (urlParts.length > 1) {
			setCurrentUrlLocale(urlParts[1])
		}
	}, [pathname])

	// Monitor for locale changes
	useEffect(() => {
		const currentLocalePrefix = locale.split('-')[0] // 'uz', 'ru', or 'en'
		
		// If URL locale doesn't match current locale setting, we need to update
		if (currentUrlLocale && currentUrlLocale !== currentLocalePrefix) {
			console.log(`Locale changed from ${currentUrlLocale} to ${currentLocalePrefix}, updating URL`)
			
			// Preserve the current serviceId in the URL when changing locale
			const serviceIdParam = serviceId ? `?serviceId=${serviceId}` : ''
			
			// Navigate to the same page but with the new locale
			router.replace(`/${currentLocalePrefix}/dashboard/new-order${serviceIdParam}`)
		}
	}, [locale, currentUrlLocale, router, serviceId])

	// Load form data from localStorage
	useEffect(() => {
		try {
			const savedFormData = localStorage.getItem('newOrderFormData')
			if (savedFormData) {
				const parsedData: SavedOrder = JSON.parse(savedFormData)
				setCategoryId(parsedData.categoryId)
				const service = services.find(
					srv =>
						String(srv.id) === parsedData.serviceId &&
						String(srv.category) === parsedData.categoryId
				)
				setServiceId(service ? parsedData.serviceId : '')
				setLink(parsedData.link)
				setQuantity(String(parsedData.quantity))
			}
		} catch (err) {
			console.error('Failed to load form data from localStorage:', err)
		}
	}, [services])

	// Save form data to localStorage
	useEffect(() => {
		const formData: SavedOrder = {
			categoryId,
			serviceId,
			link,
			quantity: Number(quantity) || 0,
		}
		try {
			localStorage.setItem('newOrderFormData', JSON.stringify(formData))
		} catch (err) {
			console.error('Failed to save form data to localStorage:', err)
		}
	}, [categoryId, serviceId, link, quantity])

	// Fetch data on mount if session exists
	useEffect(() => {
		if (session && session.token && !categories.length && !services.length) {
			console.log('Fetching data with token:', session.token)
			fetchData(session.token).catch(err => {
				console.error('Failed to fetch data:', err)
				toast.error(t('dataFetchError'))
			})
		}
	}, [session, fetchData, categories.length, services.length, t])

	// Map social icons to categories
	const enrichedCategories = useMemo(() => {
		return categories.map(category => {
			const normalizedCategoryName = category.name.toLowerCase()
			const matchingPlatform = socialPlatforms.find(platform =>
				normalizedCategoryName.includes(platform.toLowerCase())
			)
			return {
				...category,
				icon: matchingPlatform ? matchingPlatform.toLowerCase() : undefined,
			}
		})
	}, [categories])

	// Handle initial category and service selection
	useEffect(() => {
		if (isLoading || !categories.length || !services.length) return

		const serviceIdFromUrl = searchParams.get('serviceId')
		const currentLocalePrefix = locale.split('-')[0] // 'uz', 'ru', or 'en'

		if (serviceIdFromUrl) {
			const service = services.find(srv => srv.id === Number(serviceIdFromUrl))
			if (service) {
				console.log('Selecting service from URL:', serviceIdFromUrl)
				setCategoryId(String(service.category))
				setServiceId(String(serviceIdFromUrl))
				setQuantity('0')
				// Ensure URL uses current locale
				router.replace(
					`/${currentLocalePrefix}/dashboard/new-order?serviceId=${serviceIdFromUrl}`,
					{
						scroll: false,
					}
				)
				return
			} else {
				console.warn('Invalid service ID from URL:', serviceIdFromUrl)
				toast.error(t('invalidService'))
			}
		}

		// Select first category and service if no categoryId is set
		if (!categoryId && categories.length > 0) {
			const firstCategory = categories[0]
			const firstCategoryId = String(firstCategory.id)
			const firstCategoryServices = services.filter(
				srv => String(srv.category) === firstCategoryId
			)
			if (firstCategoryServices.length > 0) {
				const firstServiceId = String(firstCategoryServices[0].id)
				console.log(
					'Selecting first category and service:',
					firstCategoryId,
					firstServiceId
				)
				setCategoryId(firstCategoryId)
				setServiceId(firstServiceId)
				setQuantity('0')
				router.replace(
					`/${currentLocalePrefix}/dashboard/new-order?serviceId=${firstServiceId}`,
					{
						scroll: false,
					}
				)
			}
		}
	}, [
		isLoading,
		categories,
		services,
		searchParams,
		router,
		categoryId,
		locale,
		t,
	])

	// Filter services by category
	const filteredServices = useMemo(
		() => services.filter(srv => String(srv.category) === categoryId),
		[services, categoryId]
	)

	// Auto-select first service when category changes
	useEffect(() => {
		console.log('Auto-select service effect triggered:', {
			categoryId,
			filteredServicesLength: filteredServices.length,
			serviceId,
		})
		const currentLocalePrefix = locale.split('-')[0]
		if (categoryId && filteredServices.length > 0 && !serviceId) {
			const firstServiceId = String(filteredServices[0].id)
			console.log('Selecting first service:', firstServiceId)
			setServiceId(firstServiceId)
			setQuantity('0')
			router.replace(
				`/${currentLocalePrefix}/dashboard/new-order?serviceId=${firstServiceId}`,
				{
					scroll: false,
				}
			)
		} else if (categoryId && filteredServices.length === 0) {
			console.log('Clearing serviceId: No filtered services')
			setServiceId('')
			setQuantity('0')
			router.replace(`/${currentLocalePrefix}/dashboard/new-order`, {
				scroll: false,
			})
		}
	}, [categoryId, filteredServices, serviceId, router, locale])

	// Set selected service
	useEffect(() => {
		if (serviceId) {
			const service = services.find(srv => String(srv.id) === serviceId)
			console.log('Selected service:', service)
			setSelectedService(service || null)
			if (service && quantity) {
				validateQuantity()
			} else {
				setQuantityError(null)
			}
		} else {
			setSelectedService(null)
			setQuantityError(null)
		}
	}, [serviceId, services, quantity])

	// Calculate total price
	useEffect(() => {
		if (selectedService && quantity) {
			const quantityNum = Number.parseInt(quantity)
			if (!isNaN(quantityNum) && quantityNum > 0) {
				const price = Math.round((selectedService.price * quantityNum) / 1000)
				setTotalPrice(price)
			} else {
				setTotalPrice(0)
			}
		} else {
			setTotalPrice(0)
		}
	}, [selectedService, quantity])

	// Validation functions
	const validateQuantity = (): boolean => {
		setQuantityError(null)
		if (!quantity.trim()) {
			setQuantityError(t('quantityRequired'))
			return false
		}
		const quantityNum = Number.parseInt(quantity)
		if (isNaN(quantityNum)) {
			setQuantityError(t('quantityInvalid'))
			return false
		}
		if (!selectedService) {
			setQuantityError(t('serviceNotSelected'))
			return false
		}
		if (quantityNum < selectedService.min) {
			setQuantityError(t('quantityMin', { min: selectedService.min }))
			return false
		}
		if (quantityNum > selectedService.max) {
			setQuantityError(t('quantityMax', { max: selectedService.max }))
			return false
		}
		return true
	}

	const validateLink = (): boolean => {
		setLinkError(null)
		if (!link.trim()) {
			setLinkError(t('linkRequired'))
			return false
		}
		try {
			new URL(link)
			return true
		} catch (e) {
      console.log(e)
			setLinkError(t('invalidLink'))
			return false
		}
	}

	const handleQuantityChange = (value: string) => {
		setQuantity(value)
		if (selectedService) {
			validateQuantity()                                                                    
		} else if (value) {
			setQuantityError(t('selectServiceFirst'))
		} else {
			setQuantityError(null)
		}                                             
	}

	const handleServiceChange = (value: string) => {
		console.log('Service changed to:', value)
		setServiceId(value)
		setQuantity('0')
		const currentLocalePrefix = locale.split('-')[0]
		router.replace( 
			`/${currentLocalePrefix}/dashboard/new-order?serviceId=${value}`,
			{
				scroll: false,
			}
		)
	}

	const handleSubmit = async () => {
		setFormSubmitted(true)

		const isLinkValid = validateLink()
		const isQuantityValid = validateQuantity()

		if (!isLinkValid || !isQuantityValid) {
			return
		}

		if (!session?.user) {
			toast.error(t('noUserData'))
			return
		}

		const quantityNum = Number.parseInt(quantity)

		if (Number(session.user.balance) < totalPrice) {
			const savedOrder: SavedOrder = {
				categoryId,
				serviceId,
				link,
				quantity: quantityNum,
			}
			localStorage.setItem('newOrderFormData', JSON.stringify(savedOrder))

			toast.error(
				t('insufficientBalance', { balance: session.user.balance, totalPrice })
			)

			router.push(`/${locale.split('-')[0]}/dashboard/add-funds`)
			return
		}

		const newOrder: newOrder = {
			service_id: Number(serviceId),
			url: link,
			status: 'pending',
			quantity: quantityNum,
		}

		try {
			const response = await axios.post('/api/orders/', newOrder, {
				headers: {
					Authorization: `Bearer ${session.token}`,
					'Content-Type': 'application/json',
				},
			})

			if (response.status === 201) {
				toast.success(t('orderSuccess', { quantity: quantityNum }))
				setCategoryId('')
				setServiceId('')
				setLink('')
				setQuantity('0')
				setFormSubmitted(false)
				localStorage.removeItem('newOrderFormData')
				router.replace(`/${locale.split('-')[0]}/dashboard/new-order`)
			} else {
				throw new Error('Order creation failed')
			}
		} catch (err) {
			console.error('Error submitting order:', err)
			toast.error(t('orderError'))
		}
	}

	const getTimeColor = (duration: number) => {
		if (duration <= 60) return 'text-blue-500'
		if (duration <= 1440) return 'text-emerald-500'
		return 'text-yellow-500'
	}

	const formatDuration = (seconds: number): string => {
		if (seconds <= 60) return t('timeSoon') || 'Soon'
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

	if (isLoading) {
		return (
			<div className='flex min-h-screen flex-col'>
				<Header />
				<main className='flex-1 p-4 md:p-6'>
					<div className='mx-auto max-w-3xl flex items-center justify-center min-h-[50vh]'>
						<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
					</div>
				</main>
			</div>
		)
	}

	if (error) {
		return (
			<div className='flex min-h-screen flex-col'>
				<Header />
				<main className='flex-1 p-4 md:p-6'>
					<div className='mx-auto max-w-3xl flex items-center justify-center min-h-[50vh]'>
						<p className='text-destructive'>{error}</p>
					</div>
				</main>
			</div>
		)
	}

	return (
		<div className='flex min-h-screen flex-col'>
			<Header />
			<main className='flex-1 p-4 md:p-6'>
				<div className='mx-auto max-w-3xl'>
					<h1 className='mb-6 text-2xl font-bold'>{t('title')}</h1>
					<div className='mb-6 space-y-4'>
						<div>
							<h2 className='mb-2 text-lg font-medium'>{t('categories')}</h2>
							<Select
								value={categoryId}
								onValueChange={value => {
									console.log('Category changed to:', value)
									setCategoryId(value)
									setServiceId('')
									setQuantity('0')
								}}
							>
								<SelectTrigger>
									<SelectValue placeholder={t('selectCategory')} />
								</SelectTrigger>
								<SelectContent>
									{enrichedCategories.map(category => (
										<SelectItem key={category.id} value={String(category.id)}>
											<div className='flex items-center gap-2'>
												{category.icon && (
													<SocialIcon
														iconName={category.icon}
														className='h-5 w-5'
													/>
												)}
												<span className='text-wrap'>{category.name}</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div>
							<h2 className='mb-2 text-lg font-medium'>{t('services')}</h2>
							<Select
								value={serviceId}
								onValueChange={handleServiceChange}
								disabled={
									!categoryId || filteredServices.length === 0 || isLoading
								}
							>
								<SelectTrigger className='w-full text-wrap'>
									<SelectValue
										placeholder={
											isLoading
												? t('servicesLoading')
												: !categoryId
												? t('selectCategoryFirst')
												: filteredServices.length === 0
												? t('noServicesAvailable')
												: t('selectService')
										}
									/>
								</SelectTrigger>
								<SelectContent>
									{filteredServices.map(service => (
										<SelectItem key={service.id} value={String(service.id)}>
											<div className='flex flex-col'>
												<span className='text-start'>{service.name}</span>
												<span className='text-xs text-muted-foreground'>
													{formatCurrency(service.price)} / 1000 • Min:{' '}
													{service.min} • Max: {service.max}
												</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div>
							<h2 className='mb-2 text-lg font-medium'>{t('link')}</h2>
							<Input
								placeholder={t('enterLink')}
								value={link}
								onChange={e => {
									setLink(e.target.value)
									if (formSubmitted) setLinkError(null)
								}}
								disabled={!serviceId}
								className={linkError ? 'border-destructive' : ''}
							/>
							<FormError message={linkError} />
						</div>
						<div>
							<h2 className='mb-2 text-lg font-medium'>{t('quantity')}</h2>
							<Input
								type='number'
								placeholder={t('enterQuantity')}
								value={quantity}
								onChange={e => handleQuantityChange(e.target.value)}
								disabled={!serviceId}
								className={quantityError ? 'border-destructive' : ''}
							/>
							<FormError message={quantityError} />
							{selectedService && (
								<p className='mt-1 text-sm text-muted-foreground'>
									Min: {selectedService.min} - Max: {selectedService.max}
								</p>
							)}
						</div>
					</div>
					<Card className='mb-6'>
						<CardHeader>
							<CardTitle>{t('orderSummary')}</CardTitle>
						</CardHeader>
						<CardContent>
							{selectedService ? (
								<div className='space-y-4'>
									<div className='grid grid-cols-1 lg:grid-cols-2 gap-2'>
										<span className='text-muted-foreground'>
											{t('category')}:
										</span>
										<div className='flex items-center gap-2'>
											{categoryId &&
												enrichedCategories.find(
													cat => String(cat.id) === categoryId
												)?.icon && (
													<SocialIcon
														iconName={
															enrichedCategories.find(
																cat => String(cat.id) === categoryId
															)!.icon!
														}
														className='h-5 w-5'
													/>
												)}
											<span>
												{enrichedCategories.find(
													cat => String(cat.id) === categoryId
												)?.name || ''}
											</span>
										</div>
									</div>
									<div className='grid grid-cols-1 lg:grid-cols-2 gap-2'>
										<span className='text-muted-foreground'>
											{t('service')}:
										</span>
										<span>{selectedService.name}</span>
									</div>
									<div className='grid grid-cols-1 lg:grid-cols-2 gap-2'>
										<span className='text-muted-foreground'>
											{t('description')}:
										</span>
										<span>{selectedService.description}</span>
									</div>
									<div className='grid grid-cols-2 gap-2'>
										<span className='text-muted-foreground'>
											{t('quantity')}:
										</span>
										<span>{quantity}</span>
									</div>
									<div className='grid grid-cols-2 gap-2'>
										<span className='text-muted-foreground'>{t('link')}:</span>
										<a
											href={link}
											target='_blank'
											rel='noopener noreferrer'
											className='text-primary dark:text-blue-400 hover:underline text-sm'
										>
											{link.slice(0, 30)}...
										</a>
									</div>
									<div className='grid grid-cols-2 gap-2'>
										<span className='text-muted-foreground'>{t('time')}:</span>
										<span className={getTimeColor(selectedService.duration)}>
											{formatDuration(selectedService.duration)}
										</span>
									</div>
									<div className='grid grid-cols-2 gap-2'>
										<span className='text-muted-foreground'>{t('price')}:</span>
										<span>{formatCurrency(selectedService.price)} / 1000</span>
									</div>
									<div className='border-t pt-4 flex items-center justify-between'>
										<span className='text-muted-foreground font-medium'>
											{t('totalPrice')}
										</span>
										<span className='text-xl font-bold'>
											{formatCurrency(totalPrice)}
										</span>
									</div>
								</div>
							) : (
								<p className='text-muted-foreground'>
									{t('selectServiceForSummary')}
								</p>
							)}
						</CardContent>
						<CardFooter>
							<Button
								className='w-full'
								size='lg'
								onClick={handleSubmit}
								disabled={!categoryId || !serviceId || !link || !quantity}
							>
								{t('submitOrder')}
							</Button>
						</CardFooter>
					</Card>
				</div>
			</main>
		</div>
	)
}