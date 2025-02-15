import { ChilndProps } from '@/types'
import React from 'react'
import Navbar from './_components/navbar'

function Layout({ children }: ChilndProps) {
	return (
		<main >
			<Navbar />
			<div>{children}</div>
		</main>
	)
}

export default Layout
