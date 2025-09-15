'use server'

import { cookies } from 'next/headers';
import axios from '@/lib/axios';

interface GoogleAuthResponse {
  access: string;
  refresh: string;
  user: {
    id: string;
    email: string;
    name: string;
    picture?: string;
  };
}

export async function googleAuth(token: string) {
  try {
    const cookieStore = await cookies();
    
    // Call the API to authenticate with Google token
    const response = await axios.post('/api/auth/google/', { token });
    const data: GoogleAuthResponse = response.data;

    // Set secure httpOnly cookies (same pattern as login action)
    cookieStore.set('refresh_token', data.refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    // Optional: You can also store access token if needed
    // cookieStore.set('access_token', data.access, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict',
    //   maxAge: 60 * 60 * 24, // 1 day
    // });

    return {
      success: true,
      message: 'Successfully signed in with Google',
      user: data.user,
    };
  } catch (error) {
    console.error('Google auth error:', error);
    
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || error.response?.data?.detail || 'Google authentication failed');
    }
    
    throw new Error('Something went wrong with Google authentication');
  }
}