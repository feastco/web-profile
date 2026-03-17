"use client";

import { useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { ImagePlus, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface UploadGambarProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export default function UploadGambar({
  value,
  onChange,
  folder = "sampul",
  label = "Gambar Sampul",
}: UploadGambarProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        alert("Hanya file gambar yang diizinkan (JPG, PNG, WebP, dll).");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran gambar maksimal 5MB.");
        return;
      }

      setUploading(true);
      const ext = file.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error } = await supabase.storage
        .from("gambar")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (error) {
        alert("Gagal upload: " + error.message);
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("gambar")
        .getPublicUrl(fileName);

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
    // Extract path from URL for deletion
    const urlParts = value.split("/storage/v1/object/public/gambar/");
    if (urlParts[1]) {
      await supabase.storage.from("gambar").remove([urlParts[1]]);
    }
    onChange("");
  };

  if (value) {
    return (
      <div>
        <label className="block text-sm font-medium text-muted mb-1.5">
          {label}
        </label>
        <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-background">
          <Image
            src={value}
            alt="Preview"
            width={600}
            height={340}
            className="w-full h-48 object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Ganti
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
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
        className={`relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
          dragActive
            ? "border-primary bg-primary/10"
            : "border-white/10 hover:border-white/20 bg-white/2 hover:bg-white/4"
        } ${uploading ? "pointer-events-none opacity-60" : ""}`}
      >
        {uploading ? (
          <Loader2 size={32} className="text-primary animate-spin" />
        ) : (
          <ImagePlus
            size={32}
            className={dragActive ? "text-primary" : "text-muted"}
          />
        )}
        <div className="text-center">
          <p className="text-sm text-white font-medium">
            {uploading
              ? "Mengupload..."
              : dragActive
                ? "Lepaskan file di sini"
                : "Klik atau seret gambar ke sini"}
          </p>
          <p className="text-xs text-muted mt-1">JPG, PNG, WebP — Maks 5MB</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
