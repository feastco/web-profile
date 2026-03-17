"use client";

import { useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { FileText, X, Loader2, Upload } from "lucide-react";

interface UploadPdfProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export default function UploadPdf({
  value,
  onChange,
  folder = "pdf",
  label = "File PDF",
}: UploadPdfProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      if (file.type !== "application/pdf") {
        alert("Hanya file PDF yang diizinkan.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("Ukuran PDF maksimal 10MB.");
        return;
      }

      setUploading(true);
      setFileName(file.name);

      const safeName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.pdf`;

      const { error } = await supabase.storage
        .from("gambar")
        .upload(safeName, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: "application/pdf",
        });

      if (error) {
        alert("Gagal upload PDF: " + error.message);
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("gambar")
        .getPublicUrl(safeName);

      onChange(urlData.publicUrl);
      setUploading(false);
    },
    [folder, onChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleRemove = async () => {
    if (!value) return;
    const urlParts = value.split("/storage/v1/object/public/gambar/");
    if (urlParts[1]) {
      await supabase.storage.from("gambar").remove([urlParts[1]]);
    }
    onChange("");
    setFileName("");
  };

  if (value) {
    return (
      <div>
        <label className="block text-sm font-medium text-muted mb-1.5">
          {label}
        </label>
        <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/2">
          <div className="p-3 bg-red-500/10 rounded-lg shrink-0">
            <FileText size={24} className="text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium truncate">
              {fileName || "Dokumen PDF"}
            </p>
            <p className="text-xs text-muted mt-0.5">PDF — Siap ditampilkan</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-medium transition-colors"
            >
              Ganti
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
            >
              <X size={14} />
            </button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-muted mb-1.5">
        {label}
      </label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`flex items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
          dragActive
            ? "border-red-400 bg-red-400/10"
            : "border-white/10 hover:border-white/20 bg-white/2 hover:bg-white/4"
        } ${uploading ? "pointer-events-none opacity-60" : ""}`}
      >
        {uploading ? (
          <Loader2 size={24} className="text-red-400 animate-spin" />
        ) : (
          <Upload
            size={24}
            className={dragActive ? "text-red-400" : "text-muted"}
          />
        )}
        <div>
          <p className="text-sm text-white font-medium">
            {uploading
              ? "Mengupload PDF..."
              : dragActive
                ? "Lepaskan PDF di sini"
                : "Upload file PDF"}
          </p>
          <p className="text-xs text-muted mt-0.5">
            Hanya .pdf — Maks 10MB — Read-only untuk pengunjung
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
