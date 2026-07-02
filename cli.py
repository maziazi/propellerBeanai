#!/usr/bin/env python3
"""
BeanAI CLI — Six Thinking Hats decision analysis in your terminal.

Usage:
  python cli.py "Should I pivot my SaaS to B2B?"
  python cli.py "Should I raise a seed round?" --full
  python cli.py "Open a coffee shop?" --api http://localhost:8000
"""
from __future__ import annotations

import json
import sys
import time
from typing import Optional

import httpx
import typer
from rich import box
from rich.columns import Columns
from rich.console import Console
from rich.live import Live
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn, TimeElapsedColumn
from rich.prompt import Prompt
from rich.table import Table
from rich.text import Text

app    = typer.Typer(add_completion=False, help="BeanAI — Six Thinking Hats decision analysis.")
con    = Console()

BLUE   = "#4182EB"
GREEN  = "#169F53"
YELLOW = "#F6BB14"
RED    = "#E24231"
GREY   = "#9AA0A6"

MIND_STYLES: dict[str, dict] = {
    "fact":  {"label": "FACT",  "color": "bold blue",          "panel_style": "blue"},
    "feel":  {"label": "FEEL",  "color": "bold red",           "panel_style": "red"},
    "risk":  {"label": "RISK",  "color": "bold bright_black",  "panel_style": "bright_black"},
    "gain":  {"label": "GAIN",  "color": "bold yellow",        "panel_style": "yellow"},
    "wild":  {"label": "WILD",  "color": "bold green",         "panel_style": "green"},
    "merge": {"label": "MERGE", "color": "bold blue",          "panel_style": "blue"},
}

VERDICT_STYLE: dict[str, tuple[str, str]] = {
    "GO":    ("bold green",  "✓ GO"),
    "NO":    ("bold red",    "✕ NO"),
    "MIXED": ("bold yellow", "~ MIXED"),
    "WAIT":  ("bold white",  "○ WAIT"),
}

ASSESSMENT_MAP = {
    "positive":  "GO",
    "negative":  "NO",
    "mixed":     "MIXED",
    "uncertain": "WAIT",
}

POLL_INTERVAL = 2.5  # seconds between status checks
MAX_WAIT      = 300  # seconds before giving up


# ── API helpers ───────────────────────────────────────────────────────────────

def _api(base: str, method: str, path: str, **kwargs):
    url = f"{base.rstrip('/')}{path}"
    r = httpx.request(method, url, timeout=30, **kwargs)
    r.raise_for_status()
    return r.json()


def clarify(base: str, topic: str) -> dict:
    return _api(base, "POST", "/api/clarify", json={"topic": topic})


def analyze(base: str, topic: str, service: str, context: Optional[str] = None) -> str:
    body: dict = {"topic": topic, "service": service}
    if context:
        body["context"] = context
    data = _api(base, "POST", "/api/analyze", json=body)
    return data["job_id"]


def poll_status(base: str, job_id: str) -> dict:
    return _api(base, "GET", f"/api/status/{job_id}")


def fetch_report(base: str, job_id: str) -> dict:
    return _api(base, "GET", f"/api/report/{job_id}")


# ── Rendering ─────────────────────────────────────────────────────────────────

def _mind_panel(key: str, content: str, sources: list[dict]) -> Panel:
    style = MIND_STYLES.get(key, {"label": key.upper(), "color": "white", "panel_style": "white"})
    body = Text(content.strip(), overflow="fold")

    if sources:
        body.append("\n\nSources\n", style="dim")
        for s in sources[:3]:
            body.append(f"  · {s.get('title', s.get('url', ''))}\n", style="dim cyan")

    return Panel(
        body,
        title=f"[{style['color']}]{style['label']}[/]",
        border_style=style["panel_style"],
        padding=(0, 1),
    )


