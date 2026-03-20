import Link from "next/link";
import { Terminal, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        {/* Glow Background */}
        <div className="relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        </div>

        {/* Terminal Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/5 bg-white/2 text-sm font-medium text-primary mb-8 font-mono relative z-10">
          <Terminal size={16} />
          <span>~/error/404</span>
        </div>

        {/* Error Code */}
        <h1 className="text-8xl md:text-9xl font-black tracking-tighter text-white mb-4 relative z-10">
          4<span className="text-primary">0</span>4
        </h1>

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 relative z-10">
          Page Not Found
        </h2>

        <p className="text-muted text-lg mb-10 max-w-md mx-auto leading-relaxed relative z-10">
          The page you&apos;re looking for doesn&apos;t exist or has been moved to a different URL.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
          <Link
            href="/"
            className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-md font-medium transition-all flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Back to Home
          </Link>
          <Link
            href="/proyek"
            className="w-full sm:w-auto glass-panel text-white hover:bg-white/5 border border-white/10 px-8 py-3.5 rounded-md font-medium transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            View Projects
          </Link>
        </div>

        {/* Decorative Code Block */}
        <div className="mt-16 bg-secondary-bg border border-white/5 rounded-xl p-6 text-left font-mono text-sm relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <div className="text-slate-500">
            <span className="text-primary">const</span>{" "}
            <span className="text-white">page</span>{" "}
            <span className="text-slate-500">=</span>{" "}
            <span className="text-primary">await</span>{" "}
            <span className="text-yellow-300">findPage</span>
            <span className="text-slate-400">(</span>
            <span className="text-green-400">&apos;{"{url}"}&apos;</span>
            <span className="text-slate-400">)</span>
            <span className="text-slate-500">;</span>
            <br />
            <span className="text-slate-500">{"// "}</span>
            <span className="text-red-400">Error: Route not found</span>
          </div>
        </div>
      </div>
    </div>
  );
}
