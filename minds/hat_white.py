# White Hat: facts, data, verified sources
import asyncio
import json
import re
from clients import gemini, GEMINI_MODEL, groq, GROQ_LARGE, tavily
from models.response import WhiteHatOutput

_SYSTEM = """\
You are a White Hat thinker. Your role is to gather and present only verified facts and data.
Analyze the topic using ONLY the provided search results. Do not speculate.
Use the EXACT URLs from the search results — do not invent or modify URLs.

Return a JSON object with this exact structure:
{
  "facts": [
    {"claim": "factual statement", "source": "source name", "url": "exact url from search results", "confidence": "high|medium|low"}
  ],
  "data_gaps": ["what information is missing or unverifiable"]
}

Rules:
- Every fact MUST use a real URL from the search results provided
- Do NOT generate or guess URLs — only use what is given
- confidence: high = direct data point, medium = implied, low = estimated
- Return only the JSON object, nothing else"""


async def analyze(topic: str, context: str = None) -> WhiteHatOutput:
    query = f"{topic} {context} data statistics facts 2024 2025" if context else f"{topic} data statistics facts 2024 2025"

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
        return WhiteHatOutput(**json.loads(text))
    except Exception:
        resp = await groq.chat.completions.create(
            model=GROQ_LARGE,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.2,
        )
        return WhiteHatOutput(**json.loads(resp.choices[0].message.content))
