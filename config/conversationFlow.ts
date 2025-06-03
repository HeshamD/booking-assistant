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
        return `Amazing, ${
          responses?.name
        }! Here's a quick summary of your booking:

- 📅 Date: ${responses?.date}
- 🕑 Time: ${responses?.time}
- 👤 Name: ${responses?.name}
- 📧 Email: ${responses?.email}
- 📝 Comment: ${responses?.comment || "None"}
- 👥 Guests: ${responses?.guests}

Thanks for booking — we're excited to have you! 🎉`;
      } else {
        return "Okay — how many guests will you be bringing?";
      }
    },
    isConfirmation: true,
  },
];


