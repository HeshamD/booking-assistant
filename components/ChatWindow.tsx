import { useEffect, useRef } from "react";
import { Message as MessageType } from "../types/conversation";
import { Message } from "./Message";

interface ChatWindowProps {
  messages: MessageType[];
}

export function ChatWindow({ messages }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col space-y-3 sm:space-y-4 p-3 sm:p-4 pb-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
            Start a conversation...
          </div>
        ) : (
          messages.map((msg, index) => <Message key={index} message={msg} />)
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
  
}
