from fastapi import APIRouter, HTTPException
from minds import hat_white, hat_red, hat_black, hat_yellow, hat_green
from models.request import SingleMindRequest

router = APIRouter(tags=["minds"])

_MINDS = {
    "white":  hat_white.analyze,
    "red":    hat_red.analyze,
    "black":  hat_black.analyze,
    "yellow": hat_yellow.analyze,
    "green":  hat_green.analyze,
}


@router.post("/mind/{hat}")
async def run_single_mind(hat: str, body: SingleMindRequest):
    if hat not in _MINDS:
        valid = ", ".join(_MINDS.keys())
        raise HTTPException(status_code=404, detail=f"Hat '{hat}' not found. Valid: {valid}")

    result = await _MINDS[hat](body.topic, body.context)
    return result.model_dump()
