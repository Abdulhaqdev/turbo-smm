// app/(root)/services/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { categories, serviceTypes, getCategoryById, getServiceTypeById } from "@/lib/data";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../_components/ui/select";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Filter, Search, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Header } from '../_components/header';
import { getSocialIcon } from '../_components/sidebar';
import { ApiService } from '@/lib/apiservise'
import { useToast } from '../_components/ui/use-toast'
// import { ApiService } from "@/lib/apiService";
// import { useToast } from "@/components/ui/use-toast";

// Define the Service interface (same as in ApiService)
interface Service {
  id: number;
  name: string;
  description: string;
  duration: number;
  min: number;
  max: number;
  price: number;
  site_id: number;
  service_type: number;
  api: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("");
  const [filteredServiceTypes, setFilteredServiceTypes] = useState(serviceTypes);
  const [currentPage, setCurrentPage] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const servicesPerPage = 10;

  const { toast } = useToast();
  const apiService = new ApiService();

  // Fetch services on component mount
  useEffect(() => {
    const loadServices = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiService.fetchServices();
        if (response.status === 200 && response.data) {
          // Filter only active services
          const activeServices = response.data.filter(service => service.is_active);
          setServices(activeServices);
        } else {
          setError("Failed to load services. Please try again later.");
          toast({
            title: "Error",
            description: "Failed to load services.",
            variant: "destructive",
          });
        }
      } catch (err) {
        setError("An unexpected error occurred.");
        toast({
          title: "Error",
          description: "An unexpected error occurred while fetching services.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, []);

  // Update filtered service types when category changes
  useEffect(() => {
    if (categoryFilter) {
      setFilteredServiceTypes(serviceTypes.filter((type) => type.categoryId === categoryFilter));
      setServiceTypeFilter("");
    } else {
      setFilteredServiceTypes(serviceTypes);
    }
  }, [categoryFilter]);

  // Filter services based on search term and filters
  const filteredServices = services.filter((service) => {
    const serviceType = getServiceTypeById(service.service_type);
    const category = serviceType ? getCategoryById(serviceType.categoryId) : null;

    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (serviceType?.name.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (category?.name.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const matchesCategory = !categoryFilter || (serviceType && serviceType.categoryId === categoryFilter);
    const matchesServiceType = !serviceTypeFilter || service.service_type === serviceTypeFilter;

    return matchesSearch && matchesCategory && matchesServiceType;
  });

  // Calculate pagination
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

  // Function to determine time color
  const getTimeColor = (duration: number) => {
    if (duration <= 60) return "text-blue-500"; // Less than or equal to 1 hour
    if (duration <= 1440) return "text-green-500"; // Less than or equal to 1 day (1440 minutes)
    return "text-yellow-500"; // More than 1 day
  };

  // Format duration into a readable string
  const formatDuration = (duration: number) => {
    if (duration < 60) {
      return `${duration} minute${duration !== 1 ? "s" : ""}`;
    } else if (duration < 1440) {
      const hours = Math.floor(duration / 60);
      return `${hours} hour${hours !== 1 ? "s" : ""}`;
    } else {
      const days = Math.floor(duration / 1440);
      return `${days} day${days !== 1 ? "s" : ""}`;
    }
  };

  // Handle page change
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Clear all filters
  const clearFilters = () => {
    setCategoryFilter("");
    setServiceTypeFilter("");
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

          {/* Filters */}
          <div className="mb-6 rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </h2>
              {(categoryFilter || serviceTypeFilter || searchTerm) && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2">
                  <X className="h-4 w-4 mr-1" />
                  Clear filters
                </Button>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="category-filter" className="mb-2 block">
                  Category
                </Label>
                <Select
                  value={categoryFilter}
                  onValueChange={(value) => {
                    setCategoryFilter(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger id="category-filter">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => {
                      const Icon = getSocialIcon(category.icon);
                      return (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="service-type-filter" className="mb-2 block">
                  Service Type
                </Label>
                <Select
                  value={serviceTypeFilter}
                  onValueChange={(value) => {
                    setServiceTypeFilter(value);
                    setCurrentPage(1);
                  }}
                  disabled={filteredServiceTypes.length === 0}
                >
                  <SelectTrigger id="service-type-filter">
                    <SelectValue placeholder="All Service Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Service Types</SelectItem>
                    {filteredServiceTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results count and pagination info */}
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground mb-2 sm:mb-0">
              Showing {currentServices.length > 0 ? indexOfFirstService + 1 : 0} to{" "}
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
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
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

          {/* Desktop view - Table */}
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
                    const serviceType = getServiceTypeById(service.service_type);
                    const category = serviceType ? getCategoryById(serviceType.categoryId) : null;
                    const Icon = category ? getSocialIcon(category.icon) : null;

                    return (
                      <tr key={service.id} className={index % 2 === 0 ? "" : "bg-muted/30"}>
                        <td className="px-4 py-4 text-left">{indexOfFirstService + index + 1}</td>
                        <td className="px-4 py-4 text-left">
                          <div className="font-medium">{service.name}</div>
                        </td>
                        <td className="px-4 py-4 text-left">
                          {category && (
                            <div className="flex items-center gap-2">
                              {Icon && <Icon className="h-4 w-4" />}
                              <span>{category.name}</span>
                            </div>
                          )}
                        </td>
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
                            <Link href={`/new-order?serviceId=${service.id}`}>Buy now</Link>
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

          {/* Mobile view - Cards */}
          <div className="grid gap-4 md:hidden">
            {currentServices.map((service, index) => {
              const serviceType = getServiceTypeById(service.service_type);
              const category = serviceType ? getCategoryById(serviceType.categoryId) : null;
              const Icon = category ? getSocialIcon(category.icon) : null;

              return (
                <Card key={service.id} className="bg-card">
                  <CardContent className="pt-6">
                    <div className="mb-2 text-sm text-muted-foreground">#{indexOfFirstService + index + 1}</div>

                    {/* Service name and category */}
                    <div className="mb-4">
                      <div className="mb-2 font-medium">{service.name}</div>
                      {category && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {Icon && <Icon className="h-4 w-4" />}
                          <span>{category.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Order limits */}
                    <div className="mb-2 text-sm text-muted-foreground">
                      Min order: {service.min} Max order: {service.max}
                    </div>

                    {/* Rate and time */}
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
                      <Link href={`/new-order?serviceId=${service.id}`}>Buy now</Link>
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

          {/* Pagination controls */}
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

                {/* Page numbers */}
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