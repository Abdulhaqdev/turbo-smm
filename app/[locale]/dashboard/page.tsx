"use client";

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Header } from './_components/header'


export default function Home() {





  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-6 text-3xl font-bold">Welcome to TurboSMM</h1>
          <p className="mb-8 text-muted-foreground">Boost your social media presence with our premium services.</p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-2 text-xl font-semibold">New Order</h2>
              <p className="mb-4 text-sm text-muted-foreground">Place a new order for social media services</p>
              <Button asChild className="w-full">
                <Link href="dashboard/new-order">Place Order</Link>
              </Button>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-2 text-xl font-semibold">Browse Services</h2>
              <p className="mb-4 text-sm text-muted-foreground">Explore our wide range of social media services</p>
              <Button asChild variant="outline" className="w-full">
                <Link href="dashboard/services">View Services</Link>
              </Button>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-2 text-xl font-semibold">Add Funds</h2>
              <p className="mb-4 text-sm text-muted-foreground">Add funds to your account to place orders</p>
              <Button asChild variant="outline" className="w-full">
                <Link href="dashboard/add-funds">Add Funds</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

