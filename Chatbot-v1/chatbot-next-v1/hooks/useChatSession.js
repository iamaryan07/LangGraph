"use client";

import { useEffect, useState } from "react";

import {
  getChats,
  getChatMessages,
  sendMessageToBackend,
  updateChatTitle,
} from "@/lib/api";

import { useParams } from "next/navigation";

export function useChatSession() {
  const params = useParams();

  const threadId = params.id;

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([]);

  const [currentChat, setCurrentChat] = useState(null);

  const [pendingInterrupt, setPendingInterrupt] = useState(null);

  const loadChat = async () => {
    try {
      const chats = await getChats();

      const matchedChat = chats.find((chat) => chat.id === threadId);

      setCurrentChat(matchedChat || null);

      const data = await getChatMessages(threadId);

      setMessages(data.messages || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (threadId) {
      loadChat();
    }
  }, [threadId]);

  const handleApproval = async (approved) => {
    if (!pendingInterrupt) return;

    setLoading(true);

    try {
      const data = await sendMessageToBackend(null, threadId, { approved });

      setPendingInterrupt(null);

      if (data.response) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.response,
          },
        ]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userInput = input;

    setInput("");

    setLoading(true);

    // OPTIMISTIC USER MESSAGE
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userInput,
      },
    ]);

    try {
      const data = await sendMessageToBackend(userInput, threadId);

      // INTERRUPT
      if (data.type === "interrupt") {
        setPendingInterrupt(data.interrupt);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.response,
          },
        ]);
      }

      // UPDATE TITLE
      if (currentChat?.title === "New Chat") {
        const newTitle = userInput.slice(0, 30);

        await updateChatTitle(threadId, newTitle);

        setCurrentChat((prev) => ({
          ...prev,
          title: newTitle,
        }));
      }
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

    currentChat,

    handleApproval,
    pendingInterrupt
  };
}
