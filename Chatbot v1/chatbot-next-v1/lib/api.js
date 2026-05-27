import { supabase } from "@/lib/supabase";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// AUTH HEADERS
export async function getAuthHeaders() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("[AUTH] Session error:", error);
  }

  // LOGGED OUT
  if (!session?.access_token) {
    return {
      "Content-Type": "application/json",
    };
  }

  return {
    "Content-Type": "application/json",

    Authorization: `Bearer ${session.access_token}`,
  };
}

// SHARED RESPONSE HANDLER
async function handleResponse(res) {
  if (!res.ok) {
    let errorMessage = `Request failed: ${res.status}`;

    try {
      const errorData = await res.json();

      errorMessage = errorData.detail || errorMessage;
    } catch {
      const text = await res.text();

      console.error("[API] Non-JSON error:", text);
    }

    throw new Error(errorMessage);
  }

  return res.json();
}

// SEND MESSAGE
export async function sendMessageToBackend(message, threadId, resume = null) {
  const body = resume
    ? {
        thread_id: threadId,
        resume,
      }
    : {
        message,
        thread_id: threadId,
      };

  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",

      headers: await getAuthHeaders(),

      body: JSON.stringify(body),
    });

    return await handleResponse(res);
  } catch (err) {
    console.error("[CHAT] sendMessage error:", err);

    throw err;
  }
}

// CREATE CHAT
export async function createChat() {
  try {
    const res = await fetch(`${API_BASE}/chat/new`, {
      method: "POST",

      headers: await getAuthHeaders(),
    });

    return await handleResponse(res);
  } catch (err) {
    console.error("[CHAT] createChat error:", err);

    throw err;
  }
}

// GET CHATS
export async function getChats() {
  try {
    const res = await fetch(`${API_BASE}/chats`, {
      headers: await getAuthHeaders(),
    });

    return await handleResponse(res);
  } catch (err) {
    console.error("[CHAT] getChats error:", err);

    throw err;
  }
}

// GET SINGLE CHAT
export async function getChatMessages(threadId) {
  try {
    const res = await fetch(`${API_BASE}/chats/${threadId}`, {
      headers: await getAuthHeaders(),
    });

    return await handleResponse(res);
  } catch (err) {
    console.error("[CHAT] getChatMessages error:", err);

    throw err;
  }
}

// UPDATE TITLE
export async function updateChatTitle(threadId, title) {
  try {
    const res = await fetch(`${API_BASE}/chats/${threadId}/title`, {
      method: "PATCH",

      headers: await getAuthHeaders(),

      body: JSON.stringify({
        title,
      }),
    });

    return await handleResponse(res);
  } catch (err) {
    console.error("[CHAT] updateTitle error:", err);

    throw err;
  }
}

// DELETE CHAT
export async function deleteChat(threadId) {
  try {
    const res = await fetch(`${API_BASE}/chats/${threadId}`, {
      method: "DELETE",

      headers: await getAuthHeaders(),
    });

    return await handleResponse(res);
  } catch (err) {
    console.error("[CHAT] deleteChat error:", err);

    throw err;
  }
}
