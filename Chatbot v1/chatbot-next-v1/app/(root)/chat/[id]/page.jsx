"use client";

import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";

import { useChatSession } from "@/hooks/useChatSession";

export default function ChatPage() {
  const {
    input,
    setInput,

    loading,

    messages,
    sendMessage,

    currentChat,

    handleApproval,
    pendingInterrupt,
  } = useChatSession();

  return (
    <>
      <ChatHeader
        currentChat={currentChat}
      />

      <ChatMessages
        messages={messages}
        loading={loading}
      />

      <ChatInput
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        loading={loading}
        interrupt={pendingInterrupt}
        approval={handleApproval}
      />
    </>
  );
}