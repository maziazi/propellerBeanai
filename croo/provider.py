# CROO Provider — listens for incoming orders via WebSocket and routes to engine

class CrooProvider:
    def __init__(self, ws_url: str, sdk_key: str):
        self.ws_url = ws_url
        self.sdk_key = sdk_key

    async def listen(self):
        raise NotImplementedError("CrooProvider not yet implemented")
