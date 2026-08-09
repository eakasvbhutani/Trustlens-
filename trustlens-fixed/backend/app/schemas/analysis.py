from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class SignalFinding(BaseModel):
    id: str
    title: str
    signal_type: str  # "ai_generation", "manipulation", "metadata", "context"
    risk_score: float = Field(..., ge=0, le=100, description="Risk score 0 (low risk) to 100 (high risk)")
    confidence: float = Field(..., ge=0, le=100, description="Model/Analysis confidence percentage")
    description: str
    evidence_details: Optional[Dict[str, Any]] = None

class AIGenerationResult(BaseModel):
    score: float  # Risk score 0..100
    status: str   # "AI_INDICATORS_DETECTED", "ORGANIC_PATTERN", "INCONCLUSIVE"
    confidence: float
    findings: List[str]
    model_used: str

class ManipulationResult(BaseModel):
    score: float  # Risk score 0..100
    status: str   # "MANIPULATION_DETECTED", "UNIFORM_COMPOSITION", "INCONCLUSIVE"
    confidence: float
    findings: List[str]

class MetadataResult(BaseModel):
    available: bool
    score: float  # Risk score 0..100 based on metadata anomalies
    camera: Optional[str] = "Unknown"
    software: Optional[str] = "Unknown"
    creation_date: Optional[str] = None
    gps_available: bool = False
    location_summary: Optional[str] = None
    anomalies: List[str] = []
    raw_fields: Dict[str, Any] = {}

class ContextResult(BaseModel):
    available: bool
    score: float  # Risk score 0..100 based on context mismatch
    status: str   # "MATCHED", "MISMATCH_SUSPECTED", "UNVERIFIED"
    claims: List[str] = []
    findings: List[str] = []
    conflict_notes: Optional[str] = None

class TrustEngineOutput(BaseModel):
    trust_score: float = Field(..., ge=0, le=100, description="Overall Trust Score 0 (High Risk) to 100 (Lower Risk)")
    risk_level: str  # "HIGH_RISK", "VERIFY", "LOWER_RISK"
    recommendation: str
    assessment_confidence: str  # "LIMITED", "MODERATE", "HIGH"
    signal_weights: Dict[str, float]
    factors: List[SignalFinding]
    explanation: str

class AnalysisRequest(BaseModel):
    demo_id: Optional[str] = None
    media_url: Optional[str] = None

class AnalysisResponse(BaseModel):
    analysis_id: str
    filename: str
    media_type: str  # "image" or "video"
    media_url: Optional[str] = None
    file_size_bytes: int
    created_at: str
    is_demo: bool = False
    
    trust_engine: TrustEngineOutput
    ai_generation: AIGenerationResult
    manipulation: ManipulationResult
    metadata: MetadataResult
    context: ContextResult
    
    overall_explanation: str
