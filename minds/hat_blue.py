# Blue Hat: process control, meta-thinking, synthesis
import asyncio
import json
import re
from clients import gemini, GEMINI_MODEL, groq, GROQ_LARGE
from models.response import (
    BlueHatOutput,
    WhiteHatOutput,
    RedHatOutput,
    BlackHatOutput,
    YellowHatOutput,
    GreenHatOutput,
)

_SYSTEM = """\
You are a Blue Hat thinker — the process controller and final synthesizer.
You receive analyses from 5 thinking perspectives and must produce a balanced conclusion.
Weigh all perspectives fairly. Surface conflicts and agreements. Give clear direction.

Return a JSON object with this exact structure:
{
  "overall_assessment": "positive|negative|mixed|uncertain",
  "confidence_score": 0-100,
  "summary": "2-3 sentence synthesis of all perspectives",
  "next_steps": ["concrete action to take"],
  "critical_question": "the most important unanswered question",
  "recommended_action": "single most important action to take right now",
  "emergent_insights": ["insight that only appears when combining multiple perspectives"]
}"""


def _build_prompt(
    topic: str,
    white: WhiteHatOutput,
    red: RedHatOutput,
    black: BlackHatOutput,
    yellow: YellowHatOutput,
    green: GreenHatOutput,
    context: str = None,
) -> str:
    lines = [_SYSTEM, "", f"Topic: {topic}"]
    if context:
        lines.append(f"Context: {context}")

    lines.append("\nWHITE HAT — Facts & Information:")
    for f in white.facts:
        lines.append(f"  - {f.claim} [confidence: {f.confidence}, source: {f.source}]")
    if white.data_gaps:
        lines.append(f"  Data gaps: {'; '.join(white.data_gaps)}")

    lines.append("\nRED HAT — Feelings & Emotions:")
    lines.append(f"  Gut feeling: {red.gut_feeling}")
    for item in red.intuitions:
        lines.append(f"  - {item}")
    for item in red.emotional_concerns:
        lines.append(f"  Concern: {item}")

    lines.append("\nBLACK HAT — Caution & Risks:")
    for r in black.risks:
        lines.append(f"  - {r.risk} [severity: {r.severity}, probability: {r.probability}]")
    for item in black.hidden_assumptions:
        lines.append(f"  Assumption: {item}")
    for item in black.failure_scenarios:
        lines.append(f"  Failure: {item}")

    lines.append("\nYELLOW HAT — Optimism & Benefits:")
    for o in yellow.opportunities:
        lines.append(f"  - {o.opportunity}: {o.evidence}")
    for item in yellow.best_scenarios:
        lines.append(f"  Best case: {item}")

    lines.append("\nGREEN HAT — Creativity & Alternatives:")
    for item in green.alternatives:
        lines.append(f"  - {item}")
    for item in green.what_if:
        lines.append(f"  What if: {item}")
    for item in green.experiments:
        lines.append(f"  Experiment: {item}")

    lines.append("\nNow synthesize all perspectives into the JSON response.")
    return "\n".join(lines)


def _parse_json(text: str) -> dict:
    text = re.sub(r"```(?:json)?\n?", "", text).strip().rstrip("`")
    return json.loads(text)


async def _synthesize_with_gemini(prompt: str) -> BlueHatOutput:
    resp = await asyncio.to_thread(
        gemini.models.generate_content,
        model=GEMINI_MODEL,
        contents=prompt,
    )
    return BlueHatOutput(**_parse_json(resp.text))


async def _synthesize_with_groq(prompt: str) -> BlueHatOutput:
    resp = await groq.chat.completions.create(
        model=GROQ_LARGE,
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.4,
    )
    return BlueHatOutput(**json.loads(resp.choices[0].message.content))


async def analyze(
    topic: str,
    white: WhiteHatOutput,
    red: RedHatOutput,
    black: BlackHatOutput,
    yellow: YellowHatOutput,
    green: GreenHatOutput,
    context: str = None,
) -> BlueHatOutput:
    prompt = _build_prompt(topic, white, red, black, yellow, green, context)

    try:
        return await _synthesize_with_gemini(prompt)
    except Exception:
        return await _synthesize_with_groq(prompt)

