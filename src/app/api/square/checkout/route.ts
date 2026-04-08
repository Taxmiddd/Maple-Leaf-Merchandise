import { squareClient as client } from "@/lib/square/client";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { SquareError } from "square";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { invoiceId } = await request.json();

    // 1. Fetch Invoice
    const { data: invoice, error: fetchError } = await supabase
      .from("invoices")
      .select("*, order_id(*)")
      .eq("id", invoiceId)
      .single();

    if (fetchError || !invoice) {
        return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
    }

    // 2. Create Square Checkout
    const body: any = {
      idempotencyKey: invoiceId,
      checkoutOptions: {
        redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/invoices?paid=true`,
        askForShippingAddress: false,
      },
      order: {
        locationId: process.env.SQUARE_LOCATION_ID!,
        lineItems: [
          {
            name: `B2B Invoice #${invoice.id.slice(0, 8)}`,
            quantity: "1",
            basePriceMoney: {
              amount: BigInt(Math.round(Number(invoice.amount) * 100)), // Cents
              currency: "CAD",
            },
          },
        ],
      },
    };

    const result = await client.checkout.paymentLinks.create(body);

    return NextResponse.json({ url: result.paymentLink?.url });
  } catch (error: any) {
    if (error instanceof SquareError) {
        console.error(error.errors);
        return NextResponse.json({ error: error.errors[0].detail }, { status: 400 });
    }
    return NextResponse.json({ error: "Checkout creation failed." }, { status: 500 });
  }
}
