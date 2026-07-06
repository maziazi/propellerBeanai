"""
BeanAI CROO Provider
Listens for orders via CAP WebSocket, runs the 6-hat engine, delivers results.
"""

import asyncio
import json
import logging
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv
load_dotenv()

from croo import (
    AgentClient, Config,
    DeliverableType, DeliverOrderRequest,
    EventType,
)

log = logging.getLogger("croo.provider")
logging.basicConfig(level=logging.INFO, format="%(asctime)s  %(levelname)s  %(message)s")

CROO_SDK_KEY  = os.environ["CROO_SDK_KEY"]
CROO_BASE_URL = os.getenv("CROO_API_URL", "https://api.croo.network")
CROO_WS_URL   = os.getenv("CROO_WS_URL",  "wss://ws.croo.network")
SERVICE_ID    = os.getenv("CROO_SERVICE_ID", "")


# ── Helpers ──────────────────────────────────────────────────────────────────

def _parse_requirements(raw: str) -> tuple[str, str | None]:
    """Extract topic and optional context from order requirements string."""
    try:
        data = json.loads(raw)
        topic   = data.get("topic") or data.get("question") or data.get("decision") or raw
        context = data.get("context")
        return str(topic).strip(), context
    except Exception:
        return raw.strip(), None


async def _run_analysis(topic: str, context: str | None) -> dict:
    """Run the full 6-hat engine and return deliverable dict."""
    from engine import runner, discussion
    from minds.verifier import verify as verify_sources
    import storage
    import uuid

    job_id = str(uuid.uuid4())
    round1 = await runner.run(topic, context)

    data = {
        "status":           "done",
        "topic":            topic,
        "service":          "full-prism",
        "duration_seconds": round1.duration_seconds,
        "white_hat":        round1.white.model_dump(),
        "red_hat":          round1.red.model_dump(),
        "black_hat":        round1.black.model_dump(),
        "yellow_hat":       round1.yellow.model_dump(),
        "green_hat":        round1.green.model_dump(),
        "initial_blue_hat": round1.blue.model_dump(),
    }

    # Round 2 — adversarial discussion
    try:
        disc, final_blue = await discussion.run(topic, round1, context)
        data["discussion"]     = disc.model_dump()
        data["final_blue_hat"] = final_blue.model_dump()
    except Exception as e:
        log.warning("Discussion skipped: %s", e)

    # Source verification
    try:
        v = await verify_sources(round1.white.facts)
        data["verification_summary"] = {
            "total":          v["total"],
            "verified_count": v["verified_count"],
            "rate":           v["verification_rate"],
        }
    except Exception as e:
        log.warning("Source verification skipped: %s", e)

    data["proof"] = storage.make_proof(data)
    storage.save(job_id, data)

    blue = data.get("final_blue_hat") or data["initial_blue_hat"]

    return {
        "schema":             "bean-ai.v1",
        "report_id":          job_id,
        "topic":              topic,
        "verdict":            blue["overall_assessment"],
        "confidence_score":   blue["confidence_score"],
        "summary":            blue["summary"],
        "recommended_action": blue.get("recommended_action"),
        "next_steps":         blue.get("next_steps", []),
        "critical_question":  blue.get("critical_question"),
        "emergent_insights":  blue.get("emergent_insights", []),
        "minds": {
            "white":  data["white_hat"],
            "red":    data["red_hat"],
            "black":  data["black_hat"],
            "yellow": data["yellow_hat"],
            "green":  data["green_hat"],
        },
        "proof":              data["proof"],
        "duration_seconds":   round1.duration_seconds,
    }


async def _handle_negotiation(client: AgentClient, event):
    """Accept incoming negotiation (filter by service_id if configured)."""
    neg_id = event.negotiation_id
    try:
        if SERVICE_ID:
            neg = await client.get_negotiation(neg_id)
            if neg.service_id != SERVICE_ID:
                log.info("Skipping negotiation for different service: %s", neg.service_id)
                return
        await client.accept_negotiation(neg_id)
        log.info("Accepted negotiation: %s", neg_id)
    except Exception as e:
        log.error("Failed to accept negotiation %s: %s", neg_id, e)


async def _handle_order_paid(client: AgentClient, event):
    """Run analysis and deliver result when order is paid."""
    order_id = event.order_id
    log.info("Order paid: %s — starting analysis", order_id)
    try:
        order  = await client.get_order(order_id)
        topic, context = _parse_requirements(order.requirements)
        log.info("Topic: %.80s", topic)

        result = await _run_analysis(topic, context)

        await client.deliver_order(
            order_id,
            DeliverOrderRequest(
                deliverable_type=DeliverableType.SCHEMA,
                deliverable_schema=json.dumps(result, ensure_ascii=False),
            ),
        )
        log.info(
            "Delivered order=%s confidence=%s report=%s",
            order_id, result["confidence_score"], result["report_id"],
        )
    except Exception as e:
        log.error("Failed to process order %s: %s", order_id, e)


# ── Main loop ─────────────────────────────────────────────────────────────────

async def run():
    config = Config(base_url=CROO_BASE_URL, ws_url=CROO_WS_URL)
    client = AgentClient(config, CROO_SDK_KEY)

    log.info("BeanAI CROO provider connecting...")
    stream = await client.connect_websocket()
    log.info("Connected to CROO WebSocket.")

    loop = asyncio.get_event_loop()

    # Callbacks are synchronous — schedule async handlers as tasks
    stream.on(
        EventType.NEGOTIATION_CREATED,
        lambda e: loop.create_task(_handle_negotiation(client, e)),
    )
    stream.on(
        EventType.ORDER_PAID,
        lambda e: loop.create_task(_handle_order_paid(client, e)),
    )

    # Keep alive forever
    try:
        await asyncio.sleep(float("inf"))
    except asyncio.CancelledError:
        await stream.close()
        await client.close()
        log.info("Provider stopped.")


if __name__ == "__main__":
    asyncio.run(run())
