"use client";

import { useEffect, useRef } from "react";

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