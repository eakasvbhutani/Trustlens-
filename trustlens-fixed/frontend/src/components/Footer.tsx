import Link from "next/link";
import { Shield, AlertTriangle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#060709] border-t border-zinc-800/80 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-100">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-sm text-zinc-100 tracking-tight">
              TRUST<span className="text-zinc-400 font-normal">LENS</span>
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-mono">
            "Before you trust it, verify it."
            <br />
            Digital media authenticity & decision support engine.
          </p>
        </div>

        {/* Platform Links */}
        <div>
          <h4 className="text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider mb-3">Platform</h4>
          <ul className="space-y-2 text-xs text-zinc-400 font-medium">
            <li><Link href="/" className="hover:text-zinc-100 transition-colors">Overview</Link></li>
            <li><Link href="/verify" className="hover:text-zinc-100 transition-colors">Verify Media</Link></li>
            <li><Link href="/demo" className="hover:text-zinc-100 transition-colors">Demo Suite</Link></li>
            <li><Link href="/about" className="hover:text-zinc-100 transition-colors">Architecture & Methodology</Link></li>
          </ul>
        </div>

        {/* Vector Signals */}
        <div>
          <h4 className="text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider mb-3">Signal Vectors</h4>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li>AI Model Detection</li>
            <li>Visual Forensics</li>
            <li>EXIF Metadata Parser</li>
            <li>Context Cross-Check</li>
          </ul>
        </div>

        {/* Responsible AI Disclaimer */}
        <div className="bg-zinc-900/80 p-4 rounded-lg border border-zinc-800 space-y-2">
          <div className="flex items-center gap-2 text-zinc-300 text-xs font-mono font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Decision Support Policy</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            TrustLens provides probabilistic decision support. Automated systems cannot guarantee digital media authenticity.
          </p>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-500">
        <p>© 2026 TrustLens Platform. All rights reserved.</p>
        <p>Multimodal AI Reasoning & Digital Forensics</p>
      </div>
    </footer>
  );
}
