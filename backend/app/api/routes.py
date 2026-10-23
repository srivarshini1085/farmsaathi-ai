from __future__ import annotations

from datetime import datetime
from typing import Any, List

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from app.core.config import get_settings as load_settings
from app.models.report import FarmerReport, UserSettings
from app.repositories.report_store import LocalReportStore
from app.services.demo_provider import DemoProvider

router = APIRouter()


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    crop: str | None = None
    location: str | None = None
    soil_type: str | None = None
    growth_stage: str | None = None


class ChatResponse(BaseModel):
    answer: str
    sources: list[str]
    demo_mode: bool = True
    provider: str = "demo"
    warnings: list[str] = Field(default_factory=list)


class CropAnalysisRequest(BaseModel):
    crop: str = Field(..., min_length=1)
    symptoms: str = Field(..., min_length=1)
    location: str | None = None
    notes: str | None = None


class WeatherResponse(BaseModel):
    location: str
    source: str
    provider: str
    demo_mode: bool = True
    current: dict[str, Any]
    forecast: list[dict[str, Any]]
    alerts: list[str]


class GuideItem(BaseModel):
    id: str
    title: str
    crop: str
    category: str
    summary: str
    content: str


class ReportCreateRequest(BaseModel):
    crop: str = Field(..., min_length=1)
    location: str = Field(..., min_length=1)
    title: str = Field(..., min_length=1)
    summary: str = Field(..., min_length=1)
    findings: list[str] = Field(default_factory=list)
    analysis_source: str = "demo"
    metadata: dict[str, Any] = Field(default_factory=dict)


@router.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "FarmSaathi AI API"}


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    settings = load_settings()
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    response = DemoProvider.generate_chat_response(request.message, {
        "crop": request.crop,
        "location": request.location,
        "soil_type": request.soil_type,
        "growth_stage": request.growth_stage,
    })

    if settings.app_mode != "demo":
        raise HTTPException(status_code=501, detail="Real Bedrock integrations are not configured in this environment.")

    return ChatResponse(**response)


@router.post("/crop-analysis")
async def crop_analysis(request: CropAnalysisRequest) -> dict[str, Any]:
    settings = load_settings()
    if settings.app_mode != "demo":
        raise HTTPException(status_code=501, detail="Real image analysis is not configured in this environment.")

    analysis = DemoProvider.generate_crop_analysis({
        "crop": request.crop,
        "symptoms": request.symptoms,
        "location": request.location,
        "notes": request.notes,
    })
    return analysis


@router.get("/weather", response_model=WeatherResponse)
async def weather(location: str = Query(..., min_length=1)) -> WeatherResponse:
    settings = load_settings()
    payload = DemoProvider.get_weather(location)
    if not settings.weather_api_key:
        payload["provider"] = "demo"
        payload["demo_mode"] = True
    return WeatherResponse(**payload)


@router.get("/guides")
async def guides(crop: str | None = None, category: str | None = None) -> dict[str, List[GuideItem]]:
    items = DemoProvider.guides()
    if crop:
        items = [item for item in items if item["crop"].lower() == crop.lower()]
    if category:
        items = [item for item in items if item["category"].lower() == category.lower()]
    return {"items": [GuideItem(**item) for item in items]}


@router.get("/reports")
async def list_reports() -> dict[str, list[dict[str, Any]]]:
    store = LocalReportStore(load_settings().storage_path)
    return {"items": store.list_reports()}


@router.post("/reports")
async def create_report(request: ReportCreateRequest) -> dict[str, Any]:
    store = LocalReportStore(load_settings().storage_path)
    report = FarmerReport(
        id=f"report-{int(datetime.utcnow().timestamp())}",
        crop=request.crop,
        location=request.location,
        title=request.title,
        summary=request.summary,
        findings=request.findings,
        analysis_source=request.analysis_source,
        metadata=request.metadata,
    )
    saved = store.add_report(report)
    return {"message": "Report saved successfully", "report": saved.model_dump(mode="json")}


@router.get("/settings")
async def read_settings() -> UserSettings:
    store = LocalReportStore(load_settings().storage_path)
    return store.get_settings()


@router.put("/settings")
async def update_settings(payload: UserSettings) -> UserSettings:
    store = LocalReportStore(load_settings().storage_path)
    return store.update_settings(payload)
