"use client";

import Sidebar from "./Sidebar";

export default function ChatLayout({
  children,
  chats,
  currentChat,
  createNewChat,
  handleDeleteChat,
}) {

  return (
    <main className="h-screen bg-black text-white flex overflow-hidden">

      <Sidebar
        chats={chats}
        currentChat={currentChat}
        createNewChat={createNewChat}
        handleDeleteChat={handleDeleteChat}
      />

      <section className="flex-1 flex flex-col">
        {children}
      </section>

    </main>
  );
}