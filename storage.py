import json
import hashlib
from datetime import datetime, timezone
from pathlib import Path

REPORTS_DIR = Path(__file__).parent / "reports"
REPORTS_DIR.mkdir(exist_ok=True)


def _path(job_id: str) -> Path:
    return REPORTS_DIR / f"{job_id}.json"


def save(job_id: str, data: dict) -> None:
    _path(job_id).write_text(json.dumps(data, ensure_ascii=False, indent=2))


def load(job_id: str) -> dict | None:
    path = _path(job_id)
    if not path.exists():
        return None
    return json.loads(path.read_text())


def exists(job_id: str) -> bool:
    return _path(job_id).exists()


def make_proof(data: dict) -> dict:
    content = json.dumps(data, sort_keys=True, ensure_ascii=False)
    return {
        "sha256": hashlib.sha256(content.encode()).hexdigest(),
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }
