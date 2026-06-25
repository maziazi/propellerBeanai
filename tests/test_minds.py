"""
Test semua 6 minds dengan satu topik.
Jalankan: python tests/test_minds.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import asyncio
from dotenv import load_dotenv

load_dotenv()

TOPIC = "Membuka kedai kopi kecil di Jakarta Selatan"
CONTEXT = "Modal Rp 50 juta, target mahasiswa dan pekerja remote"


async def main():
    print(f"\nTopic: {TOPIC}")
    print(f"Context: {CONTEXT}\n")

    print("--- White Hat (Facts) ---")
    from minds.hat_white import analyze as white_analyze
    white = await white_analyze(TOPIC, CONTEXT)
    print(f"Facts       : {len(white.facts)} items")
    print(f"Data gaps   : {len(white.data_gaps)} items")
    if white.facts:
        print(f"Sample fact : {white.facts[0].claim}")
    print()

    print("--- Red / Black / Yellow / Green (parallel) ---")
    from minds.hat_red import analyze as red_analyze
    from minds.hat_black import analyze as black_analyze
    from minds.hat_yellow import analyze as yellow_analyze
    from minds.hat_green import analyze as green_analyze

    red, black, yellow, green = await asyncio.gather(
        red_analyze(TOPIC, CONTEXT),
        black_analyze(TOPIC, CONTEXT),
        yellow_analyze(TOPIC, CONTEXT),
        green_analyze(TOPIC, CONTEXT),
    )

    print(f"Red    — gut feeling: {red.gut_feeling}, intuitions: {len(red.intuitions)}")
    print(f"Black  — risks: {len(black.risks)}, assumptions: {len(black.hidden_assumptions)}")
    print(f"Yellow — opportunities: {len(yellow.opportunities)}, scenarios: {len(yellow.best_scenarios)}")
    print(f"Green  — alternatives: {len(green.alternatives)}, what-ifs: {len(green.what_if)}")
    print()

    print("--- Blue Hat (Synthesis) ---")
    from minds.hat_blue import analyze as blue_analyze
    blue = await blue_analyze(TOPIC, white, red, black, yellow, green, CONTEXT)
    print(f"Assessment : {blue.overall_assessment}")
    print(f"Confidence : {blue.confidence_score}/100")
    print(f"Summary    : {blue.summary}")
    print(f"Action     : {blue.recommended_action}")
    print()

    print("All 6 minds OK")


if __name__ == "__main__":
    asyncio.run(main())
