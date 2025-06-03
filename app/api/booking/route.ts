import { NextRequest, NextResponse } from "next/server";
import { runBookingBot } from "../../../scrapper/playwrightBot";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("📥 Booking data received:", data);

    // Trigger the playwright bot
    await runBookingBot();

    return NextResponse.json(
      { message: "✅ Booking bot triggered successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error running booking bot:", error);

    return NextResponse.json(
      { message: "❌ Failed to trigger booking bot.", error },
      { status: 500 }
    );
  }
}
