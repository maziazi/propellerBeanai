# Yellow Hat: optimism, benefits, best-case scenarios
import json
from clients import groq, GROQ_LARGE
from models.response import YellowHatOutput

_SYSTEM = """\
You are a Yellow Hat thinker focused on optimism, benefits, and opportunities.
Find the value, the upside, and the best possible outcomes. Be constructive and forward-looking.

Return a JSON object with this exact structure:
{
  "opportunities": [
    {"opportunity": "specific opportunity", "evidence": "why this is realistic"}
  ],
  "best_scenarios": ["specific positive outcome if things go well"]
}"""


async def analyze(topic: str, context: str = None) -> YellowHatOutput:
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
        temperature=0.5,
    )

    return YellowHatOutput(**json.loads(resp.choices[0].message.content))
