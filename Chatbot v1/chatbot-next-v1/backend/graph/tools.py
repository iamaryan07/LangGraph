from langchain_community.tools import DuckDuckGoSearchRun
from langchain_core.tools import tool
from langchain_mcp_adapters.client import MultiServerMCPClient
import os


search = DuckDuckGoSearchRun(region= "us-en")

@tool
def duckduckgo_search(query: str) -> str:
    """Search the web for current information."""
    return search.run(query)

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
        *mcp_tools
    ]