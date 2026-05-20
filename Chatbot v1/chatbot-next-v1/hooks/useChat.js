"use client";

import { useState } from "react";
import { sendMessageToBackend } from "@/lib/api";

export function useChat() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [threadId] = useState(
    crypto.randomUUID()
  );

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello. I am your AI assistant.",
    },
  ]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userInput = input;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userInput,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await sendMessageToBackend(userInput, threadId);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Backend connection failed.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return {
    input,
    setInput,
    loading,
    messages,
    sendMessage,
  };
}
