"""
Run the FastAPI API and the CROO A2A provider together.
Usage: python start.py

The CROO provider is supervised: if it crashes (e.g. a dropped WebSocket, or a
missing SDK key) it is retried with backoff and NEVER takes down the web API.
"""
import asyncio
import logging
import os
import sys

logging.basicConfig(level=logging.INFO, format="%(asctime)s  %(levelname)s  %(message)s")
log = logging.getLogger("start")


async def run_croo():
    """Supervise the CROO provider — keep the API alive no matter what."""
    attempt = 0
    while True:
        try:
            from croo.provider import run
            await run()
            log.warning("CROO provider exited cleanly — restarting in 10s")
        except Exception as e:
            attempt += 1
            log.warning("CROO provider crashed (attempt %d): %s", attempt, e)
        await asyncio.sleep(min(60, 10 * max(1, attempt)))


async def run_api():
    proc = await asyncio.create_subprocess_exec(
        sys.executable, "-m", "uvicorn", "main:app",
        "--host", "0.0.0.0",
        "--port", os.getenv("PORT", "8000"),
    )
    await proc.wait()


async def main():
    # return_exceptions=True so a failure in one task never cancels the other
    await asyncio.gather(run_api(), run_croo(), return_exceptions=True)


if __name__ == "__main__":
    asyncio.run(main())
