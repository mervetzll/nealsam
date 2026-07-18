import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { gifts } from "../src/data/gifts";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Supabase URL veya service role key eksik.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function main() {
  console.log(`Toplam ${gifts.length} hediye aktarılacak.`);

  const rows = gifts.map((gift) => ({
    title: gift.title,
    category: gift.category,
    sub_category: gift.subCategory,
    price_min: gift.priceMin,
    price_max: gift.priceMax,
    recipients: gift.recipients,
    interests: gift.interests,
    styles: gift.styles,
    occasions: gift.occasions,
    urgency: gift.urgency,
    risk_level: gift.riskLevel,
    reason: gift.reason,
    note: gift.note,
    search_query: gift.searchQuery,
    is_active: true,
  }));

  const { error: deleteError } = await supabase
    .from("gifts")
    .delete()
    .not("id", "is", null);

  if (deleteError) {
    throw deleteError;
  }

  const { error: insertError } = await supabase.from("gifts").insert(rows);

  if (insertError) {
    throw insertError;
  }

  console.log("Hediyeler Supabase'e başarıyla aktarıldı.");
}

main();
