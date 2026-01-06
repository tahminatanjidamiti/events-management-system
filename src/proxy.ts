import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role as string | undefined;
    const pathname = req.nextUrl.pathname;

    if (
      pathname.startsWith("/admindashboard") ||
      pathname.startsWith("/manage")
    ) {
      if (role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    if (pathname.startsWith("/createevent")) {
      if (role !== "HOST") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    if (
      pathname.startsWith("/profile") ||
      pathname.startsWith("/myevents")
    ) {
      if (role !== "USER" && role !== "HOST" && role !== "ADMIN") {
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
    "/profile/:path*",
    "/myevents/:path*",
    "/createevent/:path*",
    "/admindashboard/:path*",
    "/manageusers/:path*",
    "/managehosts/:path*",
    "/manageevents/:path*",
  ],
};