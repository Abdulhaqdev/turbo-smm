export interface IUser {
	first_name: string
	last_name: string
	balance: string
	username: string
	id: number
	email: string
	phone_number: string
	api_key: string
	created_at: string
}

export interface UserSession {
	user: IUser | null;
	token: string | null;
}