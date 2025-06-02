"use client";
import { useConversation } from "../hooks/useConversation";
import { ChatWindow } from "./ChatWindow";
import { ChatInput } from "./ChatInput";

export default function ConversationBot() {
  const { messages, processUserInput, isComplete } = useConversation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5 bg-gray-50 p-6">
      <div className="w-full max-w-lg h-[65vh] overflow-y-auto bg-white rounded-3xl shadow-lg border border-gray-200">
        <ChatWindow messages={messages} />
      </div>
      <ChatInput onSend={processUserInput} disabled={isComplete} />
    </div>
  );
}
