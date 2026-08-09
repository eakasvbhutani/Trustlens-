"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { ArrowLeft, FileCheck } from "lucide-react";
import ScoreGauge from "@/components/ScoreGauge";
import EvidenceCards from "@/components/EvidenceCards";
import EvidenceGraph from "@/components/EvidenceGraph";
import { AnalysisResponse } from "@/types/trustlens";
import { generatePassportForAnalysis, getDemoAnalysis } from "@/lib/api";

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    // 1. Try local storage cache first
    const cached = localStorage.getItem(`trustlens_res_${id}`);
    if (cached) {
      try {
        setAnalysis(JSON.parse(cached));
        setLoading(false);
        return;
      } catch (e) {
        console.error(e);
      }
    }

    // 2. If demo ID, fetch demo scenario
    if (id.startsWith("demo-") || ["authentic", "deepfake", "out_of_context"].includes(id)) {
      const demoKey = id.replace("demo-", "");
      getDemoAnalysis(demoKey).then((res) => {
        setAnalysis(res);
        setLoading(false);
      });
      return;
    }

    // 3. Fallback mock generator
    getDemoAnalysis("authentic").then((res) => {
      setAnalysis({ ...res, analysis_id: id });
      setLoading(false);
    });
  }, [id]);

  const handleGeneratePassport = async () => {
    if (!analysis) return;
    const passport = await generatePassportForAnalysis(analysis.analysis_id);
    if (typeof window !== "undefined") {
      localStorage.setItem(`trustlens_passport_${passport.passport_id}`, JSON.stringify(passport));
    }
    router.push(`/passport/${passport.passport_id}`);
  };

  if (loading || !analysis) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-zinc-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-sm text-gray-400">Loading analysis dashboard...</p>
      </div>
    );
  }

  const { trust_engine, ai_generation, manipulation, metadata, context, overall_explanation } = analysis;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/verify"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Verify Another File</span>
        </Link>

        <div className="flex items-center gap-3">
          {analysis.is_demo && (
            <span className="text-[11px] px-3 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-700 font-mono">
              Demonstration Analysis
            </span>
          )}
          <button
            onClick={handleGeneratePassport}
            className="press px-5 py-2.5 rounded-lg bg-zinc-100 hover:bg-white text-xs font-bold text-zinc-950 shadow-sm flex items-center gap-2"
          >
            <FileCheck className="w-4 h-4" />
            <span>Generate Verification Passport</span>
          </button>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Radial Score Gauge & Action Recommendation */}
        <div className="lg:col-span-5">
          <ScoreGauge
            score={trust_engine.trust_score}
            riskLevel={trust_engine.risk_level}
            recommendation={trust_engine.recommendation}
            confidence={trust_engine.assessment_confidence}
          />
        </div>

        {/* Right Column: Multi-Vector Signal Evidence Cards */}
        <div className="lg:col-span-7">
          <EvidenceCards
            aiGen={ai_generation}
            manipulation={manipulation}
            metadata={metadata}
            context={context}
            explanation={overall_explanation || trust_engine.explanation}
          />
        </div>

      </div>

      {/* Interactive Evidence Flow Graph Section */}
      <div className="pt-6">
        <EvidenceGraph
          factors={trust_engine.factors}
          trustEngine={trust_engine}
        />
      </div>

    </div>
  );
}
