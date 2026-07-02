"""
Refines a hat's output given a quality critique.
Produces an improved version of the same JSON structure.
"""
import asyncio
import json
import re
from clients import gemini, GEMINI_MODEL, groq, GROQ_LARGE

# Expected JSON schema per hat — shown to LLM so it returns the right shape
_SCHEMAS: dict[str, str] = {
    "White Hat": """{
  "facts": [{"claim": "specific factual statement", "source": "source name", "url": "exact url", "confidence": "high|medium|low"}],
  "data_gaps": ["specific missing information"]
}""",
    "Red Hat": """{
  "gut_feeling": "positive|negative|mixed",
  "intuitions": ["specific intuition about this topic"],
  "emotional_concerns": ["specific emotional concern"]
}""",
    "Black Hat": """{
  "risks": [{"risk": "specific risk", "severity": "high|medium|low", "probability": "high|medium|low"}],
  "hidden_assumptions": ["specific assumption being made"],
  "failure_scenarios": ["concrete failure scenario"]
}""",
    "Yellow Hat": """{
  "opportunities": [{"opportunity": "specific opportunity", "evidence": "concrete supporting evidence"}],
  "best_scenarios": ["specific best-case scenario"]
}""",
    "Green Hat": """{
  "alternatives": ["specific creative alternative approach"],
  "what_if": ["specific what-if scenario"],
  "experiments": ["concrete small experiment to test an assumption"]
}""",
    "Blue Hat": """{
  "overall_assessment": "positive|negative|mixed|uncertain",
  "confidence_score": <integer 0-100>,
  "summary": "2-3 sentence synthesis",
  "next_steps": ["concrete next step"],
  "critical_question": "the most important unanswered question",
  "recommended_action": "single most important action right now",
  "emergent_insights": ["insight only visible when combining all perspectives"]
}""",
}


async def refine(
    hat_name: str,
    topic: str,
    prev_output: dict,
    critique: str,
    context: str | None = None,
) -> dict:
    """
    Returns an improved output dict with the same structure.
    Falls back to prev_output if refinement fails.
    """
    schema = _SCHEMAS.get(hat_name, "{}")
    ctx_line = f"\nContext: {context}" if context else ""

    prompt = f"""\
You are a {hat_name} thinker. Your previous analysis needs improvement.

Topic: {topic}{ctx_line}

Your previous output:
{json.dumps(prev_output, indent=2)}

Quality critique — fix these specific issues:
{critique}

Instructions:
- Every point MUST be specific to "{topic}" — remove anything generic
- Add concrete details, numbers, names, or scenarios where possible
- Expand any field that has fewer than 3 items
- Return ONLY the improved JSON (no markdown, no explanation):
{schema}"""

    try:
        resp = await asyncio.to_thread(
            gemini.models.generate_content,
            model=GEMINI_MODEL,
            contents=prompt,
        )
        text = re.sub(r"```(?:json)?\n?", "", resp.text).strip().rstrip("`")
        return json.loads(text)
    except Exception:
        pass

    # Fallback to Groq
    try:
        resp = await groq.chat.completions.create(
            model=GROQ_LARGE,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.35,
        )
        return json.loads(resp.choices[0].message.content)
    except Exception:
        return prev_output  # Keep original if both fail
