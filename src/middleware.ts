import { NextRequest, NextResponse } from "next/server";
import { ratelimitNormal, ratelimitStrict } from "./lib/redis";
export async function middleware(request: NextRequest) {
  const token = request.cookies.get("jwtToken")?.value;

  const identifier =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const isApi = request.nextUrl.pathname.startsWith("/api");
  const isLogin = request.nextUrl.pathname === "/api/users/login";
  const isProfile = request.nextUrl.pathname.startsWith("/api/users/profile");

  if (!token) {
    const limit = isLogin
      ? ratelimitStrict
      : ratelimitNormal;

    const result = await limit.limit(identifier);

    if (!result.success) {
      return NextResponse.json(
        { message: "Too many requests, please try again later" },
        { status: 429 }
      );
    }

    if (isProfile) {
      return NextResponse.json(
        { message: "no token provided, access denied" },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  if (isApi) {
    const finalId = `${identifier}:${token}`;

    const result = await ratelimitNormal.limit(finalId);

    if (!result.success) {
      return NextResponse.json(
        { message: "Too many requests, please try again later" },
        { status: 429 }
      );
    }
  }

  if (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/regester") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/api/:path*", "/login", "/regester"],
};
