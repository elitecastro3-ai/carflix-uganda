import { useEffect } from "react";
import { supabase } from "./supabase";

export default function TestSupabase() {
  useEffect(() => {
    async function test() {
      console.log("TEST START");

      try {
        const { data, error } = await supabase
          .from("cars")
          .select("id")
          .limit(1);

        console.log("TEST DATA:", data);
        console.log("TEST ERROR:", error);
      } catch (e) {
        console.error("TEST EXCEPTION:", e);
      }

      console.log("TEST END");
    }

    test();
  }, []);

  return <h1>Testing Supabase...</h1>;
}