'use server'

import axios from '@/lib/axios'
import { cookies } from 'next/headers'

interface GoogleAuthResponse {
  access: string;
  refresh: string;
  user: {
    id: string;
    email: string;
    name?: string;
    first_name?: string;
    last_name?: string;
    picture?: string;
  };
}

interface GoogleErrorResponse {
  error?: string;
  detail?: string;
  message?: string;
  non_field_errors?: string[];
}

export async function googleLogin(credential: string) {
  try {
    const cookieStore = await cookies()
    
    // Validate credential
    if (!credential || typeof credential !== 'string') {
      throw new Error('Google credential mavjud emas')
    }

    console.log('Sending Google login request to backend...');
    
    // Send Google credential to your backend API
    const response = await axios.post<GoogleAuthResponse>('/api/auth/google/', {
      token: credential, // Backend 'token' field kutmoqda
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    })

    console.log('Backend response status:', response.status);
    console.log('Backend response data keys:', Object.keys(response.data));

    // Validate response
    if (!response.data || !response.data.access) {
      throw new Error('Backend dan noto\'g\'ri javob keldi')
    }

    // Set the refresh token in httpOnly cookie
    if (response.data.refresh) {
      cookieStore.set('refresh_token', response.data.refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })
    }

    // Set access token
    if (response.data.access) {
      cookieStore.set('access_token', response.data.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60, // 1 hour
        path: '/',
      })
    }

    return { 
      message: 'Google bilan muvaffaqiyatli kirildi',
      user: response.data.user 
    }
  } catch (error) {
    console.error('Google login error:', error)
    
    if (axios.isAxiosError(error)) {
      // Timeout error
      if (error.code === 'ECONNABORTED') {
        throw new Error('Server javob bermadi. Iltimos qayta urinib ko\'ring.')
      }

      // Network error
      if (!error.response) {
        throw new Error('Internet aloqasi muammosi. Iltimos qayta urinib ko\'ring.')
      }

      // Server error responses
      const errorResponse = error.response.data as GoogleErrorResponse
      console.error('Backend error details:', {
        status: error.response.status,
        data: errorResponse,
        headers: error.response.headers
      });

      // Handle different status codes
      switch (error.response.status) {
        case 400:
          const badRequestError = errorResponse.error || 
                                 errorResponse.detail || 
                                 errorResponse.message ||
                                 errorResponse.non_field_errors?.[0] ||
                                 'Noto\'g\'ri so\'rov ma\'lumotlari'
          throw new Error(badRequestError)
        
        case 401:
          throw new Error('Google token yaroqsiz yoki muddati tugagan')
        
        case 403:
          throw new Error('Ruxsat berilmagan. Google hisobingiz cheklangan bo\'lishi mumkin.')
        
        case 404:
          throw new Error('API endpoint topilmadi. Tizim administratoriga murojaat qiling.')
        
        case 429:
          throw new Error('Juda ko\'p so\'rov yuborildi. Biroz kuting va qayta urinib ko\'ring.')
        
        case 500:
        case 502:
        case 503:
        case 504:
          throw new Error('Server xatosi. Iltimos keyinroq qayta urinib ko\'ring.')
        
        default:
          const defaultError = errorResponse.error || 
                              errorResponse.detail || 
                              errorResponse.message ||
                              `Server xatosi: ${error.response.status}`
          throw new Error(defaultError)
      }
    }
    
    // Other errors
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    
    throw new Error('Google bilan kirishda kutilmagan xatolik yuz berdi')
  }
}