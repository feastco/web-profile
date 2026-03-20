"use client";

import Link from "next/link";
import { Code2, Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-background mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20">
          
          <div className="flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <div className="bg-primary/20 p-1.5 rounded-md text-primary group-hover:bg-primary/30 transition-colors">
                <Code2 size={20} strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-primary transition-colors">
                DevPortfolio
              </span>
            </Link>
            <p className="text-muted text-sm max-w-sm mb-6 leading-relaxed">
              Building and documenting the future, one commit at a time. Join the journey on GitHub.
            </p>
          </div>

          <div className="flex flex-row justify-between md:justify-end gap-16 md:gap-24">
            <div className="flex flex-col gap-3">
              <h4 className="text-primary font-mono text-sm font-semibold tracking-wider mb-2">SOCIAL</h4>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-muted hover:text-white transition-colors text-sm">GitHub</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-muted hover:text-white transition-colors text-sm">Twitter</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-muted hover:text-white transition-colors text-sm">LinkedIn</a>
            </div>
            
            <div className="flex flex-col gap-3">
              <h4 className="text-primary font-mono text-sm font-semibold tracking-wider mb-2">PAGES</h4>
              <Link href="/proyek" className="text-muted hover:text-white transition-colors text-sm">Projects</Link>
              <Link href="/blog" className="text-muted hover:text-white transition-colors text-sm">Artikel</Link>
              <Link href="/kontak" className="text-muted hover:text-white transition-colors text-sm">Contact</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Developer Portfolio. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span>Designed with Inter & JetBrains Mono</span>
            <span className="flex items-center gap-1 font-mono text-xs"><Zap size={10} className="text-primary"/> v2.0.4-stable</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
