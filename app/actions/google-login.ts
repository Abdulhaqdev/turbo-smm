// app/actions/googleAuth.ts
'use server'

import { cookies } from 'next/headers';

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
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.turbosmm.uz';
  
  try {
    const response = await fetch(`${API_URL}/api/auth/google/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Google authentication failed');
    }

    const data: GoogleAuthResponse = await response.json();

    // Set secure cookies
    (await
      // Set secure cookies
      cookies()).set('access_token', data.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
    });

    (await cookies()).set('refresh_token', data.refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return {
      success: true,
      message: 'Successfully signed in with Google',
      user: data.user,
    };
  } catch (error) {
    console.error('Google auth error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Authentication failed',
    };
  }
}