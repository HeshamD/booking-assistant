import { NextRequest, NextResponse } from "next/server";
import { runBookingBot } from "../../../bots/booking-bot";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("📥 Booking data received:", data);

    // Trigger the playwright bot
    await runBookingBot(data);

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
