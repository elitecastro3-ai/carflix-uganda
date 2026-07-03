import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    const { buyer, seller, car, price } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Buyer
    const { data: buyerData } = await supabase
      .from("users")
      .select("username")
      .eq("id", buyer)
      .single();

    // Seller
    const { data: sellerData } = await supabase
      .from("users")
      .select("username")
      .eq("id", seller)
      .single();

    const buyerName = buyerData?.username ?? "Unknown Buyer";
    const sellerName = sellerData?.username ?? "Unknown Seller";

    const formatter = new Intl.NumberFormat("en-UG");

    const time = new Date().toLocaleTimeString("en-UG", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Africa/Kampala",
    });

    const message = `🚗 <b>CarFlix Uganda</b>

🔔 <b>New Seller Inquiry</b>

👤 <b>Buyer:</b>
${buyerName}

🏪 <b>Seller:</b>
${sellerName}

🚘 <b>Vehicle:</b>
${car}

💰 <b>Price:</b>
UGX ${formatter.format(price)}

📱 <b>Method:</b>
WhatsApp

🕒 <b>Time:</b>
${time}`;

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${Deno.env.get(
        "TELEGRAM_BOT_TOKEN"
      )}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: Deno.env.get("TELEGRAM_CHAT_ID"),
          text: message,
          parse_mode: "HTML",
        }),
      }
    );

    const telegram = await telegramResponse.json();

    if (!telegram.ok) {
      throw new Error(JSON.stringify(telegram));
    }

    return new Response(
      JSON.stringify({
        success: true,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error(err);

    return new Response(
      JSON.stringify({
        success: false,
        error: err instanceof Error ? err.message : String(err),
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});