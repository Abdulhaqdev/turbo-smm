"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Header } from "../_components/header";
import { Sidebar } from "../_components/sidebar";
import { apiService } from "@/lib/apiservise";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSession } from "@/hooks/useSession";
import { Order } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export default function OrdersPage() {
  const { toast } = useToast();
  const { session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);

      if (!session) {
        // Session yo‘q bo‘lsa yangilash
      }

      if (!session?.user) {
        setError("Foydalanuvchi ma'lumotlari mavjud emas. Iltimos, tizimga kiring.");
        setIsLoading(false);
        return;
      }

      try {
        // API dan buyurtmalarni olish
        const response = await apiService.fetchOrders();
        console.log("API javobi:", response);
        if (response.status === 200 && response.data?.results) {
          setOrders(response.data.results);
        } else {
          throw new Error(response.error?.general?.[0] || "Buyurtmalarni yuklab bo‘lmadi");
        }
      } catch (err) {
        console.error("Buyurtmalarni yuklashda xatolik:", err);
        setError("Buyurtmalarni yuklashda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko‘ring.");
        toast({
          title: "Xatolik",
          description: "Buyurtmalarni yuklab bo‘lmadi.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [toast, session]);

  // Qidiruv funksiyasi
  const filteredOrders = orders.filter((order) =>
    order.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <Sidebar />
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
      <Sidebar />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold">Buyurtmalar</h1>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buyurtmalarni qidirish (URL yoki xizmat nomi bo‘yicha)"
                className="pl-9 w-full sm:w-[250px] md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <h2 className="mb-2 text-xl font-semibold">Hozircha buyurtmalar yo‘q</h2>
              <p className="mb-6 text-muted-foreground">
                Birinchi buyurtmangizni bu yerda ko‘rish uchun joylashtiring!
              </p>
              <Button asChild>
                <a href="/dashboard/new-order">Buyurtma berish</a>
              </Button>
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Xizmat</TableHead>
                    <TableHead>Havola</TableHead>
                    <TableHead>Miqdor</TableHead>
                    <TableHead>Narx</TableHead>
                    <TableHead>Holati</TableHead>
                    <TableHead>Yaratilgan sana</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.service.name}</TableCell>
                      <TableCell>
                        <a href={order.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {order.url}
                        </a>
                      </TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>{formatCurrency(parseFloat(order.price))}</TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}