"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, Plus, Minus } from "lucide-react";
import { formatCurrency, convertToUZS } from "@/lib/utils";
import Image from "next/image";
// import { useToast } from "../_components/ui/use-toast";
import { Header } from "../_components/header";
import { useToast } from '@/hooks/use-toast'

interface Transaction {
  id: number;
  amount: number;
  payment_method: string;
  created_at: string;
  status: string;
}

export default function AddFundsPage() {
  const { toast } = useToast();
  const [amount, setAmount] = useState<string>("10");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Komponent faqat klientda yuklanadi
  }, []);

  const userBalance = 50;
  const predefinedAmounts = [10, 25, 50, 100];
  const paymentMethods = [
    { id: "click", name: "Click", icon: "/placeholder.svg?height=40&width=40" },
    { id: "payme", name: "Payme", icon: "/placeholder.svg?height=40&width=40" },
    { id: "uzumbank", name: "Uzumbank", icon: "/placeholder.svg?height=40&width=40" },
  ];
  const transactions: Transaction[] = [
    { id: 1, amount: 20, payment_method: "Click", created_at: "2025-03-20T10:00:00Z", status: "completed" },
    { id: 2, amount: -15, payment_method: "Payme", created_at: "2025-03-21T15:30:00Z", status: "completed" },
  ];

  const handleAmountChange = (value: string) => {
    const regex = /^[0-9]*\.?[0-9]*$/;
    if (value === "" || regex.test(value)) {
      setAmount(value);
    }
  };

  const handlePredefinedAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleIncrement = () => {
    const currentAmount = Number.parseFloat(amount) || 0;
    setAmount((currentAmount + 5).toString());
  };

  const handleDecrement = () => {
    const currentAmount = Number.parseFloat(amount) || 0;
    if (currentAmount >= 5) {
      setAmount((currentAmount - 5).toString());
    }
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  const handleAddFunds = () => {
    if (!amount || !selectedPaymentMethod) {
      toast({
        title: "To'ldirilmagan forma",
        description: "Iltimos, miqdorni kiriting va to'lov usulini tanlang.",
        variant: "destructive",
      });
      return;
    }

    const amountNum = Number.parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Noto'g'ri miqdor",
        description: "Iltimos, 0 dan katta bo'lgan miqdorni kiriting.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      toast({
        title: "Mablag' muvaffaqiyatli qo'shildi!",
        description: `${formatCurrency(convertToUZS(amountNum))} hisobingizga qo'shildi.`,
        variant: "success",
      });
      setAmount("10");
      setSelectedPaymentMethod(null);
      setIsProcessing(false);
    }, 1500);
  };

  if (!isMounted) {
    return null; // Serverda render qilinmaydi
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-2xl font-bold">{`Hisobni to'ldirish`}</h1>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Joriy balans
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-6">
                <div className="text-3xl font-bold text-primary">
                  {formatCurrency(convertToUZS(userBalance))}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Sizning joriy hisobingiz</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                 {` Hisobni to'ldirish`}
                </CardTitle>
                <CardDescription>{`Miqdorni kiriting va to'lov usulini tanlang`}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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

                  <div className="space-y-2">
                    <Label>{`To'lov usuli`}</Label>
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
                            <Image src={method.icon} alt={method.name} fill className="object-contain" />
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
                <CardDescription>{`Sizning so'nggi moliyaviy operatsiyalaringiz`}</CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">{`Hali tranzaksiyalar yo'q`}</div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex justify-between items-center border-b py-2">
                        <div>
                          <p className="font-medium">{transaction.payment_method}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-medium ${
                              transaction.amount > 0 ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {formatCurrency(convertToUZS(transaction.amount))}
                          </p>
                          <p className="text-sm text-muted-foreground">{transaction.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}