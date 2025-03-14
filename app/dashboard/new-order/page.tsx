// app/(root)/new-order/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../_components/ui/select";
import { useToast } from "../_components/ui/use-toast";
// import { v4 as uuidv4 } from "uuid";
import { formatCurrency } from "@/lib/utils";
import { FormError } from '../_components/common/FormError';
import { Header } from '../_components/header';
import { Category, Order, Service, ServiceType, User } from '@/lib/types'
import { apiService } from '@/lib/apiservise'
// import { getSocialIcon } from '../_components/sidebar';
// import { apiService } from "@/lib/apiService";
// import { Category, ServiceType, Service, Order, User } from "@/types/api";

// Interface for saved form data in localStorage
interface SavedOrder {
  categoryId: string;
  serviceTypeId: string;
  serviceId: string;
  link: string;
  quantity: number;
}

export default function NewOrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Form state
  const [categoryId, setCategoryId] = useState<string>("");
  const [serviceTypeId, setServiceTypeId] = useState<string>("");
  const [serviceId, setServiceId] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("100");
  const [linkPlaceholder, setLinkPlaceholder] = useState<string>("Enter link");

  // Validation state
  const [quantityError, setQuantityError] = useState<string | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Derived state
  const [categories, setCategories] = useState<Category[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServiceTypes, setFilteredServiceTypes] = useState<ServiceType[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [estimatedTime, setEstimatedTime] = useState<string>("");
  const [minOrder, setMinOrder] = useState<number>(0);
  const [maxOrder, setMaxOrder] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // User state (replacing store)
  const [user, setUser] = useState<User | null>(null);

  // Fetch user, categories, service types, and services on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
  
      try {
        // Temporary hardcoded user data
        setUser({ id: 1, balance: 1000 }); // Replace with actual API call once endpoint is known
  
        const categoriesResponse = await apiService.fetchCategories();
        if (categoriesResponse.status === 200 && categoriesResponse.data) {
          const activeCategories = categoriesResponse.data.filter(cat => cat.is_active);
          setCategories(activeCategories);
        } else {
          throw new Error("Failed to load categories");
        }
  
        const serviceTypesResponse = await apiService.fetchServiceTypes();
        if (serviceTypesResponse.status === 200 && serviceTypesResponse.data) {
          const activeServiceTypes = serviceTypesResponse.data.filter(type => type.is_active);
          setServiceTypes(activeServiceTypes);
        } else {
          throw new Error("Failed to load service types");
        }
  
        const servicesResponse = await apiService.fetchServices();
        if (servicesResponse.status === 200 && servicesResponse.data) {
          const activeServices = servicesResponse.data.filter(srv => srv.is_active);
          setServices(activeServices);
        } else {
          throw new Error("Failed to load services");
        }
      } catch (err) {
        console.log(err)
        setError("Failed to load data. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load categories, service types, or services.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    loadData();
  }, []);

  // Check if we have a service ID from URL params or saved order in localStorage
  useEffect(() => {
    const serviceIdFromUrl = searchParams.get("serviceId");

    // Check if we have a saved order in localStorage
    const savedOrder = localStorage.getItem("savedOrder");
    if (savedOrder) {
      const parsedOrder: SavedOrder = JSON.parse(savedOrder);
      setCategoryId(parsedOrder.categoryId);
      setServiceTypeId(parsedOrder.serviceTypeId);
      setServiceId(parsedOrder.serviceId);
      setLink(parsedOrder.link);
      setQuantity(String(parsedOrder.quantity));

      // Clear the saved order from localStorage
      localStorage.removeItem("savedOrder");

      toast({
        title: "Order form restored",
        description: "Your previous order details have been restored.",
        variant: "default",
      });
    }
    // If we have a service ID from URL (from Services page)
    else if (serviceIdFromUrl && services.length > 0) {
      const service = services.find(srv => srv.id === Number(serviceIdFromUrl));
      if (service) {
        const serviceType = serviceTypes.find(type => type.id === service.service_type);
        if (serviceType) {
          setCategoryId(String(serviceType.category.id));
          setServiceTypeId(String(service.service_type));
          setServiceId(String(serviceIdFromUrl));
          setQuantity(String(service.min));
        }
      }
    }
  }, [searchParams, services, serviceTypes]);

  // Update filtered service types when category changes
  useEffect(() => {
    if (categoryId) {
      const filtered = serviceTypes.filter(type => String(type.category.id) === categoryId);
      setFilteredServiceTypes(filtered);

      // Set a placeholder for the link based on the category
      const category = categories.find(cat => String(cat.id) === categoryId);
      if (category) {
        setLinkPlaceholder(`Enter ${category.name} link (e.g., https://example.com)`);
      }

      // Reset service type and service if category changes
      if (serviceTypeId) {
        const currentType = serviceTypes.find(type => String(type.id) === serviceTypeId);
        if (currentType && String(currentType.category.id) !== categoryId) {
          setServiceTypeId("");
          setServiceId("");
        }
      }
    } else {
      setFilteredServiceTypes([]);
      setLinkPlaceholder("Enter link");
    }
  }, [categoryId, serviceTypeId, serviceTypes, categories]);

  // Update filtered services when service type changes
  useEffect(() => {
    if (serviceTypeId) {
      const filtered = services.filter(service => String(service.service_type) === serviceTypeId);
      setFilteredServices(filtered);

      // Reset service if service type changes
      if (serviceId) {
        const currentService = services.find(srv => String(srv.id) === serviceId);
        if (currentService && String(currentService.service_type) !== serviceTypeId) {
          setServiceId("");
        }
      }
    } else {
      setFilteredServices([]);
    }
  }, [serviceTypeId, serviceId, services]);

  // Update selected service details when service changes
  useEffect(() => {
    if (serviceId) {
      const service = services.find(srv => String(srv.id) === serviceId);
      setSelectedService(service);

      if (service) {
        setMinOrder(service.min);
        setMaxOrder(service.max);
      }
    } else {
      setSelectedService(null);
      setMinOrder(0);
      setMaxOrder(0);
    }

    setQuantityError(null);
  }, [serviceId, services]);

  // Calculate total price and estimated time when quantity or service changes
  useEffect(() => {
    if (selectedService && quantity) {
      const quantityNum = Number.parseInt(quantity);
      if (!isNaN(quantityNum) && quantityNum > 0) {
        const price = Math.round((selectedService.price * quantityNum) / 1000); // Round to nearest integer
        setTotalPrice(price);
        const time = formatDuration(selectedService.duration * quantityNum / 1000);
        setEstimatedTime(time);
      } else {
        setTotalPrice(0);
        setEstimatedTime("");
      }
    } else {
      setTotalPrice(0);
      setEstimatedTime("");
    }
  }, [selectedService, quantity]);

  // Utility to format duration
  const formatDuration = (duration: number): string => {
    if (duration < 60) {
      return `${Math.ceil(duration)} minute${Math.ceil(duration) !== 1 ? "s" : ""}`;
    } else if (duration < 1440) {
      const hours = Math.floor(duration / 60);
      return `${hours} hour${hours !== 1 ? "s" : ""}`;
    } else {
      const days = Math.floor(duration / 1440);
      return `${days} day${days !== 1 ? "s" : ""}`;
    }
  };

  // Validate quantity
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

    if (quantityNum < minOrder) {
      setQuantityError(`Quantity must be at least ${minOrder}`);
      return false;
    }

    if (quantityNum > maxOrder) {
      setQuantityError(`Quantity cannot exceed ${maxOrder}`);
      return false;
    }

    return true;
  };

  // Validate link
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
      if (!link.startsWith("http://") && !link.startsWith("https://")) {
        try {
          new URL(`https://${link}`);
          setLink(`https://${link}`);
          return true;
        } catch (e) {
          setLinkError("Please enter a valid URL");
          return false;
        }
      }

      setLinkError("Please enter a valid URL");
      return false;
    }
  };

  // Handle quantity change
  const handleQuantityChange = (value: string) => {
    setQuantity(value);
    if (formSubmitted) {
      setQuantityError(null);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setFormSubmitted(true);
  
    if (!categoryId || !serviceTypeId || !serviceId) {
      toast({
        title: "Incomplete form",
        description: "Please select a category, service type, and service to place an order.",
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
  
    // Check if user has sufficient funds
    if (user.balance < totalPrice) {
      const savedOrder: SavedOrder = {
        categoryId,
        serviceTypeId,
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
  
      router.push("dashboard/add-funds");
      return;
    }
  
    // Create the order object for API submission
    const newOrder: Order = {
      service: Number(serviceId),
      price: totalPrice, // Now an integer due to Math.round
      url: link,
      status: "true",
      user: user.id, // Ensure this is an integer
    };
  
    console.log("Submitting order:", newOrder); // Debug log
  
    try {
      const response = await apiService.createOrder(newOrder);
      if (response.status === 201 && response.data) {
        toast({
          title: "Order placed successfully!",
          description: `Your order for ${quantityNum} units has been placed. You can track it in the Orders page.`,
          variant: "success",
        });
  
        setCategoryId("");
        setServiceTypeId("");
        setServiceId("");
        setLink("");
        setQuantity("100");
        setFormSubmitted(false);
  
        // router.push("/orders");
      } else {
        throw new Error(response.error?.general?.[0] || "Failed to create order");
      }
    } catch (err) {
      console.log(err)
      toast({
        title: "Error",
        description: `Failed to submit your order: ${err.message}. Please try again later.`,
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
              <h2 className="mb-2 text-lg font-medium">Step 1: Select Category</h2>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      <div className="flex items-center gap-2">
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-medium">Step 2: Select Service Type</h2>
              <Select
                value={serviceTypeId}
                onValueChange={setServiceTypeId}
                disabled={!categoryId || filteredServiceTypes.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      !categoryId
                        ? "Select a category first"
                        : filteredServiceTypes.length === 0
                          ? "No service types available"
                          : "Select service type"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {filteredServiceTypes.map((type) => (
                    <SelectItem key={type.id} value={String(type.id)}>
                      <span>{type.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-medium">Step 3: Select Service</h2>
              <Select value={serviceId} onValueChange={setServiceId} disabled={!serviceTypeId || filteredServices.length === 0}>
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      !serviceTypeId
                        ? "Select a service type first"
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
                          {formatCurrency(service.price)} per 1000 • {formatDuration(service.duration)}
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
                placeholder={linkPlaceholder}
                value={link}
                onChange={(e) => {
                  setLink(e.target.value);
                  if (formSubmitted) {
                    setLinkError(null);
                  }
                }}
                disabled={!categoryId}
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
              {serviceId && (
                <p className="mt-1 text-sm text-muted-foreground">
                  min: {minOrder} - max: {maxOrder}
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
                    <span>{categories.find(cat => String(cat.id) === categoryId)?.name || ""}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">Service Type:</span>
                    <span>{serviceTypes.find(type => String(type.id) === serviceTypeId)?.name || ""}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">Service:</span>
                    <span>{selectedService.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">Rate:</span>
                    <span>{formatCurrency(selectedService.price)} per 1000</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span>{quantity}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">Processing Time:</span>
                    <span className="text-green-500">{estimatedTime}</span>
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
                disabled={!categoryId || !serviceTypeId || !serviceId || !link || !quantity}
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