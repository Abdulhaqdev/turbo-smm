// Define types for our application
export type SocialMediaCategory = {
  id: string
  name: string
  icon: string
  placeholder: string
}

// export type ServiceType = {
//   id: string
//   name: string
//   categoryId: string
// }

// types/service.ts
export interface Service {
  id: number;
  name: string;
  description: string;
  duration: number;
  min: number;
  max: number;
  price: number;
  site_id: number;
  service_type: number;
  api: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

// export type Order = {
//   id: string
//   categoryId: string
//   serviceTypeId: string
//   serviceId: string
//   link: string
//   quantity: number
//   totalPrice: number
//   status: "pending" | "processing" | "completed" | "canceled"
//   createdAt: string
//   estimatedCompletion: string
// }

export type User = {
  id: string
  name: string
  email: string
  balance: number
}

export type UserProfile = {
  id: string
  username: string
  email: string
  last_name: string
  first_name: string
  avatar: string
  balance: number
  joinDate: string
  phone_number: string
}

export type Transaction = {
  id: string
  type: "deposit" | "withdrawal" | "order"
  amount: number
  status: "completed" | "pending" | "failed"
  date: string
  description: string
}

export type SupportTicket = {
  id: string
  subject: string
  message: string
  status: "open" | "closed" | "in-progress"
  date: string
  replies?: {
    id: string
    message: string
    isAdmin: boolean
    date: string
  }[]
}


// types/api.ts
// export interface Category {
//   id: number;
//   name: string;
//   created_at: string;
//   updated_at: string;
//   is_active: boolean;
// }

// export interface ServiceType {
//   id: number;
//   name: string;
//   category: Category;
//   created_at: string;
//   updated_at: string;
//   is_active: boolean;
// }

// export interface Service {
//   id: number;
//   name: string;
//   description: string;
//   duration: number;
//   min: number;
//   max: number;
//   price: number;
//   site_id: number;
//   service_type: number;
//   api: number;
//   created_at: string;
//   updated_at: string;
//   is_active: boolean;
// }

// export interface Order {
//   id: string;
//   categoryId: string;
//   serviceTypeId: string;
//   serviceId: string;
//   link: string;
//   quantity: number;
//   totalPrice: number;
//   status: "pending" | "processing" | "completed" | "cancelled";
//   createdAt: string;
//   estimatedCompletion: string;
// }

// types/api.ts
export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface ServiceType {
  id: number;
  name: string;
  category: Category;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

// export interface Service {
//   id: number;
//   name: string;
//   description: string;
//   duration: number;
//   min: number;
//   max: number;
//   price: number;
//   site_id: number;
//   service_type: number;
//   api: number;
//   created_at: string;
//   updated_at: string;
//   is_active: boolean;
// }

export interface Service {
  id: number;
  name: string;
  description: string;
  duration: number;
  min: number;
  max: number;
  price: number;
  site_id: number;
  category: number;
  api: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface Order {
  id: number;
  service: Service;
  price: string; // API dan string sifatida keladi
  url: string;
  status: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  user: number;
  external_order_id: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  duration: number;
  min: number;
  max: number;
  price: number;
  site_id: number;
  category: number;
  api: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface Orders {
  id: number;
  service: Service;
  price: string;
  url: string;
  status: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  user: number;
  external_order_id: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: unknown; // ApiErrorResponse ni o‘rniga any ishlatamiz yoki kerakli turi aniqlanadi
  status: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}