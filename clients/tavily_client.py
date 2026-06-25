import os
from tavily import TavilyClient

_api_key = os.getenv("TAVILY_API_KEY")
if not _api_key:
    raise EnvironmentError("TAVILY_API_KEY is not set")

tavily = TavilyClient(api_key=_api_key)
