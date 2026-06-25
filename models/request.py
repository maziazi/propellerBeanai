from typing import Literal, Optional
from pydantic import BaseModel, Field


class AnalyzeRequest(BaseModel):
    topic: str = Field(..., min_length=3, max_length=2000)
    service: Literal["quick-scan", "full-prism", "single-mind"]
    context: Optional[str] = Field(None, max_length=1000)
    callback_url: Optional[str] = None

    model_config = {
        "json_schema_extra": {
            "example": {
                "topic": "Buka warung makan di Seminyak Bali",
                "service": "quick-scan",
                "context": "Modal Rp 80 juta, target turis domestik",
            }
        }
    }


class ClarifyRequest(BaseModel):
    topic: str = Field(..., min_length=1, max_length=2000)

    model_config = {
        "json_schema_extra": {
            "example": {
                "topic": "ide makan di Bali",
            }
        }
    }


class SingleMindRequest(BaseModel):
    topic: str = Field(..., min_length=3, max_length=2000)
    context: Optional[str] = Field(None, max_length=1000)

    model_config = {
        "json_schema_extra": {
            "example": {
                "topic": "Pivot karir dari software engineer ke product manager",
                "context": "5 tahun pengalaman, gaji saat ini Rp 25 juta",
            }
        }
    }
