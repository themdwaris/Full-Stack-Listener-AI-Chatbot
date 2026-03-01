import { NextResponse } from "next/server";

export function middleware(req) {
  try {
    const token = req?.cookies?.get("token")?.value;
    const url = req?.nextUrl;

    // Agar token nahi hai aur user chat page par hai
    if (!token && url?.pathname.startsWith("/chat/")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("❌ Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/chat/:path*"],
};