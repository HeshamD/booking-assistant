"use client";
import { useState } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (input: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim() || disabled) return;
    onSend(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex gap-3 items-center w-full max-w-4xl mx-auto px-2 sm:px-0">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={
          disabled ? "Conversation complete!" : "Type your message..."
        }
        className="flex-1 border border-gray-300 rounded-full px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-gray-100"
      />
      <button
        onClick={handleSend}
        disabled={disabled}
        className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition disabled:opacity-50 flex-shrink-0"
      >
        <Send className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
}
