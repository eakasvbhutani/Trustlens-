from typing import Dict, Any
from app.providers.base_provider import BaseDeepfakeProvider

class MockDeepfakeProvider(BaseDeepfakeProvider):
    def analyze_image(self, file_bytes: bytes, filename: str) -> Dict[str, Any]:
        fname_lower = filename.lower()
        
        # Comprehensive list of AI generation, synthetic, and generic web image indicators
        ai_keywords = [
            "deepfake", "fake", "ai", "synthetic", "midjourney", "dall", "dalle", 
            "stablediffusion", "sd", "flux", "grok", "chatgpt", "copilot", "bing", 
            "mj", "portrait", "avatar", "character", "art", "render", "anime", "style", 
            "prompt", "upscale", "v6", "v5", "download", "unnamed", "image", "file", 
            "temp", "attachment", "gen", "generated", "img_", "px", "out"
        ]
        
        authentic_keywords = ["dsc", "canon", "nikon", "sony", "iphone", "pixel", "raw", "photo_authentic"]

        is_authentic_name = any(k in fname_lower for k in authentic_keywords)
        is_ai_suspected = any(k in fname_lower for k in ai_keywords) or not is_authentic_name

        if is_ai_suspected and not is_authentic_name:
            return {
                "available": True,
                "risk_score": 88.5,
                "confidence": 92.0,
                "model_name": "TrustLens-Synthetic-Vision-v2",
                "status": "AI_INDICATORS_DETECTED",
                "findings": [
                    "High frequency spectral artifacts detected consistent with diffusion model latent space.",
                    "Unnatural skin texture smoothing and non-physical pupil reflection geometry.",
                    "Generative boundary bleeding identified around background visual elements.",
                    "Absence of physical camera hardware noise distribution profile."
                ]
            }
        elif "context" in fname_lower or "verify" in fname_lower:
            return {
                "available": True,
                "risk_score": 52.0,
                "confidence": 78.0,
                "model_name": "TrustLens-Synthetic-Vision-v2",
                "status": "INCONCLUSIVE",
                "findings": [
                    "Minor visual noise inconsistencies observed across foreground shadows.",
                    "No strong synthetic diffusion pattern detected.",
                    "Further context verification recommended."
                ]
            }
        else:
            return {
                "available": True,
                "risk_score": 12.0,
                "confidence": 89.0,
                "model_name": "TrustLens-Synthetic-Vision-v2",
                "status": "ORGANIC_PATTERN",
                "findings": [
                    "Sensor noise distribution conforms to physical camera hardware profiles.",
                    "Natural specular reflection geometry verified across high-contrast edges.",
                    "No synthetic diffusion artifacts detected."
                ]
            }
