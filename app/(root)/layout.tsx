import { ChilndProps } from '@/types'
import React from 'react'
import Navbar from './_components/navbar'
import Hero from './_components/hero'
import Feature from './_components/feature'
import PaymentMethods from './_components/paymentsmethod'
import HowItWorks from './_components/howitworks'

function Layout({ children }: ChilndProps) {
	return (
		<main className='bg-black'>
			<Navbar />
			<Hero/>
			<Feature/>
			<PaymentMethods/>
			<HowItWorks/>
			<div>{children}</div>
		</main>
	)
}

export default Layout
