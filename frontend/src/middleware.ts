import { type NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const { url, cookies, nextUrl } = request;
  const session = cookies.get("stream.sid")?.value;

  const isAuthPage = nextUrl.pathname.startsWith("/account");
  const isDeactivateRoute = nextUrl.pathname === "/account/deactivate";
  const isDashboardSettingRoute = nextUrl.pathname.startsWith("/dashboard");

  if (!session && isDashboardSettingRoute) {
    return NextResponse.redirect(new URL("/account/login", url));
  }
  if (!session && isDeactivateRoute) {
    return NextResponse.redirect(new URL("/account/login", url));
  }
  if (session && isAuthPage && !isDeactivateRoute) {
    return NextResponse.redirect(new URL("/dashboard/settings", url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/dashboard/:path*"],
};
