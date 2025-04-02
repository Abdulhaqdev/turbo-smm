"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFormattedDate } from "@/hooks/useFormattedDate";
import { apiService } from "@/lib/apiservise";
import { ROUTES } from "@/lib/constants";
import Cookies from "js-cookie";
import { Edit, LogOut, Mail, Phone, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "../_components/header";
import { useToast } from '@/hooks/use-toast'
// import { useToast } from "../_components/ui/use-toast";

// Interfeyslar
interface UserProfile {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone_number: string;
  avatar?: string;
  balance?: string;
  joinDate?: string;
}

export default function AccountPage() {
  const router = useRouter();
  const { formatShortDate, isValidDate } = useFormattedDate();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone_number: "",
  });

  // Fetch user profile
  useEffect(() => {
    const userId = Cookies.get("user_id");
    const accessToken = Cookies.get("accessToken");
    if (!accessToken || !userId) {
      toast({
        title: "Error",
        description: "Please log in to view your account",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch user profile
        const profileResponse = await apiService.get<UserProfile>(
          `/api/users/${userId}/`
        );
        if (profileResponse.status === 200 && profileResponse.data) {
          setUserProfile(profileResponse.data);
          setEditedUser({
            first_name: profileResponse.data.first_name,
            last_name: profileResponse.data.last_name,
            username: profileResponse.data.username,
            email: profileResponse.data.email,
            phone_number: profileResponse.data.phone_number,
          });
        } else {
          throw new Error(
            profileResponse.error?.general?.[0] || "Failed to fetch user profile"
          );
        }
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Something went wrong",
          variant: "destructive",
        });
        router.push("/login");
      }
    };

    fetchData();
  }, [router, toast]);
	const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("userId");
    console.log("Logout: Tokenlar o'chirildi");
    router.push("/login");
  };
  const handleSaveProfile = async () => {
    const userId = Cookies.get("user_id");
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
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
        variant: "success",
      });
    } else {
      toast({
        title: "Update failed",
        description:
          updateResponse.error?.general?.[0] ||
          "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const joinDateDisplay = isValidDate(userProfile?.joinDate)
    ? formatShortDate(userProfile?.joinDate)
    : "N/A";

  return (
    <div className="flex min-h-screen flex-col">
      <Header showBackButton />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-6 text-2xl font-bold">My Account</h1>

          {/* User Profile Section */}
          <section className="mb-6">
            <Card>
              <CardHeader className="relative">
                <CardTitle className="text-xl">User Profile</CardTitle>
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
                    {isEditing ? "Save" : "Edit"} profile
                  </span>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-6 md:flex-row">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src={userProfile?.avatar || ""}
                        alt={userProfile?.username || "User"}
                      />
                      <AvatarFallback className="text-2xl">
                        {userProfile?.first_name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">
                        {userProfile?.first_name || "User"}{" "}
                        {userProfile?.last_name || ""}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Member since {joinDateDisplay}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm font-medium">Balance:</span>
                        <span className="font-semibold text-primary">
                          ${(parseFloat(userProfile?.balance || "0") || 0).toFixed(2)}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push("add-funds")}
                        >
                          Add Funds
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    {isEditing ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">First Name</label>
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
                          <label className="text-sm font-medium">Last Name</label>
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
                          <label className="text-sm font-medium">Username</label>
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
                          <label className="text-sm font-medium">Email</label>
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
                          <label className="text-sm font-medium">Phone Number</label>
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
                          <p className="text-sm text-muted-foreground">First Name</p>
                          <p className="font-medium">
                            {userProfile?.first_name || "Not provided"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Last Name</p>
                          <p className="font-medium">
                            {userProfile?.last_name || "Not provided"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Username</p>
                          <p className="font-medium">
                            {userProfile?.username || "Not provided"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">
                            {userProfile?.email || "Not provided"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Phone Number</p>
                          <p className="font-medium">
                            {userProfile?.phone_number || "Not provided"}
                          </p>
                        </div>
												<Button variant="destructive" className="w-full" onClick={handleLogout}>
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
                        first_name: userProfile?.first_name || "",
                        last_name: userProfile?.last_name || "",
                        username: userProfile?.username || "",
                        email: userProfile?.email || "",
                        phone_number: userProfile?.phone_number || "",
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                </CardFooter>
              )}
            </Card>
          </section>

          {/* Feature Cards Section */}
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-4">Account Features</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="min-w-[300px] max-w-[300px]">
                <CardHeader>
                  <CardTitle className="text-lg">Support</CardTitle>
                </CardHeader>
                <CardContent className="h-[200px] flex flex-col justify-center items-center gap-4 text-center">
                  <p>
                    Need help with your account or have questions about our services?
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Our support team is here to help you 24/7.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => router.push(ROUTES.SUPPORT)}
                  >
                    Contact Support
                  </Button>
                </CardFooter>
              </Card>

              <Card className="min-w-[300px] max-w-[300px]">
                <CardHeader>
                  <CardTitle className="text-lg">Add Funds</CardTitle>
                </CardHeader>
                <CardContent className="h-[200px] flex flex-col justify-center items-center gap-4 text-center">
                  <p>Current Balance</p>
                  <p className="text-3xl font-bold text-primary">
                    ${(parseFloat(userProfile?.balance || "0") || 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Add funds to your account to place orders
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => router.push(ROUTES.ADD_FUNDS)}
                  >
                    Add Funds
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