"""
Jalankan FastAPI + CROO provider secara bersamaan.
Usage: python start.py
"""
import asyncio
import subprocess
import sys
import os


async def run_croo():
    from croo.provider import run
    await run()


async def run_api():
    proc = await asyncio.create_subprocess_exec(
        sys.executable, "-m", "uvicorn", "main:app",
        "--host", "0.0.0.0",
        "--port", os.getenv("PORT", "8000"),
    )
    await proc.wait()


async def main():
    await asyncio.gather(
        run_api(),
        run_croo(),
    )


if __name__ == "__main__":
    asyncio.run(main())
