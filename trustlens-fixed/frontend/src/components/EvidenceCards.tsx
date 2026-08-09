"use client";


import { Cpu, Eye, FileText, Globe, Sparkles, AlertCircle, Camera, HardDrive, MapPin } from "lucide-react";
import { AIGenerationResult, ManipulationResult, MetadataResult, ContextResult } from "@/types/trustlens";

interface EvidenceCardsProps {
  aiGen: AIGenerationResult;
  manipulation: ManipulationResult;
  metadata: MetadataResult;
  context: ContextResult;
  explanation: string;
}

export default function EvidenceCards({ aiGen, manipulation, metadata, context, explanation }: EvidenceCardsProps) {
  return (
    <div className="space-y-5">
      
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-zinc-400" />
          <span>Multi-Vector Signal Layers</span>
        </h3>
        <span className="text-xs font-mono text-zinc-500">4 Signals Evaluated</span>
      </div>

      <div className="reveal-stagger grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* CARD 1: AI GENERATION */}
        <div className="pro-card p-5 rounded-xl border border-zinc-800 flex flex-col justify-between space-y-4 bg-[#0C0E14]">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-300">
                <Cpu className="w-4 h-4 text-zinc-400" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider">1. AI Model Classifier</h4>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                aiGen.score > 60
                  ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  : aiGen.score > 30
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              }`}>
                RISK: {aiGen.score.toFixed(0)}/100
              </span>
            </div>

            <p className="text-xs text-zinc-300 font-mono">
              Status: <span className="text-zinc-100 font-bold">{aiGen.status.replace(/_/g, " ")}</span>
            </p>

            <div className="space-y-1.5 pt-1">
              {aiGen.findings.map((finding, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-zinc-400 leading-snug">
                  <span className="text-zinc-600 font-mono mt-0.5">•</span>
                  <span>{finding}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <span>Model: {aiGen.model_used}</span>
            <span>Conf: {aiGen.confidence}%</span>
          </div>
        </div>

        {/* CARD 2: VISUAL FORENSICS */}
        <div className="pro-card p-5 rounded-xl border border-zinc-800 flex flex-col justify-between space-y-4 bg-[#0C0E14]">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-300">
                <Eye className="w-4 h-4 text-zinc-400" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider">2. Visual Forensics</h4>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                manipulation.score > 60
                  ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  : manipulation.score > 30
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              }`}>
                RISK: {manipulation.score.toFixed(0)}/100
              </span>
            </div>

            <p className="text-xs text-zinc-300 font-mono">
              Status: <span className="text-zinc-100 font-bold">{manipulation.status.replace(/_/g, " ")}</span>
            </p>

            <div className="space-y-1.5 pt-1">
              {manipulation.findings.map((finding, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-zinc-400 leading-snug">
                  <span className="text-zinc-600 font-mono mt-0.5">•</span>
                  <span>{finding}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <span>Feature Map Inspection</span>
            <span>Conf: {manipulation.confidence}%</span>
          </div>
        </div>

        {/* CARD 3: METADATA */}
        <div className="pro-card p-5 rounded-xl border border-zinc-800 flex flex-col justify-between space-y-4 bg-[#0C0E14]">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-300">
                <FileText className="w-4 h-4 text-zinc-400" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider">3. EXIF Payload</h4>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                metadata.score > 60
                  ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  : metadata.score > 30
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              }`}>
                {metadata.available ? `RISK: ${metadata.score.toFixed(0)}/100` : "EXIF STRIPPED"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 truncate">
                <span className="text-[10px] text-zinc-500 block">CAMERA</span>
                {metadata.camera || "Unknown"}
              </div>
              <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 truncate">
                <span className="text-[10px] text-zinc-500 block">SOFTWARE</span>
                {metadata.software || "Unspecified"}
              </div>
            </div>

            {metadata.location_summary && (
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-900/90 p-2 rounded border border-zinc-800">
                <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span>{metadata.location_summary}</span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-zinc-800/80 text-[10px] font-mono text-zinc-500">
            Social media platforms frequently strip EXIF headers.
          </div>
        </div>

        {/* CARD 4: CONTEXT */}
        <div className="pro-card p-5 rounded-xl border border-zinc-800 flex flex-col justify-between space-y-4 bg-[#0C0E14]">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-300">
                <Globe className="w-4 h-4 text-zinc-400" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider">4. Context Verification</h4>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                context.score > 60
                  ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  : context.score > 30
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              }`}>
                STATUS: {context.status}
              </span>
            </div>

            {context.conflict_notes ? (
              <p className="text-xs text-amber-300/90 bg-amber-500/10 p-2.5 rounded border border-amber-500/20 font-mono leading-relaxed">
                {context.conflict_notes}
              </p>
            ) : (
              <p className="text-xs text-zinc-400">
                Knowledge index check completed. No narrative conflict identified.
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-zinc-800/80 text-[10px] font-mono text-zinc-500">
            Cross-referenced against open news indexes.
          </div>
        </div>

      </div>

      {/* CARD 5: EXPLAINABLE AI REASONING */}
      <div className="pro-card p-5 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-2">
        <div className="flex items-center gap-2 text-zinc-200">
          <Sparkles className="w-4 h-4 text-zinc-400" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider">Multimodal Natural Language Summary</h4>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed font-normal">
          {explanation}
        </p>
      </div>

    </div>
  );
}
