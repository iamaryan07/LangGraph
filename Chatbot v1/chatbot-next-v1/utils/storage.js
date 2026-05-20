export function getChats() {
  const chats = sessionStorage.getItem("chats");
  return chats ? JSON.parse(chats) : [];
}

export function saveChats(chats) {
  sessionStorage.setItem("chats", JSON.stringify(chats));
}

export function createChat() {
  const chats = getChats();

  const newChat = {
    id: crypto.randomUUID(),
    title: "New Chat",
    createdAt: Date.now(),
    messages: [
      {
        role: "assistant",
        content: "Hello. I am your AI assistant.",
      },
    ],
  };

  chats.unshift(newChat);

  saveChats(chats);

  return newChat;
}

export function updateChat(updatedChat) {
  const chats = getChats().map((chat) =>
    chat.id === updatedChat.id ? updatedChat : chat,
  );

  saveChats(chats);
}
