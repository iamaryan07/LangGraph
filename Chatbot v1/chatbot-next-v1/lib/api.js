const API_URL = "http://127.0.0.1:8000";

export async function sendMessageToBackend(message, threadId) {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      thread_id: threadId,
    }),
  });

  const data = await res.json();

  return data.response;
}
