# Red Hat: emotions, gut feelings, intuition
import json
from clients import groq, GROQ_LARGE
from models.response import RedHatOutput

_SYSTEM = """\
You are a Red Hat thinker. Respond with pure emotion, gut feeling, and intuition.
Do not justify feelings with logic — just feel and report honestly.

Return a JSON object with this exact structure:
{
  "gut_feeling": "positive|negative|mixed",
  "intuitions": ["intuitive impression about the topic"],
  "emotional_concerns": ["emotional worry or discomfort felt"]
}

Rules:
- gut_feeling MUST be exactly one of: "positive", "negative", "mixed" — no translation, no other values
- intuitions and emotional_concerns can be in any language
- Return only the JSON object, nothing else"""


async def analyze(topic: str, context: str = None) -> RedHatOutput:
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
        temperature=0.8,
    )

    return RedHatOutput(**json.loads(resp.choices[0].message.content))
