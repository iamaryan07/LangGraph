from pydantic import BaseModel


class ChatRequest(BaseModel):
    thread_id: str
    message: str | None = None
    resume: dict | None = None

class ChatResponse(BaseModel):
    response: str