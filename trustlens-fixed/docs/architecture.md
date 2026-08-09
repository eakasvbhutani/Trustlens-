# TrustLens System Architecture

"Before you trust it, verify it."

TrustLens is built using a clean monorepo architecture separating the Next.js presentation layer from the Python FastAPI analytical backend.

```mermaid
graph TD
    Client[Next.js 14 Frontend] -->|REST API / Multipart Upload| FastAPI[FastAPI Backend Server]
    FastAPI -->|1. Binary Payload| DeepfakeSvc[Deepfake Detection Service]
    FastAPI -->|2. Multimodal Vision| GeminiSvc[Google Gemini 2.5 Flash API]
    FastAPI -->|3. EXIF Bytes| MetadataSvc[EXIF Metadata Parser]
    FastAPI -->|4. Claims & Text| ContextSvc[Context Verification Engine]
    
    DeepfakeSvc -->|Risk Score & Findings| TrustEngine[Composite Trust Engine]
    GeminiSvc -->|Visual Anomaly JSON| TrustEngine
    MetadataSvc -->|EXIF Structure & Camera| TrustEngine
    ContextSvc -->|Claim Mismatch Status| TrustEngine
    
    TrustEngine -->|Composite Trust Score 0-100| PassportSvc[Verification Passport Service]
    PassportSvc -->|TL-XXXXXX Certificate & QR Code| Client
```

## Key Components

1. **Frontend Presentation Layer (`frontend/`)**:
   - Built with Next.js App Router, React, TypeScript, Tailwind CSS, and Framer Motion.
   - Operates dark cybersecurity UI design system.
   - Provides drag-and-drop file upload, animated stage progress, radial Trust Score gauge, interactive evidence flow graph, and QR code certificate generator.

2. **FastAPI Backend Server (`backend/`)**:
   - Built with FastAPI, Pydantic v2, Pillow, ExifRead, and Google GenAI SDK.
   - Implements provider design pattern for external AI models (`BaseDeepfakeProvider`, `MockDeepfakeProvider`, `HuggingFaceDeepfakeProvider`).
   - Feature flags controlled via `.env` configuration.
