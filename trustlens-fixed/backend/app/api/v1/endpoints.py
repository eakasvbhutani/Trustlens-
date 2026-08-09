import uuid
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query, Request
from starlette.concurrency import run_in_threadpool
from app.config import settings
from app.schemas.analysis import AnalysisResponse
from app.schemas.passport import PassportResponse
from app.services.deepfake_service import deepfake_service
from app.services.gemini_service import gemini_service
from app.services.metadata_service import metadata_service
from app.services.context_service import context_service
from app.services.trust_engine import trust_engine
from app.services.report_service import report_service

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "demo_mode": settings.DEMO_MODE,
        "deepfake_provider": settings.DEEPFAKE_PROVIDER
    }

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_media(
    request: Request,
    file: UploadFile = File(...)
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided.")
        
    ext = file.filename.split(".")[-1].lower() if "." in file.filename else ""
    is_video = ext in settings.ALLOWED_VIDEO_EXTENSIONS
    is_image = ext in settings.ALLOWED_IMAGE_EXTENSIONS
    
    if not (is_image or is_video):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Allowed image: {settings.ALLOWED_IMAGE_EXTENSIONS}, video: {settings.ALLOWED_VIDEO_EXTENSIONS}"
        )
        
    # Extension alone is trivially spoofed, so reject a declared MIME type that
    # contradicts it before spending a billed provider call on the payload.
    # Clients that declare nothing (or a generic binary type) are not treated as a
    # contradiction — the extension check above still applies — otherwise legitimate
    # uploads from clients that omit the part header would be rejected outright.
    UNSPECIFIED_MIME_TYPES = {None, "", "application/octet-stream", "binary/octet-stream"}
    allowed_mime = settings.ALLOWED_VIDEO_MIME_TYPES if is_video else settings.ALLOWED_IMAGE_MIME_TYPES
    declared_mime = (file.content_type or "").strip().lower() or None
    if declared_mime not in UNSPECIFIED_MIME_TYPES and declared_mime not in allowed_mime:
        raise HTTPException(
            status_code=400,
            detail=f"Content-type '{file.content_type}' does not match a supported '{ext}' file."
        )

    max_bytes = (settings.MAX_VIDEO_SIZE_MB if is_video else settings.MAX_IMAGE_SIZE_MB) * 1024 * 1024

    # Cheap early-out for grossly oversized uploads. Content-Length covers the whole
    # multipart body (boundary + part headers), not just the file, so allow headroom —
    # otherwise a valid file a few hundred bytes under the cap is falsely rejected.
    # This is an optimization only; the streaming loop below is the authoritative check.
    MULTIPART_OVERHEAD_ALLOWANCE = 8 * 1024
    declared_length = request.headers.get("content-length")
    if declared_length and declared_length.isdigit() and int(declared_length) > max_bytes + MULTIPART_OVERHEAD_ALLOWANCE:
        raise HTTPException(status_code=413, detail="File size exceeds maximum allowed limit.")

    # Read in bounded chunks so an unbounded body is never fully buffered in memory.

    buffer = bytearray()
    while chunk := await file.read(1024 * 1024):
        buffer.extend(chunk)
        if len(buffer) > max_bytes:
            raise HTTPException(status_code=413, detail="File size exceeds maximum allowed limit.")
    contents = bytes(buffer)

    analysis_id = str(uuid.uuid4())

    # 1. Specialized Deepfake Detection
    # Steps 1-3 are synchronous and make blocking network/CPU calls, so they are
    # offloaded to the threadpool rather than stalling the event loop.
    ai_gen = await run_in_threadpool(deepfake_service.analyze, contents, file.filename)

    # 2. Multimodal AI Analysis (Gemini / Fallback)
    manipulation, context_initial, explanation = await run_in_threadpool(
        gemini_service.analyze_image_multimodal, contents, file.filename
    )

    # 3. EXIF & Metadata Extraction
    metadata = await run_in_threadpool(metadata_service.extract_metadata, contents, file.filename)

    # 4. Context Verification
    context = context_service.verify_context(file.filename, context_initial.claims)
    
    # 5. Trust Engine Composite Aggregation
    trust_output = trust_engine.calculate_trust(ai_gen, manipulation, metadata, context)

    print(
        "SCORE BREAKDOWN:",
        f"deepfake={ai_gen.score:.1f}({ai_gen.status})",
        f"manipulation={manipulation.score:.1f}({manipulation.status})",
        f"metadata={metadata.score:.1f}",
        f"context={context.score:.1f}({context.status})",
        f"=> trust={trust_output.trust_score}({trust_output.risk_level})",
    )
    
    response = AnalysisResponse(
        analysis_id=analysis_id,
        filename=file.filename,
        media_type="video" if is_video else "image",
        file_size_bytes=len(contents),
        created_at=datetime.utcnow().isoformat() + "Z",
        is_demo=False,
        trust_engine=trust_output,
        ai_generation=ai_gen,
        manipulation=manipulation,
        metadata=metadata,
        context=context,
        overall_explanation=explanation
    )
    
    report_service.store_analysis(response)
    return response

