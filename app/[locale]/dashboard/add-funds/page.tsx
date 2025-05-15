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
import {  usePathname } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { useLocaleFromUrl } from "@/hooks/useLocaleFromUrl";
import { useTranslations } from "use-intl";
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
}

const toBase64 = (str: string) => {
  if (typeof window !== "undefined") {
    return window.btoa(str);
  }
  return Buffer.from(str).toString("base64");
};

export default function AddFundsPage() {
  // const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const { session } = useSession();
  const t = useTranslations("addFunds");
  useLocaleFromUrl();

  const [amount, setAmount] = useState<string>("1000");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);
  const [payHistory, setPayHistory] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!session) {
      return;
    }

    const loadData = async () => {
      try {
        const res = await axios.get<Transaction[]>(
          "api/payments/?type=user",
          { headers: { Authorization: `Bearer ${session.token}` } }
        );
        setPayHistory(res.data);
      } catch (error) {
        console.error("Payment history loading error:", error);
        toast({
          title: t("toast.paymentHistoryErrorTitle"),
          description: t("toast.paymentHistoryErrorDescription"),
          variant: "destructive",
        });
      }
    };

    loadData();
    setIsMounted(true);
  }, [session, toast, t]);

  const predefinedAmounts = [10000, 50000, 100000];
  const paymentMethods = [
    { id: "click", name: "Click", icon: "/click.png" },
    { id: "payme", name: "Payme", icon: "/payme.jpg" },
    { id: "octobank", name: "Octobank", icon: "/octobank.jpeg", isUnderMaintenance: true },
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
    if (paymentMethods.find((m) => m.id === methodId)?.isUnderMaintenance) {
      toast({
        title: t("toast.maintenanceErrorTitle"),
        description: t("toast.maintenanceErrorDescription"),
        variant: "destructive",
      });
      return;
    }
    setSelectedPaymentMethod(methodId);
  };

  const handleAddFunds = async () => {
    if (!amount || !selectedPaymentMethod) {
      toast({
        title: t("toast.formErrorTitle"),
        description: t("toast.formErrorDescription"),
        variant: "destructive",
      });
      return;
    }

    const amountNum = Number.parseInt(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: t("toast.invalidAmountTitle"),
        description: t("toast.invalidAmountDescription"),
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const userId = session?.user?.id;
      if (!userId) {
        throw new Error("User ID not found");
      }

      if (selectedPaymentMethod === "click") {
        const paymentUrl = `https://my.click.uz/services/pay?service_id=70317&merchant_id=37916&amount=${amountNum}&transaction_param=${userId}&return_url=https://turbosmm.uz/${pathname.split("/")[1]}/dashboard/add-funds`;
        window.open(paymentUrl, "_blank");
      } else if (selectedPaymentMethod === "payme") {
        const merchantId = "67f7bf348d2fe4b0d3c09961";
        const formattedAmount = amountNum * 100;
        const returnUrl = `https://turbosmm.uz/${pathname.split("/")[1]}/dashboard/add-funds`;
        const lang = pathname.split("/")[1] || "uz";

        const queryString = `m=${merchantId};ac.order_id=${userId};a=${formattedAmount};l=${lang};c=${returnUrl}`;
        const encodedString = toBase64(queryString);
        const paymentUrl = `https://checkout.paycom.uz/${encodedString}`;
        window.open(paymentUrl, "_blank");
      } else {
        toast({
          title: t("toast.unknownMethodTitle"),
          description: t("toast.unknownMethodDescription"),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t("toast.errorTitle"),
        description: error instanceof Error ? error.message : t("toast.errorDescription"),
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
          <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  {t("currentBalance")}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-6">
                <div className="text-3xl font-bold text-primary">
                  {session?.user?.balance ? `${formatCurrency(Number(session.user.balance))} ` : "0 UZS"}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{t("currentBalanceDescription")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  {t("addFundsTitle")}
                </CardTitle>
                <CardDescription>{t("addFundsDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">{t("amountLabel")}</Label>
                    <div className="flex">
                      <Button variant="outline" size="icon" className="rounded-r-none" onClick={handleDecrement}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="relative flex-1">
                        <Input
                          id="amount"
                          placeholder={t("amountPlaceholder")}
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
                      {t("amountEstimate", { amount: formatCurrency(Number(amount) || 0) })}
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
                    <Label>{t("paymentMethodLabel")}</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {paymentMethods.map((method) => (
                        <Button
                          key={method.id}
                          variant="outline"
                          className={`flex flex-col h-auto py-4 ${
                            selectedPaymentMethod === method.id ? "border-primary" : ""
                          } ${method.isUnderMaintenance ? "opacity-50 cursor-not-allowed" : ""}`}
                          onClick={() => handlePaymentMethodSelect(method.id)}
                          disabled={method.isUnderMaintenance || (method.id !== "click" && method.id !== "payme")}
                        >
                          <div className="mb-2 h-10 w-10 relative">
                            <Image src={method.icon} alt={method.name} fill className="object-contain" />
                          </div>
                          <span>{method.name}</span>
                          {method.isUnderMaintenance && (
                            <span className="text-xs text-muted-foreground">{t("maintenance")}</span>
                          )}
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
                  {isProcessing ? t("submitProcessing") : t("submitButton")}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  {t("transactionHistory")}
                </CardTitle>
                <CardDescription>{t("transactionHistoryDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                {payHistory && Array.isArray(payHistory) && payHistory.length > 0 ? (
                  <div className="space-y-4">
                    {payHistory.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex justify-between items-center border-b py-2"
                      >
                        <div>
                          <p className="text-sm font-medium">{transaction.payment_type.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(transaction.created_at).toLocaleString(pathname.split("/")[1] || "uz")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {formatCurrency(Number(transaction.price))} UZS
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.is_active ? t("transactionStatus.active") : t("transactionStatus.pending")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    {t("noTransactions")}
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