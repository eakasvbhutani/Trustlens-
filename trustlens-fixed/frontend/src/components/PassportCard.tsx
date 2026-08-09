"use client";

import { useState } from "react";
import { ShieldCheck, Copy, Check, Printer, AlertTriangle, QrCode } from "lucide-react";
import { PassportResponse } from "@/types/trustlens";

interface PassportCardProps {
  passport: PassportResponse;
}

export default function PassportCard({ passport }: PassportCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(passport.verification_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const isHighRisk = passport.risk_level === "HIGH_RISK" || passport.trust_score <= 30;
  const isVerify = passport.risk_level === "VERIFY" || passport.trust_score <= 60;

  const statusColor = isHighRisk 
    ? "text-rose-400 bg-rose-500/10 border-rose-500/20" 
    : isVerify 
    ? "text-amber-400 bg-amber-500/10 border-amber-500/20" 
    : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";

  return (
    <div className="max-w-2xl mx-auto pro-card rounded-2xl border border-zinc-800 p-6 sm:p-8 space-y-6 bg-[#0C0E14]">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-zinc-300" />
            <h2 className="text-base font-bold text-white font-mono tracking-wider">
              VERIFICATION PASSPORT
            </h2>
          </div>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            PASSPORT ID: <span className="text-zinc-200 font-bold">{passport.passport_id}</span>
          </p>
        </div>
        <div className={`px-3 py-1 rounded text-xs font-mono font-bold border uppercase tracking-wider ${statusColor}`}>
          {passport.risk_level.replace(/_/g, " ")}
        </div>
      </div>

      {/* Grid Specs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Trust Score</span>
          <p className="text-2xl font-bold text-white">{passport.trust_score.toFixed(0)}<span className="text-xs font-normal text-zinc-500">/100</span></p>
        </div>
        <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Target File</span>
          <p className="text-xs font-bold text-zinc-200 truncate">{passport.media_name}</p>
          <span className="text-[9px] text-zinc-500 uppercase">{passport.media_type}</span>
        </div>
        <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Timestamp</span>
          <p className="text-xs font-semibold text-zinc-300">{new Date(passport.created_at).toLocaleDateString()}</p>
          <p className="text-[9px] text-zinc-500">{new Date(passport.created_at).toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Verified Signals */}
      <div className="space-y-2 font-mono">
        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Evaluated Signal Summary</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {passport.signals_summary.map((sig, idx) => (
            <div key={idx} className="p-2.5 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-between">
              <span className="text-zinc-300 font-medium">{sig.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-bold">
                {sig.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation */}
      <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1 font-mono">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Recommendation</span>
        <p className="text-xs text-zinc-200 leading-relaxed font-normal">
          {passport.recommendation}
        </p>
      </div>

      {/* QR Code & Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-800">
        {passport.qr_code_data_url && (
          <div className="flex items-center gap-3 bg-white p-2.5 rounded-lg shrink-0">
            <img src={passport.qr_code_data_url} alt="Passport QR Code" className="w-20 h-20 rounded" />
            <div className="text-zinc-950 font-mono space-y-0.5">
              <p className="text-xs font-bold">SCAN TO VERIFY</p>
              <p className="text-[9px] text-zinc-600">Public authentication URL</p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto font-mono text-xs">
          <button
            onClick={handleCopy}
            className="press flex items-center justify-center gap-2 px-4 py-2 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Link"}</span>
          </button>
          <button
            onClick={handlePrint}
            className="press flex items-center justify-center gap-2 px-4 py-2 rounded bg-zinc-100 hover:bg-white text-zinc-950 font-bold shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Certificate</span>
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 pt-1">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span>{passport.disclaimer}</span>
      </div>

    </div>
  );
}
