// lib/google-config.ts

export const GOOGLE_CONFIG = {
  CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "577050887686-5g252b918ojrmsfgcl3kaucl5r4ek2o8.apps.googleusercontent.com",
  SCOPES: ['profile', 'email'],
  DISCOVERY_DOC: 'https://www.googleapis.com/discovery/v1/apis/oauth2/v2/rest',
};

export const loadGoogleScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.google) {
      resolve();
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
        reject(new Error('Google Sign-In failed to load'));
      }, 10000);
    };

    script.onerror = () => reject(new Error('Failed to load Google Sign-In script'));
    document.head.appendChild(script);
  });
};

export const initializeGoogleSignIn = (
  callback: (response: any) => void,
  buttonElementId: string = 'google-signin-button'
) => {
  if (!window.google?.accounts?.id) {
    console.error('Google Sign-In not loaded');
    return;
  }

  window.google.accounts.id.initialize({
    client_id: GOOGLE_CONFIG.CLIENT_ID,
    callback,
    ux_mode: 'popup',
    use_fedcm_for_prompt: false,
  });

  const buttonElement = document.getElementById(buttonElementId);
  if (buttonElement) {
    window.google.accounts.id.renderButton(buttonElement, {
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      width: '100%',
      locale: 'uz', // Uzbek locale
    });
  }
};