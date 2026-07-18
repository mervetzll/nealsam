import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/admin/:path*"],
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  const sessionCookie = request.cookies.get("nealsam_admin_session")?.value;

  if (pathname === "/admin/login") {
    if (sessionSecret && sessionCookie === sessionSecret) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  }

  if (!sessionSecret) {
    return new NextResponse("Admin session configuration is missing.", {
      status: 500,
    });
  }

  if (sessionCookie === sessionSecret) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/admin/login", request.url));
}
