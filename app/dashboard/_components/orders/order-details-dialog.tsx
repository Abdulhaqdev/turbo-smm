'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { CalendarClock, ExternalLink, Link2 } from 'lucide-react'
import { Badge } from '../ui/badge'
import { useToast } from '../ui/use-toast'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { apiService } from '@/lib/apiservise'
import { convertToUZS, formatCurrency } from '@/lib/utils'
import { useFormattedDate } from '@/hooks/useFormattedDate'
import type {  Service, ServiceType, Category } from '@/lib/types'
import Cookies from 'js-cookie'

interface OrderDetailsDialogProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
}
export interface Order {
  id: number
  service: number // serviceId
  price: number
  url: string
  status: string
  user: number
  created_at: string
  updated_at: string
  quantity?: number
  estimatedCompletion?: string
}
export function OrderDetailsDialog({
  order,
  open,
  onOpenChange,
}: OrderDetailsDialogProps) {
  const { formatDateTime, isValidDate } = useFormattedDate()
  const { toast } = useToast()
  const [service, setService] = useState<Service | null>(null)
  const [serviceType, setServiceType] = useState<ServiceType | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [userBalance, setUserBalance] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // API dan ma'lumotlarni yuklash
  useEffect(() => {
		const userId = Cookies.get('userId')
		const accessToken = Cookies.get('accessToken')
		if (!accessToken || !userId) {
			toast({
				title: 'Error',
				description: 'Please log in to view your account',
				variant: 'destructive',
			})
			// router.push('/login')
			return
		}
    if (!order || !open) return

    const fetchOrderDetails = async () => {
      setIsLoading(true)
      try {
        // Service ma'lumotlarini olish
        const serviceResponse = await apiService.get<Service>(`/api/service/${order.service}/`)
        if (serviceResponse.status === 200 && serviceResponse.data) {
          setService(serviceResponse.data)
          
          // ServiceType ma'lumotlarini olish
          const serviceTypeResponse = await apiService.get<ServiceType>(`/api/service-types/${serviceResponse.data.service_type}/`)
          if (serviceTypeResponse.status === 200 && serviceTypeResponse.data) {
            setServiceType(serviceTypeResponse.data)
            
            // Category ma'lumotlarini olish
            const categoryResponse = await apiService.get<Category>(`/api/categories/${serviceTypeResponse.data.category.id}/`)
            if (categoryResponse.status === 200 && categoryResponse.data) {
              setCategory(categoryResponse.data)
            }
          }
        }

        // Foydalanuvchi balansini olish (user ID order dan keladi)
        const userResponse = await apiService.fetchUser(userId)
				console.log(userResponse)
        if (userResponse.status === 200 && userResponse.data) {
          setUserBalance(userResponse.data.balance)
        }
      } catch (error) {
        console.error('Error fetching order details:', error)
        toast({
          title: 'Xatolik',
          description: 'Buyurtma tafsilotlarini yuklashda xatolik yuz berdi.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [order, open, toast])

  if (!order) return null


  // Handle completing a pending order
  const handleCompletePendingOrder = async () => {
    if (userBalance < order.price) {
      toast({
        title: "Mablag' yetarli emas",
        description: `Sizning balansingiz ${formatCurrency(
          convertToUZS(userBalance)
        )}, ammo bu buyurtma narxi ${formatCurrency(
          convertToUZS(order.price)
        )}. Davom etish uchun hisobingizni to'ldiring.`,
        variant: 'destructive',
      })
      return
    }

    try {
      const response = await apiService.updateOrderStatus(order.id, 'processing')
      if (response.status === 200) {
        toast({
          title: 'Buyurtma muvaffaqiyatli yakunlandi!',
          description: 'Buyurtmangiz qayta ishlandi va endi bajarilmoqda.',
          variant: 'success',
        })
        onOpenChange(false)
      } else {
        throw new Error('Failed to update order status')
      }
    } catch (error) {
			console.log(error)
			
      toast({
        title: 'Buyurtmani yakunlashda xatolik',
        description: "Buyurtmangizni qayta ishlashda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>
            <span>Buyurtma tafsilotlari</span>
            <Badge
              variant={
                order.status === 'true'
                  ? 'default'
                  : order.status === 'processing'
                  ? 'secondary'
                  : order.status === 'pending'
                  ? 'outline'
                  : 'destructive'
              }
            >
              {order.status === 'true'
                ? 'Yakunlangan'
                : order.status === 'processing'
                ? 'Jarayonda'
                : order.status === 'pending'
                ? 'Kutilmoqda'
                : 'Bekor qilingan'}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className='space-y-4 py-4'>
            {/* Order ID and Date */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>Buyurtma ID</p>
                <p className='font-medium'>{order.id}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>Sana</p>
                <p>
                  {isValidDate(order.created_at)
                    ? formatDateTime(order.created_at)
                    : 'N/A'}
                </p>
              </div>
            </div>

            {/* Service Details */}
            <div>
              <p className='text-sm font-medium text-muted-foreground mb-1'>Xizmat</p>
              <p className='font-medium'>{service?.name || 'N/A'}</p>
              {category && (
                <div className='flex items-center gap-2 mt-1 text-sm text-muted-foreground'>
                  <span>{category.name}</span>
                  {serviceType && (
                    <>
                      <span className='mx-1'>•</span>
                      <span>{serviceType.name}</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Link */}
            <div>
              <p className='text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1'>
                <Link2 className='h-4 w-4' /> Havola
              </p>
              <div className='flex items-center gap-2'>
                <p className='truncate'>{order.url}</p>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-6 w-6 shrink-0'
                  asChild
                >
                  <a href={order.url} target='_blank' rel='noopener noreferrer'>
                    <ExternalLink className='h-4 w-4' />
                  </a>
                </Button>
              </div>
            </div>

            {/* Quantity and Price */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>Miqdor</p>
                <p className='font-medium'>{order.quantity?.toLocaleString() || 'N/A'}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>Umumiy narx</p>
                <p className='font-medium'>
                  {formatCurrency(convertToUZS(order.price))}
                </p>
              </div>
            </div>

            {/* Estimated Completion */}
            <div>
              <p className='text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1'>
                <CalendarClock className='h-4 w-4' /> Taxminiy yakunlanish
              </p>
              <p className='text-green-500'>{order.estimatedCompletion || 'N/A'}</p>
            </div>
          </div>
        )}

        <DialogFooter className='flex-col sm:flex-row gap-2'>
          {order.status === 'true' && (
            <Button
              onClick={handleCompletePendingOrder}
              disabled={isLoading || userBalance < order.price}
              className='w-full sm:w-auto'
            >
              {userBalance < order.price
                ? "Mablag' yetarli emas"
                : 'Buyurtmani yakunlash'}
            </Button>
          )}
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            className='w-full sm:w-auto'
          >
            Yopish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}