import { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './app/i18n/routing'
// import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware({
  ...routing,
  localePrefix: 'always',
    localeDetection: false, // Locale detection ni o'chiramiz
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // const accessToken = request.cookies.get('refresh_token')?.value;

  // Statik fayllar va API yo'llarini o'tkazib yuboramiz
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return intlMiddleware(request);
  }

  // Joriy til prefiksini aniqlaymiz
  // const localePrefix = routing.locales.some((locale) => pathname.startsWith(`/${locale}`))
  //   ? pathname.split('/')[1]
  //   : routing.defaultLocale;
  // const pathWithoutLocale = pathname.replace(`/${localePrefix}`, '') || '/';

  // /dashboard yo'lini himoya qilamiz
  // if (pathWithoutLocale.startsWith('/dashboard')) {
  //   if (!accessToken) {
  //     return Response.redirect(new URL(`/${localePrefix}/login`, request.url));
  //   }
  // }

  // /login da autentifikatsiya qilingan foydalanuvchilarni /dashboard ga yo'naltiramiz
  // if (pathWithoutLocale === '/login' && accessToken) {
  //   return Response.redirect(new URL(`/${localePrefix}/dashboard`, request.url));
  // }

  return intlMiddleware(request); 
}

export const config = {
  matcher: [
    '/((?!_next|api|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico|css|js|map)).*)',
  ],
};
