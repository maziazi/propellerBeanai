# White Hat: facts, data, neutral information
import asyncio
import json
from clients import groq, tavily, GROQ_LARGE
from models.response import WhiteHatOutput

_SYSTEM = """\
You are a White Hat thinker. Your role is to gather and present only verified facts and data.
Analyze the topic using only the provided search results. Do not speculate.

Return a JSON object with this exact structure:
{
  "facts": [
    {"claim": "factual statement", "source": "source name", "url": "source url", "confidence": "high|medium|low"}
  ],
  "data_gaps": ["what information is missing or unverifiable"]
}"""


async def analyze(topic: str, context: str = None) -> WhiteHatOutput:
    query = f"{topic} {context}" if context else topic
    search = await asyncio.to_thread(lambda: tavily.search(query, max_results=5))

    sources = "\n".join(
        f"- {r['title']}: {r['content'][:400]} ({r['url']})"
        for r in search.get("results", [])
    )

    user_msg = f"Topic: {topic}"
    if context:
        user_msg += f"\nContext: {context}"
    user_msg += f"\n\nSearch results:\n{sources}"

    resp = await groq.chat.completions.create(
        model=GROQ_LARGE,
        messages=[
            {"role": "system", "content": _SYSTEM},
            {"role": "user", "content": user_msg},
        ],
        response_format={"type": "json_object"},
        temperature=0.2,
    )

    return WhiteHatOutput(**json.loads(resp.choices[0].message.content))
