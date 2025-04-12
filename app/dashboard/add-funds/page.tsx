"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, Plus, Minus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Header } from "../_components/header";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import axios from "@/lib/axios";

interface Transaction {
  id: number;
  price: string;
  payment_type: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    is_active: boolean;
  };
  created_at: string;
  updated_at: string;
  is_active: boolean;
   // IUser o‘rniga any, chunki session.user ishlatiladi
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export default function AddFundsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [amount, setAmount] = useState<string>("1000");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);
  const [payHistory, setPayHistory] = useState<Transaction[]>([]);

  const { session } = useSession();

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    const loadData = async () => {
      try {
        const res = await axios.get<PaginatedResponse<Transaction>>(
          "api/payments/?type=user",
          { headers: { Authorization: `Bearer ${session.token}` } }
        );
        setPayHistory(res.data.results || []);
      } catch (error) {
        console.error("Payment history yuklashda xato:", error);
        toast({
          title: "Xatolik",
          description: "Tranzaksiyalar tarixini yuklab bo‘lmadi.",
          variant: "destructive",
        });
      }
    };

    loadData();
    setIsMounted(true);
  }, [session, router, toast]);

  const predefinedAmounts = [10000, 50000, 100000];
  const paymentMethods = [
    { id: "click", name: "Click", icon: "/click.png" },
    { id: "payme", name: "Payme", icon: "/payme.jpg" },
    { id: "octobank", name: "Octobank", icon: "/octobank.jpeg" },
  ];

  const handleAmountChange = (value: string) => {
    const regex = /^[0-9]*$/;
    if (value === "" || regex.test(value)) {
      setAmount(value);
    }
  };

  const handlePredefinedAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleIncrement = () => {
    const currentAmount = Number.parseInt(amount) || 0;
    setAmount((currentAmount + 5000).toString());
  };

  const handleDecrement = () => {
    const currentAmount = Number.parseInt(amount) || 0;
    if (currentAmount >= 5000) {
      setAmount((currentAmount - 5000).toString());
    }
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  const handleAddFunds = async () => {
    if (!amount || !selectedPaymentMethod) {
      toast({
        title: "To'ldirilmagan forma",
        description: "Iltimos, miqdorni kiriting va to'lov usulini tanlang.",
        variant: "destructive",
      });
      return;
    }

    const amountNum = Number.parseInt(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Noto'g'ri miqdor",
        description: "Iltimos, 0 dan katta bo'lgan miqdorni kiriting.",
        variant: "destructive",
      });
      return;
    }

    if (selectedPaymentMethod !== "click") {
      toast({
        title: "Hozircha faqat Click qo'llab-quvvatlanadi",
        description: "Iltimos, Click to'lov usulini tanlang.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const userId = session?.user?.id;
      if (!userId) {
        throw new Error("Foydalanuvchi ID topilmadi");
      }

      const paymentUrl = `https://my.click.uz/services/pay?service_id=70317&merchant_id=37916&amount=${amountNum}&transaction_param=${userId}&return_url=https://turbosmm.uz/dashboard/add-funds`
      window.open(paymentUrl, "_blank");
    } catch (error) {
      toast({
        title: "Xatolik yuz berdi",
        description: error instanceof Error ? error.message : "Noma'lum xato",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isMounted) {
    return null;
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
                  {session?.user?.balance ? `${formatCurrency(Number(session.user.balance))} UZS` : "0 UZS"}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Sizning joriy hisobingiz</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  {`Hisobni to'ldirish`}
                </CardTitle>
                <CardDescription>{`Miqdorni kiriting va to'lov usulini tanlang`}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Miqdor (UZS)</Label>
                    <div className="flex">
                      <Button variant="outline" size="icon" className="rounded-r-none" onClick={handleDecrement}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="relative flex-1">
                        <Input
                          id="amount"
                          placeholder="10000"
                          className="pl-3"
                          value={amount}
                          onChange={(e) => handleAmountChange(e.target.value)}
                        />
                      </div>
                      <Button variant="outline" size="icon" className="rounded-l-none" onClick={handleIncrement}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Taxminiy: {formatCurrency(Number(amount) || 0)} UZS
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {predefinedAmounts.map((value) => (
                      <Button
                        key={value}
                        variant="outline"
                        className={amount === value.toString() ? "border-primary" : ""}
                        onClick={() => handlePredefinedAmount(value)}
                      >
                        {formatCurrency(value)}
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
                          className={`flex flex-col h-auto py-4 ${selectedPaymentMethod === method.id ? "border-primary" : ""}`}
                          onClick={() => handlePaymentMethodSelect(method.id)}
                          disabled={method.id !== "click"}
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

          {/* Tranzaksiyalar tarixi */}
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
                {payHistory.length > 0 ? (
                  <div className="space-y-4">
                    {payHistory.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex justify-between items-center border-b py-2"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {transaction.payment_type.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(transaction.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {formatCurrency(Number(transaction.price))} UZS
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.is_active ? "Muvaffaqiyatli" : "Kutilmoqda"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    {`Hali tranzaksiyalar yo'q`}
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