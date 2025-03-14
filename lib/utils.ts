import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



// Conversion rate: 1 USD = 12000 UZS (approximate)
export const USD_TO_UZS_RATE = 12000

// Convert USD to UZS
export function convertToUZS(amountUSD: number): number {
  return amountUSD * USD_TO_UZS_RATE
}

export function formatCurrency(amount: number, inUSD = false) {
  if (inUSD) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(amount)
  }

  // Convert to UZS and format
  const amountUZS = inUSD ? convertToUZS(amount) : amount
  return new Intl.NumberFormat("uz-UZ", {
    style: "currency",
    currency: "UZS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountUZS)
}

