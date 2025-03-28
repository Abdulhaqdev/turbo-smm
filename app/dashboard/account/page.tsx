'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { useFormattedDate } from '@/hooks/useFormattedDate'
import { apiService } from '@/lib/apiservise'
import { ROUTES } from '@/lib/constants'
import { motion } from 'framer-motion'
import Cookies from 'js-cookie'
import {
	ChevronLeft,
	ChevronRight,
	Edit,
	Mail,
	Phone,
	User,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { StatusBadge } from '../_components/common/StatusBadge'
import { Header } from '../_components/header'
import { ScrollArea, ScrollBar } from '../_components/ui/scroll-area'
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '../_components/ui/tabs'
import { useToast } from '../_components/ui/use-toast'

// Interfeyslarni aniqlash
interface UserProfile {
	first_name: string
	last_name: string
	username: string
	email: string
	phone_number: string
	avatar?: string
	balance?: string
	joinDate?: string
}

interface Transaction {
	id: string
	amount: number
	date: string
	type: 'deposit' | 'order' | 'withdrawal'
	status: string
}

interface Order {
	id: string
	date: string
	totalPrice: number
	status: string
}

export default function AccountPage() {
	const router = useRouter()
	const { formatShortDate, formatDateTime, isValidDate } = useFormattedDate()
	const { toast } = useToast()
	const featuresScrollRef = useRef<HTMLDivElement>(null)
	const [canScrollLeft, setCanScrollLeft] = useState(false)
	const [canScrollRight, setCanScrollRight] = useState(true)
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
	console.log(userProfile)
	const [isEditing, setIsEditing] = useState(false)
	const [editedUser, setEditedUser] = useState({
		first_name: '',
		last_name: '',
		username: '',
		email: '',
		phone_number: '',
	})
	const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
		[]
	)
	const [recentOrders, setRecentOrders] = useState<Order[]>([])

	// Fetch user profile, transactions, and orders
	useEffect(() => {
		const userId = Cookies.get('userId')
		const accessToken = Cookies.get('accessToken')
		if (!accessToken || !userId) {
			toast({
				title: 'Error',
				description: 'Please log in to view your account',
				variant: 'destructive',
			})
			router.push('/login')
			return
		}

		const fetchData = async () => {
			try {
				// Fetch user profile
				const profileResponse = await apiService.get<UserProfile>(
					`/api/users/${userId}/`
				)
				if (profileResponse.status === 200 && profileResponse.data) {
					setUserProfile(profileResponse.data)
					setEditedUser({
						first_name: profileResponse.data.first_name,
						last_name: profileResponse.data.last_name,
						username: profileResponse.data.username,
						email: profileResponse.data.email,
						phone_number: profileResponse.data.phone_number,
					})
				} else {
					throw new Error(
						profileResponse.error?.general?.[0] ||
							'Failed to fetch user profile'
					)
				}

				// Fetch recent orders
				const ordersResponse = await apiService.get<{ results: Order[] }>(
					`/api/orders/?limit=5`
				)
				if (ordersResponse.status === 200 && ordersResponse.data?.results) {
					setRecentOrders(ordersResponse.data.results)
				} else {
					console.log('Failed to fetch orders:', ordersResponse.error)
				}
			} catch (error) {
				toast({
					title: 'Error',
					description:
						error instanceof Error ? error.message : 'Something went wrong',
					variant: 'destructive',
				})
				router.push('/login')
			}
		}

		fetchData()
	}, [router, toast])

	// Feature card scrolling
	const checkScrollable = () => {
		if (featuresScrollRef.current) {
			const { scrollLeft, scrollWidth, clientWidth } = featuresScrollRef.current
			setCanScrollLeft(scrollLeft > 0)
			setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10)
		}
	}

	const scroll = (direction: 'left' | 'right') => {
		if (featuresScrollRef.current) {
			const scrollAmount = 300
			featuresScrollRef.current.scrollBy({
				left: direction === 'left' ? -scrollAmount : scrollAmount,
				behavior: 'smooth',
			})
			setTimeout(checkScrollable, 400)
		}
	}

	const handleSaveProfile = async () => {
		const userId = Cookies.get('userId')
		if (!userId) return

		const updatedProfile = {
			first_name: editedUser.first_name,
			last_name: editedUser.last_name,
			username: editedUser.username,
			email: editedUser.email,
			phone_number: editedUser.phone_number,
		}

		const updateResponse = await apiService.put<
			UserProfile,
			typeof updatedProfile
		>(`/api/users/${userId}/`, updatedProfile)

		if (updateResponse.status === 200 && updateResponse.data) {
			setUserProfile(updateResponse.data)
			setIsEditing(false)
			toast({
				title: 'Profile updated',
				description: 'Your profile information has been updated successfully.',
				variant: 'success',
			})
		} else {
			toast({
				title: 'Update failed',
				description:
					updateResponse.error?.general?.[0] ||
					'Failed to update profile. Please try again.',
				variant: 'destructive',
			})
		}
	}

	const joinDateDisplay = isValidDate(userProfile?.joinDate)
		? formatShortDate(userProfile?.joinDate)
		: 'N/A'

	return (
		<div className='flex min-h-screen flex-col'>
			<Header showBackButton />
			<main className='flex-1 p-4 md:p-6'>
				<div className='mx-auto max-w-6xl'>
					<h1 className='mb-6 text-2xl font-bold'>My Account</h1>

					{/* User Profile Section */}
					<section className='mb-6'>
						<Card>
							<CardHeader className='relative'>
								<CardTitle className='text-xl'>User Profile</CardTitle>
								<Button
									variant='ghost'
									size='icon'
									className='absolute right-4 top-4'
									onClick={() => {
										if (isEditing) {
											handleSaveProfile()
										} else {
											setIsEditing(true)
										}
									}}
								>
									<Edit className='h-4 w-4' />
									<span className='sr-only'>
										{isEditing ? 'Save' : 'Edit'} profile
									</span>
								</Button>
							</CardHeader>
							<CardContent>
								<div className='flex flex-col gap-6 md:flex-row'>
									<div className='flex items-center gap-4'>
										<Avatar className='h-20 w-20'>
											<AvatarImage
												src={userProfile?.avatar || ''}
												alt={userProfile?.username || 'User'}
											/>
											<AvatarFallback className='text-2xl'>
												{userProfile?.first_name?.charAt(0) || 'U'}
											</AvatarFallback>
										</Avatar>
										<div>
											<h3 className='text-lg font-medium'>
												{userProfile?.first_name || 'User'}{' '}
												{userProfile?.last_name || ''}
											</h3>
											<p className='text-sm text-muted-foreground'>
												Member since {joinDateDisplay}
											</p>
											<div className='mt-2 flex items-center gap-2'>
												<span className='text-sm font-medium'>Balance:</span>
												<span className='font-semibold text-primary'>
													$
													{(
														parseFloat(userProfile?.balance || '0') || 0
													).toFixed(2)}
												</span>
												<Button
													variant='outline'
													size='sm'
													onClick={() => router.push(ROUTES.ADD_FUNDS)}
												>
													Add Funds
												</Button>
											</div>
										</div>
									</div>

									<div className='flex-1 space-y-4'>
										{isEditing ? (
											<div className='grid gap-4 md:grid-cols-2'>
												<div className='space-y-2'>
													<label className='text-sm font-medium'>
														First Name
													</label>
													<div className='flex items-center rounded-md border px-3 py-2'>
														<User className='mr-2 h-4 w-4 text-muted-foreground' />
														<input
															type='text'
															className='flex-1 bg-transparent outline-none'
															value={editedUser.first_name}
															onChange={e =>
																setEditedUser({
																	...editedUser,
																	first_name: e.target.value,
																})
															}
														/>
													</div>
												</div>
												<div className='space-y-2'>
													<label className='text-sm font-medium'>
														Last Name
													</label>
													<div className='flex items-center rounded-md border px-3 py-2'>
														<User className='mr-2 h-4 w-4 text-muted-foreground' />
														<input
															type='text'
															className='flex-1 bg-transparent outline-none'
															value={editedUser.last_name}
															onChange={e =>
																setEditedUser({
																	...editedUser,
																	last_name: e.target.value,
																})
															}
														/>
													</div>
												</div>
												<div className='space-y-2'>
													<label className='text-sm font-medium'>
														Username
													</label>
													<div className='flex items-center rounded-md border px-3 py-2'>
														<User className='mr-2 h-4 w-4 text-muted-foreground' />
														<input
															type='text'
															className='flex-1 bg-transparent outline-none'
															value={editedUser.username}
															onChange={e =>
																setEditedUser({
																	...editedUser,
																	username: e.target.value,
																})
															}
														/>
													</div>
												</div>
												<div className='space-y-2'>
													<label className='text-sm font-medium'>Email</label>
													<div className='flex items-center rounded-md border px-3 py-2'>
														<Mail className='mr-2 h-4 w-4 text-muted-foreground' />
														<input
															type='email'
															className='flex-1 bg-transparent outline-none'
															value={editedUser.email}
															onChange={e =>
																setEditedUser({
																	...editedUser,
																	email: e.target.value,
																})
															}
														/>
													</div>
												</div>
												<div className='space-y-2'>
													<label className='text-sm font-medium'>
														Phone Number
													</label>
													<div className='flex items-center rounded-md border px-3 py-2'>
														<Phone className='mr-2 h-4 w-4 text-muted-foreground' />
														<input
															type='tel'
															className='flex-1 bg-transparent outline-none'
															value={editedUser.phone_number}
															onChange={e =>
																setEditedUser({
																	...editedUser,
																	phone_number: e.target.value,
																})
															}
														/>
													</div>
												</div>
											</div>
										) : (
											<div className='grid gap-4 md:grid-cols-2'>
												<div className='space-y-1'>
													<p className='text-sm text-muted-foreground'>
														First Name
													</p>
													<p className='font-medium'>
														{userProfile?.first_name || 'Not provided'}
													</p>
												</div>
												<div className='space-y-1'>
													<p className='text-sm text-muted-foreground'>
														Last Name
													</p>
													<p className='font-medium'>
														{userProfile?.last_name || 'Not provided'}
													</p>
												</div>
												<div className='space-y-1'>
													<p className='text-sm text-muted-foreground'>
														Username
													</p>
													<p className='font-medium'>
														{userProfile?.username || 'Not provided'}
													</p>
												</div>
												<div className='space-y-1'>
													<p className='text-sm text-muted-foreground'>Email</p>
													<p className='font-medium'>
														{userProfile?.email || 'Not provided'}
													</p>
												</div>
												<div className='space-y-1'>
													<p className='text-sm text-muted-foreground'>
														Phone Number
													</p>
													<p className='font-medium'>
														{userProfile?.phone_number || 'Not provided'}
													</p>
												</div>
											</div>
										)}
									</div>
								</div>
							</CardContent>
							{isEditing && (
								<CardFooter className='flex justify-end gap-2'>
									<Button
										variant='outline'
										onClick={() => {
											setIsEditing(false)
											setEditedUser({
												first_name: userProfile?.first_name || '',
												last_name: userProfile?.last_name || '',
												username: userProfile?.username || '',
												email: userProfile?.email || '',
												phone_number: userProfile?.phone_number || '',
											})
										}}
									>
										Cancel
									</Button>
									<Button onClick={handleSaveProfile}>Save Changes</Button>
								</CardFooter>
							)}
						</Card>
					</section>

					{/* Feature Cards Section */}
					<section className='mb-6 relative'>
						<div className='flex items-center justify-between mb-4'>
							<h2 className='text-xl font-bold'>Account Features</h2>
							<div className='flex gap-2'>
								<Button
									variant='outline'
									size='icon'
									onClick={() => scroll('left')}
									disabled={!canScrollLeft}
									className='hidden md:flex'
								>
									<ChevronLeft className='h-4 w-4' />
								</Button>
								<Button
									variant='outline'
									size='icon'
									onClick={() => scroll('right')}
									disabled={!canScrollRight}
									className='hidden md:flex'
								>
									<ChevronRight className='h-4 w-4' />
								</Button>
							</div>
						</div>

						<ScrollArea
							className='pb-4'
							ref={featuresScrollRef}
							onScroll={checkScrollable}
						>
							<div className='flex gap-4 pb-2'>
								<Card className='min-w-[300px] max-w-[300px]'>
									<CardHeader>
										<CardTitle className='text-lg'>Recent Orders</CardTitle>
										<CardDescription>
											View your most recent orders
										</CardDescription>
									</CardHeader>
									<CardContent className='h-[200px] overflow-hidden'>
										{recentOrders.length > 0 ? (
											<div className='space-y-3'>
												{recentOrders.map(order => (
													<div
														key={order.id}
														className='flex items-center justify-between border-b pb-2 last:border-0'
													>
														<div>
															<p className='font-medium truncate max-w-[180px]'>
																{order.id.substring(0, 8)}
															</p>
															<p className='text-xs text-muted-foreground'>
																{isValidDate(order.date)
																	? formatShortDate(order.date)
																	: 'N/A'}
															</p>
														</div>
														<StatusBadge status={order.status} />
													</div>
												))}
											</div>
										) : (
											<div className='flex h-full items-center justify-center text-muted-foreground'>
												<p>No orders yet</p>
											</div>
										)}
									</CardContent>
									<CardFooter>
										<Button
											variant='outline'
											className='w-full'
											onClick={() => router.push(ROUTES.ORDERS)}
										>
											View All Orders
										</Button>
									</CardFooter>
								</Card>

								<Card className='min-w-[300px] max-w-[300px]'>
									<CardHeader>
										<CardTitle className='text-lg'>
											Recent Transactions
										</CardTitle>
										<CardDescription>View your payment history</CardDescription>
									</CardHeader>
									<CardContent className='h-[200px] overflow-hidden'>
										{recentTransactions.length > 0 ? (
											<div className='space-y-3'>
												{recentTransactions.map(transaction => (
													<div
														key={transaction.id}
														className='flex items-center justify-between border-b pb-2 last:border-0'
													>
														<div>
															<p className='font-medium'>
																${transaction.amount.toFixed(2)}
															</p>
															<p className='text-xs text-muted-foreground'>
																{isValidDate(transaction.date)
																	? formatShortDate(transaction.date)
																	: 'N/A'}{' '}
																• {transaction.type}
															</p>
														</div>
														<StatusBadge status={transaction.status} />
													</div>
												))}
											</div>
										) : (
											<div className='flex h-full items-center justify-center text-muted-foreground'>
												<p>No transactions yet</p>
											</div>
										)}
									</CardContent>
									<CardFooter>
										<Button
											variant='outline'
											className='w-full'
											onClick={() => router.push('/account/transactions')}
										>
											View All Transactions
										</Button>
									</CardFooter>
								</Card>

								<Card className='min-w-[300px] max-w-[300px]'>
									<CardHeader>
										<CardTitle className='text-lg'>Support</CardTitle>
										<CardDescription>
											Get help with your account
										</CardDescription>
									</CardHeader>
									<CardContent className='h-[200px] flex flex-col justify-center items-center gap-4 text-center'>
										<p>
											Need help with your account or have questions about our
											services?
										</p>
										<p className='text-sm text-muted-foreground'>
											Our support team is here to help you 24/7.
										</p>
									</CardContent>
									<CardFooter>
										<Button
											className='w-full'
											onClick={() => router.push(ROUTES.SUPPORT)}
										>
											Contact Support
										</Button>
									</CardFooter>
								</Card>

								<Card className='min-w-[300px] max-w-[300px]'>
									<CardHeader>
										<CardTitle className='text-lg'>Add Funds</CardTitle>
										<CardDescription>Add money to your account</CardDescription>
									</CardHeader>
									<CardContent className='h-[200px] flex flex-col justify-center items-center gap-4 text-center'>
										<p>Current Balance</p>
										<p className='text-3xl font-bold text-primary'>
											$
											{(parseFloat(userProfile?.balance || '0') || 0).toFixed(
												2
											)}
										</p>
										<p className='text-sm text-muted-foreground'>
											Add funds to your account to place orders
										</p>
									</CardContent>
									<CardFooter>
										<Button
											className='w-full'
											onClick={() => router.push(ROUTES.ADD_FUNDS)}
										>
											Add Funds
										</Button>
									</CardFooter>
								</Card>
							</div>
							<ScrollBar orientation='horizontal' />
						</ScrollArea>
					</section>

					{/* Account Activity Tabs */}
					<section>
						<Card>
							<CardHeader>
								<CardTitle>Account Activity</CardTitle>
								<CardDescription>
									View your recent activity on TurboSMM
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Tabs defaultValue='orders'>
									<TabsList className='mb-4'>
										<TabsTrigger value='orders'>Recent Orders</TabsTrigger>
										<TabsTrigger value='transactions'>Transactions</TabsTrigger>
									</TabsList>
									<TabsContent value='orders' className='space-y-4'>
										{recentOrders.length > 0 ? (
											<>
												{recentOrders.map(order => (
													<motion.div
														key={order.id}
														initial={{ opacity: 0, y: 10 }}
														animate={{ opacity: 1, y: 0 }}
														transition={{ duration: 0.2 }}
														className='flex items-center justify-between rounded-lg border p-4'
													>
														<div>
															<p className='font-medium'>
																Order #{order.id.substring(0, 8)}
															</p>
															<p className='text-sm text-muted-foreground'>
																{isValidDate(order.date)
																	? formatDateTime(order.date)
																	: 'N/A'}{' '}
																• ${order.totalPrice.toFixed(2)}
															</p>
														</div>
														<div className='flex items-center gap-2'>
															<StatusBadge status={order.status} />
															<Button
																variant='ghost'
																size='sm'
																onClick={() =>
																	router.push(`/orders/${order.id}`)
																}
															>
																View
															</Button>
														</div>
													</motion.div>
												))}
												<div className='flex justify-center pt-2'>
													<Button
														variant='outline'
														onClick={() => router.push(ROUTES.ORDERS)}
													>
														View All Orders
													</Button>
												</div>
											</>
										) : (
											<div className='flex flex-col items-center justify-center py-12 text-center'>
												<p className='mb-2 text-lg font-medium'>
													No orders yet
												</p>
												<p className='mb-6 text-muted-foreground'>
												{`	You haven't placed any orders yet. Start by placing
													your first order!`}
												</p>
												<Button onClick={() => router.push(ROUTES.NEW_ORDER)}>
													Place an Order
												</Button>
											</div>
										)}
									</TabsContent>
									<TabsContent value='transactions' className='space-y-4'>
										{recentTransactions.length > 0 ? (
											<>
												{recentTransactions.map(transaction => (
													<motion.div
														key={transaction.id}
														initial={{ opacity: 0, y: 10 }}
														animate={{ opacity: 1, y: 0 }}
														transition={{ duration: 0.2 }}
														className='flex items-center justify-between rounded-lg border p-4'
													>
														<div>
															<p className='font-medium'>
																{transaction.type === 'deposit'
																	? 'Added Funds'
																	: transaction.type === 'order'
																	? 'Order Payment'
																	: 'Withdrawal'}
															</p>
															<p className='text-sm text-muted-foreground'>
																{isValidDate(transaction.date)
																	? formatDateTime(transaction.date)
																	: 'N/A'}
															</p>
														</div>
														<div className='flex items-center gap-4'>
															<p
																className={`font-semibold ${
																	transaction.type === 'deposit'
																		? 'text-green-500'
																		: ''
																}`}
															>
																{transaction.type === 'deposit' ? '+' : '-'}$
																{transaction.amount.toFixed(2)}
															</p>
															<StatusBadge status={transaction.status} />
														</div>
													</motion.div>
												))}
												<div className='flex justify-center pt-2'>
													<Button
														variant='outline'
														onClick={() => router.push('/account/transactions')}
													>
														View All Transactions
													</Button>
												</div>
											</>
										) : (
											<div className='flex flex-col items-center justify-center py-12 text-center'>
												<p className='mb-2 text-lg font-medium'>
													No transactions yet
												</p>
												<p className='mb-6 text-muted-foreground'>
													{`You haven't made any transactions yet. Add funds to
													get started!`}
												</p>
												<Button onClick={() => router.push(ROUTES.ADD_FUNDS)}>
													Add Funds
												</Button>
											</div>
										)}
									</TabsContent>
								</Tabs>
							</CardContent>
						</Card>
					</section>
				</div>
			</main>
		</div>
	)
}
