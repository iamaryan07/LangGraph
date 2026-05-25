from langchain_core.messages import SystemMessage


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
        messages = [
            SystemMessage(content=SYSTEM_PROMPT)
        ] + state["messages"]

        response = await llm_with_tools.ainvoke(messages)

        return {"messages": [response]}
    
    return chat_node