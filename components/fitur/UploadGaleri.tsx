"use client";

import { useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { Images, X, Loader2, Plus } from "lucide-react";
import Image from "next/image";

interface UploadGaleriProps {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  label?: string;
  maxFiles?: number;
}

export default function UploadGaleri({
  value,
  onChange,
  folder = "galeri",
  label = "Galeri Screenshot",
  maxFiles = 10,
}: UploadGaleriProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = useCallback(
    async (files: FileList) => {
      const validFiles = Array.from(files).filter((f) => {
        if (!f.type.startsWith("image/")) return false;
        if (f.size > 5 * 1024 * 1024) return false;
        return true;
      });

      if (validFiles.length === 0) {
        alert("Tidak ada file valid. Hanya gambar (maks 5MB) yang diterima.");
        return;
      }

      const remaining = maxFiles - value.length;
      if (remaining <= 0) {
        alert(`Maksimal ${maxFiles} gambar.`);
        return;
      }

      const toUpload = validFiles.slice(0, remaining);
      setUploading(true);

      const newUrls: string[] = [];

      for (const file of toUpload) {
        const ext = file.name.split(".").pop();
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

        const { error } = await supabase.storage
          .from("gambar")
          .upload(fileName, file, { cacheControl: "3600", upsert: false });

        if (error) {
          console.error("Upload error:", error.message);
          continue;
        }

        const { data: urlData } = supabase.storage
          .from("gambar")
          .getPublicUrl(fileName);

        newUrls.push(urlData.publicUrl);
      }

      onChange([...value, ...newUrls]);
      setUploading(false);
    },
    [folder, maxFiles, onChange, value]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) uploadFiles(e.target.files);
    // Reset agar bisa upload file yang sama lagi
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) uploadFiles(e.dataTransfer.files);
  };

  const handleRemove = async (url: string) => {
    const urlParts = url.split("/storage/v1/object/public/gambar/");
    if (urlParts[1]) {
      await supabase.storage.from("gambar").remove([urlParts[1]]);
    }
    onChange(value.filter((u) => u !== url));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-muted mb-1.5">
        {label}
        <span className="text-xs text-muted ml-2">
          ({value.length}/{maxFiles})
        </span>
      </label>

      {/* Grid preview */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
          {value.map((url, i) => (
            <div
              key={i}
              className="relative group rounded-lg overflow-hidden border border-white/10 aspect-video"
            >
              <Image
                src={url}
                alt={`Screenshot ${i + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-2">
                <span className="text-[10px] text-white/70 font-mono">
                  {i + 1}/{value.length}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {value.length < maxFiles && (
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
              ? "border-primary bg-primary/10"
              : "border-white/10 hover:border-white/20 bg-white/2 hover:bg-white/4"
          } ${uploading ? "pointer-events-none opacity-60" : ""}`}
        >
          {uploading ? (
            <Loader2 size={24} className="text-primary animate-spin" />
          ) : value.length > 0 ? (
            <Plus
              size={24}
              className={dragActive ? "text-primary" : "text-muted"}
            />
          ) : (
            <Images
              size={24}
              className={dragActive ? "text-primary" : "text-muted"}
            />
          )}
          <div>
            <p className="text-sm text-white font-medium">
              {uploading
                ? "Mengupload..."
                : dragActive
                  ? "Lepaskan file di sini"
                  : "Tambah screenshot (bisa pilih beberapa)"}
            </p>
            <p className="text-xs text-muted mt-0.5">
              JPG, PNG, WebP — Maks 5MB per file
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
