import uuid
from pathlib import Path
from fastapi import APIRouter, BackgroundTasks, HTTPException
from fastapi.responses import FileResponse
import storage

router = APIRouter(tags=["report"])


@router.get("/report/{job_id}")
async def get_report(job_id: str):
    data = storage.load(job_id)
    if data is None:
        raise HTTPException(status_code=404, detail="Report not found")
    if data["status"] != "done":
        raise HTTPException(status_code=202, detail=f"Report not ready. Status: {data['status']}")
    return data


@router.post("/discuss/{job_id}")
async def trigger_discussion(job_id: str, background_tasks: BackgroundTasks):
    data = storage.load(job_id)
    if data is None:
        raise HTTPException(status_code=404, detail="Report not found")
    if data["status"] != "done":
        raise HTTPException(status_code=400, detail="Analysis must complete before discussion")
    if data.get("discussion"):
        raise HTTPException(status_code=400, detail="Discussion already exists for this report")

    discuss_job_id = str(uuid.uuid4())

    async def _run():
        from engine import discussion as disc_engine
        from engine.runner import RoundOneResult
        from models.response import (
            WhiteHatOutput, RedHatOutput, BlackHatOutput,
            YellowHatOutput, GreenHatOutput, BlueHatOutput,
        )

        try:
            storage.save(discuss_job_id, {"status": "processing", "parent_job_id": job_id})

            round1 = RoundOneResult(
                white=WhiteHatOutput(**data["white_hat"]),
                red=RedHatOutput(**data["red_hat"]),
                black=BlackHatOutput(**data["black_hat"]),
                yellow=YellowHatOutput(**data["yellow_hat"]),
                green=GreenHatOutput(**data["green_hat"]),
                blue=BlueHatOutput(**data["initial_blue_hat"]),
                duration_seconds=data.get("duration_seconds", 0),
            )

            disc, final_blue = await disc_engine.run(data["topic"], round1)

            updated = {
                **data,
                "discussion":     disc.model_dump(),
                "final_blue_hat": final_blue.model_dump(),
            }
            updated["proof"] = storage.make_proof(updated)
            storage.save(job_id, updated)
            storage.save(discuss_job_id, {"status": "done", "parent_job_id": job_id})

        except Exception as e:
            storage.save(discuss_job_id, {"status": "failed", "error": str(e)})

    background_tasks.add_task(_run)
    return {"job_id": discuss_job_id, "parent_job_id": job_id, "estimated_seconds": 30}


@router.get("/graph/{job_id}")
async def get_graph(job_id: str):
    data = storage.load(job_id)
    if data is None:
        raise HTTPException(status_code=404, detail="Report not found")
    if data.get("status") != "done":
        raise HTTPException(status_code=202, detail=f"Report not ready. Status: {data['status']}")

    graph = data.get("graph")
    if not graph or graph.get("error"):
        raise HTTPException(status_code=404, detail="Graph not available for this report")

    html_path = Path(graph["html_path"])
    if not html_path.exists():
        raise HTTPException(status_code=404, detail="Graph file not found on server")

    return FileResponse(html_path, media_type="text/html")
