// OOP: Middleware pattern - intercepts requests for auth enforcement
export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile",
    "/notifications",
  ],
};