import { validateDate, validateTime } from "../lib/helperfunctions";
import { ConversationStep } from "../types/conversation";

export const CONVERSATION_FLOW: ConversationStep[] = [
  {
    id: "name-input",
    botMessage:
      "Hi there! I'm Mia, your booking assistant. May I know your name?",
    nextMessage: (input: string) =>
      `Got it — you entered "${input}". Is that right? (yes/no)`,
    field: "name",
  },
  {
    id: "name-confirm",
    botMessage: null,
    nextMessage: (input: string, responses) => {
      const isYes =
        input.toLowerCase().includes("yes") ||
        input.toLowerCase().includes("y");
      if (isYes) {
        return `Lovely to meet you, ${responses?.name}! What date would you like to book? (MM/DD/YYYY)`;
      } else {
        return "No problem — what's your name?";
      }
    },
    isConfirmation: true,
  },
  {
    id: "date-input",
    botMessage: null,
    nextMessage: (input: string) =>
      `You'd like "${input}". Is that correct? (yes/no)`,
    field: "date",
    validation: validateDate,
  },
  {
    id: "date-confirm",
    botMessage: null,
    nextMessage: (input: string, responses) => {
      const isYes =
        input.toLowerCase().includes("yes") ||
        input.toLowerCase().includes("y");
      if (isYes) {
        return `Perfect — what time works for you on ${responses?.date}? (please type in this format 00:00 PM or 00:00 AM)`;
      } else {
        return "No problem — what date would you like to book? (MM/DD/YYYY)";
      }
    },
    isConfirmation: true,
  },
  {
    id: "time-input",
    botMessage: null,
    nextMessage: (input: string) =>
      `You'd like "${input}". Is that correct? (yes/no)`,
    field: "time",
    validation: validateTime,
  },
  {
    id: "time-confirm",
    botMessage: null,
    nextMessage: (input: string, responses) => {
      const isYes =
        input.toLowerCase().includes("yes") ||
        input.toLowerCase().includes("y");
      if (isYes) {
        return `Awesome! Can I grab your email address?`;
      } else {
        return `Okay, what time would you prefer on ${responses?.date}? (please type in this format 00:00 PM or 00:00 AM)`;
      }
    },
    isConfirmation: true,
  },
  {
    id: "email-input",
    botMessage: null,
    nextMessage: (input: string) =>
      `Got it — "${input}". Is that your correct email? (yes/no)`,
    field: "email",
  },
  {
    id: "email-confirm",
    botMessage: null,
    nextMessage: (input: string, responses) => {
      const isYes =
        input.toLowerCase().includes("yes") ||
        input.toLowerCase().includes("y");
      if (isYes) {
        return `Thank you! Any comments or special notes you'd like us to know? (leave blank if none)`;
      } else {
        return "Okay — could you share your email address again?";
      }
    },
    isConfirmation: true,
  },
  {
    id: "comment-input",
    botMessage: null,
    nextMessage: (input: string) =>
      `Noted — "${input}". Is that correct? (yes/no)`,
    field: "comment",
  },
  {
    id: "comment-confirm",
    botMessage: null,
    nextMessage: (input: string, responses) => {
      const isYes =
        input.toLowerCase().includes("yes") ||
        input.toLowerCase().includes("y");
      if (isYes) {
        return `And lastly — how many guests will be joining?`;
      } else {
        return "Okay — what would you like to note down instead?";
      }
    },
    isConfirmation: true,
  },
  {
    id: "guests-input",
    botMessage: null,
    nextMessage: (input: string) =>
      `You mentioned "${input}" guests. Is that right? (yes/no)`,
    field: "guests",
  },
  {
    id: "guests-confirm",
    botMessage: null,
    nextMessage: (input: string, responses) => {
      const isYes =
        input.toLowerCase().includes("yes") ||
        input.toLowerCase().includes("y");
      if (isYes) {
        return `Perfect! Let me process your booking now. Please wait a moment while I check availability and schedule your appointment... ⏳`;
      } else {
        return "Okay — how many guests will you be bringing?";
      }
    },
    isConfirmation: true,
  },
  {
    id: "booking-result",
    botMessage: null,
    nextMessage: (input: string, responses, result) => {
      if (!result) {
        return "I'm still processing your booking. Please wait...";
      }

      if (result.success) {
        return `🎉 **Booking Confirmed!** 🎉

Your appointment has been successfully scheduled! Here are your booking details:

📅 **Date:** ${result.bookingDetails?.scheduledDate}
🕐 **Time:** ${result.bookingDetails?.scheduledTime}
👤 **Name:** ${result.bookingDetails?.name}
📧 **Email:** ${result.bookingDetails?.email}
👥 **Guests:** ${result.bookingDetails?.guests}
📝 **Notes:** ${result.bookingDetails?.comment || "None"}
${
  result.bookingDetails?.confirmationId
    ? `🆔 **Confirmation ID:** ${result.bookingDetails.confirmationId}`
    : ""
}

✅ You should receive a confirmation email shortly at ${
          result.bookingDetails?.email
        }.

Is there anything else I can help you with today? You can:
• Book another appointment
• Modify this booking
• Ask questions about your appointment
• Or simply say "goodbye" to end our chat`;
      } else {
        let message = `❌ **Booking Unsuccessful**

I'm sorry, but I wasn't able to complete your booking. ${
          result.error || result.message
        }`;

        if (result.availableAlternatives) {
          if (result.availableAlternatives.dates.length > 0) {
            message += `\n\n📅 **Available alternative dates:**\n${result.availableAlternatives.dates.join(
              ", "
            )}`;
          }
          if (result.availableAlternatives.times.length > 0) {
            message += `\n\n🕐 **Available times:**\n${result.availableAlternatives.times.join(
              ", "
            )}`;
          }
        }

        message += `\n\nWould you like to:
• Try booking with different date/time
• Start over with a new booking
• Speak with a human agent
• Or ask me any questions?

Just let me know how I can help!`;

        return message;
      }
    },
    isResultStep: true,
  },
  {
    id: "post-booking-interaction",
    botMessage: null,
    nextMessage: (input: string) => {
      const lowerInput = input.toLowerCase();

      if (
        lowerInput.includes("book") ||
        lowerInput.includes("appointment") ||
        lowerInput.includes("schedule")
      ) {
        return "I'd be happy to help you with another booking! Let's start fresh. What's your name?";
      } else if (
        lowerInput.includes("modify") ||
        lowerInput.includes("change") ||
        lowerInput.includes("reschedule")
      ) {
        return "I understand you'd like to modify your booking. For changes to existing appointments, please contact us directly or use the link in your confirmation email. Is there anything else I can help you with?";
      } else if (
        lowerInput.includes("question") ||
        lowerInput.includes("help") ||
        lowerInput.includes("info")
      ) {
        return "I'm here to help! What would you like to know? I can assist with booking information, appointment details, or answer general questions about our services.";
      } else if (
        lowerInput.includes("human") ||
        lowerInput.includes("agent") ||
        lowerInput.includes("speak")
      ) {
        return "I'll connect you with a human agent. Please hold on while I transfer you to our customer service team. In the meantime, is there anything quick I can help you with?";
      } else if (
        lowerInput.includes("goodbye") ||
        lowerInput.includes("bye") ||
        lowerInput.includes("thanks") ||
        lowerInput.includes("thank you")
      ) {
        return "Thank you for using our booking service! Have a wonderful day, and we look forward to seeing you soon! 👋";
      } else {
        return "I'm here to help! You can ask me to:\n• Book another appointment\n• Get information about your booking\n• Answer questions about our services\n• Connect you with a human agent\n\nWhat would you like to do?";
      }
    },
  },
];
