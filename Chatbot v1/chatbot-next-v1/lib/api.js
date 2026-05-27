import { supabase } from "@/lib/supabase";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function getAuthHeaders() {

  const { data: { session }, error } =
    await supabase.auth.getSession();

  if (error) {
    console.error("[AUTH] Session error:", error);
  }

  if (!session?.access_token) {
    console.error("[AUTH] No access token found");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session?.access_token}`,
  };
}

export async function sendMessageToBackend(
  message,
  threadId,
  resume = null
) {

  const body = resume
    ? {
        thread_id: threadId,
        resume,
      }
    : {
        message,
        thread_id: threadId,
      };

  const headers = await getAuthHeaders();

  try {

    const res = await fetch(
      `${API_BASE}/chat`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {

      const errorText = await res.text();

      console.error(
        "[CHAT] Backend error response:",
        errorText
      );

      throw new Error(
        `Failed to send message: ${res.status}`
      );
    }

    const data = await res.json();

    return data;

  } catch (err) {

    console.error("[CHAT] Fetch error:", err);

    throw err;
  }
}

export async function createChat() {

  const headers = await getAuthHeaders();

  try {

    const res = await fetch(
      `${API_BASE}/chat/new`,
      {
        method: "POST",
        headers,
      }
    );

    const data = await res.json();

    return data;

  } catch (err) {

    console.error(
      "[CHAT] createChat error:",
      err
    );

    throw err;
  }
}

export async function getChats() {

  const headers = await getAuthHeaders();

  try {

    const res = await fetch(
      `${API_BASE}/chats`,
      {
        headers,
      }
    );

    const data = await res.json();

    return data;

  } catch (err) {

    console.error(
      "[CHAT] getChats error:",
      err
    );

    throw err;
  }
}

export async function getChatMessages(
  threadId
) {
  const headers = await getAuthHeaders();

  try {

    const res = await fetch(
      `${API_BASE}/chats/${threadId}`,
      {
        headers,
      }
    );

    const data = await res.json();

    return data;

  } catch (err) {

    console.error(
      "[CHAT] getChatMessages error:",
      err
    );

    throw err;
  }
}