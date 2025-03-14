// import { ThemeToggle } from "@/components/theme-toggle"
// import { ThemeToggle } from '@/app/dashboard/_components/theme-toggle'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReactNode } from "react"

interface AuthLayoutProps {
  children: ReactNode
  title: string
  description: string
  footer?: ReactNode
}

export function AuthLayout({ children, title, description, footer }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center  justify-center bg-background p-14 md:p-0 transition-colors duration-300">
      {/* <div className="absolute right-4 top-10 md:right-8 md:top-18">
        <ThemeToggle />
      </div> */}
      <div className="w-full max-w-md">
        <Card className="w-full border-border bg-card text-card-foreground transition-colors duration-300">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
            <CardDescription className="text-center">{description}</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
          {footer && <CardFooter>{footer}</CardFooter>}
        </Card>
      </div>
    </div>
  )
}

