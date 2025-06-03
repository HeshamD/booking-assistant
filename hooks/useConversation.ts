"use client";
import { useState } from "react";
import { Message, UserResponses } from "../types/conversation";
import { CONVERSATION_FLOW } from "../config/conversationFlow";

interface UseConversationReturn {
  messages: Message[];
  responses: UserResponses;
  step: number;
  processUserInput: (input: string) => void;
  isComplete: boolean;
}

export function useConversation(): UseConversationReturn {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: CONVERSATION_FLOW[0].botMessage! },
  ]);
  const [responses, setResponses] = useState<UserResponses>({
    name: "",
    date: "",
    time: "",
    email: "",
    comment: "",
    guests: 0,
  });
  const [step, setStep] = useState<number>(0);
  const [pendingInput, setPendingInput] = useState<string>("");

  const addMessage = (message: Message): void => {
    setMessages((prev) => [...prev, message]);
  };

  const addBotMessage = (text: string, delay: number = 500): void => {
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", text }]);
    }, delay);
  };

  const processUserInput = (input: string): void => {
    if (!input.trim()) return;

    addMessage({ sender: "user", text: input });

    const currentFlow = CONVERSATION_FLOW[step];
    if (!currentFlow) return;

    // Handle confirmation steps
    if (currentFlow.isConfirmation) {
      const isYes =
        input.toLowerCase().includes("yes") ||
        input.toLowerCase().includes("y");

      if (isYes) {
        // User confirmed, save the pending input
        if (pendingInput && step > 0) {
          const previousStep = CONVERSATION_FLOW[step - 1];
          if (previousStep.field) {
            const updatedResponses: UserResponses = {
              ...responses,
              [previousStep.field]: pendingInput,
            };
            setResponses(updatedResponses);

            // Generate next message with updated responses
            const nextMessage = currentFlow.nextMessage(
              input,
              updatedResponses
            );
            addBotMessage(nextMessage);
            setStep(step + 1);
            setPendingInput("");
            return;
          }
        }
      } else {
        // User said no, go back to previous step
        const nextMessage = currentFlow.nextMessage(input, responses);
        addBotMessage(nextMessage);
        setStep(step - 1);
        setPendingInput("");
        return;
      }
    }

    // Handle input steps (not confirmation)
    if (!currentFlow.isConfirmation) {
      // Validate input if validation function exists
      if (currentFlow.validation) {
        const validation = currentFlow.validation(input);
        if (!validation.isValid) {
          addBotMessage(
            validation.errorMessage || "Invalid input. Please try again."
          );
          return;
        }
      }

      // Store pending input for confirmation
      setPendingInput(input);

      // Generate confirmation message
      const nextMessage = currentFlow.nextMessage(input, responses);
      addBotMessage(nextMessage);
      setStep(step + 1);
      return;
    }

    // Fallback - just move to next step
    const nextMessage = currentFlow.nextMessage(input, responses);
    addBotMessage(nextMessage);
    setStep(step + 1);
  };

  return {
    messages,
    responses,
    step,
    processUserInput,
    isComplete: step >= CONVERSATION_FLOW.length,
  };
}
