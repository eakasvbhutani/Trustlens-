# TrustLens AI & Multimodal Analysis Pipeline

TrustLens separates specialized synthetic deepfake detection from multimodal reasoning to ensure high accuracy without relying on Gemini as a dedicated deepfake classifier.

## 1. Multimodal Reasoning (Google Gemini 2.5 Flash API)

The `gemini_service.py` module passes media payloads to Google Gemini 2.5 Flash API with a structured system prompt requesting JSON output:

```json
{
  "manipulation_score": 82.0,
  "manipulation_status": "MANIPULATION_DETECTED",
  "manipulation_findings": [
    "Unnatural light reflection convergence on facial eye region",
    "Generative border blur along background foliage"
  ],
  "extracted_text": "BREAKING NEWS EVENT 2026",
  "claims": ["Claims event occurred in 2026"],
  "context_score": 65.0,
  "context_status": "MISMATCH_SUSPECTED",
  "context_findings": ["Headline text conflicts with underlying photo archive date."],
  "overall_explanation": "Multimodal analysis flagged lighting divergence and context mismatch."
}
```

## 2. Specialized Deepfake Detection Provider

The `deepfake_service.py` uses a provider abstraction layer (`BaseDeepfakeProvider`).
- **Real Provider**: Connects to Hugging Face Inference API (`dima806/deepfake_vs_real_image_detection`).
- **Mock Fallback**: Automatically activates when `DEMO_MODE=true` or API keys are unconfigured.

## 3. EXIF & Forensic Metadata Engine

`metadata_service.py` inspects EXIF tags using PIL and ExifRead:
- Checks for camera Make/Model tags.
- Flags AI generation software tags (e.g. Midjourney, Stable Diffusion, Photoshop Generative Fill).
- Redacts GPS coordinates for user privacy while reporting `location_summary`.
