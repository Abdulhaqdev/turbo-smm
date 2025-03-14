// lib/apiService.ts
import { ApiErrorResponse } from '@/types/register';
import Cookies from "js-cookie";
import { Category, ServiceType, Service, Order, User } from './types';

export interface ApiResponse<T> {
  data?: T;
  error?: ApiErrorResponse;
  status: number;
}

export class ApiService {
  private baseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.turbosmm.uz";

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401) {
        const refreshToken = Cookies.get("refreshToken");
        if (refreshToken) {
          const refreshResponse = await this.post<{ access: string }, { refresh: string }>("/api/token/refresh/", { refresh: refreshToken });
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
            return this.retryRequest(response.url.replace(this.baseUrl, ""), "POST", newHeaders, JSON.stringify({ refresh: refreshToken }));
          }
        }
        console.error("Refresh token failed or not available");
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
    return this.handleResponse<T>(response);
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
      return this.handleResponse<T>(response);
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
      return this.handleResponse<T>(response);
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
      return this.handleResponse<T>(response);
    } catch (error) {
      console.error("API Error (PUT):", error);
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
      return this.handleResponse<T>(response);
    } catch (error) {
      console.error("API Error (DELETE):", error);
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
      return this.handleResponse<T>(response);
    } catch (error) {
      console.error("API Error (PATCH):", error);
      return { status: 500, error: { general: ["Server bilan bog'lanishda xatolik!"] } };
    }
  }

  async fetchCategories(): Promise<ApiResponse<Category[]>> {
    return this.get<Category[]>("/api/categories/");
  }

  async fetchServiceTypes(): Promise<ApiResponse<ServiceType[]>> {
    return this.get<ServiceType[]>("/api/service-types/");
  }

  async fetchServices(): Promise<ApiResponse<Service[]>> {
    return this.get<Service[]>("/api/services/");
  }

  async createOrder(order: Order): Promise<ApiResponse<Order>> {
    return this.post<Order, Order>("/api/orders/", order);
  }
  async getOrders(): Promise<ApiResponse<Order[]>> {
    return this.get<Order[]>("/api/orders/");
  }
  async updateOrderStatus(orderId: number, status: string): Promise<ApiResponse<Order>> {
    return this.patch<Order, { status: string }>(`/api/orders/${orderId}/`, { status });
  }

  // New method to fetch user data
  async fetchUser(): Promise<ApiResponse<User>> {
    return this.get<User>("/api/users/");
  }
}

export const apiService = new ApiService();