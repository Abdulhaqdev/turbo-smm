import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from './useLocale';

export const useLocaleFromUrl = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { locale, setLocale } = useLocale();

  useEffect(() => {
    const pathSegments = pathname.split('/');
    // First segment after the initial slash is the locale in the URL
    const localeFromUrl = pathSegments.length > 1 ? pathSegments[1] : '';
    
    const localeMap: Record<string, string> = {
      uz: 'uz-UZ',
      ru: 'ru-RU',
      en: 'en-US',
    };

    // If URL locale is valid and different from current locale setting
    if (localeFromUrl && localeMap[localeFromUrl] && localeMap[localeFromUrl] !== locale) {
      console.log(`Setting locale from URL: ${localeFromUrl} → ${localeMap[localeFromUrl]}`);
      setLocale(localeMap[localeFromUrl]);
    }
  }, [pathname, setLocale, locale]);

  return {
    getCurrentUrlLocale: () => {
      const pathSegments = pathname.split('/');
      return pathSegments.length > 1 ? pathSegments[1] : '';
    },
    
    // Helper function to update URLs when locale changes
    updateUrlWithCurrentLocale: (preserveParams = true) => {
      const currentLocalePrefix = locale.split('-')[0]; // 'uz', 'ru', or 'en'
      const pathSegments = pathname.split('/');
      
      if (pathSegments.length > 1) {
        // Replace the locale segment with current locale
        pathSegments[1] = currentLocalePrefix;
        
        // Get current search params if needed
        const searchString = preserveParams ? window.location.search : '';
        
        // Navigate to the updated path
        router.replace(pathSegments.join('/') + searchString);
      }
    }
  };
};