from fastapi import APIRouter
from models.request import ClarifyRequest
from engine.intake import clarify

router = APIRouter(tags=["utility"])


@router.get("/health")
async def health():
    return {"status": "ok", "version": "1.0.0", "service": "BeanAI"}


@router.get("/schema")
async def schema():
    return {
        "name": "BeanAI",
        "description": "6 Thinking Hats decision analysis engine",
        "version": "1.0.0",
        "hats": ["white", "red", "black", "yellow", "green", "blue"],
        "services": ["quick-scan", "full-prism"],
        "endpoints": {
            "clarify":     "POST /api/clarify",
            "analyze":     "POST /api/analyze",
            "status":      "GET  /api/status/{job_id}",
            "report":      "GET  /api/report/{job_id}",
            "graph":       "GET  /api/graph/{job_id}",
            "discuss":     "POST /api/discuss/{job_id}",
            "single_mind": "POST /api/mind/{hat}",
            "health":      "GET  /api/health",
            "schema":      "GET  /api/schema",
        },
    }


@router.post("/clarify")
async def clarify_topic(body: ClarifyRequest):
    """
    Cek apakah topik cukup spesifik untuk dianalisis.
    Jika vague, kembalikan pertanyaan klarifikasi ke user.
    Panggil ini sebelum /api/analyze.
    """
    return await clarify(body.topic)
