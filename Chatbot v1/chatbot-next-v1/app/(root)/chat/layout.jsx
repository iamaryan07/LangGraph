"use client";

import ChatLayout from "@/components/chat/ChatLayout";

import { useChats } from "@/hooks/useChat";

export default function ChatRootLayout({ children }) {
    const {
        chats,
        currentChatId,
        createNewChat,
        handleDeleteChat,
    } = useChats();

    return (
        <ChatLayout
        chats={chats}
        currentChat={currentChatId}
        createNewChat={createNewChat}
        handleDeleteChat={handleDeleteChat}
        >
        {children}
        </ChatLayout>
    );
}
