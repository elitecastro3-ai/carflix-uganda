import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const { buyer, seller, car, price } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch buyer username
    const { data: buyerData } = await supabase
      .from("users")
      .select("username")
      .eq("id", buyer)
      .single();

    // Fetch seller username
    const { data: sellerData } = await supabase
      .from("users")
      .select("username")
      .eq("id", seller)
      .single();

    const buyerName = buyerData?.username ?? "Unknown Buyer";
    const sellerName = sellerData?.username ?? "Unknown Seller";

    const formatter = new Intl.NumberFormat("en-UG");

    const now = new Date();

    const time = now.toLocaleTimeString("en-UG", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Africa/Kampala",
    });

    const message =
`🚗 <b>CarFlix Uganda</b>

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

    const response = await fetch(
      `https://api.telegram.org/bot${Deno.env.get("TELEGRAM_BOT_TOKEN")}/sendMessage`,
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

    const telegram = await response.json();

    if (!telegram.ok) {
      throw new Error(JSON.stringify(telegram));
    }

    return new Response(
      JSON.stringify({
        success: true,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error(err);

    return new Response(
      JSON.stringify({
        success: false,
        error: err.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
});