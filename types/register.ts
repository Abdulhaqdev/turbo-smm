// types/register.ts
export interface FormData {
  username: string;
  phone: string;
  password: string;
}

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  general?: string;
}

export interface RegisterResponse {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  // Add other fields that the backend might return
}
export interface ApiErrorResponse {
  username?: string[];
  email?: string[];
  phone_number?: string[];
  password?: string[];
  non_field_errors?: string[];
  detail?: string;
  general?: string[];
}