# SCOUT — White Hat: facts, data, neutral information
# Focuses on: what do we know? what data exists? what are the sources?

class ScoutMind:
    hat = "white"
    name = "SCOUT"
    role = "Facts & Data Analyst"

    def __init__(self, llm_client=None):
        self.client = llm_client

    async def analyze(self, topic: str, context: dict = None) -> dict:
        # TODO: implement in Hari 2
        raise NotImplementedError("SCOUT not yet implemented — coming Hari 2")
