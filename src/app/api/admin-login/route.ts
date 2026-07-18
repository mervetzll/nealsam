import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const username = body.username;
  const password = body.password;

  const adminUser = process.env.ADMIN_USER;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!adminUser || !adminPassword || !sessionSecret) {
    return NextResponse.json(
      { message: "Admin configuration is missing." },
      { status: 500 }
    );
  }

  if (username !== adminUser || password !== adminPassword) {
    return NextResponse.json(
      { message: "Kullanıcı adı veya şifre yanlış." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set("nealsam_admin_session", sessionSecret, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
