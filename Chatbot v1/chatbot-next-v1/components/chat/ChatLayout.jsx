"use client";

import Sidebar from "./Sidebar";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

import { useChat } from "@/hooks/useChat";

export default function ChatLayout() {
  const {
    input,
    setInput,
    loading,
    messages,
    sendMessage,

    chats,
    currentChat,
    setCurrentChat,

    createNewChat,
  } = useChat();

  return (
    <main className="h-screen bg-black text-white flex">
      <Sidebar
        chats={chats}
        currentChat={currentChat}
        setCurrentChat={setCurrentChat}
        createNewChat={createNewChat}
      />

      <section className="flex-1 flex flex-col">
        <ChatHeader currentChat={currentChat} />

        <ChatMessages
          messages={messages}
          loading={loading}
        />

        <ChatInput
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
          loading={loading}
        />
      </section>
    </main>
  );
}