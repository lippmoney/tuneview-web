import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Server misconfigured." },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { error } = await supabase
    .from("waitlist")
    .insert({ email: email.toLowerCase().trim(), source: "website" });

  if (error) {
    if (error.code === "23505") {
      // unique_violation — already on the list
      return NextResponse.json(
        { error: "Already on the list." },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Database error." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
