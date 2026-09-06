import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

const authPages = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/email-verification",
  "/reset-password",
  "/email-verification/new-code",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await auth();

  // If the user is authenticated and trying to access an auth page, redirect to dashboard
  if (session && authPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Allow access to profile pages without authentication
  if (pathname.startsWith("/profile/") && pathname !== "/profile/edit") {
    return NextResponse.next();
  }

  // Allow public access to schedule page
  if (pathname === "/schedule") {
    return NextResponse.next();
  }

  // If the user is not authenticated and trying to access a protected route, redirect to login
  if (
    !session &&
    !authPages.includes(pathname) &&
    !pathname.startsWith("/reset-password/")
  ) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Otherwise, allow the request to continue
  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: ["/((?!static|favicon.ico|_next|.*\\..*|api|trpc).*)", "/"],
};
