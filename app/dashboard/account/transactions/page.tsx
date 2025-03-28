'use client'

import { StatusBadge } from '@/components/common/StatusBadge'
import { Header } from '@/components/header'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { useFormattedDate } from '@/hooks/useFormattedDate'
import { useStore } from '@/lib/store'
import { Search } from 'lucide-react'
import { useState } from 'react'

export default function TransactionsPage() {
	const { transactions } = useStore()
	const { formatDateTime, isValidDate } = useFormattedDate()
	const [searchTerm, setSearchTerm] = useState('')
	const [filterType, setFilterType] = useState<string>('all')

	// Filter transactions
	const filteredTransactions = transactions.filter(transaction => {
		const matchesSearch =
			transaction.description
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
			transaction.amount.toString().includes(searchTerm.toLowerCase())

		const matchesType = filterType === 'all' || transaction.type === filterType

		return matchesSearch && matchesType
	})

	return (
		<div className='flex min-h-screen flex-col'>
			<Header showBackButton />
			<main className='flex-1 p-4 md:p-6'>
				<div className='mx-auto max-w-6xl'>
					<h1 className='mb-6 text-2xl font-bold'>Transaction History</h1>

					<Card className='mb-6'>
						<CardHeader>
							<CardTitle className='text-lg'>Filter Transactions</CardTitle>
							<CardDescription>
								Filter and search your transaction history
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='grid gap-4 md:grid-cols-2'>
								<div className='space-y-2'>
									<Label htmlFor='search'>Search</Label>
									<div className='relative'>
										<Search className='absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
										<Input
											id='search'
											placeholder='Search by description or amount...'
											className='pl-8'
											value={searchTerm}
											onChange={e => setSearchTerm(e.target.value)}
										/>
									</div>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='filter-type'>Transaction Type</Label>
									<Select value={filterType} onValueChange={setFilterType}>
										<SelectTrigger id='filter-type'>
											<SelectValue placeholder='All Transactions' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='all'>All Transactions</SelectItem>
											<SelectItem value='deposit'>Deposits</SelectItem>
											<SelectItem value='order'>Order Payments</SelectItem>
											<SelectItem value='withdrawal'>Withdrawals</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Transactions Table */}
					<Card>
						<CardContent className='p-0'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Date</TableHead>
										<TableHead>Description</TableHead>
										<TableHead>Type</TableHead>
										<TableHead className='text-right'>Amount</TableHead>
										<TableHead className='text-right'>Status</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredTransactions.length > 0 ? (
										filteredTransactions.map(transaction => (
											<TableRow key={transaction.id}>
												<TableCell className='whitespace-nowrap'>
													{isValidDate(transaction.date)
														? formatDateTime(transaction.date)
														: 'N/A'}
												</TableCell>
												<TableCell>{transaction.description}</TableCell>
												<TableCell className='capitalize'>
													{transaction.type}
												</TableCell>
												<TableCell
													className={`text-right font-medium ${
														transaction.type === 'deposit'
															? 'text-green-500'
															: ''
													}`}
												>
													{transaction.type === 'deposit' ? '+' : '-'}$
													{transaction.amount.toFixed(2)}
												</TableCell>
												<TableCell className='text-right'>
													<StatusBadge status={transaction.status} />
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={5} className='h-24 text-center'>
												No transactions found matching your search.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	)
}
