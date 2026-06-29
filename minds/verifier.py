import asyncio
from dataclasses import dataclass

import httpx

from models.response import Fact


@dataclass
class VerifiedFact:
    claim: str
    source: str
    url: str
    confidence: str
    verified: bool
    status_code: int | None
    note: str


async def _check_url(client: httpx.AsyncClient, fact: Fact) -> VerifiedFact:
    try:
        resp = await client.get(fact.url, timeout=8.0, follow_redirects=True)
        verified = resp.status_code < 400
        return VerifiedFact(
            claim=fact.claim,
            source=fact.source,
            url=fact.url,
            confidence=fact.confidence,
            verified=verified,
            status_code=resp.status_code,
            note="" if verified else f"HTTP {resp.status_code}",
        )
    except httpx.TimeoutException:
        return VerifiedFact(
            claim=fact.claim, source=fact.source, url=fact.url,
            confidence=fact.confidence, verified=False, status_code=None, note="timeout",
        )
    except Exception as e:
        return VerifiedFact(
            claim=fact.claim, source=fact.source, url=fact.url,
            confidence=fact.confidence, verified=False, status_code=None, note=str(e)[:80],
        )


async def verify(facts: list[Fact]) -> dict:
    if not facts:
        return {"facts": [], "verified_count": 0, "total": 0, "verification_rate": 0}

    headers = {"User-Agent": "BeanAI-Verifier/1.0"}
    async with httpx.AsyncClient(headers=headers) as client:
        results = await asyncio.gather(*(_check_url(client, f) for f in facts))

    verified_count = sum(1 for r in results if r.verified)

    return {
        "facts": [
            {
                "claim": r.claim,
                "source": r.source,
                "url": r.url,
                "confidence": r.confidence,
                "verified": r.verified,
                "status_code": r.status_code,
                "note": r.note,
            }
            for r in results
        ],
        "verified_count": verified_count,
        "total": len(results),
        "verification_rate": round(verified_count / len(results) * 100),
    }
