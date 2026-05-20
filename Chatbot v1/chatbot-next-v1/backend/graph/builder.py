from langgraph.graph import StateGraph, START, END

from graph.state import ChatState
from graph.nodes import chatbot_node
from langgraph.checkpoint.memory import MemorySaver

checkpointer = MemorySaver()
graph = StateGraph(ChatState)

graph.add_node("chatbot_node", chatbot_node)

graph.add_edge(START, "chatbot_node")
graph.add_edge("chatbot_node", END)

chatbot = graph.compile(checkpointer= checkpointer)