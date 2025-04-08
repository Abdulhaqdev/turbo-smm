export interface IUser {
	first_name: string
	last_name: string
	balance: string
	username: string
	id:number
	email: string
	phone_number: string
	api_key: string
	created_at:string
}

export interface ISession {
	accessToken: string|null
	user: IUser|null
}
