from langchain_community.tools import DuckDuckGoSearchResults
from langchain_core.tools import tool
from langchain_mcp_adapters.client import MultiServerMCPClient
from rag.retriever import retriever
from langchain_core.tools import StructuredTool
import os


search = DuckDuckGoSearchResults(region= "us-en")

@tool
def duckduckgo_search(query: str) -> str:
    """Search the web for current information."""
    return search.run(query)


@tool
def retrieve_context(query: str) -> str:
    """
    Search the ML textbook knowledge base.

    Input should be a natural language question.

    Examples:
    - "Explain overfitting"
    - "What is Random Forest?"
    - "Difference between Random Forest and XGBoost"
    """

    print("\n--- RAG TOOL CALLED ---")
    print("Query:", query)

    docs = retriever.invoke(query)

    print(f"Retrieved {len(docs)} docs")

    context = "\n\n".join(
        doc.page_content for doc in docs
    )

    context = context[:800]
    return context


async def load_all_tools():
    client = MultiServerMCPClient(
    {
        "expenses": {
            "url": "https://expense-tracker-mcp.up.railway.app/mcp",
                #   "https://money-track-mcp.fastmcp.app/mcp" -> FastMCP
            "transport": "streamable_http",
            # "headers": {
            #     "Authorization": f"Bearer {os.getenv('FASTMCP_TOKEN')}" -> FastMCP
            # }
        }
    }
    )

    mcp_tools  = await client.get_tools()

    return [
        duckduckgo_search,
        retrieve_context,
        *mcp_tools
    ]