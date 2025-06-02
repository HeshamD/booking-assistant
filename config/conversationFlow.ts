import { ConversationStep } from "../types/conversation";

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    isValid: emailRegex.test(email),
    errorMessage: "Please enter a valid email address (e.g., user@example.com)",
  };
};

const validateAge = (age: string) => {
  const ageNum = parseInt(age);
  return {
    isValid: !isNaN(ageNum) && ageNum > 0 && ageNum < 120,
    errorMessage: "Please enter a valid age (1-100)",
  };
};

const validateName = (name: string) => {
  return {
    isValid: name.trim().length >= 2,
    errorMessage: "Please enter a name with at least 2 characters",
  };
};

export const CONVERSATION_FLOW: ConversationStep[] = [
  {
    id: "name-input",
    botMessage: "Hi! What's your name?",
    nextMessage: (input: string) =>
      `You entered "${input}". Is this correct? (yes/no)`,
    field: "name",
    validation: validateName,
  },
  {
    id: "name-confirm",
    botMessage: null,
    nextMessage: (input: string, responses) => {
      const isYes =
        input.toLowerCase().includes("yes") ||
        input.toLowerCase().includes("y");
      if (isYes) {
        return `Nice to meet you, ${responses?.name}! How old are you?`;
      } else {
        return "No problem! What's your name?";
      }
    },
    isConfirmation: true,
  },
  {
    id: "age-input",
    botMessage: null,
    nextMessage: (input: string) =>
      `You entered "${input}". Is this correct? (yes/no)`,
    field: "age",
    validation: validateAge,
  },
  {
    id: "age-confirm",
    botMessage: null,
    nextMessage: (input: string, responses) => {
      const isYes =
        input.toLowerCase().includes("yes") ||
        input.toLowerCase().includes("y");
      if (isYes) {
        return `Great! What's your email address?`;
      } else {
        return "No problem! How old are you?";
      }
    },
    isConfirmation: true,
  },
  {
    id: "email-input",
    botMessage: null,
    nextMessage: (input: string) =>
      `You entered "${input}". Is this correct? (yes/no)`,
    field: "email",
    validation: validateEmail,
  },
  {
    id: "email-confirm",
    botMessage: null,
    nextMessage: (input: string, responses) => {
      const isYes =
        input.toLowerCase().includes("yes") ||
        input.toLowerCase().includes("y");
      if (isYes) {
        return `Awesome, ${responses?.name}! Here's what I got: Name: ${responses?.name}, Age: ${responses?.age}, Email: ${responses?.email}. Thanks! 🎉`;
      } else {
        return "No problem! What's your email address?";
      }
    },
    isConfirmation: true,
  },
];
