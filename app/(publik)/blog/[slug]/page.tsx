"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { use } from "react";
import { supabase } from "@/lib/supabase/client";
import { ArrowLeft, Clock, Calendar, ChevronRight } from "lucide-react";
import PdfViewer from "@/components/fitur/PdfViewer";

// --- Types ---
type Artikel = {
  id: string;
  judul: string;
  slug: string;
  konten: string | null;
  gambar_sampul: string | null;
  file_pdf: string | null;
  diterbitkan_pada: string | null;
};

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });
}

function formatDateShort(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

// Estimasi waktu baca dari konten
function estimateReadTime(konten: string | null): number {
  if (!konten) return 1;
  const wordCount = konten.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

// Ambil kutipan dari konten
function getExcerpt(konten: string | null, maxLength = 200): string {
  if (!konten) return "";
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

// Simple markdown-lite renderer
function renderContent(konten: string) {
  const lines = konten.split("\n");
  const elements: React.ReactNode[] = [];
  let codeBuffer: string[] = [];
  let inCode = false;
  let codeLang = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("```")) {
      if (inCode) {
        elements.push(
          <div key={i} className="bg-background border border-white/5 rounded-xl p-6 my-8 font-mono text-sm overflow-x-auto">
            <div className="flex justify-between mb-4 border-b border-white/5 pb-2">
              <span className="text-slate-500">snippet</span>
              <span className="text-primary uppercase">{codeLang || "CODE"}</span>
            </div>
            <pre className="text-slate-300 whitespace-pre-wrap"><code>{codeBuffer.join("\n")}</code></pre>
          </div>
        );
        codeBuffer = [];
        inCode = false;
        codeLang = "";
      } else {
        inCode = true;
        codeLang = line.replace("```", "").trim();
      }
      continue;
    }

    if (inCode) {
      codeBuffer.push(line);
      continue;
    }

    if (line.startsWith("## ")) {
      elements.push(<h2 key={i} className="text-2xl font-bold text-white mt-10 mb-4">{line.replace("## ", "")}</h2>);
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={i} className="text-xl font-bold text-white mt-8 mb-3">{line.replace("### ", "")}</h3>);
    } else if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={i} className="border-l-4 border-primary pl-6 py-2 italic text-slate-400 my-8">
          {line.replace(/^> /, "")}
        </blockquote>
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <li key={i} className="text-slate-300 ml-6 mb-1 list-disc">
          {line.replace(/^[-*] /, "")}
        </li>
      );
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="mb-4" />);
    } else {
      const html = line
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
        .replace(/`(.*?)`/g, '<code class="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono text-sm">$1</code>');
      elements.push(
        <p key={i} className="text-slate-300 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: html }} />
      );
    }
  }

  return elements;
}

