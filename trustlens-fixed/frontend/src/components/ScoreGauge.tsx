"use client";

import { useEffect } from "react";
import { motion, useReducedMotion, useMotionValue, useTransform, animate } from "framer-motion";
import { ShieldAlert, ShieldCheck, HelpCircle, CheckCircle2, AlertTriangle, AlertOctagon } from "lucide-react";
import { RiskLevel, AssessmentConfidence } from "@/types/trustlens";

interface ScoreGaugeProps {
  score: number;
  riskLevel: RiskLevel;
  recommendation: string;
  confidence: AssessmentConfidence;
}

export default function ScoreGauge({ score, riskLevel, recommendation, confidence }: ScoreGaugeProps) {
  const reduceMotion = useReducedMotion();
  const radius = 76;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  /* The arc and the number are one object, so they have to move as one.
     Previously the arc swept for 1.2s while the number was already final,
     which read as two unrelated things happening in the same circle. */
  /* Seeded with the true score, never 0. This is a trust product: if the
     count-up never runs — reduced motion, a backgrounded tab, animations
     disabled — the gauge must still read the real number rather than
     showing 0, which would look like a maximum-risk verdict. */
  const count = useMotionValue(score);
  const displayed = useTransform(count, (v) => v.toFixed(0));

  useEffect(() => {
    const canAnimate =
      !reduceMotion &&
      typeof document !== "undefined" &&
      document.visibilityState === "visible";

    if (!canAnimate) {
      count.set(score);
      return;
    }

    count.set(0);
    const controls = animate(count, score, {
      duration: 0.9,
      ease: [0.23, 1, 0.32, 1],
    });
    return () => controls.stop();
  }, [score, reduceMotion, count]);

  let colors = {
    stroke: "#10B981", // Emerald
    text: "text-emerald-400",
    bg: "bg-emerald-500/5",
    border: "border-emerald-500/20",
    badgeBg: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    label: "LOWER RISK",
    Icon: ShieldCheck
  };

  if (riskLevel === "HIGH_RISK" || score <= 30) {
    colors = {
      stroke: "#F43F5E", // Rose
      text: "text-rose-400",
      bg: "bg-rose-500/5",
      border: "border-rose-500/20",
      badgeBg: "bg-rose-500/10 text-rose-300 border-rose-500/20",
      label: "HIGH RISK",
      Icon: ShieldAlert
    };
  } else if (riskLevel === "VERIFY" || score <= 60) {
    colors = {
      stroke: "#F59E0B", // Amber
      text: "text-amber-400",
      bg: "bg-amber-500/5",
      border: "border-amber-500/20",
      badgeBg: "bg-amber-500/10 text-amber-300 border-amber-500/20",
      label: "VERIFY",
      Icon: HelpCircle
    };
  }

  const { Icon } = colors;

  return (
    <div className="pro-card p-6 sm:p-8 rounded-2xl border border-zinc-800 flex flex-col items-center text-center bg-[#0C0E14]">
      
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-semibold">
          Composite Trust Assessment
        </span>
        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
          CONFIDENCE: {confidence}
        </span>
      </div>

      {/* Radial Gauge SVG */}
      <div className="relative w-52 h-52 flex items-center justify-center my-2">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={radius}
            className="stroke-zinc-800/80"
            strokeWidth="10"
            fill="transparent"
          />
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            stroke={colors.stroke}
            strokeWidth="10"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: reduceMotion ? strokeDashoffset : circumference }}
            animate={{ strokeDashoffset }}
            /* The score reveal is the explanatory moment of the whole product and
               is seen once per analysis, so it earns more than the 300ms UI budget —
               but 1.2s on a weak built-in curve read as sluggish. */
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.9, ease: [0.23, 1, 0.32, 1] }
            }
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* tabular-nums keeps the digits from jittering as they count */}
          <motion.span className={`text-5xl font-extrabold font-mono tracking-tight tabular-nums ${colors.text}`}>
            {displayed}
          </motion.span>
          <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase mt-1">out of 100</span>
        </div>
      </div>

      {/* Risk Badge */}
      <div className={`mt-3 inline-flex items-center gap-2 px-3.5 py-1 rounded-md text-xs font-mono font-bold border uppercase tracking-wider ${colors.badgeBg}`}>
        <Icon className="w-3.5 h-3.5" />
        <span>{colors.label}</span>
      </div>

      {/* Recommendation Card */}
      <div className={`mt-5 w-full p-4 rounded-xl border text-left flex items-start gap-3 ${colors.bg} ${colors.border}`}>
        {riskLevel === "HIGH_RISK" ? (
          <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
        ) : riskLevel === "VERIFY" ? (
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        )}
        <div className="space-y-1">
          <h4 className="text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider">Action Recommendation</h4>
          <p className="text-xs text-zinc-300 leading-relaxed font-normal">
            {recommendation}
          </p>
        </div>
      </div>

      <p className="text-[10px] font-mono text-zinc-500 mt-4 leading-normal">
        Synthesized multi-vector assessment. Decision support only.
      </p>

    </div>
  );
}
