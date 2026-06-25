import json
from clients import groq, GROQ_FAST

_SYSTEM = """\
Determine if a topic is specific enough for a thorough 6-hat analysis.

VAGUE: missing subject, context, or scope — e.g. "bisnis online", "investasi", "karir"
CLEAR: has enough detail to analyze — e.g. "Buka warung makan di Bali dengan modal 80 juta"

Return JSON:
{
  "is_vague": true|false,
  "questions": ["clarifying question to ask the user — empty list if clear"],
  "refined_hint": "one-line tip to make the topic more specific — empty string if clear"
}"""


async def clarify(topic: str) -> dict:
    resp = await groq.chat.completions.create(
        model=GROQ_FAST,
        messages=[
            {"role": "system", "content": _SYSTEM},
            {"role": "user", "content": f"Topic: {topic}"},
        ],
        response_format={"type": "json_object"},
        temperature=0.2,
    )
    return json.loads(resp.choices[0].message.content)
