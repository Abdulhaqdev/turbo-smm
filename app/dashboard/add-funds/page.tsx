"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, Plus, Minus } from "lucide-react";
import { formatCurrency } from "@/lib/utils"; // `convertToUZS` ni olib tashladim, chunki hozircha kerak emas
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Header } from "../_components/header";
import Cookies from "js-cookie";
import { apiService } from "@/lib/apiservise";
import { useRouter } from "next/navigation";
import { UserProfile } from '@/lib/types'

// interface Transaction {
//   id: number;
//   amount: number;
//   payment_method: string;
//   created_at: string;
//   status: string;
// }

export default function AddFundsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [amount, setAmount] = useState<string>("10000");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);
  const [userProfile, setUserProfile] = useState<
    Pick<UserProfile, "username" | "balance" | "first_name" | "last_name"> | null
  >(null);

  useEffect(() => {
    const userId = Cookies.get("user_id");
    const accessToken = Cookies.get("accessToken");
    if (!accessToken || !userId) {
      console.log("No access token or userId, redirecting to /login");
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      const response = await apiService.get<UserProfile>(`/api/users/${userId}/`);
      if (response.status === 200 && response.data) {
        setUserProfile({
          username: response.data.username,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          balance: response.data.balance,
        });
      } else {
        console.log("Failed to fetch user profile, redirecting to /login");
        router.push("/login");
      }
    };
    fetchData();
  }, [router]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const predefinedAmounts = [10000, 50000, 100000];
  const paymentMethods = [
    { id: "click", name: "Click", icon: "/click.png" },
    // Boshqa to'lov usullari hozircha faolsiz
    { id: "payme", name: "Payme", icon: "/payme.jpg" },
    { id: "octobank", name: "Octobank", icon: "/octobank.jpeg" },
  ];

  const handleAmountChange = (value: string) => {
    const regex = /^[0-9]*$/; // Faqat butun sonlar uchun
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
      const userId = Cookies.get("user_id");
      if (!userId) {
        throw new Error("Foydalanuvchi ID topilmadi");
      }

      // Click to'lov sahifasiga yo'naltirish
      const paymentUrl = `https://my.click.uz/services/pay?service_id=70317&merchant_id=37916&amount=${amountNum}&transaction_param=${userId}&return_url=https://turbosmm.uz/success`;
      window.location.href = paymentUrl;
    } catch (error) {
      toast({
        title: "Xatolik yuz berdi",
        description: error instanceof Error ? error.message : "Noma'lum xato",
        variant: "destructive",
      });
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
                  {userProfile?.balance ? `${formatCurrency(Number(userProfile.balance))} UZS` : "0 UZS"}
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
                          className={`flex flex-col h-auto py-4 ${
                            selectedPaymentMethod === method.id ? "border-primary" : ""
                          }`}
                          onClick={() => handlePaymentMethodSelect(method.id)}
                          disabled={method.id !== "click"} // Faqat Click faol
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
                {/* Hozircha statik ma'lumotlar */}
                <div className="text-center py-6 text-muted-foreground">{`Hali tranzaksiyalar yo'q`}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}