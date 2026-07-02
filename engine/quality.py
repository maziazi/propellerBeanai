"""Quality evaluator — scores a hat output and returns a specific critique."""
import json
from clients import groq, GROQ_LARGE

_SYSTEM = """\
You are a quality evaluator for a Six Thinking Hats decision analysis.
Score the hat output on three dimensions (total 0-100):

- Depth (35 pts): Is the analysis specific to THIS exact topic, or generic platitudes?
- Actionability (35 pts): Are the points concrete, non-obvious, and directly usable?
- Completeness (30 pts): Are all fields populated with ≥ 3 meaningful, distinct items?

Return ONLY valid JSON — no extra text:
{"score": <integer 0-100>, "critique": "<concise bullet list of specific gaps to fix, or 'Quality is sufficient' if score >= 65>"}

Be strict. Generic outputs that could apply to ANY topic should score below 50."""


async def evaluate(hat_name: str, topic: str, output: dict) -> tuple[int, str]:
    """
    Returns (score, critique).
    score < 65 → refinement needed.
    On any error returns (100, '') to skip refinement silently.
    """
    prompt = f"""{_SYSTEM}

Hat: {hat_name}
Topic: {topic}
Output:
{json.dumps(output, indent=2)}"""

    try:
        resp = await groq.chat.completions.create(
            model=GROQ_LARGE,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.1,
            max_tokens=250,
        )
        result = json.loads(resp.choices[0].message.content)
        score = max(0, min(100, int(result.get("score", 100))))
        critique = str(result.get("critique", "")).strip()
        return score, critique
    except Exception:
        return 100, ""
