# SourceVerifier — Cross-checks claims from all minds against real sources
# Uses Tavily search to ground facts before final report

class SourceVerifier:
    name = "VERIFIER"
    role = "Source & Fact Checker"

    def __init__(self, tavily_client=None):
        self.client = tavily_client

    async def verify(self, claims: list[str]) -> dict:
        raise NotImplementedError("SourceVerifier not yet implemented")
