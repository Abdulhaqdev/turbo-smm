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
import { Edit, LogOut, Phone, User } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "../_components/header";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/hooks/useSession";
import { useLocaleFromUrl } from "@/hooks/useLocaleFromUrl";
import { useTranslations } from "use-intl";
import logout from "@/app/actions/logout";
import axios from "axios";

export default function AccountPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const { session, setSession } = useSession();
  const t = useTranslations("account");
  useLocaleFromUrl();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    first_name: "",
    last_name: "",
    username: "",
    phone_number: "",
  });

  useEffect(() => {
    if (!session) {
      // router.push("/");
    } else {
      setEditedUser({
        first_name: session.user?.first_name || "",
        last_name: session.user?.last_name || "",
        username: session.user?.username || "",
        phone_number: session.user?.phone_number || "",
      });
    }
  }, [session, router]);

  const handleLogout = async () => {
    await logout();
    setSession(null);
    router.push("/");
  };

  const handleSaveProfile = async () => {
    const userId = session?.user?.id;
    if (!userId) return;

    const updatedProfile = {
      first_name: editedUser.first_name,
      last_name: editedUser.last_name,
      username: editedUser.username,
      phone_number: editedUser.phone_number,
    };

    try {
      const response = await axios.patch(`/api/users/${userId}/`, updatedProfile, {
        headers: {
          Authorization: `Bearer ${session?.token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setSession({
          ...session,
          user: response.data,
        });
        setIsEditing(false);
        toast({
          title: t("toast.updateSuccessTitle"),
          description: t("toast.updateSuccessDescription"),
          variant: "success",
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.general?.[0]
          ? error.response.data.general[0]
          : t("toast.updateErrorDescription");

      toast({
        title: t("toast.updateErrorTitle"),
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>

          <section className="mb-6">
            <Card>
              <CardHeader className="relative">
                <CardTitle className="text-xl">{t("profile.title")}</CardTitle>
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
                    {isEditing ? t("profile.saveButton") : t("profile.editButton")} {t("profile.title").toLowerCase()}
                  </span>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-6 md:flex-row">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="text-2xl">
                        {session?.user?.first_name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      {/* <h3 className="text-lg font-medium">
                        {session?.user?.first_name || t("profile.notProvided")}{" "}
                        {session?.user?.last_name || ""}
                      </h3> */}
                      <p className="text-sm text-muted-foreground">
                        {t("profile.joinedDate")}: {session?.user?.created_at}
                      </p>
                      <div className="mt-2 mb-4 flex items-center gap-2">
                        <span className="text-sm font-medium">{t("profile.balanceLabel")}:</span>
                        <span className="font-semibold text-primary">
                          {session?.user?.balance || "0"} UZS
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/${pathname.split("/")[1] || "uz"}/dashboard/add-funds`)}
                        >
                          {t("profile.addFundsButton")}
                        </Button>
                      </div>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        {t("profile.logoutButton")}
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    {isEditing ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        {/* <div className="space-y-2">
                          <label className="text-sm font-medium">{t("profile.firstNameLabel")}</label>
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
                          <label className="text-sm font-medium">{t("profile.lastNameLabel")}</label>
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
                        </div> */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">{t("profile.usernameLabel")}</label>
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
                          <label className="text-sm font-medium">{t("profile.phoneLabel")}</label>
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
                        {/* <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">{t("profile.firstNameLabel")}:</p>
                          <p className="font-medium">
                            {session?.user?.first_name || t("profile.notProvided")}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">{t("profile.lastNameLabel")}:</p>
                          <p className="font-medium">
                            {session?.user?.last_name || t("profile.notProvided")}
                          </p>
                        </div> */}
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">{t("profile.usernameLabel")}:</p>
                          <p className="font-medium">
                            {session?.user?.username || t("profile.notProvided")}
                          </p>
                        </div>
                        {/* <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">{t("profile.emailLabel")}:</p>
                          <p className="font-medium">
                            {session?.user?.email || t("profile.notProvided")}
                          </p>
                        </div> */}
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">{t("profile.phoneLabel")}:</p>
                          <p className="font-medium">
                            {session?.user?.phone_number || t("profile.notProvided")}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">{t("profile.userIdLabel")}:</p>
                          <p className="font-medium">
                            {session?.user?.id || t("profile.notProvided")}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">{t("profile.apiKeyLabel")}:</p>
                          <p className="font-medium">
                            {session?.user?.api_key || t("profile.notProvided")}
                          </p>
                        </div>
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
                        phone_number: session?.user?.phone_number || "",
                      });
                    }}
                  >
                    {t("profile.cancelButton")}
                  </Button>
                  <Button onClick={handleSaveProfile}>{t("profile.saveChangesButton")}</Button>
                </CardFooter>
              )}
            </Card>
          </section>

          <section className="m-6">
            <h2 className="text-xl font-bold mb-4">{t("features.title")}</h2>
            <div className="flex flex-wrap justify-center">
              <Card className="min-w-[300px] max-w-[300px]">
                <CardHeader>
                  <CardTitle className="text-lg">{t("features.support.title")}</CardTitle>
                </CardHeader>
                <CardContent className="h-[200px] flex flex-col justify-center items-center gap-4 text-center">
                  <p>{t("features.support.description")}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("features.support.supportTeam")}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => router.push(`/${pathname.split("/")[1] || "uz"}/dashboard/support`)}
                  >
                   <a href="https://t.me/turbosmm_darslik" target="_blank" rel="noopener noreferrer">
                    {t("features.support.button")}
                  </a>
                  </Button>
                </CardFooter>
              </Card>
              <Card className="min-w-[300px] max-w-[300px]">
                <CardHeader>
                  <CardTitle className="text-lg">{t("features.addFunds.title")}</CardTitle>
                </CardHeader>
                <CardContent className="h-[200px] flex flex-col justify-center items-center gap-4 text-center">
                  <p>{t("features.addFunds.currentBalance")}</p>
                  <p className="text-3xl font-bold text-primary">
                    {session?.user?.balance || "0"} UZS
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("features.addFunds.description")}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => router.push(`/${pathname.split("/")[1] || "uz"}/dashboard/add-funds`)}
                  >
                    {t("features.addFunds.button")}
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