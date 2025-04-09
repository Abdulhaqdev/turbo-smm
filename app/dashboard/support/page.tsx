"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "../_components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../_components/ui/select";
import { Label } from "@/components/ui/label";
import { MessageSquare, HelpCircle, FileQuestion } from "lucide-react";
import { Header } from "../_components/header";
import { useToast } from "@/hooks/use-toast";

export default function SupportPage() {
  const { toast } = useToast();

  const [subject, setSubject] = useState<string>("");
  const [orderId, setOrderId] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = () => {
    if (!subject || !message) {
      toast({
        title: "Forma to‘liq emas",
        description: "Iltimos, mavzuni tanlang va xabar yozing.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      toast({
        title: "Qo‘llab-quvvatlash so‘rovi yuborildi",
        description: "Xabaringizni qabul qildik va tez orada javob beramiz.",
        variant: "success",
      });

      setSubject("");
      setOrderId("");
      setMessage("");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-2xl font-bold">Qo‘llab-quvvatlash</h1>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Qo‘llab-quvvatlash bilan bog‘lanish
                </CardTitle>
                <CardDescription>Buyurtmalar yoki hisobingiz bo‘yicha yordam oling</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="subject">Mavzu</Label>
                    <Select value={subject} onValueChange={setSubject}>
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="Mavzuni tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="order">Buyurtma muammosi</SelectItem>
                        <SelectItem value="payment">To‘lov muammosi</SelectItem>
                        <SelectItem value="account">Hisob savoli</SelectItem>
                        <SelectItem value="other">Boshqa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="order-id">Buyurtma ID (Ixtiyoriy)</Label>
                    <Input
                      id="order-id"
                      placeholder="Agar mavjud bo‘lsa, buyurtma ID sini kiriting"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="message">Xabar</Label>
                    <Textarea
                      id="message"
                      placeholder="Muammoingizni batafsil tasvirlab bering"
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Yuborilmoqda..." : "So‘rov yuborish"}
                </Button>
              </CardFooter>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Tez-tez so‘raladigan savollar
                  </CardTitle>
                  <CardDescription>Ko‘p beriladigan savollar</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Buyurtmalar qancha vaqt ichida bajariladi?</h3>
                      <p className="text-sm text-muted-foreground">
                        Buyurtma bajarilish vaqti xizmatga qarab farq qiladi. Har bir xizmatning o‘rtacha vaqtini xizmatlar sahifasida ko‘rishingiz mumkin.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Qanday to‘lov usullarini qabul qilasiz?</h3>
                      <p className="text-sm text-muted-foreground">
                        Hozirda biz kredit va debet kartalari orqali to‘lovlarni qabul qilamiz.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Buyurtmam kafolatlanganmi?</h3>
                      <p className="text-sm text-muted-foreground">
                        Ha, barcha buyurtmalar kafolatlangan. Agar biz yetkazib bera olmasak, to‘liq pul qaytariladi.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Barcha savollarni ko‘rish
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileQuestion className="h-5 w-5" />
                    Bilimlar bazasi
                  </CardTitle>
                  <CardDescription>Qo‘llanmalar va darsliklar</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Birinchi buyurtmani qanday joylashtirish kerak</h3>
                      <p className="text-sm text-muted-foreground">
                        TurboSMM’da birinchi buyurtmangizni joylashtirish bo‘yicha qadam-baqadam qo‘llanma.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Xizmat ko‘rsatkichlarini tushunish</h3>
                      <p className="text-sm text-muted-foreground">
                        Xizmatlarimizdagi turli ko‘rsatkichlar va atamalar nimani anglatishini bilib oling.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Natijalarni oshirish uchun maslahatlar</h3>
                      <p className="text-sm text-muted-foreground">
                        Ijtimoiy media marketingdan maksimal foyda olish uchun eng yaxshi amaliyotlar.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Bilimlar bazasini ko‘rish
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}