"use client";

import { Terminal, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        {/* Glow Background */}
        <div className="relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />
        </div>

        {/* Terminal Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-red-500/20 bg-red-500/5 text-sm font-medium text-red-400 mb-8 font-mono relative z-10">
          <Terminal size={16} />
          <span>~/error/runtime</span>
        </div>

        {/* Error Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center relative z-10">
          <span className="text-4xl">⚠️</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">
          Something Went Wrong
        </h1>

        <p className="text-muted text-lg mb-10 max-w-md mx-auto leading-relaxed relative z-10">
          An unexpected error has occurred. Please try again or navigate back to the homepage.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
          <button
            onClick={reset}
            className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-md font-medium transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto glass-panel text-white hover:bg-white/5 border border-white/10 px-8 py-3.5 rounded-md font-medium transition-all flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
