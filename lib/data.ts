import type { SocialMediaCategory, ServiceType, Service, User, UserProfile, Transaction, SupportTicket } from "./types"



// Helper functions
export function getServiceTypesByCategory(categoryId: string): ServiceType[] {
  return serviceTypes.filter((type) => type.categoryId === categoryId)
}

export function getServicesByType(serviceTypeId: string): Service[] {
  return services.filter((service) => service.serviceTypeId === serviceTypeId)
}

export function getServiceById(serviceId: string): Service | undefined {
  return services.find((service) => service.id === serviceId)
}

export function getCategoryById(categoryId: string): SocialMediaCategory | undefined {
  return categories.find((category) => category.id === categoryId)
}

export function getServiceTypeById(serviceTypeId: string): ServiceType | undefined {
  return serviceTypes.find((type) => type.id === serviceTypeId)
}

// Calculate estimated completion time based on quantity and service
export function calculateEstimatedTime(service: Service, quantity: number): string {
  // Calculate time in hours based on quantity
  const timeInHours = (service.timeInHours / 1000) * quantity

  if (timeInHours < 1) {
    // Convert to minutes if less than 1 hour
    const minutes = Math.ceil(timeInHours * 60)
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`
  } else if (timeInHours < 24) {
    // Display in hours if less than 24 hours
    const hours = Math.ceil(timeInHours)
    return `${hours} hour${hours !== 1 ? "s" : ""}`
  } else {
    // Display in days if 24 hours or more
    const days = Math.ceil(timeInHours / 24)
    return `${days} day${days !== 1 ? "s" : ""}`
  }
}

// Calculate total price based on quantity and service rate
export function calculateTotalPrice(service: Service, quantity: number): number {
  return (service.rate / 1000) * quantity
}

