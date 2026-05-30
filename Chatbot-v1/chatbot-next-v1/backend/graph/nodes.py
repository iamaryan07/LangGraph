from langchain_core.messages import SystemMessage, AIMessage, HumanMessage, RemoveMessage
from langgraph.types import interrupt
from langgraph.store.base import BaseStore
from langchain_core.runnables import RunnableConfig
from graph.state import MemoryDecision
import uuid
from graph.prompts import SYSTEM_PROMPT, MEMORY_PROMPT, SYSTEM_PROMPT_TEMPLATE


def create_chat_node(llm_with_tools):

    async def chat_node(state, config: RunnableConfig, *, store: BaseStore):
        """LLM node may answer or request a tool call."""

        user_id = config["configurable"]["user_id"]
        namespace = ("user", user_id, "details")

        items = await store.asearch(namespace)
        user_details = "\n".join(item.value.get("data", "")
                                 for item in items) if items else ""

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
            SystemMessage(content=SYSTEM_PROMPT_TEMPLATE.format(
                user_details_content=user_details or "(empty)"))
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


def create_remember_node(memory_extractor):

    async def remember_node(state, config: RunnableConfig, *, store: BaseStore):

        user_id = config['configurable']['user_id']
        namespace = ('user', user_id, 'details')

        items = await store.asearch(namespace)
        existing = "\n".join(it.value.get("data", "")
                             for it in items) if items else "(empty)"

        last_human = next(
            (
                msg
                for msg in reversed(state["messages"])
                if isinstance(msg, HumanMessage)
            ),
            None
        )

        if not last_human:
            return {}

        last_text = last_human.content

        decision: MemoryDecision = await memory_extractor.ainvoke(
            [
                SystemMessage(content=MEMORY_PROMPT.format(
                    user_details_content=existing)),
                HumanMessage(content=last_text),
            ]
        )

        if decision.should_write:
            for memory in decision.memories:
                if memory.is_new and memory.text.strip():
                    await store.aput(namespace, str(uuid.uuid4()), {'data': memory.text.strip()})

        return {}

    return remember_node
