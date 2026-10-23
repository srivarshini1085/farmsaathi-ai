from __future__ import annotations

from typing import List


class DemoProvider:
    @staticmethod
    def generate_chat_response(prompt: str, context: dict | None = None) -> dict:
        context = context or {}
        crop = context.get("crop") or "rice"
        location = context.get("location") or "your field"
        stage = context.get("growth_stage") or "early growth stage"
        soil = context.get("soil_type") or "loamy soil"

        return {
            "answer": (
                f"Demo response for {crop} in {location}:\n"
                "1. Check soil moisture before irrigation and water only when the top layer has dried sufficiently.\n"
                "2. Inspect leaves for yellowing, wilting or spots, and compare them to the crop stage ({stage}) before applying any treatment.\n"
                "3. Maintain a balanced nutrient plan and ensure drainage is adequate in {soil}.\n"
                "4. Keep field records of weather changes, pests, and irrigation timing to improve decisions over the season.\n\n"
                "This is a clearly labelled demo answer and should be treated as a starting point, not a guaranteed recommendation."
            ),
            "sources": [
                "Demo generic agronomy guidance",
                "Field observation checklist",
            ],
            "demo_mode": True,
            "provider": "demo",
            "warnings": [
                "This response is simulated for local demo use only. Verify guidance with local agricultural advisories before applying treatment or changing irrigation practices."
            ],
        }

    @staticmethod
    def generate_crop_analysis(data: dict) -> dict:
        crop = data.get("crop") or "Tomato"
        symptoms = data.get("symptoms") or "Leaf discoloration and mild wilting"
        return {
            "selected_crop": crop,
            "visible_symptoms": [symptoms],
            "possible_causes": [
                "Water stress or nutrient imbalance",
                "Early fungal pressure during humid conditions",
                "Insect activity in stressed plants",
            ],
            "alternative_explanations": [
                "Temporary leaf burn from intense sunlight",
                "Movement of soil or nutrient variation across rows",
            ],
            "confidence_summary": "This is a demo simulation and not a definitive diagnosis. It highlights likely causes based on the crop and symptoms provided.",
            "recommended_next_steps": [
                "Compare symptoms across healthy and affected plants.",
                "Check leaf undersides and stem base for pests or lesions.",
                "Review recent irrigation and rainfall patterns before making treatment decisions.",
            ],
            "preventive_practices": [
                "Use spacing and airflow management to reduce disease pressure.",
                "Avoid overhead watering late in the day.",
                "Keep the field and surrounding areas clean from infected residues.",
            ],
            "contact_expert_when": "Consult a local agriculture officer if symptoms spread rapidly, multiple growth stages are affected, or there is severe crop loss.",
            "demo_mode": True,
            "provider": "demo",
        }

    @staticmethod
    def get_weather(location: str) -> dict:
        return {
            "location": location,
            "source": "demo weather provider",
            "provider": "demo",
            "demo_mode": True,
            "current": {
                "temperature_c": 29,
                "humidity_pct": 68,
                "precipitation_mm": 8,
                "wind_kph": 12,
                "condition": "Partly cloudy",
            },
            "forecast": [
                {"day": "Today", "temperature_c": 29, "condition": "Partly cloudy", "rain_chance_pct": 25},
                {"day": "Tomorrow", "temperature_c": 31, "condition": "Sunny", "rain_chance_pct": 15},
                {"day": "Day 3", "temperature_c": 28, "condition": "Light rain", "rain_chance_pct": 60},
            ],
            "alerts": ["Check irrigation scheduling if the next 24 hours remain dry."]
        }

    @staticmethod
    def guides() -> list[dict]:
        return [
            {
                "id": "rice-ideal-water",
                "title": "Rice irrigation timing",
                "crop": "Rice",
                "category": "Watering",
                "summary": "Maintain consistent moisture at critical growth stages while avoiding prolonged waterlogging.",
                "content": "Monitor field conditions carefully and time irrigation to prevent stress while keeping the root zone active. In flooded rice systems, avoid long dry periods during tillering and flowering. Always adjust practice to soil texture and local rainfall."
            },
            {
                "id": "tomato-soil-prep",
                "title": "Tomato soil preparation",
                "crop": "Tomato",
                "category": "Soil preparation",
                "summary": "Prepare raised beds with good drainage and organic matter.",
                "content": "Add compost or farmyard manure before transplanting, then ensure the field drains well. Healthy root development depends on a loose, aerated bed and stable moisture."
            },
        ]
