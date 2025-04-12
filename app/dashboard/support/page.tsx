
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { MessageSquare, HelpCircle, FileQuestion } from "lucide-react";
import { Header } from "../_components/header";

export default function SupportPage() {




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
             
              <CardFooter>
                <Button className="w-full">
                <a href="https://t.me/turbosmm_admin" target="_blank" rel="noopener noreferrer">
    Qo‘llab-quvvatlash bilan bog‘lanish
  </a>                </Button>
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