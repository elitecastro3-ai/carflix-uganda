import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hcmkruxumytizendywdj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjbWtydXh1bXl0aXplbmR5d2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MTQwMDEsImV4cCI6MjA5MTM5MDAwMX0.LTenICmVJqzSCxiemjEeboHEXAhQsn7PVD822UxywBU";

export const supabase = createClient(supabaseUrl, supabaseKey);