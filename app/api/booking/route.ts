import { NextRequest, NextResponse } from "next/server";
import { runBookingBot } from "../../../bots/booking-bot";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("📥 Booking data received:", data);
    
    // Trigger the playwright bot
    const botResult = await runBookingBot(data);
    
    // Generate a confirmation ID (you can make this more sophisticated)
    const confirmationId = `BK${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 3).toUpperCase()}`;
    
    // Return proper booking result format
    return NextResponse.json({
      success: true,
      message: "✅ Booking completed successfully.",
      confirmationId: confirmationId,
      bookingDetails: {
        confirmationId: confirmationId,
        scheduledDate: data.date,
        scheduledTime: data.time,
        name: data.name,
        email: data.email,
        guests: data.guests,
        comment: data.comment || "None",
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error("❌ Error running booking bot:", error);
    
    // Return proper error format
    return NextResponse.json({
      success: false,
      message: "❌ Failed to complete booking.",
      error: "Booking service unavailable. Please try again later.",
      // You can add available alternatives here if needed
      availableAlternatives: {
        dates: [], // Add alternative dates if available
        times: []  // Add alternative times if available
      }
    }, { status: 500 });
  }
}