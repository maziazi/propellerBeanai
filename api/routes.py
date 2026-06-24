from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class AnalyzeRequest(BaseModel):
    topic: str
    type: str = "quick"

@router.post("/analyze")
async def analyze(body: AnalyzeRequest):
    # TODO: wire up MindRunner — returning dummy response for now
    return {
        "id": "demo-001",
        "topic": body.topic,
        "type": body.type,
        "status": "done",
        "confidence": 74,
    }

@router.get("/health")
async def health():
    return {"status": "ok"}
