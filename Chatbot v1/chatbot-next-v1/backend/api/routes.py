from fastapi import APIRouter
from langchain_core.messages import HumanMessage

from models.schemas import ChatRequest

from graph.builder import chatbot

from supabase import create_client

import os

import uuid

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)

router = APIRouter()


@router.post('/chat')
def chat(req: ChatRequest):
    config = {
        'configurable': {
            'thread_id': req.thread_id
        },
        "metadata": {
            "thread_id": req.thread_id
        },
        "run_name": "chat-turn"
    }
    
    response = chatbot.invoke(
        {'messages': [HumanMessage(content=req.message)]}, config= config) # type: ignore

    last_message = response["messages"][-1]

    return {
        "response": last_message.content
    }


@router.post('/chat/new')
def create_chat():
    thread_id = str(uuid.uuid4())

    chat = {
        "id": thread_id,
        "title": "New Chat"
        }
    
    supabase.table('chats').insert(chat).execute()

    return chat


@router.get("/chats")
def get_chats():
    response = (
        supabase
          .table("chats")
          .select("*")
          .order("created_at", desc= True)
          .execute()
    )

    return response.data


@router.get("/chats/{thread_id}")
def get_chat(thread_id: str):
    config = {
        "configurable": {
            "thread_id": thread_id
        },
        "metadata": {
            "thread_id": thread_id
        },
        "run_name": "chat-turn"
    }

    state = chatbot.get_state(config= config)

    messages = []

    if state.values:
        messages = state.values.get("messages", [])

    role_map = {
        "human": "user",
        "ai": "assistant"
    }

    return {
        "messages": [
            {
                "role": role_map.get(message.type, message.type),
                "content": message.content
            }
            for message in messages
        ]
    }