"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import PassportCard from "@/components/PassportCard";
import { PassportResponse } from "@/types/trustlens";
import { getPassport } from "@/lib/api";

export default function PassportPage() {
  const params = useParams();
  const id = params?.id as string;

  const [passport, setPassport] = useState<PassportResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    // Check localStorage cache first
    const cached = localStorage.getItem(`trustlens_passport_${id}`);
    if (cached) {
      try {
        setPassport(JSON.parse(cached));
        setLoading(false);
        return;
      } catch (e) {
        console.error(e);
      }
    }

    getPassport(id).then((res) => {
      setPassport(res);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-zinc-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-sm text-gray-400">Verifying Passport Signature...</p>
      </div>
    );
  }

  if (!passport) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <p className="text-xs font-semibold tracking-widest text-red-400">
          VERIFICATION FAILED
        </p>
        <h1 className="text-2xl font-bold text-white">Passport not found</h1>
        <p className="text-sm text-gray-400">
          No verification passport exists for ID{" "}
          <span className="font-mono text-gray-300">{id}</span>. This certificate could not
          be authenticated.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
        >
          Back to TrustLens
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to TrustLens</span>
        </Link>
        <span className="text-[11px] px-3 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-700 font-mono">
          Public Authentication Certificate
        </span>
      </div>

      <PassportCard passport={passport} />

    </div>
  );
}
