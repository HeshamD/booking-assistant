export interface Message {
  sender: "bot" | "user";
  text: string;
}

export interface UserResponses {
  name: string;
  age: string;
  email: string;
}

export interface ConversationStep {
  id: string;
  botMessage: string | null;
  nextMessage: (input: string, responses?: UserResponses) => string;
  field?: keyof UserResponses;
  isConfirmation?: boolean;
  validation?: (input: string) => { isValid: boolean; errorMessage?: string };
}
