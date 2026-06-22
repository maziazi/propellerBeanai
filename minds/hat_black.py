# SHADOW — Black Hat: risks, caution, critical judgment
# Focuses on: what could go wrong? what are the dangers?

class ShadowMind:
    hat = "black"
    name = "SHADOW"
    role = "Risk & Critical Analyst"

    def __init__(self, llm_client=None):
        self.client = llm_client

    async def analyze(self, topic: str, context: dict = None) -> dict:
        raise NotImplementedError("SHADOW not yet implemented")
