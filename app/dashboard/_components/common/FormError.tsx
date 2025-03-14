import { AlertCircle } from "lucide-react"

interface FormErrorProps {
  message: string | null | undefined
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null

  return (
    <div className="flex items-center gap-2 mt-1 text-sm text-destructive">
      <AlertCircle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  )
}

