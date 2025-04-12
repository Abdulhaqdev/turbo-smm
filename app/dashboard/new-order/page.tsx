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
import { useToast } from "@/hooks/use-toast";
import SocialIcon from "@/components/shared/SocialIcon";
import { useSession } from "@/hooks/useSession";
import axios from "@/lib/axios";

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

interface Order {
  service_id: number;
  url: string;
  status: string;
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
  const { session } = useSession();

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

  const socialPlatforms = [
    "Instagram",
    "Facebook",
    "Twitter",
    "Spotify",
    "TikTok",
    "LinkedIn",
    "Google",
    "Telegram",
    "Discord",
    "Snapchat",
    "Twitch",
    "Youtube",
  ];

  useEffect(() => {
    if (session) {
      const loadData = async () => {
        setIsLoading(true);
        setError(null);

        try {
          // Kategoriyalarni yuklash
          const categoryRes = await axios.get("/api/categories/", {
            headers: { Authorization: `Bearer ${session.token}` },
          });
          console.log(categoryRes.data)
          const categories = categoryRes.data as Category[];
          console.log(categories)
          const activeCategories = categories
            .filter((category) => category.is_active !== false)
            .map((category) => {
              const normalizedCategoryName = category.name.toLowerCase();
              const matchingPlatform = socialPlatforms.find((platform) =>
                normalizedCategoryName.includes(platform.toLowerCase())
              );
              return {
                ...category,
                icon: matchingPlatform ? matchingPlatform.toLowerCase() : undefined,
              };
            });
            console.log(activeCategories)
          setCategories(activeCategories);

          // Xizmatlarni yuklash
          const serviceRes = await axios.get("/api/services/", {
            headers: { Authorization: `Bearer ${session.token}` },
          });
          const services = serviceRes.data as Service[];
          const activeServices = services.filter((service) => service.is_active);
          console.log("services", activeServices)
          setServices(activeServices);
        } catch (err) {
          console.error(err);
          setError("Ma'lumotlarni yuklashda xatolik yuz berdi.");
          toast({
            title: "Xatolik",
            description: "Kategoriyalar yoki xizmatlarni yuklashda xatolik.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    } else {
      setError("Tizimga kirish kerak!");
      setIsLoading(false);
    }
  }, [router, session, toast]);

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
        title: "Buyurtma formasi tiklandi",
        description: "Oldingi buyurtma ma'lumotlaringiz tiklandi.",
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
      setQuantityError("Miqdor kiritilishi shart");
      return false;
    }
    const quantityNum = Number.parseInt(quantity);
    if (isNaN(quantityNum)) {
      setQuantityError("Miqdor haqiqiy raqam bo‘lishi kerak");
      return false;
    }
    if (selectedService) {
      if (quantityNum < selectedService.min) {
        setQuantityError(`Miqdor kamida ${selectedService.min} bo‘lishi kerak`);
        return false;
      }
      if (quantityNum > selectedService.max) {
        setQuantityError(`Miqdor ${selectedService.max} dan oshmasligi kerak`);
        return false;
      }
    }
    return true;
  };

  const validateLink = (): boolean => {
    setLinkError(null);
    if (!link.trim()) {
      setLinkError("Havola kiritilishi shart");
      return false;
    }
    try {
      new URL(link);
      return true;
    } catch (e) {
      console.log(e);
      setLinkError("Iltimos, haqiqiy URL kiriting");
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
        title: "Forma to‘liq emas",
        description: "Buyurtma berish uchun kategoriya va xizmatni tanlang.",
        variant: "destructive",
      });
      return;
    }

    const isLinkValid = validateLink();
    const isQuantityValid = validateQuantity();

    if (!isLinkValid || !isQuantityValid) {
      return;
    }

    if (!session?.user) {
      toast({
        title: "Xatolik",
        description: "Foydalanuvchi ma'lumotlari mavjud emas. Buyurtma berish uchun tizimga kiring.",
        variant: "destructive",
      });
      return;
    }

    const quantityNum = Number.parseInt(quantity);

    if (Number(session.user.balance) < totalPrice) {
      const savedOrder: SavedOrder = {
        categoryId,
        serviceId,
        link,
        quantity: quantityNum,
      };
      localStorage.setItem("savedOrder", JSON.stringify(savedOrder));

      toast({
        title: "Mablag‘ yetarli emas",
        description: `Sizning balansingiz ${session.user.balance}, lekin bu buyurtma ${totalPrice} turadi. Davom etish uchun pul qo‘shing.`,
        variant: "destructive",
      });

      router.push("/dashboard/add-funds");
      return;
    }

    const newOrder: Order = {
      service_id: Number(serviceId),
      url: link,
      status: "pending", // "padding" o‘rniga "pending" ishlatildi
      quantity: quantityNum,
    };

    try {
      const response = await axios.post("/api/orders/", newOrder, {
        headers: {
          Authorization: `Bearer ${session.token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        toast({
          title: "Buyurtma muvaffaqiyatli joylashtirildi!",
          description: `${quantityNum} dona uchun buyurtmangiz joylashtirildi.`,
          variant: "success",
        });

        setCategoryId("");
        setServiceId("");
        setLink("");
        setQuantity("");
        setFormSubmitted(false);
      } else {
        throw new Error("Buyurtma yaratishda xatolik yuz berdi");
      }
    } catch (err) {
      console.error("Buyurtma yuborishda xatolik:", err);
      toast({
        title: "Xatolik",
        description: "Buyurtmani yuborishda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko‘ring.",
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
          <h1 className="mb-6 text-2xl font-bold">Yangi Buyurtma</h1>

          <div className="mb-6 space-y-4">
            <div>
              <h2 className="mb-2 text-lg font-medium">Kategoriyalar</h2>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className=" ">
                        <SelectValue placeholder={ categories[0].name}  />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem  key={category.id} value={String(category.id)}>
                      <div className="flex items-center gap-2 ">
                        {category.icon && <SocialIcon iconName={category.icon} className="h-5 w-5" />}
                        <span className='text-wrap'>{category.name}</span>
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
                        ? "Avval kategoriyani tanlang"
                        : filteredServices.length === 0
                        ? "Xizmatlar mavjud emas"
                        : "Xizmatni tanlang"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {filteredServices.map((service) => (
                    <SelectItem key={service.id} value={String(service.id)}>
                      <div className="flex flex-col">
                        <span className='text-start'>{service.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatCurrency(service.price)} har 1000 ga • Min: {service.min} • Max: {service.max}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-medium">Havola</h2>
              <Input
                placeholder="Havolani kiriting (masalan, https://example.com)"
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
              <h2 className="mb-2 text-lg font-medium">Miqdor</h2>
              <Input
                type="number"
                
                placeholder="Miqdorni kiriting"
                // value={quantity}
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
              <CardTitle>Buyurtma xulosasi</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedService ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">Kategoriya:</span>
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
                    <span className="text-muted-foreground">Xizmat:</span>
                    <span>{selectedService.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">Miqdor:</span>
                    <span>{quantity}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">Narx:</span>

                    <span>{formatCurrency(selectedService.price)} har 1000 ga</span>
                  </div>
                  <div className="border-t pt-4 flex items-center justify-between">
                    <span className="text-muted-foreground font-medium">Umumiy narx</span>
                    <span className="text-xl font-bold">{formatCurrency(totalPrice)}</span>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Buyurtma xulosasini ko‘rish uchun xizmatni tanlang</p>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                onClick={handleSubmit}
                disabled={!categoryId || !serviceId || !link || !quantity}
              >
                Buyurtmani yuborish
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}