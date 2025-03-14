"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
// import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { useToast } from "@/components/ui/use-toast"
import { CreditCard, Wallet, Plus, Minus } from "lucide-react"
import { useStore } from "@/lib/store"
import { formatCurrency, convertToUZS } from "@/lib/utils"
import Image from "next/image"
import { useToast } from '../_components/ui/use-toast'
import { Header } from '../_components/header'

export default function AddFundsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { addFunds, savedOrder, user } = useStore()

  const [amount, setAmount] = useState<string>("10")
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null)

  // Predefined amounts in USD (will be displayed in UZS)
  const predefinedAmounts = [10, 25, 50, 100]

  // Payment methods
  const paymentMethods = [
    { id: "click", name: "Click", icon: "/placeholder.svg?height=40&width=40" },
    { id: "payme", name: "Payme", icon: "/placeholder.svg?height=40&width=40" },
    { id: "uzumbank", name: "Uzumbank", icon: "/placeholder.svg?height=40&width=40" },
  ]

  // Handle amount change
  const handleAmountChange = (value: string) => {
    // Allow only numbers and decimal point
    const regex = /^[0-9]*\.?[0-9]*$/
    if (value === "" || regex.test(value)) {
      setAmount(value)
    }
  }

  // Handle predefined amount click
  const handlePredefinedAmount = (value: number) => {
    setAmount(value.toString())
  }

  // Handle increment/decrement
  const handleIncrement = () => {
    const currentAmount = Number.parseFloat(amount) || 0
    setAmount((currentAmount + 5).toString())
  }

  const handleDecrement = () => {
    const currentAmount = Number.parseFloat(amount) || 0
    if (currentAmount >= 5) {
      setAmount((currentAmount - 5).toString())
    }
  }

  // Handle payment method selection
  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId)
  }

  // Handle add funds (placeholder for now)
  const handleAddFunds = () => {
    // Validate form
    if (!amount || !selectedPaymentMethod) {
      toast({
        title: "To'ldirilmagan forma",
        description: "Iltimos, miqdorni kiriting va to'lov usulini tanlang.",
        variant: "destructive",
      })
      return
    }

    const amountNum = Number.parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Noto'g'ri miqdor",
        description: "Iltimos, 0 dan katta bo'lgan miqdorni kiriting.",
        variant: "destructive",
      })
      return
    }

    // Simulate processing
    setIsProcessing(true)

    // Simulate API call with timeout
    setTimeout(() => {
      // Add funds to user balance
      addFunds(amountNum)

      // Show success toast
      toast({
        title: "Mablag' muvaffaqiyatli qo'shildi!",
        description: `${formatCurrency(convertToUZS(amountNum))} hisobingizga qo'shildi.`,
        variant: "success",
      })

      // Reset form
      setAmount("10")
      setSelectedPaymentMethod(null)
      setIsProcessing(false)

      // Redirect to new order page if there was a saved order
      if (savedOrder) {
        router.push("/new-order")
      }
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-2xl font-bold">{`Hisobni to'ldirish`}</h1>

          {savedOrder && (
            <div className="mb-6 rounded-lg border border-yellow-500 bg-yellow-500/10 p-4">
              <h2 className="mb-2 font-semibold text-yellow-500">Kutilayotgan buyurtma</h2>
              <p className="text-sm">
                Sizda yakunlanmagan buyurtma mavjud. Buyurtmani davom ettirish uchun hisobingizni to'ldiring.
              </p>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {/* Current Balance Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Joriy balans
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-6">
                <div className="text-3xl font-bold text-primary">{formatCurrency(convertToUZS(user.balance))}</div>
                <p className="mt-2 text-sm text-muted-foreground">Sizning joriy hisobingiz</p>
              </CardContent>
            </Card>

            {/* Add Funds Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Hisobni to'ldirish
                </CardTitle>
                <CardDescription>Miqdorni kiriting va to'lov usulini tanlang</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Amount Input */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">Miqdor</Label>
                    <div className="flex">
                      <Button variant="outline" size="icon" className="rounded-r-none" onClick={handleDecrement}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="amount"
                          placeholder="10.00"
                          className="pl-7"
                          value={amount}
                          onChange={(e) => handleAmountChange(e.target.value)}
                        />
                      </div>
                      <Button variant="outline" size="icon" className="rounded-l-none" onClick={handleIncrement}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Taxminiy: {formatCurrency(convertToUZS(Number.parseFloat(amount) || 0))}
                    </p>
                  </div>

                  {/* Predefined Amounts */}
                  <div className="grid grid-cols-4 gap-2">
                    {predefinedAmounts.map((value) => (
                      <Button
                        key={value}
                        variant="outline"
                        className={amount === value.toString() ? "border-primary" : ""}
                        onClick={() => handlePredefinedAmount(value)}
                      >
                        {formatCurrency(convertToUZS(value))}
                      </Button>
                    ))}
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-2">
                    <Label>To'lov usuli</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {paymentMethods.map((method) => (
                        <Button
                          key={method.id}
                          variant="outline"
                          className={`flex flex-col h-auto py-4 ${
                            selectedPaymentMethod === method.id ? "border-primary" : ""
                          }`}
                          onClick={() => handlePaymentMethodSelect(method.id)}
                        >
                          <div className="mb-2 h-10 w-10 relative">
                            <Image
                              src={method.icon || "/placeholder.svg"}
                              alt={method.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <span>{method.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={handleAddFunds}
                  disabled={isProcessing || !amount || !selectedPaymentMethod}
                >
                  {isProcessing ? "Jarayonda..." : "Hisobni to'ldirish"}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Tranzaksiyalar tarixi
                </CardTitle>
                <CardDescription>Sizning so'nggi moliyaviy operatsiyalaringiz</CardDescription>
              </CardHeader>
              <CardContent>
                {/* This would typically be populated from an API */}
                <div className="text-center py-6 text-muted-foreground">Hali tranzaksiyalar yo'q</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

