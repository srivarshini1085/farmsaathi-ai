from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List

from app.models.report import FarmerReport, UserSettings


class LocalReportStore:
    def __init__(self, storage_path: str = "/tmp/farmsaathi_reports.db") -> None:
        self.path = Path(storage_path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        if not self.path.exists():
            self.path.write_text("{\n  \"reports\": [],\n  \"settings\": {\n    \"language\": \"en\",\n    \"default_crop\": \"Rice\",\n    \"default_location\": \"Hyderabad\",\n    \"voice_enabled\": true,\n    \"tts_enabled\": true,\n    \"notifications_enabled\": true,\n    \"dark_mode\": false\n  }\n}\n", encoding="utf-8")

    def _load(self) -> Dict[str, Any]:
        return json.loads(self.path.read_text(encoding="utf-8"))

    def _save(self, payload: Dict[str, Any]) -> None:
        self.path.write_text(json.dumps(payload, indent=2), encoding="utf-8")

    def list_reports(self) -> List[Dict[str, Any]]:
        return self._load().get("reports", [])

    def add_report(self, report: FarmerReport) -> FarmerReport:
        payload = self._load()
        payload.setdefault("reports", []).append(report.model_dump(mode="json"))
        self._save(payload)
        return report

    def get_settings(self) -> UserSettings:
        payload = self._load()
        settings = payload.get("settings", {})
        return UserSettings(**settings)

    def update_settings(self, settings: UserSettings) -> UserSettings:
        payload = self._load()
        payload["settings"] = settings.model_dump(mode="json")
        self._save(payload)
        return settings
