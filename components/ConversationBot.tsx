"use client";
import { useConversation } from "../hooks/useConversation";
import { ChatWindow } from "./ChatWindow";
import { ChatInput } from "./ChatInput";

export default function ConversationBot() {
  const { messages, processUserInput, isComplete } = useConversation();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="flex flex-col flex-1 w-full max-w-4xl mx-auto gap-4 sm:gap-5">
        {/* Chat container - takes remaining space */}
        <div className="flex-1 bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200 overflow-hidden flex flex-col min-h-0">
          <ChatWindow messages={messages} />
        </div>

        {/* Input stays at bottom */}
        <div className="flex-shrink-0">
          <ChatInput onSend={processUserInput} disabled={isComplete} />
        </div>
      </div>
    </div>
    
  );
}
