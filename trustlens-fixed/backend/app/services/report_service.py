import io
import uuid
import base64
import qrcode
from typing import Dict, Optional
from datetime import datetime
from app.schemas.analysis import AnalysisResponse
from app.schemas.passport import PassportResponse

# In-memory storage for analysis results and passports (ideal for hackathon MVP)
_ANALYSIS_DB: Dict[str, AnalysisResponse] = {}
_PASSPORT_DB: Dict[str, PassportResponse] = {}

class ReportService:
    def store_analysis(self, analysis: AnalysisResponse) -> None:
        _ANALYSIS_DB[analysis.analysis_id] = analysis

    def get_analysis(self, analysis_id: str) -> Optional[AnalysisResponse]:
        return _ANALYSIS_DB.get(analysis_id)

    def generate_passport(self, analysis_id: str, base_url: str = "http://localhost:3000") -> PassportResponse:
        analysis = self.get_analysis(analysis_id)
        if not analysis:
            # Fallback mock passport if requested for unknown ID
            passport_id = f"TL-{uuid.uuid4().hex[:6].upper()}"
            verification_url = f"{base_url}/passport/{passport_id}"
            qr_url = self._generate_qr_base64(verification_url)
            
            passport = PassportResponse(
                passport_id=passport_id,
                analysis_id=analysis_id,
                media_name="Sample Media",
                media_type="image",
                created_at=datetime.utcnow().isoformat() + "Z",
                trust_score=75.0,
                risk_level="LOWER_RISK",
                recommendation="No significant manipulation indicators detected.",
                assessment_confidence="MODERATE",
                signals_summary=[
                    {"name": "AI Generation", "status": "ORGANIC_PATTERN", "risk": "Low"},
                    {"name": "Visual Forensics", "status": "UNIFORM", "risk": "Low"}
                ],
                qr_code_data_url=qr_url,
                verification_url=verification_url
            )
            _PASSPORT_DB[passport_id] = passport
            return passport

        passport_id = f"TL-{analysis_id[:6].upper()}"
        verification_url = f"{base_url}/passport/{passport_id}"
        qr_url = self._generate_qr_base64(verification_url)

        signals_summary = [
            {
                "name": "AI Generation Detection",
                "status": analysis.ai_generation.status,
                "score": analysis.ai_generation.score,
                "model": analysis.ai_generation.model_used
            },
            {
                "name": "Visual Forensics & Artifacts",
                "status": analysis.manipulation.status,
                "score": analysis.manipulation.score
            },
            {
                "name": "EXIF & Metadata Inspection",
                "status": "ANOMALIES_PRESENT" if analysis.metadata.anomalies else "STANDARD",
                "software": analysis.metadata.software
            },
            {
                "name": "Context & Source Verification",
                "status": analysis.context.status,
                "score": analysis.context.score
            }
        ]

        passport = PassportResponse(
            passport_id=passport_id,
            analysis_id=analysis.analysis_id,
            media_name=analysis.filename,
            media_type=analysis.media_type,
            media_url=analysis.media_url,
            created_at=analysis.created_at,
            trust_score=analysis.trust_engine.trust_score,
            risk_level=analysis.trust_engine.risk_level,
            recommendation=analysis.trust_engine.recommendation,
            assessment_confidence=analysis.trust_engine.assessment_confidence,
            signals_summary=signals_summary,
            qr_code_data_url=qr_url,
            verification_url=verification_url
        )
        
        _PASSPORT_DB[passport_id] = passport
        return passport

    def get_passport(self, passport_id: str) -> Optional[PassportResponse]:
        return _PASSPORT_DB.get(passport_id)

    def _generate_qr_base64(self, data_url: str) -> str:
        try:
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_M,
                box_size=8,
                border=2,
            )
            qr.add_data(data_url)
            qr.make(fit=True)

            img = qr.make_image(fill_color="#0B0F17", back_color="#FFFFFF")
            buffer = io.BytesIO()
            img.save(buffer, format="PNG")
            img_str = base64.b64encode(buffer.getvalue()).decode("utf-8")
            return f"data:image/png;base64,{img_str}"
        except Exception:
            return ""

report_service = ReportService()
