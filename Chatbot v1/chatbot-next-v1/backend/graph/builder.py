from langgraph.graph import StateGraph, START, END

from graph.state import ChatState
from graph.nodes import chatbot_node
from langgraph.checkpoint.postgres import PostgresSaver

from psycopg import Connection
from dotenv import load_dotenv
import os

load_dotenv()

DB_URI = os.getenv("DATABASE_URL")

conn = Connection.connect(
    DB_URI,
    autocommit=True,
    prepare_threshold=0
)

checkpointer = PostgresSaver(conn)
checkpointer.setup()

graph = StateGraph(ChatState)

graph.add_node("chatbot_node", chatbot_node)

graph.add_edge(START, "chatbot_node")
graph.add_edge("chatbot_node", END)

chatbot = graph.compile(checkpointer= checkpointer)