"""
Test Layer 4 — Engines.
Jalankan: python tests/test_engines.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import asyncio
from dotenv import load_dotenv

load_dotenv()

TOPIC = "Membuka kedai kopi kecil di Jakarta Selatan"
CONTEXT = "Modal Rp 50 juta, target mahasiswa dan pekerja remote"
VAGUE_TOPIC = "bisnis online"


async def test_intake():
    print("--- 4B Clarification Engine ---")
    from engine.intake import clarify

    result_vague = await clarify(VAGUE_TOPIC)
    print(f"Topic vague  : '{VAGUE_TOPIC}'")
    print(f"  is_vague   : {result_vague['is_vague']}")
    print(f"  questions  : {result_vague['questions']}")

    result_clear = await clarify(TOPIC)
    print(f"Topic clear  : '{TOPIC[:40]}...'")
    print(f"  is_vague   : {result_clear['is_vague']}")
    print()


async def test_runner():
    print("--- 4A Hat Engine (Round 1) ---")
    from engine.runner import run

    result = await run(TOPIC, CONTEXT)
    print(f"White  facts     : {len(result.white.facts)}")
    print(f"Red    feeling   : {result.red.gut_feeling}")
    print(f"Black  risks     : {len(result.black.risks)}")
    print(f"Yellow opportun  : {len(result.yellow.opportunities)}")
    print(f"Green  alts      : {len(result.green.alternatives)}")
    print(f"Blue   score     : {result.blue.confidence_score}/100")
    print(f"Total time       : {result.duration_seconds}s")
    print()
    return result


async def test_discussion(round1):
    print("--- 4C Discussion Engine (Round 2) ---")
    from engine.discussion import run as discussion_run

    discussion, final_blue = await discussion_run(TOPIC, round1, CONTEXT)
    print(f"Conflict points  : {len(discussion.conflict_points)}")
    print(f"Agreement points : {len(discussion.agreement_points)}")
    print(f"Emergent insights: {len(discussion.emergent_insights)}")
    print(f"Final assessment : {final_blue.overall_assessment}")
    print(f"Final confidence : {final_blue.confidence_score}/100")
    print(f"Final action     : {final_blue.recommended_action}")
    print()


async def main():
    await test_intake()
    round1 = await test_runner()
    await test_discussion(round1)
    print("All engines OK")


if __name__ == "__main__":
    asyncio.run(main())
