"use client";

import { useEffect, useState } from "react";
import { sendMessageToBackend } from "@/lib/api";
import { createChat, getChats, updateChat } from "@/utils/storage";

export function useChat() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  useEffect(() => {
    const storedChats = getChats();
    if (storedChats.length > 0) {
      setChats(storedChats);
      setCurrentChat(storedChats[0]);
    } else {
      const newChat = createChat();

      setChats([newChat]);
      setCurrentChat(newChat);
    }
  }, []);

  const createNewChat = () => {
    const newChat = createChat();

    setChats((prev) => [newChat, ...prev]);

    setCurrentChat(newChat);
  };

  const messages = currentChat?.messages || [];

  const sendMessage = async () => {
    if (!input.trim() || loading || !currentChat) return;

    const userInput = input;

    setInput("");
    setLoading(true);

    // USER MESSAGE
    const updatedUserMessages = [
      ...currentChat.messages,
      {
        role: "user",
        content: userInput,
      },
    ];

    const updatedUserChat = {
      ...currentChat,
      messages: updatedUserMessages,
      title:
        currentChat.title === "New Chat"
          ? userInput.slice(0, 30)
          : currentChat.title,
    };

    updateChat(updatedUserChat);

    setCurrentChat(updatedUserChat);

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === updatedUserChat.id ? updatedUserChat : chat,
      ),
    );

    try {
      const threadId = updatedUserChat.id;

      const response = await sendMessageToBackend(userInput, threadId);

      // ASSISTANT MESSAGE
      const updatedAssistantMessages = [
        ...updatedUserChat.messages,
        {
          role: "assistant",
          content: response,
        },
      ];

      const updatedAssistantChat = {
        ...updatedUserChat,
        messages: updatedAssistantMessages,
      };

      updateChat(updatedAssistantChat);

      setCurrentChat(updatedAssistantChat);

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === updatedAssistantChat.id ? updatedAssistantChat : chat,
        ),
      );
    } catch (error) {
      console.error(error);

      const failedMessages = [
        ...updatedUserChat.messages,
        {
          role: "assistant",
          content: "Backend connection failed.",
        },
      ];

      const failedChat = {
        ...updatedUserChat,
        messages: failedMessages,
      };

      updateChat(failedChat);

      setCurrentChat(failedChat);

      setChats((prev) =>
        prev.map((chat) => (chat.id === failedChat.id ? failedChat : chat)),
      );
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
    setCurrentChat,

    createNewChat,
  };
}
