from fastapi import APIRouter
from langchain_core.messages import HumanMessage

from models.schemas import ChatRequest

from graph.builder import chatbot


router = APIRouter()


@router.post('/chat')
def chat(req: ChatRequest):
    config = {'configurable': {'thread_id': req.thread_id}}
    full_response = ""

    for message_chunk, metadata in chatbot.stream({'messages': [HumanMessage(content=req.message)]}, config= config, stream_mode="messages"):
        if message_chunk.content:
            full_response += message_chunk.content

    return {
        "response": full_response
    }
