import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role as string | undefined;
    const pathname = req.nextUrl.pathname;

    if ( pathname.startsWith("/admin")) {
      if (role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    if (pathname.startsWith("/host")) {
      if (role !== "HOST") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    if ( pathname.startsWith("/user")) {
      if (role !== "USER") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);
export const config = {
  matcher: [
    "/admin/:path*",
    "/host/:path*",
    "/user/:path*",
  ],
};