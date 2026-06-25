import asyncio
import json
import re

from clients import groq, gemini, GROQ_LARGE, GEMINI_MODEL
from models.response import BlueHatOutput, DiscussionOutput

_HAT_ROLES = {
    "white":  ("White Hat",  "Facts & Information"),
    "red":    ("Red Hat",    "Feelings & Emotions"),
    "black":  ("Black Hat",  "Caution & Risks"),
    "yellow": ("Yellow Hat", "Optimism & Benefits"),
    "green":  ("Green Hat",  "Creativity & Alternatives"),
}


def _round1_summaries(round1) -> dict:
    return {
        "white":  f"Facts: {'; '.join(f.claim for f in round1.white.facts[:3])}. "
                  f"Gaps: {'; '.join(round1.white.data_gaps[:2])}.",
        "red":    f"Gut feeling: {round1.red.gut_feeling}. "
                  f"Intuitions: {'; '.join(round1.red.intuitions[:2])}.",
        "black":  f"Top risks: {'; '.join(r.risk for r in round1.black.risks[:3])}. "
                  f"Assumptions: {'; '.join(round1.black.hidden_assumptions[:2])}.",
        "yellow": f"Opportunities: {'; '.join(o.opportunity for o in round1.yellow.opportunities[:3])}.",
        "green":  f"Alternatives: {'; '.join(round1.green.alternatives[:2])}. "
                  f"What-ifs: {'; '.join(round1.green.what_if[:2])}.",
    }


async def _hat_round2_response(hat_key: str, topic: str, summaries: dict) -> str:
    hat_name, hat_role = _HAT_ROLES[hat_key]
    others = "\n".join(
        f"- {_HAT_ROLES[k][0]}: {v}"
        for k, v in summaries.items()
        if k != hat_key
    )

    prompt = f"""\
You are a {hat_name} thinker ({hat_role}).

Topic: {topic}

Other perspectives from Round 1:
{others}

Respond in 2-4 sentences from your {hat_name} viewpoint.
React to what others said — agree where appropriate, challenge where you see gaps."""

    resp = await groq.chat.completions.create(
        model=GROQ_LARGE,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.6,
    )
    return resp.choices[0].message.content.strip()


async def _extract_meta(topic: str, responses: dict) -> dict:
    responses_text = "\n".join(
        f"{_HAT_ROLES[k][0]}: {v}"
        for k, v in responses.items()
    )

    prompt = f"""\
Topic: {topic}

Round 2 responses:
{responses_text}

Analyze this discussion and return JSON:
{{
  "conflict_points": ["where perspectives clearly disagree"],
  "agreement_points": ["where perspectives align"],
  "emergent_insights": ["insight that only appears by combining perspectives — not obvious from any single one"]
}}"""

    resp = await groq.chat.completions.create(
        model=GROQ_LARGE,
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.4,
    )
    return json.loads(resp.choices[0].message.content)


async def _final_blue_synthesis(
    topic: str,
    round1,
    discussion: DiscussionOutput,
    context: str = None,
) -> BlueHatOutput:
    prompt = f"""\
You are a Blue Hat thinker producing a final synthesis after two rounds of analysis.

Topic: {topic}
{f"Context: {context}" if context else ""}

ROUND 1 SYNTHESIS:
{round1.blue.summary}
Initial confidence: {round1.blue.confidence_score}/100

ROUND 2 DISCUSSION:
- White Hat: {discussion.white_hat_response}
- Red Hat: {discussion.red_hat_response}
- Black Hat: {discussion.black_hat_response}
- Yellow Hat: {discussion.yellow_hat_response}
- Green Hat: {discussion.green_hat_response}

Conflicts: {'; '.join(discussion.conflict_points)}
Agreements: {'; '.join(discussion.agreement_points)}
Emergent insights: {'; '.join(discussion.emergent_insights)}

Produce a refined final synthesis that incorporates all Round 2 insights.

Return JSON:
{{
  "overall_assessment": "positive|negative|mixed|uncertain",
  "confidence_score": 0-100,
  "summary": "refined 2-3 sentence synthesis after both rounds",
  "next_steps": ["concrete action"],
  "critical_question": "most important unanswered question after both rounds",
  "recommended_action": "single most important action right now",
  "emergent_insights": ["insight that emerged only after the full discussion"]
}}"""

    try:
        resp = await asyncio.to_thread(
            gemini.models.generate_content,
            model=GEMINI_MODEL,
            contents=prompt,
        )
        text = re.sub(r"```(?:json)?\n?", "", resp.text).strip().rstrip("`")
        return BlueHatOutput(**json.loads(text))
    except Exception:
        resp = await groq.chat.completions.create(
            model=GROQ_LARGE,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.4,
        )
        return BlueHatOutput(**json.loads(resp.choices[0].message.content))


async def run(topic: str, round1, context: str = None) -> tuple[DiscussionOutput, BlueHatOutput]:
    summaries = _round1_summaries(round1)

    white_r, red_r, black_r, yellow_r, green_r = await asyncio.gather(
        _hat_round2_response("white",  topic, summaries),
        _hat_round2_response("red",    topic, summaries),
        _hat_round2_response("black",  topic, summaries),
        _hat_round2_response("yellow", topic, summaries),
        _hat_round2_response("green",  topic, summaries),
    )

    responses = {
        "white": white_r, "red": red_r, "black": black_r,
        "yellow": yellow_r, "green": green_r,
    }

    meta = await _extract_meta(topic, responses)

    discussion = DiscussionOutput(
        white_hat_response=white_r,
        red_hat_response=red_r,
        black_hat_response=black_r,
        yellow_hat_response=yellow_r,
        green_hat_response=green_r,
        conflict_points=meta.get("conflict_points", []),
        agreement_points=meta.get("agreement_points", []),
        emergent_insights=meta.get("emergent_insights", []),
    )

    final_blue = await _final_blue_synthesis(topic, round1, discussion, context)

    return discussion, final_blue
