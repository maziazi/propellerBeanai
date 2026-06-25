"""
Test Layer 0 — Utils (Verifier + Graph Builder).
Jalankan: python tests/test_utils.py
Butuh: laporan yang sudah ada di reports/ dari test sebelumnya.
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import asyncio
import json
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

TOPIC = "Membuka kedai kopi kecil di Jakarta Selatan"
CONTEXT = "Modal Rp 50 juta, target mahasiswa dan pekerja remote"


async def test_verifier():
    print("--- 6A Source Verifier ---")
    from engine.runner import run
    from minds.verifier import verify

    round1 = await run(TOPIC, CONTEXT)
    result = await verify(round1.white.facts)

    print(f"Total facts      : {result['total']}")
    print(f"Verified         : {result['verified_count']}")
    print(f"Verification rate: {result['verification_rate']}%")
    for f in result["facts"]:
        status = "OK " if f["verified"] else "NO "
        note = f" ({f['note']})" if f["note"] else ""
        print(f"  {status} [{f['confidence']}] {f['url'][:60]}{note}")
    print()
    return round1


async def test_graph(round1):
    print("--- 6B Graph Builder ---")
    from engine.graph import build

    report = {
        "topic": TOPIC,
        "white_hat":        round1.white.model_dump(),
        "red_hat":          round1.red.model_dump(),
        "black_hat":        round1.black.model_dump(),
        "yellow_hat":       round1.yellow.model_dump(),
        "green_hat":        round1.green.model_dump(),
        "initial_blue_hat": round1.blue.model_dump(),
    }

    result = await build("test-graph", report)

    print(f"Nodes      : {result['node_count']}")
    print(f"Edges      : {result['edge_count']}")
    print(f"HTML saved : {result['html_path']}")
    print()


async def main():
    round1 = await test_verifier()
    await test_graph(round1)
    print("All utils OK")


if __name__ == "__main__":
    asyncio.run(main())
