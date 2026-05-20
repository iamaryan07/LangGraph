"use client";

import { SendHorizonal } from "lucide-react";

export default function ChatInput({ input, setInput, sendMessage, loading }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="p-4 md:p-6 border-t border-zinc-800 bg-black">
      <div className="max-w-4xl mx-auto flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-3xl px-5 py-3 shadow-2xl">
        <input
          type="text"
          placeholder="Ask anything..."
          className="flex-1 bg-transparent outline-none text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-white text-black p-3 rounded-2xl"
        >
          <SendHorizonal size={18} />
        </button>
      </div>
    </div>
  );
}
