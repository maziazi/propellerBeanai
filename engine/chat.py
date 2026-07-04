"""Live, interactive panel chat.

Given a finished analysis and a user message, produce SHORT, conversational
replies from a few hats — like people arguing in a group chat, reacting to the
user and to each other. Not the long formal round-2 debate.
"""

import json
import logging

from clients import groq, GROQ_FAST

log = logging.getLogger("engine.chat")

HATS = {
    "white":  "White Hat — facts & data, cites reality",
    "red":    "Red Hat — emotion, gut feeling, intuition",
    "black":  "Black Hat — risks, caution, devil's advocate",
    "yellow": "Yellow Hat — opportunity, upside, optimism",
    "green":  "Green Hat — creative alternatives, what-ifs",
    "blue":   "Blue Hat — synthesis, keeps the panel on track",
}

_SYSTEM = """You are a live panel of six "thinking hats" debating a decision in a group chat.
Reply like real people chatting: SHORT (1-2 sentences), casual, direct. React to the user's latest \
message and to each other. Hats can disagree and address each other by name.

Return ONLY JSON:
{"replies":[{"hat":"white|red|black|yellow|green|blue","to":"user|white|red|black|yellow|green|blue|all","content":"short reply"}]}

Rules:
- 2 to 4 replies, from DIFFERENT hats that actually have something to say.
- content <= 220 characters, conversational, NO markdown, NO bullet lists.
- Stay in character per hat.
- At least one reply must directly answer or challenge the user."""


async def respond(topic: str, hats_context: str, history: list, user_msg: str, max_replies: int = 4) -> list:
    convo = "\n".join(
        f"{h.get('from', '?')}: {h.get('content', '')}" for h in (history or [])[-8:]
    )
    prompt = f"""Decision under discussion: {topic}

The panel's established positions:
{hats_context}

Recent conversation:
{convo or '(none yet)'}

The user just said: "{user_msg}"

Give the panel's live chat replies now (JSON only)."""

    try:
        resp = await groq.chat.completions.create(
            model=GROQ_FAST,
            messages=[
                {"role": "system", "content": _SYSTEM},
                {"role": "user", "content": prompt},
            ],
            response_format={"type": "json_object"},
            temperature=0.7,
            max_tokens=500,
        )
        data = json.loads(resp.choices[0].message.content)
        out = []
        for r in (data.get("replies") or [])[:max_replies]:
            hat = str(r.get("hat", "")).lower().strip()
            content = str(r.get("content", "")).strip()
            if hat not in HATS or not content:
                continue
            to = str(r.get("to", "user")).lower().strip()
            out.append({"hat": hat, "to": to, "content": content[:300]})
        if out:
            return out
    except Exception as e:
        log.warning("chat.respond failed: %s", e)

    return [{
        "hat": "blue", "to": "user",
        "content": "The panel hit a brief hiccup — send that again and we'll weigh in.",
    }]
