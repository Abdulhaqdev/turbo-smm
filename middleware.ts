  import { NextResponse, NextRequest } from "next/server";

  export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl; // So'rovning yo'lini olish
    const accessToken = request.cookies.get("refresh_token")?.value; // Cookies dan accessToken ni olish

    console.log(accessToken)

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

//   import { NextRequest, NextResponse } from "next/server";

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get("access_token")?.value;  

//   if (request.nextUrl.pathname.startsWith("/dashboard")) {
//     if (!token) {
//       return NextResponse.redirect(new URL("/", request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*"],
// };