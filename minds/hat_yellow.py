# Yellow Hat: opportunities, benefits, best-case scenarios
import asyncio
import json
import re
from clients import gemini, GEMINI_MODEL, groq, GROQ_LARGE, tavily
from models.response import YellowHatOutput

_SYSTEM = """\
You are a Yellow Hat thinker focused on optimism, benefits, and opportunities.
Find the value, the upside, and the best possible outcomes based on REAL data.
Use the EXACT URLs from the search results — do not invent or modify URLs.

Return a JSON object with this exact structure:
{
  "opportunities": [
    {"opportunity": "specific opportunity", "evidence": "why this is realistic, cite source"}
  ],
  "best_scenarios": ["specific positive outcome if things go well"]
}

Rules:
- Opportunities must be grounded in the search results provided, not assumptions
- Do NOT generate or guess URLs — only use what is given
- Return only the JSON object, nothing else"""


async def analyze(topic: str, context: str = None) -> YellowHatOutput:
    query = f"{topic} {context} opportunity market growth trend 2024 2025" if context else f"{topic} opportunity market growth trend 2024 2025"

    search = await asyncio.to_thread(
        lambda: tavily.search(query, max_results=6, days=365)
    )

    sources = "\n".join(
        f"[{i+1}] Title: {r['title']}\n    Content: {r['content'][:500]}\n    URL: {r['url']}"
        for i, r in enumerate(search.get("results", []))
    )

    prompt = f"""{_SYSTEM}

Topic: {topic}
{"Context: " + context if context else ""}

Search results (use ONLY these URLs):
{sources}"""

    try:
        resp = await asyncio.to_thread(
            gemini.models.generate_content,
            model=GEMINI_MODEL,
            contents=prompt,
        )
        text = re.sub(r"```(?:json)?\n?", "", resp.text).strip().rstrip("`")
        return YellowHatOutput(**json.loads(text))
    except Exception:
        resp = await groq.chat.completions.create(
            model=GROQ_LARGE,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.5,
        )
        return YellowHatOutput(**json.loads(resp.choices[0].message.content))
