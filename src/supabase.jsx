import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hcmkruxumytizendywdj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjbWtydXh1bXl0aXplbmR5d2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MTQwMDEsImV4cCI6MjA5MTM5MDAwMX0.LTenICmVJqzSCxiemjEeboHEXAhQsn7PVD822UxywBU";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

// TEMPORARY DIAGNOSTIC
console.log("===== AUTH-FREE SUPABASE TEST =====");

(async () => {
  try {
    console.log("AUTH-FREE TEST 1: starting cars query...");

    const result = await supabase
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