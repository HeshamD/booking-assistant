export interface Message {
  sender: "bot" | "user";
  text: string;
}

export interface UserResponses {
  date: string;
  time: string;
  name: string;
  email: string;
  comment: string;
  guests: number;
}

export interface ConversationStep {
  id: string;
  botMessage: string | null;
  nextMessage: (input: string, responses?: UserResponses) => string;
  field?: keyof UserResponses;
  isConfirmation?: boolean;
  validation?: (input: string) => { isValid: boolean; errorMessage?: string };
}
