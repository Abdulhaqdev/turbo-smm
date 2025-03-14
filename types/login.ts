// app/(root)/login/page.tsx
export interface LoginData {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
	user_id: string
}

export interface LoginErrors {
  username?: string;
  password?: string;
  general?: string;
}