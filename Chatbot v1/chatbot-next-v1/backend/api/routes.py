from fastapi import APIRouter, Body, Request
from langchain_core.messages import HumanMessage
from langgraph.types import Command

from models.schemas import ChatRequest

from services.auth import verify_token

from supabase import create_client

from fastapi import Depends, Header, HTTPException

import os

import uuid

from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
# SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)

router = APIRouter()


@router.post('/chat')
async def chat(req: ChatRequest, request: Request, user = Depends(verify_token)):

    user_id = user["sub"]

    chat = (
        supabase
        .table("chats")
        .select("*")
        .eq("id", req.thread_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    if not chat.data:
        raise HTTPException(
            status_code=404,
            detail="Chat not found"
        )

    chatbot = request.app.state.chatbot

    config = {
        'configurable': {
            'thread_id': req.thread_id
        },
        "metadata": {
            "thread_id": req.thread_id
        },
        "run_name": "chat-turn"
    }

    if req.resume:
        response = await chatbot.ainvoke(
            Command(
                resume=req.resume
            ),
            config=config
        )

    else:
        response = await chatbot.ainvoke(
            {'messages': [HumanMessage(content=req.message)]}, config= config) # type: ignore

    if "__interrupt__" in response:

        interrupt_data = response["__interrupt__"][0].value

        return {
            "type": "interrupt",
            "interrupt": interrupt_data
        }

    last_message = response["messages"][-1]

    content = (
        last_message.content
        if isinstance(last_message.content, str)
        else "".join(
            item.get("text", "")
            for item in last_message.content
            if isinstance(item, dict)
        )
    )

    return {
        "type": "message",
        "response": content
    }


@router.post('/chat/new')
async def create_chat(user = Depends(verify_token)):
    thread_id = str(uuid.uuid4())

    chat = {
        "id": thread_id,
        "title": "New Chat",
        "user_id": user["sub"]
        }
    
    supabase.table('chats').insert(chat).execute()

    return chat


@router.get("/chats")
async def get_chats(user = Depends(verify_token)):

    user_id = user["sub"]

    response = (
        supabase
          .table("chats")
          .select("*")
          .eq("user_id", user_id)
          .order("created_at", desc= True)
          .execute()
    )

    return response.data


@router.get("/chats/{thread_id}")
async def get_chat(thread_id: str, request: Request, user = Depends(verify_token)):

    user_id = user["sub"]

    chatbot = request.app.state.chatbot

    config = {
        "configurable": {
            "thread_id": thread_id
        },
        "metadata": {
            "thread_id": thread_id
        },
        "run_name": "chat-turn"
    }

    chat = (
        supabase
          .table('chats')
          .select('*')
          .eq('id', thread_id)
          .eq('user_id', user_id)
          .maybe_single()
          .execute()
    )

    if not chat.data:
        raise HTTPException(
            status_code=404,
            detail="Chat not found"
        )

    state = await chatbot.aget_state(config= config)

    messages = []

    if state.values:
        messages = state.values.get("messages", [])

    role_map = {
        "human": "user",
        "ai": "assistant"
    }

    filtered_messages = []

    for message in messages:

        # SKIP TOOL OUTPUTS
        if message.type == "tool":
            continue

        # SKIP AI TOOL CALL MESSAGES
        if (
            message.type == "ai"
            and getattr(message, "tool_calls", None)
        ):
            continue

        filtered_messages.append(message)

    return {
        "messages": [
            {
                "role": role_map.get(message.type, message.type),

                "content": (
                    message.content
                    if isinstance(message.content, str)
                    else "".join(
                        item.get("text", "")
                        for item in message.content
                        if isinstance(item, dict)
                    )
                )
            }
            for message in filtered_messages
        ]
    }


@router.patch("/chats/{thread_id}/title")
async def update_chat_title(thread_id: str, data: dict = Body(...), user= Depends(verify_token)):
    
    response = (
        supabase
        .table("chats")
        .update({
            "title": data["title"]
        })
        .eq("id", thread_id)
        .eq("user_id", user["sub"])
        .execute()
    )

    return response.data


@router.delete("/chats/{thread_id}")
async def delete_chat(
    thread_id: str,
    user = Depends(verify_token)
):

    response = (
        supabase
        .table("chats")
        .delete()
        .eq("id", thread_id)
        .eq("user_id", user["sub"])
        .execute()
    )

    return {
        "success": True
    }