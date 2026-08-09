from typing import List, Dict, Any
from app.config import settings
from app.schemas.analysis import (
    TrustEngineOutput,
    SignalFinding,
    AIGenerationResult,
    ManipulationResult,
    MetadataResult,
    ContextResult
)

class TrustEngine:
    """
    Modular Trust Engine that aggregates multi-signal evidence into an explainable Trust Score.
    """
    def __init__(self):
        self.w_deepfake = settings.WEIGHT_DEEPFAKE
        self.w_gemini = settings.WEIGHT_GEMINI
        self.w_metadata = settings.WEIGHT_METADATA
        self.w_context = settings.WEIGHT_CONTEXT

    def calculate_trust(
        self,
        ai_gen: AIGenerationResult,
        manipulation: ManipulationResult,
        metadata: MetadataResult,
        context: ContextResult
    ) -> TrustEngineOutput:
        
        # Calculate weighted composite risk score (0 = no risk, 100 = extreme risk)
        weighted_risk = (
            (ai_gen.score * self.w_deepfake) +
            (manipulation.score * self.w_gemini) +
            (metadata.score * self.w_metadata) +
            (context.score * self.w_context)
        )
        
        # Invert risk score to derive Trust Score (0 = High Risk, 100 = Lower Risk)
        trust_score = max(0.0, min(100.0, round(100.0 - weighted_risk, 1)))
        
        # Determine Risk Level & Recommendation
        if trust_score <= 30.0:
            risk_level = "HIGH_RISK"
            recommendation = "Don't share until independently verified. Critical synthetic or manipulation indicators detected."
        elif trust_score <= 60.0:
            risk_level = "VERIFY"
            recommendation = "Some signals are inconclusive or context mismatch was detected. Consider verifying source prior to sharing."
        else:
            risk_level = "LOWER_RISK"
            recommendation = "No significant manipulation indicators were detected, but automated analysis cannot guarantee authenticity."
            
        # Determine confidence level based on metadata and signal availability
        available_count = 2 + (1 if metadata.available else 0) + (1 if context.available else 0)
        if available_count >= 4:
            confidence = "HIGH"
        elif available_count >= 3:
            confidence = "MODERATE"
        else:
            confidence = "LIMITED"
            
        # Construct Factors & Evidence Graph Nodes
        factors: List[SignalFinding] = []
        
        factors.append(SignalFinding(
            id="sig-deepfake",
            title="AI Generation Detection",
            signal_type="ai_generation",
            risk_score=ai_gen.score,
            confidence=ai_gen.confidence,
            description=f"Model assessment ({ai_gen.model_used}): {ai_gen.status}. " + "; ".join(ai_gen.findings[:2]),
            evidence_details={"status": ai_gen.status, "findings": ai_gen.findings}
        ))
        
        factors.append(SignalFinding(
            id="sig-manipulation",
            title="Visual Artifact & Forensic Analysis",
            signal_type="manipulation",
            risk_score=manipulation.score,
            confidence=manipulation.confidence,
            description="; ".join(manipulation.findings[:2]),
            evidence_details={"findings": manipulation.findings}
        ))
        
        factors.append(SignalFinding(
            id="sig-metadata",
            title="EXIF & File Structure Analysis",
            signal_type="metadata",
            risk_score=metadata.score,
            confidence=85.0 if metadata.available else 40.0,
            description=f"Software: {metadata.software or 'N/A'}, Camera: {metadata.camera or 'N/A'}. " + (
                "Anomalies detected in metadata headers." if metadata.anomalies else "Standard metadata structure."
            ),
            evidence_details={
                "software": metadata.software,
                "camera": metadata.camera,
                "anomalies": metadata.anomalies,
                "gps_available": metadata.gps_available
            }
        ))
        
        factors.append(SignalFinding(
            id="sig-context",
            title="Context & Source Consistency",
            signal_type="context",
            risk_score=context.score,
            confidence=75.0 if context.available else 30.0,
            description=context.conflict_notes or ("; ".join(context.findings[:2]) if context.findings else "No contextual conflicts detected."),
            evidence_details={"status": context.status, "claims": context.claims}
        ))
        
        explanation = (
            f"TrustLens analyzed 4 distinct signal vector layers. The resulting Trust Score of {trust_score}/100 "
            f"indicates a {risk_level.replace('_', ' ')} classification. Key drivers include: "
            f"{ai_gen.status} (AI risk score: {ai_gen.score}/100) and forensic visual inspection."
        )

        return TrustEngineOutput(
            trust_score=trust_score,
            risk_level=risk_level,
            recommendation=recommendation,
            assessment_confidence=confidence,
            signal_weights={
                "specialized_ai": self.w_deepfake,
                "multimodal_reasoning": self.w_gemini,
                "metadata": self.w_metadata,
                "context_verification": self.w_context
            },
            factors=factors,
            explanation=explanation
        )

trust_engine = TrustEngine()
