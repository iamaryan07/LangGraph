"use client";

import { SendHorizonal } from "lucide-react";

export default function ChatInput({
  input,
  setInput,
  sendMessage,
  loading,
  interrupt,
  approval,
}) {

  const handleKeyDown = (e) => {

    if (interrupt) return;

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="p-4 md:p-6 border-t border-zinc-800 bg-black">

      {/* INTERRUPT UI */}
      {interrupt && (
        <div className="max-w-4xl mx-auto mb-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-4">

          <p className="text-sm text-zinc-300 mb-4">
            {interrupt.question}
          </p>

          {/* OPTIONAL TOOL DISPLAY */}
          {interrupt.tools && (
            <div className="mb-4 space-y-2">
              {interrupt.tools.map((tool, index) => (
                <div
                  key={index}
                  className="text-xs bg-zinc-800 rounded-lg p-3"
                >
                  <p className="font-semibold text-white">
                    {tool.name}
                  </p>

                  <pre className="text-zinc-400 mt-2 overflow-auto">
                    {JSON.stringify(tool.args, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">

            <button
              onClick={() => approval(true)}
              disabled={loading}
              className="bg-white text-black px-4 py-2 rounded-xl"
            >
              Approve
            </button>

            <button
              onClick={() => approval(false)}
              disabled={loading}
              className="bg-zinc-800 text-white px-4 py-2 rounded-xl border border-zinc-700"
            >
              Deny
            </button>

          </div>
        </div>
      )}

      {/* NORMAL INPUT */}
      <div className="max-w-5xl mx-auto flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-3xl px-6 py-4 shadow-2xl">

        <textarea
          rows={1}
          placeholder={
            interrupt
              ? "Resolve pending tool approval..."
              : "Ask anything..."
          }
          className="
  flex-1
  bg-transparent
  outline-none
  text-white
  placeholder:text-zinc-500
  resize-none
"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading || interrupt}
        />

        <button
          onClick={sendMessage}
          disabled={loading || interrupt}
          className="
            bg-white
            text-black
            p-3
            rounded-2xl
            transition
            hover:bg-zinc-200
            disabled:opacity-50
          "
        >
          <SendHorizonal size={18} />
        </button>

      </div>
    </div>
  );
}