"""
A2A Enricher: BeanAI sebagai requester yang hire agent lain untuk enrich FACT data.
Dipanggil dari dalam engine sebelum white hat analysis.
"""
import asyncio
import json
import logging
import os

log = logging.getLogger("croo.a2a")

# Agent CROO yang bisa dihire untuk research/data enrichment
# Ganti dengan agent ID real dari CROO Agent Store
A2A_RESEARCH_AGENT_ID  = os.getenv("A2A_RESEARCH_AGENT_ID", "")
A2A_RESEARCH_SERVICE   = os.getenv("A2A_RESEARCH_SERVICE_ID", "")


async def enrich_with_research(topic: str, croo_sdk_key: str) -> dict | None:
    """
    Hire a research agent on CROO to get external data for FACT mind.
    Returns enrichment data or None if not configured / failed.
    """
    if not A2A_RESEARCH_AGENT_ID or not croo_sdk_key:
        return None

    try:
        from croo import AgentClient, Config, NegotiateOrderRequest

        client = AgentClient(sdk_key=croo_sdk_key)
        log.info("A2A: hiring research agent for topic: %s", topic[:60])

        negotiation = await client.negotiate_order(
            agent_id=A2A_RESEARCH_AGENT_ID,
            service_id=A2A_RESEARCH_SERVICE,
            requirements=json.dumps({"query": topic, "format": "structured"}),
        )

        order = await client.pay_order(negotiation_id=negotiation.id)
        log.info("A2A: paid order %s (tx: %s)", order.id, order.pay_tx_hash)

        delivery = await client.get_delivery(order_id=order.id, timeout=120)
        result = json.loads(delivery.content)

        log.info("A2A: received enrichment data from research agent")
        return {
            "source":         "a2a_research_agent",
            "agent_id":       A2A_RESEARCH_AGENT_ID,
            "order_id":       order.id,
            "tx_hash":        order.pay_tx_hash,
            "data":           result,
        }

    except Exception as e:
        log.warning("A2A enrichment failed (non-fatal): %s", e)
        return None
