# BLOOM — Yellow Hat: optimism, benefits, best-case scenarios
# Focuses on: what are the upsides? what value does this create?

class BloomMind:
    hat = "yellow"
    name = "BLOOM"
    role = "Optimistic & Benefits Analyst"

    def __init__(self, llm_client=None):
        self.client = llm_client

    async def analyze(self, topic: str, context: dict = None) -> dict:
        raise NotImplementedError("BLOOM not yet implemented")
