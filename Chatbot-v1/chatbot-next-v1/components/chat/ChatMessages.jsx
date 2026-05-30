"use client";

import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";

import ChatMessage from "./ChatMessage";
import TypingLoader from "./TypingLoader";

export default function ChatMessages({
  messages,
  loading,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const isEmpty =
    messages.length === 0 && !loading;

  if (isEmpty) {
    return (
      <div className="flex-1 flex items-center justify-center px-8">

        <div className="max-w-3xl text-center">

          <div className="flex justify-center mb-6">

            <div className="bg-white text-black p-4 rounded-3xl">
              <Sparkles size={28} />
            </div>

          </div>

          <h1 className="text-4xl md:text-5xl font-bold">
            AI Assistant
          </h1>

          <p className="mt-4 text-zinc-400 text-lg">
            Powered by LangGraph, Groq, FastAPI and MCP tools.
          </p>

          <div className="mt-12 grid gap-4 md:grid-cols-2">

          <SuggestionCard
            text="Explain RAG in simple terms"
          />

          <SuggestionCard
            text="How do transformers work?"
          />

          <SuggestionCard
            text="Today's latest sports news"
          />

          <SuggestionCard
            text="Track my expenses for this month"
          />

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-10 py-8 space-y-6">

      {messages.map((msg, index) => (
        <ChatMessage
          key={index}
          role={msg.role}
          content={msg.content}
        />
      ))}

      {loading && <TypingLoader />}

      <div ref={bottomRef} />

    </div>
  );
}

function SuggestionCard({ text }) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900/50
        p-5
        text-left
        text-sm
        text-zinc-300
      "
    >
      {text}
    </div>
  );
}