import { ApiErrorResponse } from "@/types/register";
import Cookies from "js-cookie";

interface Category {
  id: number;
  name: string;
  is_active?: boolean;
}

interface Service {
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

interface User {
  id: number;
  balance: number;
}

interface Order {
  service_id: number;
  url: string;
  status: string;
  user: number;
  quantity: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiErrorResponse;
  status: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export class ApiService {
  private baseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.turbosmm.uz";
  
  private async handleResponse<T>(response: Response, method: string): Promise<ApiResponse<T>> {
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401) {
        const refreshToken = Cookies.get("refreshToken");
        if (!refreshToken) {
          console.error("Refresh token topilmadi");
          return { status: 401, error: { general: ["Sessiya tugadi, qayta kiring"] } };
        }
        const refreshResponse = await this.post<{ access: string }, { refresh: string }>("/api/token/refresh/", {
          refresh: refreshToken,
        });
        if (refreshResponse.status === 200 && refreshResponse.data?.access) {
          Cookies.set("accessToken", refreshResponse.data.access, {
            expires: 1,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
          });
          const newHeaders = {
            ...this.getHeaders(),
            Authorization: `Bearer ${refreshResponse.data.access}`,
          };
          return this.retryRequest(response.url.replace(this.baseUrl, ""), method, newHeaders, null);
        } else {
          console.error("Refresh token yangilash muvaffaqiyatsiz:", refreshResponse.error);
          return { status: 401, error: { general: ["Sessiya yangilanmadi, qayta kiring"] } };
        }
      }
      return { status: response.status, error: data };
    }
    return { status: response.status, data };
  }

  private async retryRequest<T>(
    url: string,
    method: string,
    headers: HeadersInit,
    body?: string | null
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method,
      headers,
      body: body || undefined,
    });
    return this.handleResponse<T>(response, method); // Pass method here too
  }

  private getHeaders(): HeadersInit {
    const accessToken = Cookies.get("accessToken");
    return {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    };
  }

  async get<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        method: "GET",
        headers: { ...this.getHeaders(), ...options.headers },
      });
      return this.handleResponse<T>(response, "GET"); // Pass "GET" as method
    } catch (error) {
      console.error("API Error (GET):", error);
      return { status: 500, error: { general: ["Server bilan bog'lanishda xatolik!"] } };
    }
  }

  async post<T, B>(endpoint: string, body: B, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        method: "POST",
        headers: { ...this.getHeaders(), ...options.headers },
        body: JSON.stringify(body),
      });
      return this.handleResponse<T>(response, "POST"); // Pass "POST" as method
    } catch (error) {
      console.error("API Error (POST):", error);
      return { status: 500, error: { general: ["Server bilan bog'lanishda xatolik!"] } };
    }
  }

  async put<T, B>(endpoint: string, body: B, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        method: "PUT",
        headers: { ...this.getHeaders(), ...options.headers },
        body: JSON.stringify(body),
      });
      return this.handleResponse<T>(response, "PUT"); // Pass "PUT" as method
    } catch (error) {
      console.error("API Error (PUT):", error);
      return { status: 500, error: { general: ["Server bilan bog'lanishda xatolik!"] } };
    }
  }

  async patch<T, B>(endpoint: string, body: B, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        method: "PATCH",
        headers: { ...this.getHeaders(), ...options.headers },
        body: JSON.stringify(body),
      });
      return this.handleResponse<T>(response, "PATCH"); // Pass "PATCH" as method
    } catch (error) {
      console.error("API Error (PATCH):", error);
      return { status: 500, error: { general: ["Server bilan bog'lanishda xatolik!"] } };
    }
  }

  async delete<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        method: "DELETE",
        headers: { ...this.getHeaders(), ...options.headers },
      });
      return this.handleResponse<T>(response, "DELETE"); // Pass "DELETE" as method
    } catch (error) {
      console.error("API Error (DELETE):", error);
      return { status: 500, error: { general: ["Server bilan bog'lanishda xatolik!"] } };
    }
  }

  async fetchCategories(): Promise<ApiResponse<PaginatedResponse<Category>>> {
    return this.get<PaginatedResponse<Category>>("/api/categories/");
  }

  async fetchServices(page: number = 1): Promise<ApiResponse<PaginatedResponse<Service>>> {
    return this.get<PaginatedResponse<Service>>(`/api/services/?page=${page}`);
  }

  async createOrder(order: Order): Promise<ApiResponse<Order>> {
    return this.post<Order, Order>("/api/orders/", order)
  }
  fetchOrders(): Promise<ApiResponse<Order[]>> {
    return this.get<Order[]>("/api/orders/");
  }

  async updateOrderStatus(orderId: number, status: string): Promise<ApiResponse<Order>> {
    return this.patch<Order, { status: string }>(`/api/orders/${orderId}/`, { status });
  }

  async fetchUser(userId: string): Promise<ApiResponse<User>> {
    return this.get<User>(`/api/users/${userId}`);
  }

  async fetchUsers(): Promise<ApiResponse<User[]>> {
    return this.get<User[]>(`/api/users/`);
  }
}

export const apiService = new ApiService();