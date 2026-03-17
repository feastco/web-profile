"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";

interface GaleriProyekProps {
  gambar: string[];
  judulProyek?: string;
}

export default function GaleriProyek({ gambar, judulProyek = "Proyek" }: GaleriProyekProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!gambar || gambar.length === 0) return null;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % gambar.length);
    }
  };

  const goPrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + gambar.length) % gambar.length);
    }
  };

  return (
    <>
      {/* Gallery Section */}
      <div className="mt-16">
        <div className="flex items-center gap-3 mb-6">
          <Images size={20} className="text-primary" />
          <h3 className="text-xl font-bold text-white">Screenshot</h3>
          <span className="text-xs text-muted font-mono">
            {gambar.length} gambar
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {gambar.map((url, i) => (
            <button
              key={i}
              onClick={() => openLightbox(i)}
              className="group relative rounded-xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all aspect-video"
            >
              <Image
                src={url}
                alt={`${judulProyek} screenshot ${i + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                unoptimized
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-mono text-white bg-black/50 px-2 py-1 rounded">
                  {i + 1} / {gambar.length}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
          >
            <X size={20} />
          </button>

          {/* Counter */}
          <div className="absolute top-6 left-6 text-sm font-mono text-white/60 z-10">
            {lightboxIndex + 1} / {gambar.length}
          </div>

          {/* Prev */}
          {gambar.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-4 md:left-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-[90vw] max-h-[85vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={gambar[lightboxIndex]}
              alt={`${judulProyek} screenshot ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          {/* Next */}
          {gambar.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-4 md:right-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      )}
    </>
  );
}
