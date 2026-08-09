export type RiskLevel = "HIGH_RISK" | "VERIFY" | "LOWER_RISK";
export type AssessmentConfidence = "LIMITED" | "MODERATE" | "HIGH";

export interface SignalFinding {
  id: string;
  title: string;
  signal_type: "ai_generation" | "manipulation" | "metadata" | "context";
  risk_score: number; // 0..100
  confidence: number;
  description: string;
  evidence_details?: Record<string, any>;
}

export interface AIGenerationResult {
  score: number;
  status: string;
  confidence: number;
  findings: string[];
  model_used: string;
}

export interface ManipulationResult {
  score: number;
  status: string;
  confidence: number;
  findings: string[];
}

export interface MetadataResult {
  available: boolean;
  score: number;
  camera?: string;
  software?: string;
  creation_date?: string;
  gps_available: boolean;
  location_summary?: string;
  anomalies: string[];
  raw_fields?: Record<string, string>;
}

export interface ContextResult {
  available: boolean;
  score: number;
  status: string;
  claims: string[];
  findings: string[];
  conflict_notes?: string;
}

export interface TrustEngineOutput {
  trust_score: number;
  risk_level: RiskLevel;
  recommendation: string;
  assessment_confidence: AssessmentConfidence;
  signal_weights: Record<string, number>;
  factors: SignalFinding[];
  explanation: string;
}

export interface AnalysisResponse {
  analysis_id: string;
  filename: string;
  media_type: "image" | "video";
  media_url?: string;
  file_size_bytes: number;
  created_at: string;
  is_demo?: boolean;
  
  trust_engine: TrustEngineOutput;
  ai_generation: AIGenerationResult;
  manipulation: ManipulationResult;
  metadata: MetadataResult;
  context: ContextResult;
  
  overall_explanation: string;
}

export interface PassportResponse {
  passport_id: string;
  analysis_id: string;
  media_name: string;
  media_type: string;
  media_url?: string;
  created_at: string;
  trust_score: number;
  risk_level: RiskLevel;
  recommendation: string;
  assessment_confidence: AssessmentConfidence;
  signals_summary: any[];
  disclaimer: string;
  qr_code_data_url?: string;
  verification_url: string;
}
