"use client";

import { useEffect, useState } from "react";

import {
  sendMessageToBackend,
  createChat,
  getChats,
  getChatMessages,
} from "@/lib/api";

export function useChat() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([]);

  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const [pendingInterrupt, setPendingInterrupt] = useState(null);

  // LOAD ALL CHATS
  useEffect(() => {
    const loadChats = async () => {
      try {
        const storedChats = await getChats();

        setChats(storedChats);

        if (storedChats.length > 0) {
          await loadChat(storedChats[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadChats();
  }, []);

  // LOAD SINGLE CHAT
  const loadChat = async (chat) => {
    try {
      setCurrentChat(chat);

      const data = await getChatMessages(chat.id);

      setMessages(data.messages || []);
    } catch (error) {
      console.error(error);

      setMessages([]);
    }
  };

  // CREATE NEW CHAT
  const createNewChat = async () => {
    try {
      const newChat = await createChat();

      setChats((prev) => [newChat, ...prev]);

      setCurrentChat(newChat);

      setMessages([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApproval = async (approved) => {
    if (!pendingInterrupt) return;

    setLoading(true);

    try {
      const data = await sendMessageToBackend(null, currentChat.id, { approved });

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

  // SEND MESSAGE
  const sendMessage = async () => {
    if (!input.trim() || loading || !currentChat) return;

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
      const data = await sendMessageToBackend(userInput, currentChat.id);

      // ASSISTANT MESSAGE
      if (data.type == "interrupt") {
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

      // UPDATE TITLE LOCALLY
      if (currentChat.title === "New Chat") {
        const updatedChat = {
          ...currentChat,
          title: userInput.slice(0, 30),
        };

        setCurrentChat(updatedChat);

        setChats((prev) =>
          prev.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat)),
        );
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

    chats,
    currentChat,

    loadChat,

    createNewChat,

    handleApproval,
    pendingInterrupt
  };
}
