"use client";

import { useState } from "react";
import { FileText, Download, Maximize2, Minimize2 } from "lucide-react";

interface PdfViewerProps {
  url: string;
  title?: string;
}

export default function PdfViewer({ url, title = "Dokumen PDF" }: PdfViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!url) return null;

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-secondary-bg border-b border-white/10">
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-red-400" />
            <span className="text-white font-medium text-sm">{title}</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm transition-colors"
            >
              <Download size={16} /> Download
            </a>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
            >
              <Minimize2 size={18} />
            </button>
          </div>
        </div>
        {/* PDF */}
        <iframe
          src={`${url}#toolbar=0&navpanes=0`}
          title={title}
          className="flex-1 w-full"
          style={{ border: "none" }}
        />
      </div>
    );
  }

  return (
    <div className="mt-12 rounded-2xl border border-white/5 overflow-hidden bg-secondary-bg">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <FileText size={18} className="text-red-400" />
          </div>
          <div>
            <p className="text-white font-medium text-sm">{title}</p>
            <p className="text-[11px] text-muted">Dokumen PDF — Read Only</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-medium transition-colors"
          >
            <Download size={14} /> Download
          </a>
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
          >
            <Maximize2 size={14} />
          </button>
        </div>
      </div>
      {/* PDF embed */}
      <iframe
        src={`${url}#toolbar=0&navpanes=0`}
        title={title}
        className="w-full"
        style={{ height: "60vh", border: "none" }}
      />
    </div>
  );
}
