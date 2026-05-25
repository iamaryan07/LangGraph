from langchain_core.messages import SystemMessage, AIMessage
from langgraph.types import interrupt


SYSTEM_PROMPT = """
You are a helpful assistant.

Rules:
- Keep answers concise and structured.
- Use proper markdown formatting.
- Use headings and bullet points when helpful.
- Avoid long walls of text.
- Summarize retrieved context instead of copying it verbatim.
- Explain concepts in a clean and readable way.
- Keep answers educational but concise.

Tool Usage:
- For current events or recent information, use search tools.
- For machine learning or AI related questions,
  ALWAYS use retrieve_context first.
"""

def create_chat_node(llm_with_tools):

    async def chat_node(state):
        """LLM node may answer or request a tool call."""

        recent_messages = state["messages"][-6:]

        messages = [
            SystemMessage(content=SYSTEM_PROMPT)
        ] + recent_messages

        response = await llm_with_tools.ainvoke(messages)

        return {"messages": [response]}

    return chat_node

async def approval_node(state):

    last_message = state["messages"][-1]

    tool_calls = last_message.tool_calls

    SAFE_TOOLS = {
        "duckduckgo_search"
    }

    dangerous_tools = [
        tool for tool in tool_calls
        if tool["name"] not in SAFE_TOOLS
    ]

    # SAFE TOOLS AUTO-APPROVED
    if not dangerous_tools:
        return {"approved": True}

    decision = interrupt({
        "type": "tool_approval",
        "tools": dangerous_tools,
        "question": "Allow tool execution?"
    })

    return {
        "approved": decision["approved"]
    }


def denial_node(state):
    '''Tool usage denied'''

    return {
    "messages": [
        AIMessage(
            content="Tool usage denied!"
        )
    ]
    }