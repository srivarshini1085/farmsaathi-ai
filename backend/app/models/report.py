from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class FarmerReport(BaseModel):
    id: str
    crop: str
    location: str
    title: str
    summary: str
    findings: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())
    analysis_source: str = "demo"
    metadata: Dict[str, Any] = Field(default_factory=dict)


class UserSettings(BaseModel):
    language: str = "en"
    default_crop: str = "Rice"
    default_location: str = "Hyderabad"
    voice_enabled: bool = True
    tts_enabled: bool = True
    notifications_enabled: bool = True
    dark_mode: bool = False
