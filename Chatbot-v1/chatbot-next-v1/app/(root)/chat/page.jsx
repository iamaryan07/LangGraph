"use client";

import { useEffect } from "react";

import { useChats } from "@/hooks/useChat";

export default function ChatHomePage() {
  const {
    chats,
    createNewChat,
  } = useChats();

  useEffect(() => {
    if (chats.length > 0) {

      window.location.href =
        `/chat/${chats[0].id}`;

      return;
    }

    createNewChat();
  }, [chats])
}