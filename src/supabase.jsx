import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hcmkruxumytizendywdj.supabase.co";
const supabaseKey = "[ANON KEY UNCHANGED — NOT PRINTED HERE]";

export const supabase = createClient(supabaseUrl, supabaseKey);

// ─── TEMPORARY DIAGNOSTIC ONLY — remove after testing ───────────────────────
const diagnosticSupabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

console.log("===== AUTH-FREE SUPABASE TEST =====");

(async () => {
  try {
    console.log("AUTH-FREE TEST 1: starting cars query...");

    const result = await diagnosticSupabase
      .from("cars")
      .select("*")
      .limit(1);

    console.log("AUTH-FREE TEST 2: query returned");
    console.log("AUTH-FREE TEST 3: data =", result.data);
    console.log("AUTH-FREE TEST 4: error =", result.error);
    console.log("AUTH-FREE TEST 5: count =", result.count);
  } catch (err) {
    console.error("AUTH-FREE TEST 6: query threw =", err);
  }
})();
// ─── END TEMPORARY DIAGNOSTIC ────────────────────────────────────────────────