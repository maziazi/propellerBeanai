import os
from groq import AsyncGroq

_api_key = os.getenv("GROQ_API_KEY")
if not _api_key:
    import warnings
    warnings.warn("GROQ_API_KEY not set — Groq features will be unavailable", stacklevel=2)
    groq = None
else:
    groq = AsyncGroq(api_key=_api_key)

GROQ_LARGE = "llama-3.3-70b-versatile"
GROQ_FAST  = "llama-3.1-8b-instant"
