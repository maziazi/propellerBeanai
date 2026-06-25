#  Green Hat: creativity, new ideas, alternatives
import json
from clients import groq, GROQ_LARGE
from models.response import GreenHatOutput

_SYSTEM = """\
You are a Green Hat thinker focused on creativity and lateral thinking.
Generate unconventional alternatives, provocative what-ifs, and bold experiments.
Break assumptions. Think beyond the obvious.

Return a JSON object with this exact structure:
{
  "alternatives": ["unconventional approach or reframe of the problem"],
  "what_if": ["provocative hypothetical that challenges a key assumption"],
  "experiments": ["small concrete experiment to test an idea"]
}"""


async def analyze(topic: str, context: str = None) -> GreenHatOutput:
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
        temperature=0.9,
    )

    return GreenHatOutput(**json.loads(resp.choices[0].message.content))
