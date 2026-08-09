"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

import { Upload, FileImage, Film, AlertCircle, ArrowRight, Loader2, Sparkles, CheckCircle2, ShieldCheck, X, Cpu, Eye, FileText, Globe } from "lucide-react";
import { analyzeMedia } from "@/lib/api";

const STAGES = [
  "Uploading media payload...",
  "Inspecting visual signals & shadow geometry...",
  "Checking AI-generation diffusion indicators...",
  "Analyzing EXIF metadata & camera signatures...",
  "Cross-referencing context & claim consistency...",
  "Synthesizing composite Trust Engine assessment..."
];

export default function VerifyPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisProfile, setAnalysisProfile] = useState<string>("ai_check");
  
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentStage, setCurrentStage] = useState<number>(0);

  const handleFileChange = (file: File | undefined) => {
    if (!file) return;
    setError(null);

    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const isImage = ["jpg", "jpeg", "png", "webp"].includes(ext);
    const isVideo = ["mp4", "mov", "webm"].includes(ext);

    if (!isImage && !isVideo) {
      setError(`Unsupported file format '.${ext}'. Please upload JPG, PNG, WEBP, or MP4.`);
      return;
    }

    const maxMB = isVideo ? 50 : 15;
    if (file.size > maxMB * 1024 * 1024) {
      setError(`File size exceeds limit (${maxMB}MB max).`);
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setError(null);
  };

  const startAnalysis = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    setCurrentStage(0);

    const interval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < STAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 500);

    try {
      const result = await analyzeMedia(selectedFile);
      clearInterval(interval);
      setCurrentStage(STAGES.length - 1);
      
      setTimeout(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem(`trustlens_res_${result.analysis_id}`, JSON.stringify(result));
        }
        router.push(`/results/${result.analysis_id}`);
      }, 400);

    } catch (err) {
      clearInterval(interval);
      setIsAnalyzing(false);
      setError("Analysis failed. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 bg-tech-grid">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Forensic Audit Portal</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Verify Media Payload
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
          Analyze synthetic AI indicators, diffusion model latent patterns, EXIF metadata, and contextual consistency.
        </p>
      </div>

      {!isAnalyzing ? (
        <div className="space-y-6">
          
          {/* Dropzone Container */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`pro-card press p-8 sm:p-10 rounded-2xl border-2 border-dashed text-center cursor-pointer ${
              selectedFile
                ? "border-zinc-500 bg-zinc-900/60"
                : "border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/40"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileChange(e.target.files?.[0])}
              accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
              className="hidden"
            />

            {!selectedFile ? (
              <div className="space-y-3 flex flex-col items-center">
                <div className="w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 shadow-sm">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-zinc-100">
                    Drag and drop your image or video payload
                  </p>
                  <p className="text-xs text-zinc-400 font-mono">
                    or <span className="text-zinc-200 underline font-semibold">browse files</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 pt-1">
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">JPG, PNG, WEBP (15MB)</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">MP4, WEBM (50MB)</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4 flex flex-col items-center">
                <div className="relative max-w-sm rounded-xl overflow-hidden border border-zinc-700 bg-black shadow-lg">
                  {selectedFile.type.startsWith("video/") ? (
                    <video src={previewUrl!} controls className="max-h-56 object-contain" />
                  ) : (
                    <img src={previewUrl!} alt="Preview" className="max-h-56 object-contain" />
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleClear(); }}
                    aria-label="Remove selected file"
                    className="press absolute top-2 right-2 p-1 rounded-full bg-black/80 text-white border border-zinc-700 hover:bg-black"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
                  <span className="font-bold text-zinc-100 truncate max-w-[200px]">{selectedFile.name}</span>
                  <span className="text-zinc-600">|</span>
                  <span>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                  <span className="text-zinc-600">|</span>
                  <span className="uppercase text-zinc-400 font-semibold">{selectedFile.name.split(".").pop()}</span>
                </div>
              </div>
            )}

          </div>

          {/* Analysis Focus Profile Selector */}
          <div className="pro-card p-4 rounded-xl border border-zinc-800 space-y-3 font-mono">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Select Analysis Focus Profile</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setAnalysisProfile("ai_check")}
                className={`press p-3 rounded-lg border text-left space-y-1 ${
                  analysisProfile === "ai_check"
                    ? "bg-zinc-800 border-zinc-500 text-white"
                    : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-zinc-200">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Synthetic AI Check</span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-tight">Focuses on diffusion model artifacts, latent patterns, and AI signatures.</p>
              </button>

              <button
                type="button"
                onClick={() => setAnalysisProfile("full_audit")}
                className={`press p-3 rounded-lg border text-left space-y-1 ${
                  analysisProfile === "full_audit"
                    ? "bg-zinc-800 border-zinc-500 text-white"
                    : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-zinc-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Multi-Vector Audit</span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-tight">Balanced 4-vector inspection across all forensic layers.</p>
              </button>

              <button
                type="button"
                onClick={() => setAnalysisProfile("exif_check")}
                className={`press p-3 rounded-lg border text-left space-y-1 ${
                  analysisProfile === "exif_check"
                    ? "bg-zinc-800 border-zinc-500 text-white"
                    : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-zinc-200">
                  <FileText className="w-3.5 h-3.5" />
                  <span>EXIF Forensics</span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-tight">Focuses on EXIF metadata headers, camera Make/Model, and software edits.</p>
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-rose-400 text-xs font-mono font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Analyze Button */}
          {selectedFile && (
            <div className="flex justify-center pt-2">
              <button
                onClick={startAnalysis}
                className="press w-full sm:w-auto px-8 py-3.5 text-xs font-mono font-bold text-zinc-950 bg-zinc-100 hover:bg-white rounded-lg shadow-sm flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Execute Multi-Vector Analysis</span>
              </button>
            </div>
          )}

        </div>
      ) : (
        /* Animated Multi-Stage Progress Screen */
        <div className="pro-card p-8 rounded-2xl border border-zinc-800 space-y-6 text-center bg-[#0C0E14] font-mono">
          
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200 relative">
              <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                Executing Forensic Pipeline
              </h3>
              <p className="text-xs text-zinc-400">
                Processing multi-vector signal layers...
              </p>
            </div>
          </div>

          <div className="max-w-md mx-auto space-y-2 text-left text-xs">
            {STAGES.map((stageText, idx) => {
              const isDone = idx < currentStage;
              const isCurrent = idx === currentStage;

              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded border flex items-center justify-between transition-colors duration-200 ease-out ${
                    isDone
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : isCurrent
                      ? "bg-zinc-800 border-zinc-600 text-white font-bold"
                      : "bg-zinc-900/40 border-zinc-800/80 text-zinc-600"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {isDone ? (
                      <CheckCircle2 className="confirm-pop w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-3.5 h-3.5 text-zinc-300 animate-spin shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-zinc-700 shrink-0" />
                    )}
                    <span>{stageText}</span>
                  </span>
                  {isDone && <span className="confirm-pop text-[9px] text-emerald-400 font-bold uppercase">Pass</span>}
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}
