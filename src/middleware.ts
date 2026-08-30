import { NextResponse } from "next/server";
import authConfig from "./auth.config";
import NextAuth from "next-auth";

const { auth: middleware } = NextAuth(authConfig);

const authRoutes = ["/login", "/register", "/auth"];

export default middleware(async (request) => {
  const session = request.auth;
  const path = request.nextUrl.pathname;

  const isAuthRoute = authRoutes.some((route) =>
    path.startsWith(route)
  );
  const isAdminRoute = path.startsWith("/admin");


  if (isAuthRoute) {
    if (session?.user?.email) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  if (isAdminRoute) {
    console.log (session?.user)
      if (!session?.user?.email) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (!session.user.isAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  if (!session?.user?.email) {
    const loginUrl = new URL("/login", request.url);

    

    return NextResponse.redirect(loginUrl);
  }
   const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' ${process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ""} https://cdn.jsdelivr.net;
    style-src 'self' 'unsafe-inline';
    connect-src 'self' https://github.com https://api.github.com https://accounts.google.com https://oauth2.googleapis.com;
    worker-src 'self' blob:;
    img-src 'self' https://authjs.dev https://github.com https://api.github.com https://accounts.google.com https://res.cloudinary.com blob: data:;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self' https://github.com https://api.github.com https://accounts.google.com https://oauth2.googleapis.com;
    frame-src 'self' https://www.youtube.com;
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
}

  // return NextResponse.next();
// }
);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
