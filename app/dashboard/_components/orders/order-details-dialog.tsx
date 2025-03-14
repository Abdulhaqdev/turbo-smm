"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog'
import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
import { getCategoryById, getServiceById, getServiceTypeById } from "@/lib/data"
// import { getSocialIcon } from "@/components/sidebar"
import { formatCurrency, convertToUZS } from "@/lib/utils"
// import { useFormattedDate } from "@/hooks/useFormattedDate"
import { CalendarClock, Link2, ExternalLink } from "lucide-react"
import type { Order } from "@/lib/types"
import { useStore } from "@/lib/store"
import { useFormattedDate } from '@/app/hooks/useFormattedDate'
import { useToast } from '../ui/use-toast'
import { getSocialIcon } from '../sidebar'
import { Badge } from '../ui/badge'
// import { useToast } from "@/components/ui/use-toast"
                    
interface OrderDetailsDialogProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderDetailsDialog({ order, open, onOpenChange }: OrderDetailsDialogProps) {
  const { user, completePendingOrder } = useStore()
  const { formatDateTime, isValidDate } = useFormattedDate()
  const { toast } = useToast()

  if (!order) return null

  const service = getServiceById(order.serviceId)
  const serviceType = getServiceTypeById(order.serviceTypeId)
  const category = getCategoryById(order.categoryId)
  const Icon = category ? getSocialIcon(category.icon) : null

  // Handle completing a pending order
  const handleCompletePendingOrder = () => {
    // Check if user has sufficient balance
    if (user.balance < order.totalPrice) {
      toast({
        title: "Mablag' yetarli emas",
        description: `Sizning balansingiz ${formatCurrency(convertToUZS(user.balance))}, ammo bu buyurtma narxi ${formatCurrency(convertToUZS(order.totalPrice))}. Davom etish uchun hisobingizni to'ldiring.`,
        variant: "destructive",
      })
      return
    }

    // Complete the pending order
    const success = completePendingOrder(order.id, order.totalPrice)

    if (success) {
      toast({
        title: "Buyurtma muvaffaqiyatli yakunlandi!",
        description: "Buyurtmangiz qayta ishlandi va endi bajarilmoqda.",
        variant: "success",
      })
      onOpenChange(false)
    } else {
      toast({
        title: "Buyurtmani yakunlashda xatolik",
        description: "Buyurtmangizni qayta ishlashda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Buyurtma tafsilotlari</span>
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
              {order.status === "completed"
                ? "Yakunlangan"
                : order.status === "processing"
                  ? "Jarayonda"
                  : order.status === "pending"
                    ? "Kutilmoqda"
                    : "Bekor qilingan"}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Order ID and Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Buyurtma ID</p>
              <p className="font-medium">{order.id.substring(0, 8)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Sana</p>
              <p>{isValidDate(order.createdAt) ? formatDateTime(order.createdAt) : "N/A"}</p>
            </div>
          </div>

          {/* Service Details */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Xizmat</p>
            <p className="font-medium">{service?.name}</p>
            {category && (
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                {Icon && <Icon className="h-4 w-4" />}
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

          {/* Link */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
              <Link2 className="h-4 w-4" /> Havola
            </p>
            <div className="flex items-center gap-2">
              <p className="truncate">{order.link}</p>
              <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" asChild>
                <a href={order.link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quantity and Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Miqdor</p>
              <p className="font-medium">{order.quantity.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Umumiy narx</p>
              <p className="font-medium">{formatCurrency(convertToUZS(order.totalPrice))}</p>
            </div>
          </div>

          {/* Estimated Completion */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
              <CalendarClock className="h-4 w-4" /> Taxminiy yakunlanish
            </p>
            <p className="text-green-500">{order.estimatedCompletion}</p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {order.status === "pending" && (
            <Button
              onClick={handleCompletePendingOrder}
              disabled={user.balance < order.totalPrice}
              className="w-full sm:w-auto"
            >
              {user.balance < order.totalPrice ? "Mablag' yetarli emas" : "Buyurtmani yakunlash"}
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Yopish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

