// lib/google-utils.ts

export const GOOGLE_CONFIG = {
  CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "577050887686-5g252b918ojrmsfgcl3kaucl5r4ek2o8.apps.googleusercontent.com",
  SCOPES: ['profile', 'email'],
} as const;

// Google Sign-In types
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
          prompt: () => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

export const loadGoogleScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if Google is already loaded
    if (typeof window !== 'undefined' && window.google?.accounts?.id) {
      resolve();
      return;
    }

    // Check if script is already being loaded
    if (document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
      // Wait for it to load
      const waitForGoogle = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(waitForGoogle);
          resolve();
        }
      }, 100);

      setTimeout(() => {
        clearInterval(waitForGoogle);
        reject(new Error('Google Sign-In script timeout'));
      }, 10000);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      const waitForGoogle = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(waitForGoogle);
          resolve();
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(waitForGoogle);
        reject(new Error('Google Sign-In failed to initialize'));
      }, 10000);
    };

    script.onerror = () => reject(new Error('Failed to load Google Sign-In script'));
    document.head.appendChild(script);
  });
};

interface GoogleButtonOptions {
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  width?: string | number;
  locale?: string;
}

export const initializeGoogleSignIn = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: (response: any) => void,
  buttonElementId: string = 'google-signin-button',
  options: GoogleButtonOptions = {}
) => {
  if (!window.google?.accounts?.id) {
    console.error('Google Sign-In not loaded');
    return Promise.reject(new Error('Google Sign-In not loaded'));
  }

  return new Promise<void>((resolve, reject) => {
    try {
      window.google!.accounts.id.initialize({
        client_id: GOOGLE_CONFIG.CLIENT_ID,
        callback,
        ux_mode: 'popup',
        use_fedcm_for_prompt: false,
      });

      const buttonElement = document.getElementById(buttonElementId);
      if (buttonElement) {
        window.google!.accounts.id.renderButton(buttonElement, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          width: '100%',
          ...options,
        });
        resolve();
      } else {
        reject(new Error(`Button element with id '${buttonElementId}' not found`));
      }
    } catch (error) {
      reject(error);
    }
  });
};

// Hook for using Google Sign-In in React components
export const useGoogleSignIn = () => {
  const initializeGoogle = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (response: any) => void,
    buttonElementId?: string,
    options?: GoogleButtonOptions
  ) => {
    try {
      await loadGoogleScript();
      await initializeGoogleSignIn(callback, buttonElementId, options);
    } catch (error) {
      console.error('Failed to initialize Google Sign-In:', error);
      throw error;
    }
  };

  return { initializeGoogle };
};