"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, ArrowRight, Play, Info } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[#08090C]/85 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-zinc-100 group-hover:border-zinc-500 transition-colors shadow-sm">
              <Shield className="w-4 h-4 text-zinc-200" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-zinc-100">
                  TRUST<span className="text-zinc-400 font-normal">LENS</span>
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/50 uppercase tracking-widest">
                  VERIFICATION ENGINE
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono tracking-tight">MEDIA AUTHENTICITY INTELLIGENCE</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-400">
            <Link
              href="/"
              className={`transition-colors hover:text-zinc-100 ${
                pathname === "/" ? "text-zinc-100 font-semibold" : ""
              }`}
            >
              Overview
            </Link>
            <Link
              href="/verify"
              className={`transition-colors hover:text-zinc-100 ${
                pathname === "/verify" ? "text-zinc-100 font-semibold" : ""
              }`}
            >
              Verify Media
            </Link>
            <Link
              href="/demo"
              className={`flex items-center gap-1.5 transition-colors hover:text-zinc-100 ${
                pathname === "/demo" ? "text-zinc-100 font-semibold" : ""
              }`}
            >
              <Play className="w-3 h-3 text-zinc-400" /> Demo Suite
            </Link>
            <Link
              href="/about"
              className={`flex items-center gap-1.5 transition-colors hover:text-zinc-100 ${
                pathname === "/about" ? "text-zinc-100 font-semibold" : ""
              }`}
            >
              <Info className="w-3 h-3" /> Architecture & Methodology
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center gap-3">
            <Link
              href="/verify"
              className="press inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-100 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 hover:border-zinc-500 rounded-lg shadow-sm"
            >
              <span>Analyze Media</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}
