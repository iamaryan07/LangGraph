from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import ToolNode

from graph.state import ChatState
from graph.nodes import create_chat_node, approval_node, denial_node, create_summarize_node, should_summarize, create_remember_node
from graph.tools import load_all_tools
from graph.state import MemoryDecision

from langchain.messages import AIMessage

from services.llm import get_llm

from psycopg import AsyncConnection
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
from langgraph.store.postgres.aio import AsyncPostgresStore

from dotenv import load_dotenv


import os

load_dotenv()

DB_URI = os.getenv("DATABASE_URL")


def approval_router(state):
    if state['approved']:
        return "tools"
    return "denial_node"


def chat_router(state):
    last_message = state['messages'][-1]

    if (isinstance(last_message, AIMessage)and last_message.tool_calls):
        return "approval_node"
    
    if should_summarize(state):
        return "summarize"
    
    return END


async def build_graph():

    tools = await load_all_tools()

    llm = get_llm()

    llm_with_tools = llm.bind_tools(tools, parallel_tool_calls=False,)
    
    memory_llm = llm.with_structured_output(MemoryDecision)

    checkpointer_conn = await AsyncConnection.connect(
        DB_URI,
        autocommit=True,
        prepare_threshold=0
    )

    store_conn = await AsyncConnection.connect(
        DB_URI,
        autocommit=True,
        prepare_threshold=0
    )

    checkpointer = AsyncPostgresSaver(checkpointer_conn)
    await checkpointer.setup()

    store = AsyncPostgresStore(store_conn)
    await store.setup()

    graph = StateGraph(ChatState)

    tool_node = ToolNode(tools)

    graph.add_node("chat_node", create_chat_node(llm_with_tools))
    graph.add_node("approval_node", approval_node)
    graph.add_node("tools", tool_node)
    graph.add_node("denial_node", denial_node)
    graph.add_node("summarize", create_summarize_node(llm))
    graph.add_node("remember_node", create_remember_node(memory_llm))

    graph.add_edge(START, "remember_node")
    graph.add_edge("remember_node", "chat_node")
    graph.add_conditional_edges("chat_node",
                                chat_router,
                                {
                                    "approval_node": "approval_node",
                                    "summarize": "summarize",
                                    END: END
                                }
                                )
    graph.add_conditional_edges("approval_node",
                                approval_router,
                                {
                                    "tools": "tools",
                                    "denial_node": "denial_node"
                                }
                                )
    graph.add_edge("summarize", END)
    graph.add_edge("denial_node", END)
    graph.add_edge("tools", "chat_node")

    chatbot = graph.compile(checkpointer= checkpointer, store= store)

    return chatbot