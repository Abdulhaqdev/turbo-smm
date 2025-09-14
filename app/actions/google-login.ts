'use server'

import axios from '@/lib/axios'
import { cookies } from 'next/headers'

interface GoogleAuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    picture?: string;
  };
}

export async function googleLogin(credential: string) {
  try {
    const cookieStore = await cookies()
    
    // Send Google credential to your backend API
    const response = await axios.post<GoogleAuthResponse>('/api/auth/google/', {
      credential: credential,
    })

    // Set the refresh token in httpOnly cookie
    cookieStore.set('refresh_token', response.data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    // Optionally set access token if needed
    if (response.data.access_token) {
      cookieStore.set('access_token', response.data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60, // 1 hour
      })
    }

    return { 
      message: 'Google login successful',
      user: response.data.user 
    }
  } catch (error) {
    console.error('Google login error:', error)
    
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Google login failed'
      throw new Error(errorMessage)
    }
    
    throw new Error('Something went wrong with Google login')
  }
}