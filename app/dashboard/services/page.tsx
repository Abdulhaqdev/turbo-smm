"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../_components/ui/select";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Filter, Search, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Header } from "../_components/header";
import { apiService } from "@/lib/apiservise";
import { useToast } from '@/hooks/use-toast';
import SocialIcon from '@/components/shared/SocialIcon'

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
  icon?: string; // Yangi xususiyat: ijtimoiy tarmoq ikonkasi
}

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const servicesPerPage = 10;

  const { toast } = useToast();

  // Ijtimoiy tarmoqlar ro'yxati
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
    "Youtube"
  ];

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const categoriesResponse = await apiService.fetchCategories();
        if (categoriesResponse.status === 200 && categoriesResponse.data?.results) {
          const activeCategories = categoriesResponse.data.results
            .filter((cat) => cat.is_active !== false)
            .map((cat) => {
              // Kategoriya nomi ijtimoiy tarmoq nomiga mos keladimi tekshiramiz
              const normalizedCategoryName = cat.name.toLowerCase();
              const matchingPlatform = socialPlatforms.find(
                (platform) => platform.toLowerCase() === normalizedCategoryName
              );
              return {
                ...cat,
                icon: matchingPlatform ? matchingPlatform.toLowerCase() : undefined, // Agar moslik bo‘lsa ikonka qo‘shiladi
              };
            });
          setCategories(activeCategories);
        } else {
          throw new Error("Failed to load categories");
        }

        const servicesResponse = await apiService.fetchServices(currentPage);
        if (servicesResponse.status === 200 && servicesResponse.data?.results) {
          const activeServices = servicesResponse.data.results.filter((service) => service.is_active);
          setServices(activeServices);
          setTotalPages(Math.ceil(servicesResponse.data.count / servicesPerPage));
        } else {
          throw new Error("Failed to load services");
        }
      } catch (err) {
        console.error(err);
        setError("An unexpected error occurred while fetching data.");
        toast({
          title: "Error",
          description: "Failed to load data from the server.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentPage, toast]);

  const filteredServices = services.filter((service) => {
    const category = categories.find((cat) => cat.id === service.category);

    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category?.name.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const matchesCategory = !categoryFilter || service.category.toString() === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);

  const getTimeColor = (duration: number) => {
    if (duration <= 60) return "text-blue-500";
    if (duration <= 1440) return "text-green-500";
    return "text-yellow-500";
  };

  const formatDuration = (duration: number) => {
    if (duration < 60) return `${duration} minute${duration !== 1 ? "s" : ""}`;
    if (duration < 1440) {
      const hours = Math.floor(duration / 60);
      return `${hours} hour${hours !== 1 ? "s" : ""}`;
    }
    const days = Math.floor(duration / 1440);
    return `${days} day${days !== 1 ? "s" : ""}`;
  };

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const clearFilters = () => {
    setCategoryFilter("");
    setSearchTerm("");
    setCurrentPage(1);
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
            <h1 className="text-2xl font-bold">Services</h1>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                className="pl-9 w-full sm:w-[250px] md:w-[300px]"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <div className="mb-6 rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </h2>
              {(categoryFilter || searchTerm) && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2">
                  <X className="h-4 w-4 mr-1" />
                  Clear filters
                </Button>
              )}
            </div>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="category-filter" className="mb-2 block">
                  Category
                </Label>
                <Select
                  value={categoryFilter}
                  onValueChange={(value) => {
                    setCategoryFilter(value === "all" ? "" : value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger id="category-filter">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
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

          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground mb-2 sm:mb-0">
              Showing {filteredServices.length > 0 ? indexOfFirstService + 1 : 0} to{" "}
              {Math.min(indexOfLastService, filteredServices.length)} of {filteredServices.length} services
            </p>
            {totalPages > 1 && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">Page {currentPage} of {totalPages}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="hidden md:block">
            <div className="rounded-lg border bg-card">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left">#</th>
                    <th className="px-4 py-3 text-left">Service</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-right">Min-Max</th>
                    <th className="px-4 py-3 text-right">Rate per 1000</th>
                    <th className="px-4 py-3 text-right">Average time</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentServices.map((service, index) => {
                    const category = categories.find((cat) => cat.id === service.category);
                    return (
                      <tr key={service.id} className={index % 2 === 0 ? "" : "bg-muted/30"}>
                        <td className="px-4 py-4 text-left">{indexOfFirstService + index + 1}</td>
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
                            <Link href={`/dashboard/new-order?serviceId=${service.id}`}>Buy now</Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  {currentServices.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                        No services found matching your search.
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
                    <div className="mb-2 text-sm text-muted-foreground">#{indexOfFirstService + index + 1}</div>
                    <div className="mb-4">
                      <div className="mb-2 font-medium">{service.name}</div>
                      <div className="text-sm text-muted-foreground">{category?.name || "N/A"}</div>
                    </div>
                    <div className="mb-2 text-sm text-muted-foreground">
                      Min order: {service.min} Max order: {service.max}
                    </div>
                    <div className="mb-4 grid gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Rate per 1000</span>
                        <span className="font-medium">{formatCurrency(service.price)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Average time</span>
                        <span className={getTimeColor(service.duration)}>{formatDuration(service.duration)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href={`/dashboard/new-order?serviceId=${service.id}`}>Buy now</Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
            {currentServices.length === 0 && (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">No services found matching your search.</p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <div className="flex items-center space-x-1">
                <Button variant="outline" size="sm" onClick={() => paginate(1)} disabled={currentPage === 1}>
                  First
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => paginate(pageNum)}
                        className="mx-0.5 w-8"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}