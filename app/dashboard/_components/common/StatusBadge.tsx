// import { Badge } from "../components/ui/badge"

import { Badge } from '../ui/badge'

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant =
    status === "completed"
      ? "default"
      : status === "processing"
        ? "secondary"
        : status === "pending"
          ? "outline"
          : "destructive"

  const statusText =
    status === "completed"
      ? "Yakunlangan"
      : status === "processing"
        ? "Jarayonda"
        : status === "pending"
          ? "Kutilmoqda"
          : status === "canceled"
            ? "Bekor qilingan"
            : status

  return (
    <Badge variant={variant} className={className}>
      {statusText}
    </Badge>
  )
}

