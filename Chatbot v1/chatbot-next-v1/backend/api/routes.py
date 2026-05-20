from fastapi import APIRouter
from langchain_core.messages import HumanMessage

from models.schemas import ChatRequest

from graph.builder import chatbot


router = APIRouter()


@router.post('/chat')
def chat(req: ChatRequest):
    config = {'configurable': {'thread_id': req.thread_id}}
    response = chatbot.invoke(
        {'messages': [HumanMessage(content=req.message)]}, config= config) # type: ignore

    last_message = response["messages"][-1]

    return {
        "response": last_message.content
    }
