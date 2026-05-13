import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, title, destination, excerpt, content } = body as {
      name?: string;
      email?: string;
      title?: string;
      destination?: string;
      excerpt?: string;
      content?: string;
    };

    if (!title || !content || !name) {
      return NextResponse.json({ error: "title, content, and name are required" }, { status: 400 });
    }

    const serviceKey = process.env.SUPABASE_SERVICE_KEY;
    if (!serviceKey) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://prffhhkemxibujjjiyhg.supabase.co",
      serviceKey
    );

    // Generate a slug from the title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .substring(0, 80);

    const { error } = await supabase.from("user_posts").insert({
      user_name: name,
      email: email || null,
      title,
      destination: destination || null,
      excerpt: excerpt || null,
      content,
      slug: slug + "-" + Date.now(),
      status: "pending",
      cover_photo: null,
      photos: null,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Community submit error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
