import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body as { email?: string };

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }

    const serviceKey = process.env.SUPABASE_SERVICE_KEY;
    if (!serviceKey) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://prffhhkemxibujjjiyhg.supabase.co",
      serviceKey
    );

    const { error } = await supabase.from("newsletter_subscribers").insert({
      email,
      subscribed_at: new Date().toISOString(),
    });

    if (error) {
      // Unique constraint violation — already subscribed
      if (error.code === "23505") {
        return NextResponse.json({ success: true, message: "Already subscribed" });
      }
      console.error("Newsletter insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Newsletter route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
