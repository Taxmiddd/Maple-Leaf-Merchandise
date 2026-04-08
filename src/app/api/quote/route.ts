import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { data: lead, error } = await supabase
      .from("leads")
      .insert([
        {
          name: body.name,
          email: body.email,
          company: body.company || "N/A",
          project_details: body.details,
          status: "New",
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Optional: Notify Admin (e.g., via Email or Webhook)
    
    return NextResponse.json({ success: true, lead });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
