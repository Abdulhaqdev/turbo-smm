"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../_components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { FormError } from "../_components/common/FormError";
import { Header } from "../_components/header";
import { apiService } from "@/lib/apiservise";
import Cookies from "js-cookie";
import { useToast } from '@/hooks/use-toast';
import SocialIcon from '@/components/shared/SocialIcon';

// Interfeyslar
interface Category {
  id: number;
  name: string;
  is_active?: boolean;
  icon?: string;
}

interface Service {
  id: number;
  name: string;
  description: string;
  duration: number;
  min: number;
  max: number;
  price: number;
  site_id: number;
  category: number;
  api: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

interface UserProfile {
  id: number;
  balance: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}

interface Order {
  service_id: number;
  url: string;
  status: string;
  user: string;
  quantity: number;
}

interface SavedOrder {
  categoryId: string;
  serviceId: string;
  link: string;
  quantity: number;
}

export default function NewOrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [categoryId, setCategoryId] = useState<string>("");
  const [serviceId, setServiceId] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");

  const [quantityError, setQuantityError] = useState<string | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [user, setUser] = useState<UserProfile | null>(null);

  const socialPlatforms = [
    "Instagram", "Facebook", "Twitter", "Spotify", "TikTok", "LinkedIn",
    "Google", "Telegram", "Discord", "Snapchat", "Twitch", "Youtube"
  ];
  // const {session} = useSession()

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const userId = Cookies.get("user_id");
        const accessToken = Cookies.get("accessToken");
        if (!accessToken || !userId) {
          throw new Error("No access token or user ID found");
        }

        // AccountPage'dagi usuldan foydalanib user ma'lumotlarini olish
        const profileResponse = await apiService.get<UserProfile>(`/api/users/${userId}/`);
        if (profileResponse.status === 200 && profileResponse.data) {
          setUser(profileResponse.data);
        } else {
          throw new Error(profileResponse.error?.general?.[0] || "Failed to fetch user profile");
        }

        const categoriesResponse = await apiService.fetchCategories();
        if (categoriesResponse.status === 200 && categoriesResponse.data?.results) {
          const activeCategories = categoriesResponse.data.results
            .filter((cat) => cat.is_active !== false)
            .map((cat) => {
              const normalizedCategoryName = cat.name.toLowerCase();
              const matchingPlatform = socialPlatforms.find((platform) =>
                normalizedCategoryName.includes(platform.toLowerCase())
              );
              return {
                ...cat,
                icon: matchingPlatform ? matchingPlatform.toLowerCase() : undefined,
              };
            });
          setCategories(activeCategories);
        } else {
          throw new Error(categoriesResponse.error?.general?.[0] || "Failed to load categories");
        }

