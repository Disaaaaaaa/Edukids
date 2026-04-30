import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

// Routes that require specific roles
const ROLE_ROUTES = {
  "/student": "student",
  "/teacher": "teacher",
  "/admin": "admin",
}

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const role = req.auth?.user?.role as string | undefined

  // Protect dashboard routes based on roles
  for (const [route, expectedRole] of Object.entries(ROLE_ROUTES)) {
    if (nextUrl.pathname.startsWith(route)) {
      if (!isLoggedIn) {
        return NextResponse.redirect(new URL("/login", nextUrl))
      }
      if (role !== expectedRole) {
        // User is logged in but has the wrong role, redirect to their dashboard or home
        if (role === "student") return NextResponse.redirect(new URL("/student/dashboard", nextUrl))
        if (role === "teacher") return NextResponse.redirect(new URL("/teacher/dashboard", nextUrl))
        if (role === "admin") return NextResponse.redirect(new URL("/admin/dashboard", nextUrl))
        return NextResponse.redirect(new URL("/", nextUrl))
      }
    }
  }

  // If going to login while already logged in
  if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")) {
    if (role === "student") return NextResponse.redirect(new URL("/student/dashboard", nextUrl))
    if (role === "teacher") return NextResponse.redirect(new URL("/teacher/dashboard", nextUrl))
    if (role === "admin") return NextResponse.redirect(new URL("/admin/dashboard", nextUrl))
    return NextResponse.redirect(new URL("/", nextUrl))
  }

  return NextResponse.next()
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
