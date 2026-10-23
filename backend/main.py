from __future__ import annotations

import os
from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router as api_router
from app.core.config import get_settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    app.state.settings = settings
    yield


app = FastAPI(
    title="FarmSaathi AI API",
    description="AI-powered agricultural assistant for farmer support and crop health analysis",
    version="1.0.0",
    lifespan=lifespan,
)

origins = [origin.strip() for origin in get_settings().allow_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")


@app.get("/health")
async def root_health() -> dict[str, str]:
    return {"status": "ok", "service": "FarmSaathi AI API"}
