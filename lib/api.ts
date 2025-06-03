import { BookingResult, UserResponses } from "../types/conversation";

export async function sendResponses(responses: UserResponses): Promise<BookingResult> {
  try {
    const response = await fetch('/api/booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(responses),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Booking failed',
        error: data.error,
        availableAlternatives: data.availableAlternatives,
      };
    }

    // Handle successful response
    if (data.success) {
      return {
        success: true,
        message: data.message || 'Booking successful',
        bookingDetails: {
          confirmationId: data.confirmationId,
          scheduledDate: responses.date,
          scheduledTime: responses.time,
          name: responses.name,
          email: responses.email,
          guests: responses.guests,
          comment: responses.comment,
        },
      };
    } else {
      // Backend returned success: false
      return {
        success: false,
        message: data.message || 'Booking failed',
        error: data.error,
        availableAlternatives: data.availableAlternatives,
      };
    }
    
  } catch (error) {
    console.error('Error sending responses:', error);
    return {
      success: false,
      message: 'Network error occurred',
      error: 'Failed to connect to booking service',
    };
  }
}