@router.get("/analysis/{analysis_id}", response_model=AnalysisResponse)
def get_analysis(analysis_id: str):
    res = report_service.get_analysis(analysis_id)
    if not res:
        raise HTTPException(status_code=404, detail="Analysis report not found.")
    return res

@router.post("/passport/{analysis_id}", response_model=PassportResponse)
def generate_passport(analysis_id: str, origin: Optional[str] = Query(None)):
    base_url = origin or "http://localhost:3000"
    return report_service.generate_passport(analysis_id, base_url=base_url)

@router.get("/passport/view/{passport_id}", response_model=PassportResponse)
def get_passport(passport_id: str):
    res = report_service.get_passport(passport_id)
    if not res:
        # A public verification route must never synthesize a passing result for an
        # unknown ID — that would forge exactly the proof this endpoint exists to check.
        raise HTTPException(status_code=404, detail="Passport not found.")
    return res

@router.get("/demo/{demo_id}", response_model=AnalysisResponse)
def get_demo_analysis(demo_id: str):
    # Pre-configured demo scenarios for instant hackathon demonstration
    analysis_id = f"demo-{demo_id}"
    
    if demo_id == "authentic":
        # DEMO 1: Authentic Image -> LOWER RISK (Trust Score ~91)
        # Filename must match MockDeepfakeProvider's authentic_keywords ("canon"),
        # otherwise the provider returns AI_INDICATORS_DETECTED and contradicts
        # the clean EXIF/context signals this scenario overrides below.
        filename = "canon_r5_photo_authentic.jpg"
        dummy_bytes = b"authentic_demo_bytes"
        ai_gen = deepfake_service.analyze(dummy_bytes, filename)
        manipulation, context_initial, explanation = gemini_service.analyze_image_multimodal(dummy_bytes, filename)
        metadata = metadata_service.extract_metadata(dummy_bytes, filename)
        metadata.available = True
        metadata.camera = "Canon EOS R5"
        metadata.software = "Adobe Lightroom 12.0 (Macintosh)"
        metadata.creation_date = "2026-05-14 10:22:15"
        metadata.anomalies = []
        metadata.score = 5.0
        
        context = context_service.verify_context(filename, [])
        context.score = 5.0
        context.status = "MATCHED"
        
        trust_output = trust_engine.calculate_trust(ai_gen, manipulation, metadata, context)
        
    elif demo_id == "deepfake":
        # DEMO 2: AI Deepfake -> HIGH RISK (Trust Score ~22)
        filename = "deepfake_synthetic_portrait.png"
        dummy_bytes = b"deepfake_demo_bytes"
        ai_gen = deepfake_service.analyze(dummy_bytes, filename)
        manipulation, context_initial, explanation = gemini_service.analyze_image_multimodal(dummy_bytes, filename)
        metadata = metadata_service.extract_metadata(dummy_bytes, filename)
        metadata.available = True
        metadata.software = "Midjourney v6.0"
        metadata.anomalies = ["AI generation tool signature present in metadata header."]
        metadata.score = 90.0
        
        context = context_service.verify_context(filename, ["Generated face portrait."])
        context.score = 75.0
        context.status = "MISMATCH_SUSPECTED"
        
        trust_output = trust_engine.calculate_trust(ai_gen, manipulation, metadata, context)
        
    else: # "out_of_context"
        # DEMO 3: Out-of-Context Image -> VERIFY (Trust Score ~48)
        filename = "context_misleading_news.jpg"
        dummy_bytes = b"context_demo_bytes"
        ai_gen = deepfake_service.analyze(dummy_bytes, filename)
        manipulation, context_initial, explanation = gemini_service.analyze_image_multimodal(dummy_bytes, filename)
        metadata = metadata_service.extract_metadata(dummy_bytes, filename)
        
        context = context_service.verify_context(filename, ["Breaking Event 2026"])
        context.score = 65.0
        context.status = "MISMATCH_SUSPECTED"
        context.conflict_notes = "Original photo captured in 2021; circulated with inaccurate 2026 narrative."
        
        trust_output = trust_engine.calculate_trust(ai_gen, manipulation, metadata, context)

    res = AnalysisResponse(
        analysis_id=analysis_id,
        filename=filename,
        media_type="image",
        file_size_bytes=2450000,
        created_at=datetime.utcnow().isoformat() + "Z",
        is_demo=True,
        trust_engine=trust_output,
        ai_generation=ai_gen,
        manipulation=manipulation,
        metadata=metadata,
        context=context,
        overall_explanation=explanation
    )
    
    report_service.store_analysis(res)
    return res
