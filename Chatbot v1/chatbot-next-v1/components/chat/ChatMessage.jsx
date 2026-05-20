import { Bot, User } from "lucide-react";

export default function ChatMessage({
  role,
  content,
}) {
  return (
    <div
      className={`flex items-start gap-4 ${
        role === "user"
          ? "justify-end"
          : "justify-start"
      }`}
    >
      {role === "assistant" && (
        <div className="bg-zinc-800 p-3 rounded-2xl">
          <Bot size={20} />
        </div>
      )}

      <div
        className={`max-w-2xl px-5 py-4 rounded-3xl text-sm leading-7 shadow-lg ${
          role === "user"
            ? "bg-white text-black rounded-br-md"
            : "bg-zinc-900 text-zinc-100 rounded-bl-md border border-zinc-800"
        }`}
      >
        {content}
      </div>

      {role === "user" && (
        <div className="bg-white text-black p-3 rounded-2xl">
          <User size={20} />
        </div>
      )}
    </div>
  );
}