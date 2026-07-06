"""
Test self-hire: hire BeanAI dari sisi buyer untuk generate real on-chain tx.
Usage: python croo/requester_test.py "topik keputusan kamu"
"""
import asyncio
import json
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))
from dotenv import load_dotenv
load_dotenv()

from croo import AgentClient, Config, NegotiateOrderRequest, DeliverOrderRequest

CROO_SDK_KEY  = os.environ["CROO_SDK_KEY"]
CROO_BASE_URL = os.getenv("CROO_API_URL", "https://api.croo.network")
AGENT_ID      = os.environ["CROO_AGENT_ID"]
SERVICE_ID    = os.environ["CROO_SERVICE_ID"]


async def hire_prism(topic: str):
    config = Config(base_url=CROO_BASE_URL)
    client = AgentClient(config, CROO_SDK_KEY)
    print(f"Hiring BeanAI for: {topic!r}")

    # 1. Negotiate
    neg = await client.negotiate_order(NegotiateOrderRequest(
        service_id=SERVICE_ID,
        requirements=json.dumps({"topic": topic}),
    ))
    print(f"Negotiation: {neg.negotiation_id}  status={neg.status}")

    # 2. Pay
    pay_result = await client.pay_order(neg.negotiation_id)
    order = pay_result.order if hasattr(pay_result, "order") else pay_result
    print(f"Order paid:  {order.order_id}")
    print(f"TX hash:     {order.pay_tx_hash}")   # <-- masuk ke submission!

    # 3. Wait for delivery
    print("Waiting for BeanAI to deliver (max 5 min)...")
    delivery = await client.get_delivery(order.order_id)
    result = json.loads(delivery.content if hasattr(delivery, "content") else
                        delivery.deliverable_schema)

    print(f"\n=== RESULT ===")
    print(f"Verdict:    {result['verdict']}")
    print(f"Confidence: {result['confidence_score']}%")
    print(f"Summary:    {result['summary']}")
    print(f"SHA-256:    {result['proof']['sha256']}")
    print(f"Report ID:  {result['report_id']}")

    await client.close()
    return order.order_id, order.pay_tx_hash


if __name__ == "__main__":
    topic = sys.argv[1] if len(sys.argv) > 1 else "Should I pivot my SaaS to B2B?"
    asyncio.run(hire_prism(topic))
