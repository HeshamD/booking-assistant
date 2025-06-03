export interface Message {
  sender: "bot" | "user";
  text: string;
  timestamp?: Date;
  isResult?: boolean; // New: to identify result messages
}

export interface UserResponses {
  date: string;
  time: string;
  name: string;
  email: string;
  comment: string;
  guests: string; // Changed from number to string to match conversation flow
}

export interface BookingResult {
  success: boolean;
  message: string;
  bookingDetails?: {
    confirmationId?: string;
    scheduledDate: string;
    scheduledTime: string;
    name: string;
    email: string;
    guests: string;
    comment?: string;
  };
  error?: string;
  availableAlternatives?: {
    dates: string[];
    times: string[];
  };
}

export interface ConversationStep {
  id: string;
  botMessage: string | null;
  nextMessage: (input: string, responses?: UserResponses, result?: BookingResult) => string; // Updated to include BookingResult
  field?: keyof UserResponses;
  isConfirmation?: boolean;
  isResultStep?: boolean; // New: to identify result steps
  validation?: (input: string) => { isValid: boolean; errorMessage?: string };
}

// Additional interface for conversation state management
export interface ConversationState {
  currentStepIndex: number;
  responses: Partial<UserResponses>;
  bookingResult: BookingResult | null;
  isCompleted: boolean;
  messages: Message[];
}

// Interface for the conversation handler
export interface IBookingConversationHandler {
  processUserInput(input: string): Promise<string>;
  getCurrentStep(): ConversationStep;
  reset(): void;
  getConversationState(): ConversationState;
  isBookingInProgress(): boolean;
}