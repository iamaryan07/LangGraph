const API_BASE = "http://localhost:8000";

export async function sendMessageToBackend(
  message,
  threadId
) {
  const res = await fetch(
    `${API_BASE}/chat`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        message,
        thread_id: threadId,
      }),
    }
  );

  if (!res.ok) {
    throw new Error(
      "Failed to send message"
    );
  }

  const data = await res.json();

  return data.response;
}

export async function createChat() {
  const res = await fetch(
    `${API_BASE}/chat/new`,
    {
      method: "POST",
    }
  );

  return res.json();
}

export async function getChats() {
  const res = await fetch(
    `${API_BASE}/chats`
  );

  return res.json();
}

export async function getChatMessages(
  threadId
) {
  const res = await fetch(
    `${API_BASE}/chats/${threadId}`
  );

  return res.json();
}