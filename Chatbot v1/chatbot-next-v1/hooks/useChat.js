"use client";

import { useEffect, useState } from "react";

import {
  createChat,
  deleteChat,
  getChats,
} from "@/lib/api";

import { useRouter, useParams } from "next/navigation";

export function useChats() {

  const router = useRouter();

  const params = useParams();

  const [chats, setChats] = useState([]);

  // LOAD CHATS
  const loadChats = async () => {

    try {

      const storedChats = await getChats();

      setChats(storedChats);

    } catch (error) {

      console.error(error);
    }
  };


  useEffect(() => {

    loadChats();

  }, []);

  // CREATE CHAT
  const createNewChat = async () => {

    try {

      const newChat = await createChat();

      setChats((prev) => [
        newChat,
        ...prev
      ]);

      router.push(`/chat/${newChat.id}`);

    } catch (error) {

      console.error(error);
    }
  };

  // DELETE CHAT
  const handleDeleteChat = async (
    threadId
  ) => {

    try {

      await deleteChat(threadId);

      const updatedChats = chats.filter(
        (chat) => chat.id !== threadId
      );

      setChats(updatedChats);

      // IF CURRENT CHAT DELETED
      if (params.id === threadId) {

        if (updatedChats.length > 0) {

          router.push(
            `/chat/${updatedChats[0].id}`
          );

        } else {

          router.push("/");
        }
      }

    } catch (error) {

      console.error(error);
    }
  };

  return {
    chats,
    currentChatId: params.id,
    createNewChat,
    handleDeleteChat,
  };
}