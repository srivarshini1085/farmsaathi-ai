from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "FarmSaathi AI"
    app_mode: str = "demo"
    aws_region: str = "us-east-1"
    bedrock_model_id: str = "amazon.nova-lite-v1:0"
    weather_api_key: str = ""
    aws_access_key_id: str = ""
    aws_secret_access_key: str = ""
    allow_origins: str = "http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000"
    storage_path: str = "/tmp/farmsaathi_reports.db"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