// --- Main Component ---
export default function ArtikelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [artikel, setArtikel] = useState<Artikel | null>(null);
  const [related, setRelated] = useState<{ slug: string; judul: string; diterbitkan_pada: string | null; gambar_sampul: string | null }[]>([]);
  const [readProgress, setReadProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);

  // Reading Progress
  useEffect(() => {
    const handleScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      const scrolled = Math.max(0, -top);
      const total = height - windowH;
      const progress = total > 0 ? Math.min(100, (scrolled / total) * 100) : 100;
      setReadProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch data
  useEffect(() => {
    async function fetchArtikel() {
      try {
        const { data, error } = await supabase
          .from("artikel")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error) throw error;
        setArtikel(data as Artikel);

        // fetch related
        const { data: rel } = await supabase
          .from("artikel")
          .select("slug, judul, diterbitkan_pada, gambar_sampul")
          .neq("slug", slug)
          .order("diterbitkan_pada", { ascending: false })
          .limit(3);
        setRelated(rel ?? []);
      } catch {
        setNotFoundState(true);
      } finally {
        setLoading(false);
      }
    }
    fetchArtikel();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFoundState || !artikel) {
    notFound();
  }

  const readTime = estimateReadTime(artikel.konten);
  const excerpt = getExcerpt(artikel.konten);

  return (
    <div className="py-12 min-h-screen">
      {/* Reading Progress Bar (fixed) */}
      <div className="fixed top-0 left-0 w-full h-0.5 bg-white/5 z-50">
        <div
          className="h-full bg-primary transition-all duration-100"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* Kembali ke Artikel */}
      <Link href="/blog" className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors mb-10 group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Kembali ke Artikel
      </Link>

      {/* Hero Image */}
      {artikel.gambar_sampul && (
        <div className="mb-10 max-w-5xl mx-auto rounded-2xl overflow-hidden border border-white/5">
          <Image
            src={artikel.gambar_sampul}
            alt={artikel.judul}
            width={1200}
            height={600}
            className="w-full h-auto max-h-112 object-cover"
            unoptimized
            priority
          />
        </div>
      )}

      {/* Hero */}
      <div className="mb-10 max-w-5xl mx-auto">
        <div className="flex flex-col gap-4 mb-8">
          <span className="font-mono text-primary text-sm tracking-wider uppercase">04. Artikel</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white">
            {artikel.judul}
          </h1>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-sm flex-wrap">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formatDate(artikel.diterbitkan_pada)}
            </span>
            <span className="size-1 rounded-full bg-slate-600" />
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {readTime} min read
            </span>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div ref={articleRef} className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 pb-20 pt-8">
        {/* Article Body */}
        <article className="lg:col-span-8">
          {/* Lead paragraph */}
          {excerpt && (
            <p className="text-lg leading-relaxed text-slate-300 mb-8 border-l-4 border-primary pl-6 italic">
              {excerpt}
            </p>
          )}

          {/* Content */}
          <div className="prose-invert max-w-none">
            {artikel.konten ? (
              renderContent(artikel.konten)
            ) : (
              <p className="text-slate-400">No content available for this article yet.</p>
            )}
          </div>

          {/* PDF Viewer */}
          {artikel.file_pdf && (
            <PdfViewer url={artikel.file_pdf} title={`${artikel.judul} — PDF`} />
          )}
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-4 flex flex-col gap-8">
          {/* Related Posts */}
          {related.length > 0 && (
            <div className="bg-[#151921] border border-white/5 p-6 rounded-2xl">
              <h3 className="text-white font-bold mb-6">Artikel Terkait</h3>
              <div className="flex flex-col gap-5">
                {related.map((r) => (
                  <Link key={r.slug} href={`/blog/${r.slug}`} className="group flex items-start gap-3">
                    {r.gambar_sampul ? (
                      <Image
                        src={r.gambar_sampul}
                        alt={r.judul}
                        width={64}
                        height={40}
                        className="w-16 h-10 rounded-md object-cover border border-white/10 shrink-0 mt-0.5"
                        unoptimized
                      />
                    ) : (
                      <div className="w-16 h-10 rounded-md bg-white/5 border border-white/10 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-xs font-mono text-primary">{formatDateShort(r.diterbitkan_pada)}</p>
                      <h4 className="text-slate-300 group-hover:text-primary transition-colors font-medium text-sm leading-snug">
                        {r.judul}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Kembali ke Artikel */}
          <Link
            href="/blog"
            className="group flex items-center justify-between bg-[#151921] border border-white/5 hover:border-primary/40 p-4 rounded-xl transition-all"
          >
            <span className="text-slate-300 text-sm font-medium">Semua Artikel</span>
            <ChevronRight size={16} className="text-slate-500 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </Link>
        </aside>
      </div>

      {/* Footer CTA */}
      <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto">
        <div>
          <h3 className="text-2xl font-bold text-white">Suka artikelnya?</h3>
          <p className="text-slate-400 mt-1">Jelajahi lebih banyak artikel tentang development dan arsitektur.</p>
        </div>
        <Link
          href="/blog"
          className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-primary hover:border-primary text-white px-8 py-3 rounded-xl font-bold transition-all group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Kembali ke Artikel
        </Link>
      </div>
    </div>
  );
}
