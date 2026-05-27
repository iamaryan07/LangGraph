from langchain_core.messages import SystemMessage, AIMessage, HumanMessage, RemoveMessage
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

def create_summarize_node(llm):

    async def summarize_node(state):

        summary = state.get("summary", "")

        if summary:
            prompt = (
                f"Existing summary:\n{summary}\n\n"
                "Extend the summary using the new conversation above."
            )
        else:
            prompt = "Summarize the conversation above."

        messages = state["messages"] + [
            HumanMessage(content=prompt)
        ]

        response = await llm.ainvoke(messages)

        # Keep latest 4 messages
        messages_to_delete = state["messages"][:-4]

        return {
            "summary": response.content,
            "messages": [
                RemoveMessage(id=m.id)
                for m in messages_to_delete
            ]
        }

    return summarize_node

def should_summarize(state):
    return len(state["messages"]) > 4


def create_chat_node(llm_with_tools):

    async def chat_node(state):
        """LLM node may answer or request a tool call."""

        messages = []

        if state.get('summary'):
            messages.append(
                SystemMessage(
                    content=(
                        f"Conversation summary:\n"
                        f"{state['summary']}"
                    )
                )
            )

        messages.extend(state['messages'])

        messages = [
            SystemMessage(content=SYSTEM_PROMPT)
        ] + messages

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