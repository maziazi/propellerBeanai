import os
from google import genai

_api_key = os.getenv("GEMINI_API_KEY")
if not _api_key:
    raise EnvironmentError("GEMINI_API_KEY is not set")

gemini = genai.Client(api_key=_api_key)

GEMINI_MODEL = "gemini-2.5-flash-lite"
