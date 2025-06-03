"use client";
import { useState, useEffect } from "react";
import { Message, UserResponses } from "../types/conversation";
import { CONVERSATION_FLOW } from "../config/conversationFlow";
import { sendResponses } from "../lib/api";

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

  // Console log responses whenever they change
  useEffect(() => {
    console.log("📋 Current responses:", responses);
    console.log("📊 Response summary:", {
      fieldsCompleted: Object.values(responses).filter(
        (value) => value !== "" && value !== 0
      ).length,
      totalFields: Object.keys(responses).length,
      currentStep: step,
    });
  }, [responses, step]);

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

    console.log("🔄 Processing user input:", input, "at step:", step);

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
            console.log("✅ Confirmed and updating responses:", {
              field: previousStep.field,
              value: pendingInput,
              updatedResponses,
            });
            setResponses(updatedResponses);

            // Check if this is the last step
            if (step + 1 >= CONVERSATION_FLOW.length) {
              console.log(
                "🎉 All data confirmed — ready to send:",
                updatedResponses
              );
              sendResponses(updatedResponses);
            }

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
        console.log("❌ User declined, going back to previous step");
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
          console.log("⚠️ Validation failed:", validation.errorMessage);
          addBotMessage(
            validation.errorMessage || "Invalid input. Please try again."
          );
          return;
        }
      }

      // Store pending input for confirmation
      console.log("⏳ Storing pending input for confirmation:", input);
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
