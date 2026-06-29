from dotenv import load_dotenv
load_dotenv()

import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers import utility, minds, analyze, report

app = FastAPI(
    title="BeanAI",
    description="6 Thinking Hats decision analysis engine — powered by CROO Agent Protocol",
    version="1.0.0",
)

_origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
if os.getenv("FRONTEND_URL"):
    _origins.append(os.getenv("FRONTEND_URL"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(utility.router, prefix="/api")
app.include_router(minds.router,   prefix="/api")
app.include_router(analyze.router, prefix="/api")
app.include_router(report.router,  prefix="/api")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
