"""
Test koneksi ke 3 external API: Groq, Gemini, Tavily.
Jalankan: python test_connections.py
Output tidak menampilkan API key.
"""
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()


def check_keys():
    keys = {
        "GROQ_API_KEY":   os.getenv("GROQ_API_KEY"),
        "GEMINI_API_KEY": os.getenv("GEMINI_API_KEY"),
        "TAVILY_API_KEY": os.getenv("TAVILY_API_KEY"),
    }
    print("\n=== ENV KEYS ===")
    for name, val in keys.items():
        if val:
            print(f"  ✅ {name:<20} ada ({len(val)} karakter)")
        else:
            print(f"  ❌ {name:<20} TIDAK ADA")


async def test_groq_fast():
    from groq import AsyncGroq
    client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))
    resp = await client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": "Reply with exactly one word: READY"}],
        max_tokens=5,
    )
    return resp.choices[0].message.content.strip()


async def test_groq_large():
    from groq import AsyncGroq
    client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))
    resp = await client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": "Reply with exactly one word: READY"}],
        max_tokens=5,
    )
    return resp.choices[0].message.content.strip()


async def test_gemini():
    from google import genai
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    resp = await asyncio.to_thread(
        client.models.generate_content,
        model="gemini-2.5-flash-lite",
        contents="Reply with exactly one word: READY",
    )
    return resp.text.strip()


def test_tavily():
    from tavily import TavilyClient
    client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))
    resp = client.search("artificial intelligence 2025", max_results=1)
    results = resp.get("results", [])
    return f"{len(results)} result — {results[0]['title'][:40]}..." if results else "0 results"


async def main():
    check_keys()
    print("\n=== CONNECTION TESTS ===")

    if os.getenv("GROQ_API_KEY"):
        try:
            result = await test_groq_fast()
            print(f"  ✅ {'Groq Llama 8B (fast)':<26} → {result}")
        except Exception as e:
            print(f"  ❌ {'Groq Llama 8B (fast)':<26} → {e}")
        try:
            result = await test_groq_large()
            print(f"  ✅ {'Groq Llama 70B (large)':<26} → {result}")
        except Exception as e:
            print(f"  ❌ {'Groq Llama 70B (large)':<26} → {e}")
    else:
        print(f"  ⏭️  Groq — skip (no key)")

    if os.getenv("GEMINI_API_KEY"):
        try:
            result = await test_gemini()
            print(f"  ✅ {'Gemini 2.5 Flash Lite':<26} → {result}")
        except Exception as e:
            print(f"  ❌ {'Gemini 2.5 Flash Lite':<26} → {e}")
    else:
        print(f"  ⏭️  Gemini — skip (no key)")

    if os.getenv("TAVILY_API_KEY"):
        try:
            result = test_tavily()
            print(f"  ✅ {'Tavily Search':<26} → {result}")
        except Exception as e:
            print(f"  ❌ {'Tavily Search':<26} → {e}")
    else:
        print(f"  ⏭️  Tavily — skip (no key)")

    print()


if __name__ == "__main__":
    asyncio.run(main())
