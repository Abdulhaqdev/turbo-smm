"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../_components/ui/table";
import { Search, ExternalLink, CalendarClock, Link2 } from "lucide-react";
import { useToast } from "../_components/ui/use-toast";
import { formatCurrency } from "@/lib/utils";
import { useFormattedDate } from "../../../hooks/useFormattedDate";
import { Header } from "../_components/header";
import { Badge } from "../_components/ui/badge";
import { Sidebar } from "../_components/sidebar";
import { apiService } from "@/lib/apiservise";
import { Order, User, Service } from "@/lib/types";
import Cookies from "js-cookie";
import { OrderDetailsDialog } from '../_components/orders/order-details-dialog'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User>();
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // Tanlangan buyurtma uchun state
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog ochiq/yopiq holati
  const { toast } = useToast();
  const { isValidDate } = useFormattedDate();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Faqat sanani formatlash uchun funksiya
  const formatDateOnly = (dateString: string) => {
    if (!isValidDate(dateString)) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Fetch user, services, and orders on mount
  useEffect(() => {
    const userId = Cookies.get("userId");
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

    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch user data
        const userResponse = await apiService.fetchUser(userId);
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

        // Fetch services
        const servicesResponse = await apiService.fetchServices();
        if (servicesResponse.status === 200 && servicesResponse.data) {
          setServices(servicesResponse.data);
        } else {
          throw new Error("Failed to load services");
        }

        // Fetch orders
        const ordersResponse = await apiService.getOrders();
        if (ordersResponse.status === 200 && ordersResponse.data) {
          const mappedOrders = ordersResponse.data.map((order: Order) => ({
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
            quantity: order.quantity || 100,
            serviceTypeId: order.serviceTypeId,
            categoryId: order.categoryId,
            estimatedCompletion: order.estimatedCompletion || "N/A",
          }));
          setOrders(mappedOrders);
        } else {
          throw new Error("Failed to load orders");
        }
      } catch (err) {
        console.log(err);
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
    const service = services.find((s) => s.id === order.service);
    return (
      (service?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
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
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: "processing" } : order
          )
        );
      } else {
        throw new Error("Failed to update order status");
      }
    } catch (err) {
      console.log(err)
      toast({
        title: "Error completing order",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle opening the dialog
  const handleOpenDialog = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

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
                        const service = services.find((s) => s.id === order.service);
                        return (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>
                              <div className="font-medium line-clamp-1">
                                {service?.name ?? "Unknown Service"}
                              </div>
                            </TableCell>
                            <TableCell>{order.quantity || "N/A"}</TableCell>
                            <TableCell>{formatCurrency(order.price)}</TableCell>
                            <TableCell>{formatDateOnly(order.created_at)}</TableCell>
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
                                  >
                                    Complete
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenDialog(order)} // Dialog ochiladi
                                >
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
                    const service = services.find((s) => s.id === order.service);
                    return (
                      <Card key={order.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex items-center justify-between border-b p-4">
                            <div className="font-medium">
                              <span className="text-xs text-muted-foreground mr-2">ID:</span>
                              {order.id}
                            </div>
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
                          <div className="p-4 space-y-3">
                            <div>
                              <div className="font-medium line-clamp-1">
                                {service?.name ?? "Unknown Service"}
                              </div>
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
                            <div className="flex items-center text-sm">
                              <CalendarClock className="h-3 w-3 text-muted-foreground mr-2" />
                              <span>{formatDateOnly(order.created_at)}</span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => handleOpenDialog(order)} // Dialog ochiladi
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
        </div>
      </main>

      {/* OrderDetailsDialog qo'shildi */}
      <OrderDetailsDialog
        order={selectedOrder}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}