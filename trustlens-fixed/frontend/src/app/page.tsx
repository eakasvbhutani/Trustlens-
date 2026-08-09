"use client";

import Link from "next/link";
import { Eye, ArrowRight, Play, Cpu, FileText, Sparkles, CheckCircle2, AlertTriangle, Binary } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-20 pb-20 bg-tech-grid">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>PROBABILISTIC DECISION SUPPORT ENGINE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Before you trust it, <br />
              <span className="text-zinc-400 font-light italic">
                verify it.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed font-normal">
              TrustLens is an enterprise digital media trust platform. It synthesizes multimodal AI reasoning, deepfake detection models, EXIF metadata forensics, and contextual evidence into an explainable Trust Score.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-start gap-3 pt-2">
              <Link
                href="/verify"
                className="press w-full sm:w-auto px-6 py-3.5 text-xs font-semibold text-zinc-950 bg-zinc-100 hover:bg-white rounded-lg shadow-sm flex items-center justify-center gap-2"
              >
                <span>Verify Media Payload</span>
                <ArrowRight className="w-4 h-4 text-zinc-950" />
              </Link>

              <Link
                href="/demo"
                className="press w-full sm:w-auto px-6 py-3.5 text-xs font-semibold text-zinc-300 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 rounded-lg flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5 text-zinc-400" />
                <span>Demo Suite</span>
              </Link>
            </div>

            {/* Metrics */}
            <div className="pt-6 border-t border-zinc-800/60 grid grid-cols-3 gap-4 text-left text-xs text-zinc-400">
              <div>
                <span className="block text-sm font-bold text-zinc-200">4 Signal Layers</span>
                Multi-Vector Forensics
              </div>
              <div>
                <span className="block text-sm font-bold text-zinc-200">Explainable AI</span>
                Transparent Evidence
              </div>
              <div>
                <span className="block text-sm font-bold text-zinc-200">QR Passport</span>
                Shareable Audit Link
              </div>
            </div>

          </div>

          {/* Right Column Visual Dashboard Card */}
          <div className="lg:col-span-5">
            <div className="reveal pro-card p-6 rounded-2xl border border-zinc-800 space-y-5 bg-[#0C0E14]">
              
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 text-xs">
                <div className="flex items-center gap-2">
                  <Binary className="w-4 h-4 text-zinc-400" />
                  <span className="font-mono text-zinc-300 font-semibold uppercase tracking-wider">Analysis Result</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold uppercase">
                  HIGH RISK
                </span>
              </div>

              {/* Gauge Preview */}
              <div className="flex items-center gap-6 py-2">
                <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" className="stroke-zinc-800" strokeWidth="6" fill="none" />
                    <circle cx="50" cy="50" r="40" className="stroke-rose-500" strokeWidth="6" strokeDasharray="251" strokeDashoffset="180" strokeLinecap="round" fill="none" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold font-mono text-zinc-100">28</span>
                    <span className="text-[8px] text-zinc-500 uppercase">/ 100</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Action Recommendation</h4>
                  <p className="text-xs text-zinc-300 leading-snug">
                    Don't share until independently verified. Synthetic AI indicators detected in visual boundary region.
                  </p>
                </div>
              </div>

              {/* Breakdown List */}
              <div className="space-y-2 pt-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-zinc-400" /> AI Diffusion Model
                  </span>
                  <span className="text-rose-400 font-bold">88.5% Risk</span>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5 text-zinc-400" /> Visual Forensics
                  </span>
                  <span className="text-amber-400 font-bold">45.0% Risk</span>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-zinc-400" /> EXIF Payload
                  </span>
                  <span className="text-emerald-400 font-bold">Valid Header</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* CORE SIGNAL LAYERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Methodology</span>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Four Signal Vectors. One Decision-Support Engine.
          </h2>
        </div>

        <div className="reveal-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <div className="pro-card p-5 rounded-xl border border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">1. AI Model Detection</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Identify multi-spectral signals associated with AI-generated or synthetic model output using specialized classifiers.
            </p>
          </div>

          <div className="pro-card p-5 rounded-xl border border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">2. EXIF Metadata Inspection</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Analyze EXIF structure, software edit history, camera profiles, and privacy-sanitized location signatures.
            </p>
          </div>

          <div className="pro-card p-5 rounded-xl border border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">3. Multimodal Reasoning</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Understand why content was flagged through natural language reasoning instead of receiving a black-box result.
            </p>
          </div>

          <div className="pro-card p-5 rounded-xl border border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">4. Actionable Recommendation</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Get a clear recommendation: LOWER RISK, VERIFY, or HIGH RISK / DON'T SHARE.
            </p>
          </div>

        </div>

      </section>

      {/* PIPELINE OVERVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pro-card p-8 rounded-2xl border border-zinc-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Pipeline Flow</span>
              <h3 className="text-lg font-bold text-white">Multimodal Analytical Pipeline</h3>
            </div>
            <span className="text-xs font-mono text-zinc-400">End-to-End Decision Support</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center font-mono text-xs">
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
              Media Payload
            </div>
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
              AI Detection
            </div>
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
              EXIF Forensics
            </div>
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
              Context Check
            </div>
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400 font-bold">
              Trust Score
            </div>
          </div>
        </div>
      </section>

      {/* RESPONSIBLE AI DISCLAIMER */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-zinc-400 font-mono text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Responsible AI Positioning</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            TrustLens provides probabilistic analysis and decision support. Automated systems cannot guarantee that digital media is authentic. Always exercise critical judgement before sharing digital media.
          </p>
        </div>
      </section>

    </div>
  );
}
