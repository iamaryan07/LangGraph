from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import ToolNode, tools_condition

from graph.state import ChatState
from graph.nodes import create_chat_node, approval_node, denial_node
from graph.tools import load_all_tools

from services.llm import get_llm

from psycopg import AsyncConnection
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver

from dotenv import load_dotenv

import os

load_dotenv()

DB_URI = os.getenv("DATABASE_URL")


def approval_router(state):
    if state['approved']:
        return "tools"
    return "denial_node"

async def build_graph():

    tools = await load_all_tools()

    llm = get_llm()

    llm_with_tools = llm.bind_tools(tools)

    conn = await AsyncConnection.connect(
        DB_URI,
        autocommit=True,
        prepare_threshold=0
    )

    checkpointer = AsyncPostgresSaver(conn)
    await checkpointer.setup()

    graph = StateGraph(ChatState)

    tool_node = ToolNode(tools)

    graph.add_node("chat_node", create_chat_node(llm_with_tools))
    graph.add_node("approval_node", approval_node)
    graph.add_node("tools", tool_node)
    graph.add_node("denial_node", denial_node)

    graph.add_edge(START, "chat_node")
    graph.add_conditional_edges("chat_node",
                                tools_condition,
                                {
                                    "tools": "approval_node",
                                    "__end__": END
                                }
                            )
    graph.add_edge("denial_node", END)
    graph.add_conditional_edges("approval_node", approval_router)
    graph.add_edge("tools", "chat_node")

    chatbot = graph.compile(checkpointer= checkpointer)

    return chatbot