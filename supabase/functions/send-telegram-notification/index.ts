import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  try {
    const { buyer, seller, car, price } = await req.json();

    // 🔐 Init Supabase Admin Client
    const supabase = createClient(
      Deno.env.get("https://hcmkruxumytizendywdj.supabase.co")!,
      Deno.env.get("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjbWtydXh1bXl0aXplbmR5d2RqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTgxNDAwMSwiZXhwIjoyMDkxMzkwMDAxfQ.seziPLuhF4l-o_ZO5fMKO5zV8_ikb-jGswGo3aSq6ug")!
    );

    // 👤 Fetch buyer username
    const { data: buyerData, error: buyerError } = await supabase
      .from("users")
      .select("username")
      .eq("id", buyer)
      .single();

    if (buyerError) throw buyerError;

    // 🏪 Fetch seller username
    const { data: sellerData, error: sellerError } = await supabase
      .from("users")
      .select("username")
      .eq("id", seller)
      .single();

    if (sellerError) throw sellerError;

    const buyerName = buyerData?.username || "Unknown Buyer";
    const sellerName = sellerData?.username || "Unknown Seller";

    // 🕒 Time formatting (Uganda time)
    const time = new Date().toLocaleTimeString("en-US", {
      timeZone: "Africa/Kampala",
      hour: "2-digit",
      minute: "2-digit",
    });

    // 🚗 Telegram Message (your format)
    const message =
`🚗 *CarFlix Uganda*

🔔 *New Seller Inquiry*

👤 *Buyer:*
${buyerName}

🏪 *Seller:*
${sellerName}

🚘 *Vehicle:*
${car}

💰 *Price:*
UGX ${price}

📱 *Method:*
WhatsApp

🕒 *Time:*
${time}`;

    // 🤖 Send to Telegram
    const telegramToken = Deno.env.get("TELEGRAM_BOT_TOKEN")!;
    const chatId = Deno.env.get("TELEGRAM_CHAT_ID")!;

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${telegramToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    const telegramData = await telegramRes.json();

    if (!telegramRes.ok) {
      console.error("Telegram error:", telegramData);
      throw new Error("Failed to send Telegram message");
    }

    return new Response(
      JSON.stringify({ success: true, telegramData }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge Function Error:", err);

    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});