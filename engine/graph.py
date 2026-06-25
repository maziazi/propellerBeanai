import json
from pathlib import Path

import networkx as nx
from pyvis.network import Network

from clients import groq, GROQ_FAST

GRAPHS_DIR = Path(__file__).parent.parent / "reports" / "graphs"
GRAPHS_DIR.mkdir(parents=True, exist_ok=True)

_HAT_COLORS = {
    "white":  "#e0e0e0",
    "red":    "#ff6b6b",
    "black":  "#777777",
    "yellow": "#ffd93d",
    "green":  "#6bcb77",
    "blue":   "#4d96ff",
}

_EDGE_COLORS = {
    "supports":  "#6bcb77",
    "conflicts": "#ff6b6b",
    "builds_on": "#4d96ff",
    "questions": "#ffd93d",
}


def _summarize(report: dict) -> str:
    parts = []

    if wh := report.get("white_hat"):
        facts = "; ".join(f["claim"] for f in wh.get("facts", [])[:4])
        parts.append(f"WHITE HAT facts: {facts}")

    if rh := report.get("red_hat"):
        intuitions = "; ".join(rh.get("intuitions", [])[:3])
        parts.append(f"RED HAT feeling: {rh.get('gut_feeling')}. {intuitions}")

    if bk := report.get("black_hat"):
        risks = "; ".join(r["risk"] for r in bk.get("risks", [])[:4])
        parts.append(f"BLACK HAT risks: {risks}")

    if yh := report.get("yellow_hat"):
        opps = "; ".join(o["opportunity"] for o in yh.get("opportunities", [])[:4])
        parts.append(f"YELLOW HAT opportunities: {opps}")

    if gh := report.get("green_hat"):
        alts = "; ".join(gh.get("alternatives", [])[:3])
        parts.append(f"GREEN HAT alternatives: {alts}")

    if blue := report.get("final_blue_hat") or report.get("initial_blue_hat"):
        parts.append(f"BLUE HAT summary: {blue.get('summary', '')}")

    return "\n".join(parts)


async def _extract_entities_and_relations(summary: str) -> dict:
    prompt = f"""\
Extract entities and relationships from this 6-hat analysis for a knowledge graph.

Analysis:
{summary}

Return JSON with this exact structure:
{{
  "entities": [
    {{"id": "e1", "label": "concept name", "type": "fact|risk|opportunity|emotion|alternative|insight", "hat": "white|red|black|yellow|green|blue"}}
  ],
  "relations": [
    {{"from": "e1", "to": "e2", "type": "supports|conflicts|builds_on|questions", "label": "short verb phrase"}}
  ]
}}

Extract 8-15 entities and 6-12 relations. Prioritize the most important concepts and conflicts."""

    resp = await groq.chat.completions.create(
        model=GROQ_FAST,
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.3,
    )
    return json.loads(resp.choices[0].message.content)


def _to_networkx(graph_data: dict) -> nx.DiGraph:
    G = nx.DiGraph()

    for entity in graph_data.get("entities", []):
        G.add_node(
            entity["id"],
            label=entity.get("label", entity["id"]),
            type=entity.get("type", "concept"),
            hat=entity.get("hat", "blue"),
        )

    for rel in graph_data.get("relations", []):
        G.add_edge(
            rel["from"],
            rel["to"],
            type=rel.get("type", "builds_on"),
            label=rel.get("label", ""),
        )

    return G


def _to_pyvis(G: nx.DiGraph) -> Network:
    net = Network(
        height="620px",
        width="100%",
        directed=True,
        bgcolor="#1a1a2e",
        font_color="white",
    )
    net.set_options(json.dumps({
        "physics": {
            "enabled": True,
            "stabilization": {"iterations": 120},
            "barnesHut": {"gravitationalConstant": -8000},
        },
        "edges": {
            "arrows": {"to": {"enabled": True, "scaleFactor": 0.8}},
            "smooth": {"type": "curvedCW", "roundness": 0.2},
            "font": {"size": 10, "color": "#cccccc"},
        },
        "interaction": {"hover": True, "tooltipDelay": 100},
    }))

    for node_id, data in G.nodes(data=True):
        net.add_node(
            node_id,
            label=data.get("label", node_id),
            title=f"{data.get('type', 'concept')} — {data.get('hat', '')} hat",
            color=_HAT_COLORS.get(data.get("hat", "blue"), "#888888"),
            size=22,
        )

    for src, dst, data in G.edges(data=True):
        edge_type = data.get("type", "builds_on")
        net.add_edge(
            src, dst,
            label=data.get("label", ""),
            color=_EDGE_COLORS.get(edge_type, "#888888"),
            title=edge_type,
        )

    return net


async def build(job_id: str, report: dict) -> dict:
    summary = _summarize(report)
    graph_data = await _extract_entities_and_relations(summary)

    G = _to_networkx(graph_data)

    net = _to_pyvis(G)
    html_path = GRAPHS_DIR / f"{job_id}.html"
    net.save_graph(str(html_path))

    return {
        "html_path": str(html_path),
        "node_count": G.number_of_nodes(),
        "edge_count": G.number_of_edges(),
        "graph_data": graph_data,
    }
