from fastapi import APIRouter

router = APIRouter()

@router.post("/analyze")
async def analyze(topic: str):
    # TODO: wire up MindRunner
    raise NotImplementedError("API not yet implemented")

@router.get("/health")
async def health():
    return {"status": "ok"}
