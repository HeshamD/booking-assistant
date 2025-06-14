import { Message as MessageType } from "../types/conversation";

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  const isUser = message.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} w-full`}>
      <div
        className={`px-4 py-2 rounded-2xl max-w-sm break-words ${
          isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
        } shadow`}
      >
        {message.text}
      </div>
    </div>
  );
}
