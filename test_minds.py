"""
Smoke test: jalankan tanpa CROO untuk verify semua minds bisa di-import.
Usage: python test_minds.py
"""
import asyncio
from minds import ScoutMind, PulseMind, ShadowMind, BloomMind, SparkMind, CompassMind
from minds import SourceVerifier


def test_imports():
    minds = [ScoutMind, PulseMind, ShadowMind, BloomMind, SparkMind, CompassMind]
    for mind in minds:
        instance = mind()
        print(f"[OK] {instance.name} ({instance.hat} hat) — {instance.role}")

    verifier = SourceVerifier()
    print(f"[OK] {verifier.name} — {verifier.role}")


if __name__ == "__main__":
    test_imports()
    print("\nSemua minds berhasil di-import. Siap coding Hari 2!")
