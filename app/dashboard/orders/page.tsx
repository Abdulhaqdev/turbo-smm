
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Header } from "../_components/header";
import { Sidebar } from "../_components/sidebar";

export default function OrdersPage() {

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
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <h2 className="mb-2 text-xl font-semibold">No orders yet</h2>
            <p className="mb-6 text-muted-foreground">Place your first order to see it here!</p>
            <Button asChild>
              <a href="new-order">Place an Order</a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}