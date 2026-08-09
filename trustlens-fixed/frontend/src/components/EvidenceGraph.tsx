"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Cpu, Eye, FileText, Globe, Layers, CheckCircle2, ArrowRight } from "lucide-react";
import { SignalFinding, TrustEngineOutput } from "@/types/trustlens";

interface EvidenceGraphProps {
  factors: SignalFinding[];
  trustEngine: TrustEngineOutput;
}

export default function EvidenceGraph({ factors, trustEngine }: EvidenceGraphProps) {
  const [selectedNode, setSelectedNode] = useState<string>("trust-engine");

  const nodes = [
    { id: "media", label: "Uploaded Media", icon: Upload, type: "input", riskScore: 0, status: "SOURCE_INPUT" },
    { id: "sig-deepfake", label: "AI Generation", icon: Cpu, type: "signal", riskScore: factors.find(f => f.signal_type === "ai_generation")?.risk_score || 0 },
    { id: "sig-manipulation", label: "Visual Forensics", icon: Eye, type: "signal", riskScore: factors.find(f => f.signal_type === "manipulation")?.risk_score || 0 },
    { id: "sig-metadata", label: "EXIF Metadata", icon: FileText, type: "signal", riskScore: factors.find(f => f.signal_type === "metadata")?.risk_score || 0 },
    { id: "sig-context", label: "Context Check", icon: Globe, type: "signal", riskScore: factors.find(f => f.signal_type === "context")?.risk_score || 0 },
    { id: "trust-engine", label: "Trust Engine", icon: Layers, type: "output", riskScore: 100 - trustEngine.trust_score }
  ];

  const activeFactor = factors.find(f => f.id === selectedNode);

  return (
    <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-zinc-400" />
            <span>Interactive Evidence Flow Graph</span>
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Why did TrustLens give this score? Click any processing node to inspect its specific model confidence and signals.
          </p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-700 font-mono self-start sm:self-auto">
          Interactive Inspection
        </span>
      </div>

      {/* Node Flow Pipeline */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 py-4">
        {nodes.map((node) => {
          const NodeIcon = node.icon;
          const isSelected = selectedNode === node.id;
          
          let statusBg = "bg-emerald-500/20 border-emerald-500/40 text-emerald-400";
          if (node.type === "signal" && node.riskScore > 60) {
            statusBg = "bg-rose-500/20 border-rose-500/40 text-rose-400";
          } else if (node.type === "signal" && node.riskScore > 30) {
            statusBg = "bg-amber-500/20 border-amber-500/40 text-amber-400";
          }

          return (
            <button
              key={node.id}
              onClick={() => setSelectedNode(node.id)}
              aria-pressed={isSelected}
              className={`press p-3.5 rounded-xl border text-center flex flex-col items-center justify-center gap-2 ${
                isSelected
                  ? "bg-zinc-800 border-zinc-500 shadow-lg shadow-black/40"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <div className={`p-2 rounded-lg border ${statusBg}`}>
                <NodeIcon className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-gray-200">{node.label}</span>
              <span className="text-[10px] text-gray-400">
                {node.type === "input" ? "Input" : node.type === "output" ? `Score: ${trustEngine.trust_score.toFixed(0)}` : `Risk: ${node.riskScore.toFixed(0)}`}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detailed Inspection Drawer */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
        <AnimatePresence mode="wait">
          {selectedNode === "trust-engine" ? (
            <motion.div
              key="trust-engine"
              initial={{ opacity: 0, transform: "translateY(5px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              exit={{ opacity: 0, transform: "translateY(-5px)" }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-zinc-100">Node: Composite Trust Engine</h4>
                <span className="text-xs text-gray-400">Aggregated Weight Matrix</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                The Trust Engine combines 4 distinct signal layers using configurable weights: Specialized AI (40%), Gemini Multimodal (20%), EXIF Metadata (15%), Context Verification (25%).
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                {Object.entries(trustEngine.signal_weights).map(([k, v]) => (
                  <div key={k} className="p-2 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-[10px] text-gray-400 capitalize block">{k.replace("_", " ")}</span>
                    <span className="font-bold text-zinc-200">{(v * 100).toFixed(0)}% Weight</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : selectedNode === "media" ? (
            <motion.div
              key="media"
              initial={{ opacity: 0, transform: "translateY(5px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              exit={{ opacity: 0, transform: "translateY(-5px)" }}
              className="space-y-2"
            >
              <h4 className="text-sm font-bold text-zinc-100">Node: Uploaded Media Container</h4>
              <p className="text-xs text-gray-300">
                Media payload validated. Pre-processing extracted visual frames, EXIF headers, and audio spectral channels for analysis.
              </p>
            </motion.div>
          ) : activeFactor ? (
            <motion.div
              key={activeFactor.id}
              initial={{ opacity: 0, transform: "translateY(5px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              exit={{ opacity: 0, transform: "translateY(-5px)" }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-zinc-100">Node: {activeFactor.title}</h4>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-gray-400">Model Confidence: <strong className="text-white">{activeFactor.confidence}%</strong></span>
                  <span className="text-gray-400">Risk Score: <strong className="text-amber-400">{activeFactor.risk_score}/100</strong></span>
                </div>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {activeFactor.description}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

    </div>
  );
}
