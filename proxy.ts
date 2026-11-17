import { NextResponse, type NextRequest } from "next/server";
import { SIGNUP_COOKIE, readSignupToken } from "@/lib/signup-session";

// /welcome is only for people who just signed up. Anyone else goes home.
export function proxy(request: NextRequest) {
  const email = readSignupToken(request.cookies.get(SIGNUP_COOKIE)?.value);
  if (email) return NextResponse.next();

  const response = NextResponse.redirect(new URL("/", request.url));
  if (request.cookies.has(SIGNUP_COOKIE)) response.cookies.delete(SIGNUP_COOKIE);
  return response;
}

export const config = {
  matcher: "/welcome",
};
