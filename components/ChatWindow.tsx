import { Message as MessageType } from "../types/conversation";
import { Message } from "./Message";

interface ChatWindowProps {
  messages: MessageType[];
}

export function ChatWindow({ messages }: ChatWindowProps) {
  return (
    <div className="flex flex-col space-y-4 p-4">
      {messages.map((msg, index) => (
        <Message key={index} message={msg} />
      ))}
    </div>
  );
}
