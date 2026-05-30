from typing import Annotated, TypedDict, List

from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages

from pydantic import BaseModel, Field


class ChatState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]
    approved: bool
    summary: str

class MemoryItem(BaseModel):
    is_new: bool = Field(description="True if new, false if duplicate")
    text: str = Field(description="Atomic user memory")

class MemoryDecision(BaseModel):
    should_write: bool
    memories: List[MemoryItem] = Field(default_factory=list)