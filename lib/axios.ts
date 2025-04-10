import { useSession } from '@/hooks/useSession'
import axios from 'axios'
import { BASE_URL } from './constants'

axios.defaults.withCredentials = true
axios.defaults.baseURL = BASE_URL
axios.defaults.headers.common['Accept'] = 'application/json'

export default axios

axios.interceptors.response.use(
	response => {
		return response
	},
	error => {
		if (error.response.status === 401) {
			useSession.setState({ session: null })
		}
		return Promise.reject(error)
	}
)