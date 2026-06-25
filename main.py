from dotenv import load_dotenv
load_dotenv()

import uvicorn
from fastapi import FastAPI
from api.routers import utility, minds, analyze, report

app = FastAPI(
    title="PrismAI",
    description="6 Thinking Hats decision analysis engine — powered by CROO Agent Protocol",
    version="1.0.0",
)

app.include_router(utility.router, prefix="/api")
app.include_router(minds.router,   prefix="/api")
app.include_router(analyze.router, prefix="/api")
app.include_router(report.router,  prefix="/api")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
