"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiService } from "@/lib/apiservise";
import { ROUTES } from "@/lib/constants";
import Cookies from "js-cookie";
import { Edit, LogOut, Mail, Phone, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "../_components/header";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/hooks/useSession";

interface UserProfile {
  first_name: string;
  last_name: string;
  balance: string;
  username: string;
  email: string;
  id: number;
  phone_number: string;
  api_key: string;
  created_at: string;
}

export default function AccountPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { session, } = useSession();
  const [userProfile, setUserProfile] = useState<UserProfile | undefined | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone_number: "",
  });


  // useEffect(() => {
  //   if (!session) {
  //     router.push("/");
  //   } else {
  //     setUserProfile(session.user);
  //     setEditedUser({
  //       first_name: session.user?.first_name || "",
  //       last_name: session.user?.last_name || "",
  //       username: session.user?.username || "",
  //       email: session.user?.email || "",
  //       phone_number: session.user?.phone_number || "",
  //     });
  //   }
  // }, [session]);

  console.log(session)

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("userId");
    // clearSession();
    router.push("/");
  };

  const handleSaveProfile = async () => {
    const userId = session?.user?.id;
    if (!userId) return;

    const updatedProfile = {
      first_name: editedUser.first_name,
      last_name: editedUser.last_name,
      username: editedUser.username,
      email: editedUser.email,
      phone_number: editedUser.phone_number,
    };

    const updateResponse = await apiService.put<UserProfile, typeof updatedProfile>(
      `/api/users/${userId}/`,
      updatedProfile
    );

    if (updateResponse.status === 200 && updateResponse.data) {
      setUserProfile(updateResponse.data);
      setIsEditing(false);
      toast({
        title: "Profil yangilandi",
        description: "Profil ma'lumotlaringiz muvaffaqiyatli yangilandi.",
        variant: "success",
      });
    } else {
      toast({
        title: "Yangilash muvaffaqiyatsiz",
        description:
          updateResponse.error?.general?.[0] ||
          "Profilni yangilashda xatolik yuz berdi. Iltimos, qaytadan urinib ko‘ring.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header showBackButton />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-6 text-2xl font-bold">Mening Hisobim</h1>

          <section className="mb-6">
            <Card>
              <CardHeader className="relative">
                <CardTitle className="text-xl">Foydalanuvchi Profili</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4"
                  onClick={() => {
                    if (isEditing) {
                      handleSaveProfile();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">
                    {isEditing ? "Saqlash" : "Tahrirlash"} profil
                  </span>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-6 md:flex-row">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="text-2xl">
                        {session?.user?.first_name?.charAt(0) || "F"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">
                        {session?.user?.first_name || "Foydalanuvchi"}{" "}
                        {session?.user?.last_name || ""}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {`A'zo bo‘lgan sanasi`}: {session?.user?.created_at}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm font-medium">Balans:</span>
                        <span className="font-semibold text-primary">
                          {session?.user?.balance || "0"} UZS
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push("add-funds")}
                        >
                          Pul qo‘shish
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    {isEditing ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Ism</label>
                          <div className="flex items-center rounded-md border px-3 py-2">
                            <User className="mr-2 h-4 w-4 text-muted-foreground" />
                            <input
                              type="text"
                              className="flex-1 bg-transparent outline-none"
                              value={editedUser.first_name}
                              onChange={(e) =>
                                setEditedUser({
                                  ...editedUser,
                                  first_name: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Familiya</label>
                          <div className="flex items-center rounded-md border px-3 py-2">
                            <User className="mr-2 h-4 w-4 text-muted-foreground" />
                            <input
                              type="text"
                              className="flex-1 bg-transparent outline-none"
                              value={editedUser.last_name}
                              onChange={(e) =>
                                setEditedUser({
                                  ...editedUser,
                                  last_name: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Foydalanuvchi nomi</label>
                          <div className="flex items-center rounded-md border px-3 py-2">
                            <User className="mr-2 h-4 w-4 text-muted-foreground" />
                            <input
                              type="text"
                              className="flex-1 bg-transparent outline-none"
                              value={editedUser.username}
                              onChange={(e) =>
                                setEditedUser({
                                  ...editedUser,
                                  username: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Elektron pochta</label>
                          <div className="flex items-center rounded-md border px-3 py-2">
                            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                            <input
                              type="email"
                              className="flex-1 bg-transparent outline-none"
                              value={editedUser.email}
                              onChange={(e) =>
                                setEditedUser({
                                  ...editedUser,
                                  email: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Telefon raqami</label>
                          <div className="flex items-center rounded-md border px-3 py-2">
                            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                            <input
                              type="tel"
                              className="flex-1 bg-transparent outline-none"
                              value={editedUser.phone_number}
                              onChange={(e) =>
                                setEditedUser({
                                  ...editedUser,
                                  phone_number: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Ism</p>
                          <p className="font-medium">
                            {session?.user?.first_name || "Kiritilmagan"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Familiya</p>
                          <p className="font-medium">
                            {session?.user?.last_name || "Kiritilmagan"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Foydalanuvchi nomi</p>
                          <p className="font-medium">
                            {session?.user?.username || "Kiritilmagan"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Elektron pochta</p>
                          <p className="font-medium">
                            {session?.user?.email || "Kiritilmagan"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Telefon raqami</p>
                          <p className="font-medium">
                            {session?.user?.phone_number || "Kiritilmagan"}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={handleLogout}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Chiqish
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              {isEditing && (
                <CardFooter className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedUser({
                        first_name: session?.user?.first_name || "",
                        last_name: session?.user?.last_name || "",
                        username: session?.user?.username || "",
                        email: session?.user?.email || "",
                        phone_number: session?.user?.phone_number || "",
                      });
                    }}
                  >
                    Bekor qilish
                  </Button>
                  <Button onClick={handleSaveProfile}>O‘zgarishlarni saqlash</Button>
                </CardFooter>
              )}
            </Card>
          </section>

          <section className="m-6">
            <h2 className="text-xl font-bold mb-4">Hisob Xususiyatlari</h2>
            <div className="flex flex-wrap justify-center">
              <Card className="min-w-[300px] max-w-[300px]">
                <CardHeader>
                  <CardTitle className="text-lg">Qo‘llab-quvvatlash</CardTitle>
                </CardHeader>
                <CardContent className="h-[200px] flex flex-col justify-center items-center gap-4 text-center">
                  <p>Hisobingiz bilan yordam kerakmi yoki xizmatlarimiz haqida savollaringiz bormi?</p>
                  <p className="text-sm text-muted-foreground">
                    Bizning qo‘llab-quvvatlash jamoamiz sizga 24/7 yordam berishga tayyor.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => router.push(ROUTES.SUPPORT)}>
                    Qo‘llab-quvvatlash bilan bog‘lanish
                  </Button>
                </CardFooter>
              </Card>
              <Card className="min-w-[300px] max-w-[300px]">
                <CardHeader>
                  <CardTitle className="text-lg">Pul qo‘shish</CardTitle>
                </CardHeader>
                <CardContent className="h-[200px] flex flex-col justify-center items-center gap-4 text-center">
                  <p>Joriy Balans</p>
                  <p className="text-3xl font-bold text-primary">
                    {session?.user?.balance || "0"} UZS
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Buyurtma berish uchun hisobingizga pul qo‘shing
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => router.push(ROUTES.ADD_FUNDS)}>
                    Pul qo‘shish
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}