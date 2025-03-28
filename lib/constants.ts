/**
 * Application routes for consistent navigation
 */
export const ROUTES = {
  HOME: "/",
  NEW_ORDER: "dashboard/new-order",
  SERVICES: "dashboard/services",
  ORDERS: "dashboard/orders",
  ADD_FUNDS: "dashboard/add-funds",
  ACCOUNT: "/dashboard/account",
  SUPPORT: "dashboard/support",
}

/**
 * Order status constants for consistent usage across the application
 */
export const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  CANCELED: "canceled",
}

/**
 * Transaction type constants
 */
export const TRANSACTION_TYPES = {
  DEPOSIT: "deposit",
  WITHDRAWAL: "withdrawal",
  ORDER: "order",
}

