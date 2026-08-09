import requests
from typing import Dict, Any

from app.config import settings
from app.providers.base_provider import BaseDeepfakeProvider
from app.providers.mock_provider import MockDeepfakeProvider
from app.schemas.analysis import AIGenerationResult


class HuggingFaceDeepfakeProvider(BaseDeepfakeProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key

        # NOTE: the old legacy endpoint (api-inference.huggingface.co) was
        # fully decommissioned in late 2025 and now returns 404/410 for
        # every request. The replacement is the "router" endpoint below,
        # which proxies to the hf-inference provider.
        self.api_url = (
            "https://router.huggingface.co/hf-inference/models/"
            "dima806/deepfake_vs_real_image_detection"
        )

    def analyze_image(
        self, file_bytes: bytes, filename: str
    ) -> Dict[str, Any]:

        if not self.api_key:
            return MockDeepfakeProvider().analyze_image(
                file_bytes, filename
            )

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/octet-stream",
        }

        try:
            response = requests.post(
                self.api_url,
                headers=headers,
                data=file_bytes,
                timeout=30,
            )

            print("HF STATUS:", response.status_code)
            print("HF RESPONSE:", response.text)

            if response.status_code == 200:
                results = response.json()

                fake_score = 0.0

                for item in results:
                    label = item.get("label", "").lower()
                    score = float(item.get("score", 0.0))

                    if label in [
                        "fake",
                        "artificial",
                        "synthetic",
                        "ai",
                    ]:
                        fake_score = score * 100.0

                status = (
                    "AI_INDICATORS_DETECTED"
                    if fake_score > 60
                    else (
                        "INCONCLUSIVE"
                        if fake_score > 30
                        else "ORGANIC_PATTERN"
                    )
                )

                findings = [
                    f"Hugging Face deepfake classification "
                    f"model output: {fake_score:.1f}% AI probability.",
                    "Analyzed image features using the "
                    "Hugging Face deepfake classification model."
                ]

                return {
                    "available": True,
                    "risk_score": fake_score,
                    "confidence": 85.0,
                    "model_name": (
                        "HuggingFace "
                        "dima806/deepfake_vs_real"
                    ),
                    "status": status,
                    "findings": findings,
                }

            else:
                print(
                    "Hugging Face API failed:",
                    response.status_code,
                )

                fallback = MockDeepfakeProvider().analyze_image(
                    file_bytes, filename
                )

                fallback["model_name"] += " (HF API Fallback)"

                return fallback

        except Exception as e:
            print("HF ERROR:", repr(e))

            fallback = MockDeepfakeProvider().analyze_image(
                file_bytes, filename
            )

            fallback["model_name"] += " (Network Fallback)"

            return fallback


class DeepfakeService:
    def __init__(self):
        print(
            "Provider:",
            settings.DEEPFAKE_PROVIDER
        )

        print(
            "HF Key exists:",
            bool(settings.HUGGINGFACE_API_KEY)
        )

        if (
            settings.DEEPFAKE_PROVIDER == "huggingface"
            and settings.HUGGINGFACE_API_KEY
        ):
            print("Using HuggingFace")

            self.provider = HuggingFaceDeepfakeProvider(
                settings.HUGGINGFACE_API_KEY
            )

        else:
            print("Using MOCK")

            self.provider = MockDeepfakeProvider()

    def analyze(
        self,
        file_bytes: bytes,
        filename: str
    ) -> AIGenerationResult:
        raw = self.provider.analyze_image(
            file_bytes,
            filename
        )

        # Providers return a plain dict (risk_score/model_name); the rest
        # of the app (trust_engine, response schema) expects the
        # AIGenerationResult pydantic model (score/model_used). Convert here
        # so callers never have to deal with the raw provider shape.
        return AIGenerationResult(
            score=raw["risk_score"],
            status=raw["status"],
            confidence=raw["confidence"],
            findings=raw["findings"],
            model_used=raw["model_name"],
        )


deepfake_service = DeepfakeService()
