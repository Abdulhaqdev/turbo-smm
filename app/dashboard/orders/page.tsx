"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../_components/ui/table";
import { Search, ExternalLink, CalendarClock, Link2 } from "lucide-react";
import { getCategoryById, getServiceById, getServiceTypeById } from "@/lib/data";
import { useToast } from "../_components/ui/use-toast";
import { formatCurrency } from "@/lib/utils";
import { useFormattedDate } from "../../hooks/useFormattedDate";
import { OrderDetailsDialog } from "../_components/orders/order-details-dialog";
import { Header } from "../_components/header";
import { Badge } from "../_components/ui/badge";
import { getSocialIcon, Sidebar } from "../_components/sidebar";
import { apiService } from '@/lib/apiservise'
import { User } from '@/lib/types'
// import { apiService } from "@/lib/apiService";
// import type { Order, User } from "@/lib/types";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order]>([]);
  const [user, setUser] = useState<User| null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { formatDateTime, isValidDate } = useFormattedDate();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fetch user and orders on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        // Fetch user data
        const userResponse = await apiService.fetchUser();
        if (userResponse.status === 200 && userResponse.data) {
          setUser(userResponse.data);
        } else if (userResponse.status === 401) {
          toast({
            title: "Authentication required",
            description: "Please log in to view your orders.",
            variant: "destructive",
          });
          router.push("/login");
          return;
        } else {
          throw new Error("Failed to load user data");
        }

        // Fetch orders
        const ordersResponse = await apiService.getOrders();
        if (ordersResponse.status === 200 && ordersResponse.data) {
          const mappedOrders = ordersResponse.data.map((order: any) => ({
            id: order.id,
            service: order.service,
            price: order.price,
            url: order.url,
            status: order.status === "true" ? "completed" : order.status,
            user: order.user,
            created_at: order.created_at,
            updated_at: order.updated_at,
            link: order.url,
            createdAt: order.created_at,
            quantity: 100, // Default value; fetch or calculate if possible
            serviceTypeId: undefined, // Fetch from service if available
            categoryId: undefined, // Fetch from service if available
            estimatedCompletion: "N/A", // Default value; fetch or calculate if possible
          }));
          setOrders(mappedOrders);
        } else {
          throw new Error("Failed to load orders");
        }
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast, router]);

  // Filter orders based on search term
  const filteredOrders = orders.filter((order) => {
    const service = getServiceById(order.service);
    const serviceType = getServiceTypeById(order.serviceTypeId || 0);
    const category = getCategoryById(order.categoryId || 0);
    return (
      (service?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (serviceType?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (order.link?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      order.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle completing a pending order
  const handleCompletePendingOrder = async (orderId: number, totalPrice: number) => {
    if (!user) {
      toast({
        title: "Error",
        description: "User data not available. Please log in.",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    if (user.balance < totalPrice) {
      toast({
        title: "Insufficient funds",
        description: `Your balance is ${formatCurrency(user.balance)}, but this order costs ${formatCurrency(totalPrice)}. Please add more funds to continue.`,
        variant: "destructive",
      });
      router.push("/add-funds");
      return;
    }

    try {
      const response = await apiService.updateOrderStatus(orderId, "processing");
      if (response.status === 200 && response.data) {
        toast({
          title: "Order completed successfully!",
          description: "Your order has been processed and is now being fulfilled.",
          variant: "success",
        });
        // Update local orders state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: "processing" } : order
          )
        );
      } else {
        throw new Error("Failed to update order status");
      }
    } catch (err) {
      toast({
        title: "Error completing order",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Open order details dialog
  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <Sidebar />
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto max-w-7xl flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Sidebar />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold">Orders</h1>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-9 w-full sm:w-[250px] md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <h2 className="mb-2 text-xl font-semibold">No orders yet</h2>
              <p className="mb-6 text-muted-foreground">Place your first order to see it here!</p>
              <Button asChild>
                <a href="/new-order">Place an Order</a>
              </Button>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block rounded-lg border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => {
                        const service = getServiceById(order.service);
                        const category = getCategoryById(order.categoryId || 0);
                        const serviceType = getServiceTypeById(order.serviceTypeId || 0);
                        const Icon = category ? getSocialIcon(category.icon) : null;

                        return (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium line-clamp-1">{service?.name ?? "Unknown Service"}</div>
                                {category && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    {Icon && <Icon className="h-3 w-3" />}
                                    <span>{category.name}</span>
                                    {serviceType && (
                                      <>
                                        <span className="mx-1">•</span>
                                        <span>{serviceType.name}</span>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{order.quantity || "N/A"}</TableCell>
                            <TableCell>{formatCurrency(order.price)}</TableCell>
                            <TableCell>
                              {isValidDate(order.created_at) ? formatDateTime(order.created_at) : "N/A"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  order.status === "completed"
                                    ? "default"
                                    : order.status === "processing"
                                      ? "secondary"
                                      : order.status === "pending"
                                        ? "outline"
                                        : "destructive"
                                }
                              >
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                {order.status === "pending" && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleCompletePendingOrder(order.id, order.price)}
                                    disabled={user?.balance < order.price}
                                  >
                                    Complete
                                  </Button>
                                )}
                                <Button variant="outline" size="sm" onClick={() => openOrderDetails(order)}>
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                  Details
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No orders found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="grid gap-4 md:hidden">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const service = getServiceById(order.service);
                    const category = getCategoryById(order.categoryId || 0);
                    const serviceType = getServiceTypeById(order.serviceTypeId || 0);
                    const Icon = category ? getSocialIcon(category.icon) : null;

                    return (
                      <Card key={order.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex items-center justify-between border-b p-4">
                            <div className="font-medium">
                              <span className="text-xs text-muted-foreground mr-2">ID:</span>
                              {order.id}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  order.status === "completed"
                                    ? "default"
                                    : order.status === "processing"
                                      ? "secondary"
                                      : order.status === "pending"
                                        ? "outline"
                                        : "destructive"
                                }
                              >
                                {order.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="p-4 space-y-3">
                            <div>
                              <div className="font-medium line-clamp-1">{service?.name ?? "Unknown Service"}</div>
                              {category && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  {Icon && <Icon className="h-3 w-3" />}
                                  <span>{category.name}</span>
                                  {serviceType && (
                                    <>
                                      <span className="mx-1">•</span>
                                      <span>{serviceType.name}</span>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="flex justify-between text-sm">
                              <div>
                                <span className="text-muted-foreground">Quantity: </span>
                                <span>{order.quantity || "N/A"}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Price: </span>
                                <span className="font-medium">{formatCurrency(order.price)}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Link2 className="h-3 w-3 text-muted-foreground" />
                              <span className="truncate text-muted-foreground">{order.link}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <CalendarClock className="h-3 w-3" />
                                <span>{isValidDate(order.created_at) ? formatDateTime(order.created_at) : "N/A"}</span>
                              </div>
                              <div className="text-green-500">{order.estimatedCompletion || "N/A"}</div>
                            </div>
                            {order.status === "pending" && (
                              <Button
                                className="w-full mt-2"
                                onClick={() => handleCompletePendingOrder(order.id, order.price)}
                                disabled={user?.balance < order.price}
                              >
                                {user?.balance < order.price ? "Insufficient Funds" : "Complete Order"}
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => openOrderDetails(order)}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <div className="rounded-lg border border-dashed p-8 text-center">
                    <p className="text-muted-foreground">No orders found matching your search.</p>
                  </div>
                )}
              </div>
            </>
          )}

          <OrderDetailsDialog order={selectedOrder} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} />
        </div>
      </main>
    </div>
  );
}