import { squareClient as client } from "@/lib/square/client";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { SquareError } from "square";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    // 1. Verify Admin Session
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== 'ADMIN') {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 2. Parse Date Params
    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    if (!start || !end) {
        return NextResponse.json({ error: "Start and end dates are required" }, { status: 400 });
    }

    // 3. Fetch Square Payments
    // Square API uses RFC 3339 timestamps
    const response = await client.payments.list({
      beginTime: start,
      endTime: end,
      locationId: process.env.SQUARE_LOCATION_ID
    });

    const payments: any[] = [];
    for await (const payment of response) {
      payments.push(payment);
    }
    
    // 4. Aggregate Stats
    const totalRevenue = payments.reduce((acc: any, p: any) => acc + Number(p.amountMoney?.amount || 0), 0);
    const totalTransactions = payments.length;
    const netRevenue = payments.reduce((acc: any, p: any) => acc + Number(p.totalMoney?.amount || 0), 0); // Simplified for B2B

    // Format for Chart (Daily aggregation)
    const dailyStats: Record<string, number> = {};
    payments.forEach((p: any) => {
        const date = new Date(p.createdAt!).toISOString().split('T')[0];
        dailyStats[date] = (dailyStats[date] || 0) + (Number(p.totalMoney?.amount) / 100);
    });

    const chartData = Object.entries(dailyStats).map(([date, revenue]) => ({
        date,
        revenue
    })).sort((a,b) => a.date.localeCompare(b.date));

    return NextResponse.json({
        overview: {
            revenue: totalRevenue / 100, // Convert cents to CAD
            transactions: totalTransactions,
            net: netRevenue / 100
        },
        chartData
    });

  } catch (error: any) {
    if (error instanceof SquareError) {
        console.error("Square API Error:", error.errors);
        return NextResponse.json({ error: error.errors[0].detail }, { status: 400 });
    }
    console.error("Analytics Error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