def _receipt_panel(report: dict, job_id: str) -> Optional[Panel]:
    proof = report.get("proof", {})
    sha   = proof.get("sha256")
    if not sha:
        return None

    blue    = report.get("final_blue_hat") or report.get("initial_blue_hat") or {}
    assess  = blue.get("overall_assessment", "")
    verdict = ASSESSMENT_MAP.get(assess, "—")
    score   = blue.get("confidence_score", "—")
    ts      = proof.get("generated_at", "—")

    t = Table.grid(padding=(0, 2))
    t.add_column(style="green", no_wrap=True)
    t.add_column(style="white")
    t.add_row("Topic",   report.get("topic", "—")[:60])
    t.add_row("Time",    ts[:19].replace("T", " ") + " UTC" if "T" in ts else ts)
    t.add_row("Minds",   "FACT  FEEL  RISK  GAIN  WILD  MERGE")
    t.add_row("Verdict", verdict)
    t.add_row("Score",   f"{score}%")
    t.add_row("SHA-256", f"[dim]{sha}[/dim]")
    t.add_row("ID",      f"[dim]{job_id}[/dim]")

    return Panel(t, title="[bold green]BeanAI Decision Receipt[/]", border_style="green", padding=(0, 1))


def _render_report(report: dict, job_id: str) -> None:
    topic = report.get("topic", "")
    blue  = report.get("final_blue_hat") or report.get("initial_blue_hat") or {}

    # ── Verdict header ────────────────────────────────────────────────────────
    assess  = blue.get("overall_assessment", "")
    verdict = ASSESSMENT_MAP.get(assess, "")
    score   = blue.get("confidence_score", "—")

    if verdict in VERDICT_STYLE:
        vstyle, vlabel = VERDICT_STYLE[verdict]
        con.print()
        con.print(f"  [{vstyle}]{vlabel}[/]  [dim]Confidence: {score}%[/dim]  [dim]—  {topic}[/dim]")
        con.print()
    else:
        con.print(f"\n  [dim]{topic}[/dim]\n")

    # ── Six mind panels ───────────────────────────────────────────────────────
    HAT_MAP = [
        ("fact",  report.get("white_hat")),
        ("feel",  report.get("red_hat")),
        ("risk",  report.get("black_hat")),
        ("gain",  report.get("yellow_hat")),
        ("wild",  report.get("green_hat")),
        ("merge", blue),
    ]

    for key, hat in HAT_MAP:
        if not hat:
            continue

        # Build content from hat fields
        lines: list[str] = []
        style = MIND_STYLES[key]

        if key == "fact":
            for f in (hat.get("facts") or [])[:5]:
                claim = f.get("claim", str(f))
                src   = f" — {f['source']}" if isinstance(f, dict) and f.get("source") else ""
                lines.append(f"· {claim}{src}")
            gaps = hat.get("data_gaps") or []
            if gaps:
                lines.append("\nData gaps:")
                for g in gaps[:2]:
                    lines.append(f"  · {g}")

        elif key == "feel":
            if hat.get("gut_feeling"):
                lines.append(f"Gut: {hat['gut_feeling']}")
            for i in (hat.get("intuitions") or [])[:3]:
                lines.append(f"· {i}")

        elif key == "risk":
            for r in (hat.get("risks") or [])[:4]:
                risk = r.get("risk", str(r)) if isinstance(r, dict) else str(r)
                sev  = f" [{r['severity']}]" if isinstance(r, dict) and r.get("severity") else ""
                lines.append(f"· {risk}{sev}")

        elif key == "gain":
            for o in (hat.get("opportunities") or [])[:4]:
                opp = o.get("opportunity", str(o)) if isinstance(o, dict) else str(o)
                lines.append(f"· {opp}")

        elif key == "wild":
            for a in (hat.get("alternatives") or [])[:3]:
                lines.append(f"· {a}")
            for w in (hat.get("what_if") or [])[:2]:
                lines.append(f"? {w}")

        elif key == "merge":
            if hat.get("summary"):
                lines.append(hat["summary"])
            if hat.get("recommended_action"):
                lines.append(f"\nRecommendation: {hat['recommended_action']}")
            steps = hat.get("next_steps") or []
            if steps:
                lines.append("\nNext steps:")
                for s in steps[:3]:
                    lines.append(f"  {s}")

        content = "\n".join(lines) if lines else "(no output)"
        sources = []
        if key == "fact":
            verified = report.get("verified_sources") or []
            sources  = verified[:3]

        con.print(_mind_panel(key, content, sources))

    # ── Decision Receipt ──────────────────────────────────────────────────────
    receipt = _receipt_panel(report, job_id)
    if receipt:
        con.print()
        con.print(receipt)
    else:
        con.print("\n[dim]No SHA-256 receipt available for this report.[/dim]")

    con.print()


