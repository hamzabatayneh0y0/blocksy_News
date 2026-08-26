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

  if (isAuthRoute) {
    if (session?.user?.email) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  if (!session?.user?.email) {
    const loginUrl = new URL("/login", request.url);

    

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
