from langchain_core.messages import SystemMessage


SYSTEM_PROMPT = """
You are a helpful assistant.

Rules:
- For current events, sports results, weather, stock prices, or recent information,
  ALWAYS use a search tool first.
- Never guess recent information.
- After receiving tool results, answer directly.
"""

def create_chat_node(llm_with_tools):

    async def chat_node(state):
        """LLM node may answer or request a tool call."""
        messages = [
            SystemMessage(content=SYSTEM_PROMPT)
        ] + state["messages"]

        response = await llm_with_tools.ainvoke(messages)

        return {"messages": [response]}
    
    return chat_node