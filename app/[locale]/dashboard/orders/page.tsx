"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Header } from "../_components/header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession } from "@/hooks/useSession";
import { useLocaleFromUrl } from "@/hooks/useLocaleFromUrl";
import { useTranslations } from "use-intl";
import { usePathname } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import axios from "@/lib/axios";
import Link from "next/link";
import { Order } from "@/lib/types";

export default function OrdersPage() {
  const { session } = useSession();
  const pathname = usePathname();
  const t = useTranslations("orders");
  useLocaleFromUrl();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      const loadData = async () => {
        setIsLoading(true);
        try {
          const res = await axios.get("/api/orders?type=user", {
            headers: { Authorization: `Bearer ${session.token}` },
          });
          setOrders(res.data);
        } catch (err) {
          setError(`${t("loadingError")} ${(err as Error).message}`);
        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    }
  }, [session, t]);

  const filteredOrders = orders.filter(
    (order) =>
      order.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to determine status badge styles
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-900/30 text-green-400";
      case "processing":
        return "bg-blue-900/30 text-blue-600";
      case "partial":
        return "bg-yellow-900/30 text-yellow-500";
      case "canceled":
        return "bg-red-900/30 text-red-400";
      default:
        return "bg-gray-900/30 text-gray-400";
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto max-w-7xl flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-gray-300"></div>
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
            <p className="text-destructive dark:text-red-400">{error}</p>
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
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-gray-400" />
              <Input
                placeholder={t("searchPlaceholder")}
                className="pl-9 w-full sm:w-[250px] md:w-[300px] bg-white dark:bg-[#101013] border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center border-gray-700 dark:bg-[#101013]">
              <h2 className="mb-2 text-xl font-semibold">{t("noOrdersTitle")}</h2>
              <p className="mb-6 text-gray-400">{t("noOrdersDescription")}</p>
              <Button asChild className="bg-primary text-white hover:bg-primary/90">
                <Link href={`/${pathname.split("/")[1] || "uz"}/dashboard/new-order`}>{t("createOrderButton")}</Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-lg border shadow-sm border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101013]">
              {/* Mobile View */}
              <div className="block sm:hidden">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border-b border-gray-700 p-4 last:border-b-0"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm text-gray-400">
                        #{order.id} | {new Date(order.created_at).toLocaleDateString(pathname.split("/")[1] || "uz")}
                      </div>
                      <div className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyles(order.status)}`}>
                        {order.status}
                      </div>
                    </div>
                    <div className="text-sm mb-2 font-medium">{order.service.name}</div>
                    <div className="text-sm text-blue-400 mb-2 truncate">
                      <a
                        href={order.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {order.url}
                      </a>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <div>{t("mobile.priceLabel")}: {formatCurrency(Number.parseFloat(order.price))}</div>
                      <div>{t("mobile.quantityLabel")}: {order.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tablet View */}
              <div className="hidden sm:block md:hidden">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border-b last:border-b-0 p-4 bg-white dark:bg-[#101013] rounded-lg shadow-sm mb-4 hover:shadow-md transition-shadow border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-4"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-muted-foreground dark:text-gray-400">{t("tablet.idLabel")}:</span>
                      <span className="text-sm">{order.id}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-muted-foreground dark:text-gray-400">{t("tablet.serviceLabel")}:</span>
                      <span className="text-sm">{order.service.name}</span>
                    </div>
                    <div className="flex flex-col col-span-2">
                      <span className="font-semibold text-sm text-muted-foreground dark:text-gray-400">{t("tablet.linkLabel")}:</span>
                      <a
                        href={order.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary dark:text-blue-400 hover:underline text-sm"
                      >
                        {order.url.length > 30 ? `${order.url.slice(0, 30)}...` : order.url}
                      </a>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-muted-foreground dark:text-gray-400">{t("tablet.statusLabel")}:</span>
                      <span className={`text-sm ${getStatusStyles(order.status)} rounded-md p-1`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-muted-foreground dark:text-gray-400">{t("tablet.dateLabel")}:</span>
                      <span className="text-sm">{new Date(order.created_at).toLocaleDateString(pathname.split("/")[1] || "uz")}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tablet/Desktop View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b bg-muted/50">
                      <TableHead className="text-left font-semibold text-sm text-muted-foreground dark:text-gray-400">
                        {t("table.id")}
                      </TableHead>
                      <TableHead className="text-left font-semibold text-sm text-muted-foreground dark:text-gray-400">
                        {t("table.service")}
                      </TableHead>
                      <TableHead className="text-left font-semibold text-sm text-muted-foreground dark:text-gray-400">
                        {t("table.link")}
                      </TableHead>
                      <TableHead className="text-left font-semibold text-sm text-muted-foreground dark:text-gray-400">
                        {t("table.quantity")}
                      </TableHead>
                      <TableHead className="text-left font-semibold text-sm text-muted-foreground dark:text-gray-400">
                        {t("table.price")}
                      </TableHead>
                      <TableHead className="text-left font-semibold text-sm text-muted-foreground dark:text-gray-400">
                        {t("table.status")}
                      </TableHead>
                      <TableHead className="text-left font-semibold text-sm text-muted-foreground dark:text-gray-400">
                        {t("table.createdAt")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow
                        key={order.id}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <TableCell className="text-sm">{order.id}</TableCell>
                        <TableCell className="text-sm">{order.service.name}</TableCell>
                        <TableCell>
                          <a
                            href={order.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary dark:text-blue-400 hover:underline text-sm"
                          >
                            {order.url.length > 30 ? `${order.url.slice(0, 30)}...` : order.url}
                          </a>
                        </TableCell>
                        <TableCell className="text-sm">{order.quantity}</TableCell>
                        <TableCell className="text-sm">{formatCurrency(Number.parseFloat(order.price))}</TableCell>
                        <TableCell>
                          <span className={`text-sm ${getStatusStyles(order.status)} rounded-md p-2`}>
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(order.created_at).toLocaleDateString(pathname.split("/")[1] || "uz")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}