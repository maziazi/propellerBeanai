import asyncio
import logging
import time
from dataclasses import dataclass, field

from minds import hat_white, hat_red, hat_black, hat_yellow, hat_green, hat_blue
from models.response import (
    WhiteHatOutput, RedHatOutput, BlackHatOutput,
    YellowHatOutput, GreenHatOutput, BlueHatOutput,
)
from engine import quality, refiner

logger = logging.getLogger("engine.runner")

QUALITY_THRESHOLD = 65  # score below this triggers a refinement pass


# ── Resilience helpers ────────────────────────────────────────────────────────

async def _try_hat(name: str, factory, fallback, tries: int = 3):
    """Run a hat with retry + backoff; degrade to a minimal output if it keeps
    failing. A single flaky LLM/search connection (e.g. RemoteDisconnected when
    all hats hit the shared Gemini client at once) must never fail the whole run.
    """
    for attempt in range(tries):
        try:
            return await factory()
        except Exception as e:
            if attempt == tries - 1:
                logger.warning("%s failed after %d attempts (%s) — degrading", name, tries, e)
                return fallback
            await asyncio.sleep(1.2 * (attempt + 1))
    return fallback


def _hat_fallbacks() -> dict:
    return {
        "white":  WhiteHatOutput(facts=[], data_gaps=["White Hat was temporarily unavailable."]),
        "red":    RedHatOutput(gut_feeling="mixed", intuitions=[], emotional_concerns=["Red Hat was temporarily unavailable."]),
        "black":  BlackHatOutput(risks=[], hidden_assumptions=[], failure_scenarios=["Black Hat was temporarily unavailable."]),
        "yellow": YellowHatOutput(opportunities=[], best_scenarios=["Yellow Hat was temporarily unavailable."]),
        "green":  GreenHatOutput(alternatives=[], what_if=[], experiments=["Green Hat was temporarily unavailable."]),
    }


def _blue_fallback() -> BlueHatOutput:
    return BlueHatOutput(
        overall_assessment="uncertain",
        confidence_score=0,
        summary="Synthesis was temporarily unavailable due to a connection issue. Please re-run the analysis.",
        next_steps=["Re-run the analysis."],
    )


@dataclass
class RoundOneResult:
    white: WhiteHatOutput
    red: RedHatOutput
    black: BlackHatOutput
    yellow: YellowHatOutput
    green: GreenHatOutput
    blue: BlueHatOutput
    duration_seconds: float
    quality_log: list = field(default_factory=list)


async def _quality_loop(
    hat_name: str,
    model_cls,
    initial_output,
    topic: str,
    context: str | None,
    max_retries: int,
) -> tuple:
    """
    Evaluate quality of a hat's output. If score < threshold, refine and repeat.
    Returns (final_output, log_entries).

    max_retries=0 → no quality check, return as-is
    max_retries=1 → check once, refine at most once
    max_retries=2 → check + refine up to twice
    """
    output = initial_output
    log = []

    for attempt in range(max_retries):
        try:
            score, critique = await quality.evaluate(hat_name, topic, output.model_dump())
        except Exception:
            # Quality service unavailable (e.g. connection drop) — keep current output
            break

        entry = {"hat": hat_name, "attempt": attempt + 1, "score": score}

        if score >= QUALITY_THRESHOLD:
            entry["status"] = "passed"
            log.append(entry)
            break

        entry["status"] = "refining"
        entry["critique"] = critique
        log.append(entry)

        try:
            improved_dict = await refiner.refine(hat_name, topic, output.model_dump(), critique, context)
            output = model_cls(**improved_dict)
        except Exception:
            # Refine failed or validation failed — keep the previous output
            break

    return output, log


async def run(topic: str, context: str = None, max_retries: int = 1) -> RoundOneResult:
    """
    max_retries controls how many quality-refinement passes each hat gets.
      0 → original behaviour (single pass, no quality check)
      1 → check quality once, refine if needed  (quick-scan default)
      2 → up to 2 refinement passes             (full-prism default)
    """
    start = time.perf_counter()
    quality_log: list = []

    # ── Phase 1: Run all 5 hats in parallel (each with retry + degrade) ───────
    fb = _hat_fallbacks()
    white_raw, red_raw, black_raw, yellow_raw, green_raw = await asyncio.gather(
        _try_hat("White Hat",  lambda: hat_white.analyze(topic, context),  fb["white"]),
        _try_hat("Red Hat",    lambda: hat_red.analyze(topic, context),    fb["red"]),
        _try_hat("Black Hat",  lambda: hat_black.analyze(topic, context),  fb["black"]),
        _try_hat("Yellow Hat", lambda: hat_yellow.analyze(topic, context), fb["yellow"]),
        _try_hat("Green Hat",  lambda: hat_green.analyze(topic, context),  fb["green"]),
    )

    # ── Phase 2: Quality-loop all 5 in parallel ───────────────────────────────
    results = await asyncio.gather(
        _quality_loop("White Hat",  WhiteHatOutput,  white_raw,  topic, context, max_retries),
        _quality_loop("Red Hat",    RedHatOutput,    red_raw,    topic, context, max_retries),
        _quality_loop("Black Hat",  BlackHatOutput,  black_raw,  topic, context, max_retries),
        _quality_loop("Yellow Hat", YellowHatOutput, yellow_raw, topic, context, max_retries),
        _quality_loop("Green Hat",  GreenHatOutput,  green_raw,  topic, context, max_retries),
    )
    white, wlog = results[0]
    red,   rlog = results[1]
    black, bklog = results[2]
    yellow, ylog = results[3]
    green, glog  = results[4]
    quality_log.extend([*wlog, *rlog, *bklog, *ylog, *glog])

    # ── Phase 3: Blue Hat synthesizes from refined outputs (retry + degrade) ──
    blue_raw = await _try_hat(
        "Blue Hat",
        lambda: hat_blue.analyze(topic, white, red, black, yellow, green, context),
        _blue_fallback(),
    )
    blue, blog = await _quality_loop("Blue Hat", BlueHatOutput, blue_raw, topic, context, max_retries)
    quality_log.extend(blog)

    return RoundOneResult(
        white=white,
        red=red,
        black=black,
        yellow=yellow,
        green=green,
        blue=blue,
        duration_seconds=round(time.perf_counter() - start, 2),
        quality_log=quality_log,
    )
