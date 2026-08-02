import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseAdmin() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase admin environment variables are missing.");
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

async function isAdminAuthenticated() {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("nealsam_admin_session")?.value;

  return Boolean(sessionSecret && sessionCookie === sessionSecret);
}

export async function GET() {
  const isAdmin = await isAdminAuthenticated();

  if (!isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const supabaseAdmin = getSupabaseAdmin();

  const { data, error } = await supabaseAdmin
    .from("gifts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ gifts: data });
}

export async function POST(request: Request) {
  const isAdmin = await isAdminAuthenticated();

  if (!isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const supabaseAdmin = getSupabaseAdmin();

  const row = {
    title: body.title,
    category: body.category,
    sub_category: body.sub_category,
    price_min: Number(body.price_min),
    price_max: Number(body.price_max),
    recipients: body.recipients || [],
    interests: body.interests || [],
    styles: body.styles || [],
    occasions: body.occasions || [],
    urgency: body.urgency || [],
    risk_level: body.risk_level || "low",
    reason: body.reason,
    note: body.note,
    search_query: body.search_query,
    is_active: true,
  };

  const { data, error } = await supabaseAdmin
    .from("gifts")
    .insert(row)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ gift: data });
}

export async function PATCH(request: Request) {
  const isAdmin = await isAdminAuthenticated();

  if (!isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const supabaseAdmin = getSupabaseAdmin();

  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ message: "Gift id missing." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("gifts")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ gift: data });
}

export async function DELETE(request: Request) {
  const isAdmin = await isAdminAuthenticated();

  if (!isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const supabaseAdmin = getSupabaseAdmin();

  if (!body.id) {
    return NextResponse.json({ message: "Gift id missing." }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("gifts").delete().eq("id", body.id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
