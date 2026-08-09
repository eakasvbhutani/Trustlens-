from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class PassportResponse(BaseModel):
    passport_id: str  # Format: TL-XXXXXX
    analysis_id: str
    media_name: str
    media_type: str
    media_url: Optional[str] = None
    created_at: str
    trust_score: float
    risk_level: str
    recommendation: str
    assessment_confidence: str
    signals_summary: List[Dict[str, Any]]
    disclaimer: str = "Automated analysis provides decision support and cannot guarantee absolute digital authenticity."
    qr_code_data_url: Optional[str] = None
    verification_url: str
