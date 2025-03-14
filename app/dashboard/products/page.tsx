"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"

export default function ProductsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { products, placeOrder, user } = useStore()

  // State for quantity inputs
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(products.map((product) => [product.id, 1])),
  )

  // Handle quantity change
  const handleQuantityChange = (productId: string, value: string) => {
    const quantity = Number.parseInt(value)
    if (isNaN(quantity) || quantity < 1) return

    setQuantities((prev) => ({
      ...prev,
      [productId]: quantity,
    }))
  }

  // Handle order placement
  const handlePlaceOrder = (productId: string) => {
    const quantity = quantities[productId]
    const product = products.find((p) => p.id === productId)

    if (!product) return

    const totalPrice = product.price * quantity

    // Check if user has sufficient balance
    if (user.balance < totalPrice) {
      toast({
        title: "Insufficient balance",
        description: `You need $${totalPrice.toFixed(2)} to place this order. Please add funds to continue.`,
        variant: "destructive",
      })

      // Save draft order and redirect to add funds page
      placeOrder(productId, quantity)
      router.push("dashboard/add-funds")
      return
    }

    // Place order
    const success = placeOrder(productId, quantity)

    if (success) {
      toast({
        title: "Order placed successfully",
        description: "Your order has been placed and is now being processed.",
        variant: "default",
      })

      // Redirect to orders page
      router.push("dashboard/orders")
    }
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Products</h1>
        <p className="text-muted-foreground">Browse our products and place an order</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <div className="relative h-48 w-full">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-2xl font-bold text-primary mb-4">{formatCurrency(product.price)}</p>

              <div className="space-y-2">
                <Label htmlFor={`quantity-${product.id}`}>Quantity</Label>
                <Input
                  id={`quantity-${product.id}`}
                  type="number"
                  min="1"
                  value={quantities[product.id]}
                  onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                />
              </div>

              <div className="mt-4 text-sm">
                <p>Total: {formatCurrency(product.price * quantities[product.id])}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handlePlaceOrder(product.id)}>
                Place Order
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </Layout>
  )
}