        const servicesResponse = await apiService.fetchServices();
        if (servicesResponse.status === 200 && servicesResponse.data?.results) {
          const activeServices = servicesResponse.data.results.filter((srv) => srv.is_active);
          setServices(activeServices);
        } else {
          throw new Error(servicesResponse.error?.general?.[0] || "Failed to load services");
        }
      } catch (err) {
        console.error("Load Data Error:", err);
        setError("Failed to load data. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load categories, services, or user data.",
          variant: "destructive",
        });
        router.push("/login"); // Xatolik bo'lsa login sahifasiga yo'naltirish
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast, router]);

  useEffect(() => {
    const serviceIdFromUrl = searchParams.get("serviceId");
    const savedOrder = localStorage.getItem("savedOrder");
    if (savedOrder) {
      const parsedOrder: SavedOrder = JSON.parse(savedOrder);
      setCategoryId(parsedOrder.categoryId);
      setServiceId(parsedOrder.serviceId);
      setLink(parsedOrder.link);
      setQuantity(String(parsedOrder.quantity));
      localStorage.removeItem("savedOrder");

      toast({
        title: "Order form restored",
        description: "Your previous order details have been restored.",
        variant: "default",
      });
    } else if (serviceIdFromUrl && services.length > 0) {
      const service = services.find((srv) => srv.id === Number(serviceIdFromUrl)) || null;
      if (service) {
        setCategoryId(String(service.category));
        setServiceId(String(serviceIdFromUrl));
        setQuantity(String(service.min));
      }
    }
  }, [searchParams, services, toast]);

  useEffect(() => {
    if (categoryId) {
      const filtered = services.filter((srv) => String(srv.category) === categoryId);
      setFilteredServices(filtered);
    } else {
      setFilteredServices([]);
    }
  }, [categoryId, services]);

  useEffect(() => {
    if (serviceId) {
      const service = services.find((srv) => String(srv.id) === serviceId) || null;
      setSelectedService(service);
      if (service && !quantity) {
        setQuantity(String(service.min));
      }
    } else {
      setSelectedService(null);
    }
    setQuantityError(null);
  }, [serviceId, services, quantity]);

  useEffect(() => {
    if (selectedService && quantity) {
      const quantityNum = Number.parseInt(quantity);
      if (!isNaN(quantityNum) && quantityNum > 0) {
        const price = Math.round((selectedService.price * quantityNum) / 1000);
        setTotalPrice(price);
      } else {
        setTotalPrice(0);
      }
    } else {
      setTotalPrice(0);
    }
  }, [selectedService, quantity]);

  const validateQuantity = (): boolean => {
    setQuantityError(null);
    if (!quantity.trim()) {
      setQuantityError("Quantity is required");
      return false;
    }
    const quantityNum = Number.parseInt(quantity);
    if (isNaN(quantityNum)) {
      setQuantityError("Quantity must be a valid number");
      return false;
    }
    if (selectedService) {
      if (quantityNum < selectedService.min) {
        setQuantityError(`Quantity must be at least ${selectedService.min}`);
        return false;
      }
      if (quantityNum > selectedService.max) {
        setQuantityError(`Quantity cannot exceed ${selectedService.max}`);
        return false;
      }
    }
    return true;
  };

  const validateLink = (): boolean => {
    setLinkError(null);
    if (!link.trim()) {
      setLinkError("Link is required");
      return false;
    }
    try {
      new URL(link);
      return true;
    } catch (e) {
      console.log(e);
      setLinkError("Please enter a valid URL");
      return false;
    }
  };

  const handleQuantityChange = (value: string) => {
    setQuantity(value);
    if (formSubmitted) {
      setQuantityError(null);
    }
  };

  const handleSubmit = async () => {
    setFormSubmitted(true);

    if (!categoryId || !serviceId) {
      toast({
        title: "Incomplete form",
        description: "Please select a category and service to place an order.",
        variant: "destructive",
      });
      return;
    }

    const isLinkValid = validateLink();
    const isQuantityValid = validateQuantity();

    if (!isLinkValid || !isQuantityValid) {
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "User data not available. Please log in to place an order.",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    const quantityNum = Number.parseInt(quantity);

    if (user.balance < totalPrice) {
      const savedOrder: SavedOrder = {
        categoryId,
        serviceId,
        link,
        quantity: quantityNum,
      };
      localStorage.setItem("savedOrder", JSON.stringify(savedOrder));

      toast({
        title: "Insufficient funds",
        description: `Your balance is ${formatCurrency(user.balance)}, but this order costs ${formatCurrency(totalPrice)}. Please add funds to continue.`,
        variant: "destructive",
      });

      router.push("/dashboard/add-funds");
      return;
    }

    const newOrder: Order = {
      service_id: 1, 
      url: link,
      status: "padding",
      user: toString(user.id),
      quantity: quantityNum,
    };

    try {
      const response = await apiService.createOrder(newOrder);
      if (response.status === 201 && response.data) {
        toast({
          title: "Order placed successfully!",
          description: `Your order for ${quantityNum} units has been placed.`,
          variant: "success",
        });

        setCategoryId("");
        setServiceId("");
        setLink("");
        setQuantity("");
        setFormSubmitted(false);
      } else {
        throw new Error(response.error?.general?.[0] || "Failed to create order");
      }
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: "Failed to submit your order. Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto max-w-3xl flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto max-w-3xl flex items-center justify-center min-h-[50vh]">
            <p className="text-destructive">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-2xl font-bold">New Order</h1>

          <div className="mb-6 space-y-4">
            <div>
              <h2 className="mb-2 text-lg font-medium">Kategoriyalar</h2>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      <div className="flex items-center gap-2">
                        {category.icon && <SocialIcon iconName={category.icon} className="h-5 w-5" />}
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-medium">Xizmatlar</h2>
              <Select
                value={serviceId}
                onValueChange={setServiceId}
                disabled={!categoryId || filteredServices.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      !categoryId
                        ? "Select a category first"
                        : filteredServices.length === 0
                        ? "No services available"
                        : "Select service"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {filteredServices.map((service) => (
                    <SelectItem key={service.id} value={String(service.id)}>
                      <div className="flex flex-col">
                        <span>{service.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatCurrency(service.price)} per 1000 • Min: {service.min} • Max: {service.max}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-medium">Link</h2>
              <Input
                placeholder="Enter link (e.g., https://example.com)"
                value={link}
                onChange={(e) => {
                  setLink(e.target.value);
                  if (formSubmitted) {
                    setLinkError(null);
                  }
                }}
                disabled={!serviceId}
                className={linkError ? "border-destructive" : ""}
              />
              <FormError message={linkError} />
            </div>

            <div>
              <h2 className="mb-2 text-lg font-medium">Quantity</h2>
              <Input
                type="number"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                disabled={!serviceId}
                className={quantityError ? "border-destructive" : ""}
              />
              <FormError message={quantityError} />
              {selectedService && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Min: {selectedService.min} - Max: {selectedService.max}
                </p>
              )}
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedService ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">Category:</span>
                    <div className="flex items-center gap-2">
                      {categoryId && categories.find((cat) => String(cat.id) === categoryId)?.icon && (
                        <SocialIcon
                          iconName={categories.find((cat) => String(cat.id) === categoryId)!.icon!}
                          className="h-5 w-5"
                        />
                      )}
                      <span>{categories.find((cat) => String(cat.id) === categoryId)?.name || ""}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">Service:</span>
                    <span>{selectedService.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span>{quantity}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">Rate:</span>
                    <span>{formatCurrency(selectedService.price)} per 1000</span>
                  </div>
                  <div className="border-t pt-4 flex items-center justify-between">
                    <span className="text-muted-foreground font-medium">Total Price</span>
                    <span className="text-xl font-bold">{formatCurrency(totalPrice)}</span>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Select a service to see order summary</p>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                onClick={handleSubmit}
                disabled={!categoryId || !serviceId || !link || !quantity}
              >
                Submit Order
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}