# ── Main command ──────────────────────────────────────────────────────────────

@app.command()
def main(
    topic: str = typer.Argument(..., help="The decision or question to analyze."),
    full:  bool = typer.Option(False, "--full", "-f", help="Run Full Analysis (Round 2 debate). Slower, deeper."),
    api:   str  = typer.Option("http://localhost:8000", "--api", envvar="BEANAI_API", help="BeanAI API base URL."),
    no_clarify: bool = typer.Option(False, "--no-clarify", help="Skip clarification step and analyze directly."),
) -> None:
    service = "full-prism" if full else "quick-scan"
    label   = "Full Analysis" if full else "Quick Scan"
    context: Optional[str] = None

    con.print()
    con.print(Panel(
        f"[bold]{topic}[/bold]",
        title=f"[blue]BeanAI[/blue] · {label}",
        border_style="blue",
        padding=(0, 1),
    ))

    # ── Clarify ───────────────────────────────────────────────────────────────
    if not no_clarify:
        try:
            with con.status("[dim]Checking topic clarity...[/dim]", spinner="dots"):
                result = clarify(api, topic)

            if result.get("is_vague") and result.get("questions"):
                con.print("\n[yellow]A few clarifying questions:[/yellow]\n")
                context_parts: list[str] = []

                for q in result["questions"]:
                    con.print(f"  [bold]{q['question']}[/bold]")
                    opts = q.get("options", [])
                    if opts:
                        for idx, opt in enumerate(opts, 1):
                            con.print(f"    {idx}. {opt['label']}")
                        raw = Prompt.ask("  Your choice (number or custom text)", default="")
                        if raw.isdigit() and 1 <= int(raw) <= len(opts):
                            context_parts.append(f"{q['question']}: {opts[int(raw)-1]['value']}")
                        elif raw.strip():
                            context_parts.append(f"{q['question']}: {raw.strip()}")
                    else:
                        raw = Prompt.ask("  Your answer", default="")
                        if raw.strip():
                            context_parts.append(f"{q['question']}: {raw.strip()}")
                    con.print()

                if context_parts:
                    context = "; ".join(context_parts)
        except Exception as e:
            con.print(f"[dim]Clarification skipped: {e}[/dim]")

    # ── Submit analysis ───────────────────────────────────────────────────────
    try:
        with con.status("[dim]Submitting to BeanAI...[/dim]", spinner="dots"):
            job_id = analyze(api, topic, service, context)
        con.print(f"[dim]Job: {job_id[:8]}…[/dim]")
    except Exception as e:
        con.print(f"[red]Failed to start analysis: {e}[/red]")
        raise typer.Exit(1)

    # ── Poll until done ───────────────────────────────────────────────────────
    est = 35 if service == "quick-scan" else 160
    start = time.time()

    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        TimeElapsedColumn(),
        console=con,
        transient=True,
    ) as progress:
        task = progress.add_task(f"Six minds analyzing… (~{est}s)", total=None)

        while True:
            elapsed = time.time() - start
            if elapsed > MAX_WAIT:
                con.print("[red]Timed out waiting for analysis.[/red]")
                raise typer.Exit(1)

            time.sleep(POLL_INTERVAL)

            try:
                st = poll_status(api, job_id)
            except Exception:
                continue

            if st["status"] == "done":
                break
            elif st["status"] == "failed":
                con.print(f"[red]Analysis failed: {st.get('error', 'unknown')}[/red]")
                raise typer.Exit(1)

            progress.update(task, description=f"Six minds analyzing… ({int(elapsed)}s elapsed)")

    # ── Fetch and render ──────────────────────────────────────────────────────
    try:
        with con.status("[dim]Fetching report...[/dim]", spinner="dots"):
            report = fetch_report(api, job_id)
    except Exception as e:
        con.print(f"[red]Failed to fetch report: {e}[/red]")
        raise typer.Exit(1)

    _render_report(report, job_id)


if __name__ == "__main__":
    app()
