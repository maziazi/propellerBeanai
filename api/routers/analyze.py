import uuid
from fastapi import APIRouter, BackgroundTasks, HTTPException
from models.request import AnalyzeRequest
from models.response import JobResponse, StatusResponse
import storage

router = APIRouter(tags=["analyze"])


async def _run_analysis(job_id: str, topic: str, service: str, context: str = None):
    from engine import runner, discussion

    try:
        storage.save(job_id, {"status": "processing", "topic": topic, "service": service})

        round1 = await runner.run(topic, context)

        data = {
            "status": "done",
            "topic": topic,
            "service": service,
            "duration_seconds": round1.duration_seconds,
            "white_hat":        round1.white.model_dump(),
            "red_hat":          round1.red.model_dump(),
            "black_hat":        round1.black.model_dump(),
            "yellow_hat":       round1.yellow.model_dump(),
            "green_hat":        round1.green.model_dump(),
            "initial_blue_hat": round1.blue.model_dump(),
        }

        if service == "full-prism":
            disc, final_blue = await discussion.run(topic, round1, context)
            data["discussion"]      = disc.model_dump()
            data["final_blue_hat"]  = final_blue.model_dump()

        data["proof"] = storage.make_proof(data)
        storage.save(job_id, data)

    except Exception as e:
        storage.save(job_id, {"status": "failed", "error": str(e)})


@router.post("/analyze", response_model=JobResponse)
async def analyze(body: AnalyzeRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())
    storage.save(job_id, {"status": "queued", "topic": body.topic, "service": body.service})

    estimated = 15 if body.service == "quick-scan" else 45
    background_tasks.add_task(_run_analysis, job_id, body.topic, body.service, body.context)

    return JobResponse(job_id=job_id, estimated_seconds=estimated)


@router.get("/status/{job_id}", response_model=StatusResponse)
async def get_status(job_id: str):
    data = storage.load(job_id)
    if data is None:
        raise HTTPException(status_code=404, detail="Job not found")

    return StatusResponse(
        job_id=job_id,
        status=data["status"],
        report_id=job_id if data["status"] == "done" else None,
        error=data.get("error"),
    )
