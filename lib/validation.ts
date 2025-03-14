/**
 * Validates an email address
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates a credit card number
 */
export function validateCardNumber(cardNumber: string): boolean {
  const sanitized = cardNumber.replace(/\s/g, "")
  return /^\d{16}$/.test(sanitized)
}

/**
 * Validates a credit card expiry date
 */
export function validateExpiryDate(expiryDate: string): boolean {
  return /^\d{2}\/\d{2}$/.test(expiryDate)
}

/**
 * Validates a credit card CVC
 */
export function validateCVC(cvc: string): boolean {
  return /^\d{3,4}$/.test(cvc)
}

