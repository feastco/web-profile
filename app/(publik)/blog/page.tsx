"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { Terminal, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// --- Types ---
type Artikel = {
  id: string;
  judul: string;
  slug: string;
  konten: string | null;
  gambar_sampul: string | null;
  diterbitkan_pada: string | null;
};

const POSTS_PER_PAGE = 5;

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "2-digit", year: "numeric"
  });
}

// Ambil kutipan dari konten (150 karakter pertama)
function getExcerpt(konten: string | null, maxLength = 150): string {
  if (!konten) return "Belum ada konten.";
  const plainText = konten
    .replace(/#{1,6}\s/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[>\-*]/g, '')
    .replace(/\n+/g, ' ')
    .trim();
  return plainText.length > maxLength ? plainText.slice(0, maxLength) + "..." : plainText;
}

// --- Components ---
function FeaturedCard({ artikel }: { artikel: Artikel }) {
  return (
    <Link href={`/blog/${artikel.slug}`} className="group relative grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-xl border border-white/5 bg-secondary-bg hover:border-primary/40 transition-all duration-500">
      <div className="lg:col-span-7 h-64 lg:h-auto overflow-hidden">
        {artikel.gambar_sampul ? (
          <Image
            src={artikel.gambar_sampul}
            alt={artikel.judul}
            width={800}
            height={450}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-primary/20 to-background flex items-center justify-center min-h-64">
            <Terminal size={48} className="text-primary/30" />
          </div>
        )}
      </div>
      <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-6">
          <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-mono font-bold tracking-wider uppercase border border-primary/30">
            Featured Post
          </span>
          <span className="text-slate-400 text-xs font-mono">{formatDate(artikel.diterbitkan_pada)}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight text-white group-hover:text-primary transition-colors">
          {artikel.judul}
        </h2>
        <p className="text-slate-400 text-base leading-relaxed mb-8">
          {getExcerpt(artikel.konten)}
        </p>
        <span className="flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all uppercase text-sm tracking-widest">
          Read Article <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}

function ArticleCard({ artikel }: { artikel: Artikel }) {
  return (
    <Link href={`/blog/${artikel.slug}`} className="group flex flex-col bg-secondary-bg rounded-xl border border-white/5 overflow-hidden hover:border-primary/40 transition-all duration-300">
      <div className="aspect-video w-full overflow-hidden shrink-0">
        {artikel.gambar_sampul ? (
          <Image
            src={artikel.gambar_sampul}
            alt={artikel.judul}
            width={600}
            height={340}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-primary/10 to-background flex items-center justify-center">
            <Terminal size={32} className="text-primary/30" />
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-mono text-slate-500 uppercase">
            {formatDate(artikel.diterbitkan_pada)}
          </span>
        </div>
        <h3 className="text-lg font-bold mb-3 leading-snug text-white group-hover:text-primary transition-colors">
          {artikel.judul}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
          {getExcerpt(artikel.konten)}
        </p>
        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500">READ MORE</span>
          <ArrowRight size={16} className="text-slate-600 group-hover:text-primary transition-colors" />
        </div>
      </div>
    </Link>
  );
}

// --- Main Page ---
export default function ArtikelPage() {
  const [artikelList, setArtikelList] = useState<Artikel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArtikel() {
      try {
        const { data, error } = await supabase
          .from("artikel")
          .select("*")
          .order("diterbitkan_pada", { ascending: false });

        if (error) throw error;
        if (data) {
          setArtikelList(data as Artikel[]);
        }
      } catch {
        setArtikelList([]);
      } finally {
        setLoading(false);
      }
    }
    fetchArtikel();
  }, []);

  const featured = artikelList[0] ?? null;
  const rest = artikelList.slice(1);
  const totalPages = Math.ceil(rest.length / POSTS_PER_PAGE);
  const paginated = rest.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  if (loading) {
    return (
      <div className="py-12">
        <div className="flex items-center justify-center py-40">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/5 bg-white/2 text-sm font-medium text-primary mb-4 font-mono w-fit">
          <Terminal size={16} />
          <span>~/artikel/archive</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">Artikel Terbaru</h1>
        <div className="h-1 w-20 bg-primary mt-4 rounded-full" />
      </div>

      {/* Featured Post */}
      {featured && (
        <section className="mb-16">
          <FeaturedCard artikel={featured} />
        </section>
      )}

      {/* Article Grid */}
      {artikelList.length === 0 ? (
        <div className="py-20 text-center border border-white/5 rounded-2xl bg-secondary-bg">
          <p className="font-mono text-muted">Belum ada artikel yang dipublish.</p>
        </div>
      ) : paginated.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginated.map((a) => (
            <ArticleCard key={a.id} artikel={a} />
          ))}
        </div>
      ) : null}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-16 flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="size-10 flex items-center justify-center rounded border border-white/10 hover:border-primary transition-colors disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`size-10 flex items-center justify-center rounded text-sm font-mono transition-all ${
                currentPage === i + 1
                  ? "bg-primary text-white"
                  : "border border-white/10 text-slate-400 hover:text-white hover:border-primary"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="size-10 flex items-center justify-center rounded border border-white/10 hover:border-primary transition-colors disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
