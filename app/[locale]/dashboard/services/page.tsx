"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../_components/ui/select";
import { Label } from "@/components/ui/label";
import { Filter, Search, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Header } from "../_components/header";
import { useToast } from "@/hooks/use-toast";
import SocialIcon from "@/components/shared/SocialIcon";
import { useSession } from "@/hooks/useSession";
import axios from "@/lib/axios";
import { usePathname } from "next/navigation";
import { useLocaleFromUrl } from "@/hooks/useLocaleFromUrl";
import { useTranslations } from "use-intl";

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

interface Category {
  id: number;
  name: string;
  is_active?: boolean;
  icon?: string;
}

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();
  const { session } = useSession();
  const pathname = usePathname();
  const t = useTranslations("services");
  useLocaleFromUrl();

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
    const loadData = async () => {
      if (!session) {
        setError(t("authError"));
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Kategoriyalar
        const categoriesResponse = await axios.get<Category[]>("/api/categories/", {
          headers: { Authorization: `Bearer ${session.token}` },
        });

        const activeCategories = categoriesResponse.data
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

        // Xizmatlar
        const servicesResponse = await axios.get<Service[]>("/api/services/", {
          headers: { Authorization: `Bearer ${session.token}` },
        });

        const activeServices = servicesResponse.data.filter((service) => service.is_active);
        setServices(activeServices);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError(t("loadingError"));
        toast({
          title: t("toast.errorTitle"),
          description: t("toast.errorDescription"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [session, toast, t]);

  const filteredServices = services.filter((service) => {
    const category = categories.find((cat) => cat.id === service.category);

    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category?.name.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const matchesCategory = !categoryFilter || service.category.toString() === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const currentServices = filteredServices;

  const getTimeColor = (duration: number) => {
    if (duration <= 60) return "text-blue-500";
    if (duration <= 1440) return "text-green-500";
    return "text-yellow-500";
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds}s`);
    return parts.join(" ");
  };

  const clearFilters = () => {
    setCategoryFilter("");
    setSearchTerm("");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto max-w-7xl flex items-center justify-center min-h-[50vh]">
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
          <div className="mx-auto max-w-7xl flex items-center justify-center min-h-[50vh]">
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
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold">{t("title")}</h1>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("searchPlaceholder")}
                className="pl-9 w-full sm:w-[250px] md:w-[300px]"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="mb-6 rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                {t("filters")}
              </h2>
              {(categoryFilter || searchTerm) && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2">
                  <X className="h-4 w-4 mr-1" />
                  {t("clearFilters")}
                </Button>
              )}
            </div>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="category-filter" className="mb-2 block">
                  {t("categoryLabel")}
                </Label>
                <Select
                  value={categoryFilter}
                  onValueChange={(value) => {
                    setCategoryFilter(value === "all" ? "" : value);
                  }}
                >
                  <SelectTrigger id="category-filter">
                    <SelectValue placeholder={t("allCategories")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allCategories")}</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        <div className="flex items-center gap-2">
                          {category.icon && <SocialIcon iconName={category.icon} className="h-5 w-5" />}
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="rounded-lg border bg-card">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left">{t("table.number")}</th>
                    <th className="px-4 py-3 text-left">{t("table.service")}</th>
                    <th className="px-4 py-3 text-left">{t("table.category")}</th>
                    <th className="px-4 py-3 text-right">{t("table.minMax")}</th>
                    <th className="px-4 py-3 text-right">{t("table.ratePer1000")}</th>
                    <th className="px-4 py-3 text-right">{t("table.averageTime")}</th>
                    <th className="px-4 py-3 text-right">{t("table.action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {currentServices.map((service, index) => {
                    const category = categories.find((cat) => cat.id === service.category);
                    return (
                      <tr key={service.id} className={index % 2 === 0 ? "" : "bg-muted/30"}>
                        <td className="px-4 py-4 text-left">{index + 1}</td>
                        <td className="px-4 py-4 text-left">
                          <div className="font-medium">{service.name}</div>
                        </td>
                        <td className="px-4 py-4 text-left">{category?.name || "N/A"}</td>
                        <td className="px-4 py-4 text-right">
                          <div className="text-xs text-muted-foreground">
                            {service.min} - {service.max}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">{formatCurrency(service.price)}</td>
                        <td className={`px-4 py-4 text-right ${getTimeColor(service.duration)}`}>
                          {formatDuration(service.duration)}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Button asChild size="sm">
                            <Link href={`/${pathname.split("/")[1]}/dashboard/new-order?serviceId=${service.id}`}>
                              {t("buyNow")}
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  {currentServices.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                        {t("noServicesFound")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-4 md:hidden">
            {currentServices.map((service, index) => {
              const category = categories.find((cat) => cat.id === service.category);
              return (
                <Card key={service.id} className="bg-card">
                  <CardContent className="pt-6">
                    <div className="mb-2 text-sm text-muted-foreground">#{index + 1}</div>
                    <div className="mb-4">
                      <div className="mb-2 font-medium">{service.name}</div>
                      <div className="text-sm text-muted-foreground">{category?.name || "N/A"}</div>
                    </div>
                    <div className="mb-2 text-sm text-muted-foreground">
                      {t("card.minOrder")}: {service.min} {t("card.maxOrder")}: {service.max}
                    </div>
                    <div className="mb-4 grid gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{t("card.ratePer1000")}</span>
                        <span className="font-medium">{formatCurrency(service.price)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{t("card.averageTime")}</span>
                        <span className={getTimeColor(service.duration)}>{formatDuration(service.duration)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href={`/${pathname.split("/")[1]}/dashboard/new-order?serviceId=${service.id}`}>
                        {t("buyNow")}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
            {currentServices.length === 0 && (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">{t("noServicesFound")}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}