import asyncio
import time
from dataclasses import dataclass

from minds import hat_white, hat_red, hat_black, hat_yellow, hat_green, hat_blue
from models.response import (
    WhiteHatOutput, RedHatOutput, BlackHatOutput,
    YellowHatOutput, GreenHatOutput, BlueHatOutput,
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


async def run(topic: str, context: str = None) -> RoundOneResult:
    start = time.perf_counter()

    white, red, black, yellow, green = await asyncio.gather(
        hat_white.analyze(topic, context),
        hat_red.analyze(topic, context),
        hat_black.analyze(topic, context),
        hat_yellow.analyze(topic, context),
        hat_green.analyze(topic, context),
    )

    blue = await hat_blue.analyze(topic, white, red, black, yellow, green, context)

    return RoundOneResult(
        white=white,
        red=red,
        black=black,
        yellow=yellow,
        green=green,
        blue=blue,
        duration_seconds=round(time.perf_counter() - start, 2),
    )
