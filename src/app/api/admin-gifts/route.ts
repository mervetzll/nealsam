import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type GiftInput = {
  id?: string;
  title?: string;
  category?: string;
  subCategory?: string;
  priceMin?: number;
  priceMax?: number;
  recipients?: string[];
  interests?: string[];
  styles?: string[];
  occasions?: string[];
  urgency?: string[];
  riskLevel?: "low" | "medium" | "high";
  reason?: string;
  note?: string;
  searchQuery?: string;
  isActive?: boolean;
};

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRole) {
    throw new Error("Supabase admin environment variables are missing.");
  }

  return createClient(url, serviceRole);
}

async function isAdmin() {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("nealsam_admin_session")?.value;

  return Boolean(sessionSecret && sessionCookie === sessionSecret);
}

function rowToGift(row: any) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    subCategory: row.sub_category,
    priceMin: row.price_min,
    priceMax: row.price_max,
    recipients: row.recipients || [],
    interests: row.interests || [],
    styles: row.styles || [],
    occasions: row.occasions || [],
    urgency: row.urgency || [],
    riskLevel: row.risk_level,
    reason: row.reason,
    note: row.note,
    searchQuery: row.search_query,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}

function giftToRow(input: GiftInput) {
  return {
    title: input.title,
    category: input.category,
    sub_category: input.subCategory,
    price_min: Number(input.priceMin || 0),
    price_max: Number(input.priceMax || 0),
    recipients: input.recipients || [],
    interests: input.interests || [],
    styles: input.styles || [],
    occasions: input.occasions || [],
    urgency: input.urgency || [],
    risk_level: input.riskLevel || "low",
    reason: input.reason || "",
    note: input.note || "",
    search_query: input.searchQuery || input.title || "",
    is_active: input.isActive ?? true,
  };
}

function validateGift(input: GiftInput) {
  if (!input.title?.trim()) return "Hediye adı zorunlu.";
  if (!input.category?.trim()) return "Kategori zorunlu.";
  if (!input.subCategory?.trim()) return "Alt kategori zorunlu.";
  if (!Number.isFinite(Number(input.priceMin))) return "Minimum fiyat sayı olmalı.";
  if (!Number.isFinite(Number(input.priceMax))) return "Maksimum fiyat sayı olmalı.";
  if (Number(input.priceMin) > Number(input.priceMax)) {
    return "Minimum fiyat maksimum fiyattan büyük olamaz.";
  }
  return null;
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("gifts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    gifts: (data || []).map(rowToGift),
  });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const input = (await request.json()) as GiftInput;
  const validationError = validateGift(input);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("gifts")
    .insert(giftToRow(input))
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    gift: rowToGift(data),
  });
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const input = (await request.json()) as GiftInput;

  if (!input.id) {
    return NextResponse.json({ error: "Hediye ID eksik." }, { status: 400 });
  }

  const validationError = validateGift(input);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("gifts")
    .update(giftToRow(input))
    .eq("id", input.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    gift: rowToGift(data),
  });
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Hediye ID eksik." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("gifts").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
  });
}
