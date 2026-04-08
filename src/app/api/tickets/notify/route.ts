import { resend } from "@/lib/resend";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { ticketId, type } = await request.json();

    // 1. Fetch Ticket & Client Info
    const { data: ticket, error: fetchError } = await supabase
      .from("tickets")
      .select("*, profiles(company_name, contact_name)")
      .eq("id", ticketId)
      .single();

    if (fetchError || !ticket) {
        return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
    }

    // 2. Draft & Send Email
    // Using demo@resend.dev for testing if API KEY is sandbox, otherwise real.
    const fromEmail = "Maple Leaf Trading <onboarding@resend.dev>"; 
    const toEmail = "hello@mapleleaf-trading.ca"; // In prod, this would be the client's email or admin's email

    let subject = "";
    let html = "";

    if (type === 'NEW_TICKET') {
        subject = `[NEW TICKET #${ticket.id.slice(0, 8)}] ${ticket.subject}`;
        html = `
          <div style="font-family: sans-serif; max-width: 600px; padding: 40px; background-color: #0A0C11; color: white;">
            <h1 style="color: #EA002C; text-transform: uppercase;">Ticket Initialized</h1>
            <p style="color: #888; text-transform: uppercase; font-size: 10px; font-weight: bold; letter-spacing: 0.1em;">B2B Support Hub</p>
            <hr style="border: 0; border-top: 1px solid #333; margin: 30px 0;" />
            <p><strong>Partner:</strong> ${ticket.profiles?.company_name || 'N/A'}</p>
            <p><strong>Subject:</strong> ${ticket.subject}</p>
            <p><strong>Priority:</strong> ${ticket.priority}</p>
            <p style="color: #aaa; font-style: italic;">"${ticket.description}"</p>
            <hr style="border: 0; border-top: 1px solid #333; margin: 30px 0;" />
            <p style="font-size: 10px; color: #555; text-transform: uppercase;">Maple Leaf Trading Ltd. &bull; Operations Hub</p>
          </div>
        `;
    } else if (type === 'STATUS_UPDATE') {
        subject = `[TICKET UPDATE #${ticket.id.slice(0, 8)}] Status Moved to ${ticket.status}`;
        html = `
           <div style="font-family: sans-serif; max-width: 600px; padding: 40px; background-color: #0A0C11; color: white;">
            <h2 style="color: #EA002C; text-transform: uppercase;">Engagement Status Changed</h2>
            <p style="color: #888; text-transform: uppercase; font-size: 10px; font-weight: bold;">Ticket #${ticket.id.slice(0, 8)}</p>
            <hr style="border: 0; border-top: 1px solid #333; margin: 30px 0;" />
            <p>Your inquiry regarding <strong>"${ticket.subject}"</strong> has been shifted to <strong>${ticket.status}</strong>.</p>
            <p>Our production team is now overseeing the resolution.</p>
            <hr style="border: 0; border-top: 1px solid #333; margin: 30px 0;" />
          </div>
        `;
    }

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject,
      html,
    });

    if (error) {
        console.error("Resend Error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Notify Error:", error);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
