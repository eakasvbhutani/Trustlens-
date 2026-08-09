import Link from "next/link";
import { Shield, Eye, Cpu, FileText, Globe, Layers, AlertTriangle, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Methodology & Scoring Architecture
        </h1>
        <p className="text-sm text-gray-400 max-w-xl mx-auto">
          How TrustLens calculates explainable Trust Scores across multiple digital forensics layers.
        </p>
      </div>

      {/* Scoring Weight Breakdown Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-zinc-800 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-zinc-300" />
          <span>Trust Engine Composite Formula</span>
        </h3>

        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 font-mono text-xs sm:text-sm text-zinc-200 text-center leading-relaxed">
          Trust Score = 100 - (0.40 × DeepfakeRisk + 0.20 × GeminiRisk + 0.15 × MetadataRisk + 0.25 × ContextRisk)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-zinc-300 font-bold block">1. Specialized AI Detection (40%)</span>
            <p className="text-gray-300">
              Evaluates high-frequency spectral artifacts, diffusion patterns, and transformer visual feature maps.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-zinc-300 font-bold block">2. Multimodal AI Reasoning (20%)</span>
            <p className="text-gray-300">
              Google Gemini API multimodal vision checks visual lighting, boundary distortions, and facial ROI geometry.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-zinc-300 font-bold block">3. EXIF & Forensic Metadata (15%)</span>
            <p className="text-gray-300">
              Extracts camera Make/Model, software signatures, creation date, and location presence (with GPS privacy redactions).
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-amber-400 font-bold block">4. Context Verification (25%)</span>
            <p className="text-gray-300">
              Cross-references extracted image text and claim entities against public news and knowledge indexes.
            </p>
          </div>
        </div>
      </div>

      {/* Responsible AI Positioning */}
      <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>Responsible AI Philosophy</span>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">
          TrustLens explicitly avoids overclaiming infallible truth. Automated systems provide decision support rather than absolute declarations. We utilize probabilistic categories (LOWER RISK, VERIFY, HIGH RISK) and highlight confidence boundaries.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          href="/verify"
          className="press inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-zinc-100 hover:bg-white text-sm font-bold text-zinc-950 shadow-sm"
        >
          <span>Verify Media Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
