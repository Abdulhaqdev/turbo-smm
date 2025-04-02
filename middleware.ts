import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl; // So'rovning yo'lini olish
  const accessToken = request.cookies.get("accessToken")?.value; // Cookies dan accessToken ni olish
  console.log("Middleware: accessToken:", accessToken); // Debugging uchun log

  // /dashboard yo'lini tekshirish
  if (pathname.startsWith("/dashboard")) {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // /login yo'lini tekshirish
  if (pathname === "/login" && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next(); // So'rovni davom ettirish
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"], // Middleware qo'llaniladigan yo'llar
};