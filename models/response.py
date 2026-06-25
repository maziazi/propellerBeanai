from typing import List, Literal, Optional
from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Shared sub-models
# ---------------------------------------------------------------------------

class Fact(BaseModel):
    claim: str
    source: str
    url: str
    confidence: Literal["high", "medium", "low"]


class Risk(BaseModel):
    risk: str
    severity: Literal["high", "medium", "low"]
    probability: Literal["high", "medium", "low"]


class Opportunity(BaseModel):
    opportunity: str
    evidence: str


class Proof(BaseModel):
    sha256: str
    generated_at: str


# ---------------------------------------------------------------------------
# Mind outputs — one per hat
# ---------------------------------------------------------------------------

# White Hat: fakta, data, dan sumber yang bisa diverifikasi
class WhiteHatOutput(BaseModel):
    facts: List[Fact]
    data_gaps: List[str]


# Red Hat: perasaan, intuisi, dan respons emosional
class RedHatOutput(BaseModel):
    gut_feeling: Literal["positive", "negative", "mixed"]
    intuitions: List[str]
    emotional_concerns: List[str]


# Black Hat: risiko, asumsi tersembunyi, dan skenario gagal
class BlackHatOutput(BaseModel):
    risks: List[Risk]
    hidden_assumptions: List[str]
    failure_scenarios: List[str]


# Yellow Hat: peluang, manfaat, dan skenario terbaik
class YellowHatOutput(BaseModel):
    opportunities: List[Opportunity]
    best_scenarios: List[str]


# Green Hat: alternatif kreatif, what-if, dan eksperimen
class GreenHatOutput(BaseModel):
    alternatives: List[str]
    what_if: List[str]
    experiments: List[str]


# Blue Hat: sintesis akhir, penilaian menyeluruh, dan langkah berikutnya
class BlueHatOutput(BaseModel):
    overall_assessment: Literal["positive", "negative", "mixed", "uncertain"]
    confidence_score: int = Field(..., ge=0, le=100)
    summary: str
    next_steps: List[str]
    critical_question: Optional[str] = None
    recommended_action: Optional[str] = None
    emergent_insights: Optional[List[str]] = None


# ---------------------------------------------------------------------------
# Discussion output (Ronde 2)
# ---------------------------------------------------------------------------

class DiscussionOutput(BaseModel):
    white_hat_response: str
    red_hat_response: str
    black_hat_response: str
    yellow_hat_response: str
    green_hat_response: str
    conflict_points: List[str]
    agreement_points: List[str]
    emergent_insights: List[str]


# ---------------------------------------------------------------------------
# Top-level responses
# ---------------------------------------------------------------------------

class ReportResponse(BaseModel):
    report_id: str
    topic: str
    service: str
    duration_seconds: float
    white_hat: WhiteHatOutput
    red_hat: RedHatOutput
    black_hat: BlackHatOutput
    yellow_hat: YellowHatOutput
    green_hat: GreenHatOutput
    initial_blue_hat: BlueHatOutput
    discussion: Optional[DiscussionOutput] = None
    final_blue_hat: Optional[BlueHatOutput] = None
    proof: Proof


class StatusResponse(BaseModel):
    job_id: str
    status: Literal["queued", "processing", "done", "failed"]
    progress: Optional[dict] = None
    estimated_seconds_remaining: Optional[int] = None
    report_id: Optional[str] = None
    error: Optional[str] = None


class JobResponse(BaseModel):
    job_id: str
    estimated_seconds: int
