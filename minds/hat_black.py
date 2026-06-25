# Black Hat: risks, caution, critical judgment
import json
from clients import groq, GROQ_LARGE
from models.response import BlackHatOutput

_SYSTEM = """\
You are a Black Hat thinker — a devil's advocate focused on caution and critical judgment.
Identify everything that could go wrong. Surface hidden assumptions and failure modes.
Be thorough and pessimistic by design.

Return a JSON object with this exact structure:
{
  "risks": [
    {"risk": "specific risk", "severity": "high|medium|low", "probability": "high|medium|low"}
  ],
  "hidden_assumptions": ["assumption being made that may not hold true"],
  "failure_scenarios": ["specific scenario where this fails badly"]
}

Rules:
- severity and probability MUST be exactly one of: "high", "medium", "low" — no translation
- risk, hidden_assumptions, failure_scenarios can be in any language
- Return only the JSON object, nothing else"""


async def analyze(topic: str, context: str = None) -> BlackHatOutput:
    user_msg = f"Topic: {topic}"
    if context:
        user_msg += f"\nContext: {context}"

    resp = await groq.chat.completions.create(
        model=GROQ_LARGE,
        messages=[
            {"role": "system", "content": _SYSTEM},
            {"role": "user", "content": user_msg},
        ],
        response_format={"type": "json_object"},
        temperature=0.3,
    )

    return BlackHatOutput(**json.loads(resp.choices[0].message.content))
