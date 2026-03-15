"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import { supabase } from "@/lib/supabase/client";
import { ArrowLeft, Clock, Calendar, Tag, Mail, ChevronRight } from "lucide-react";

// --- Types ---
type Artikel = {
  id: string;
  judul: string;
  slug: string;
  kutipan: string;
  konten: string;
  gambar_url: string | null;
  kategori: string | null;
  tags: string[] | null;
  menit_baca: number | null;
  diterbitkan: boolean;
  dibuat_pada: string;
};

// --- Mock fallback ---
const mockData: Record<string, Omit<Artikel, "id">> = {
  "microservices-go-kubernetes": {
    judul: "Architecting Scalable Microservices with Go and Kubernetes",
    slug: "microservices-go-kubernetes",
    kutipan: "Exploring patterns for building resilient distributed systems in modern cloud environments.",
    konten: `## Why Go for Microservices?

Go's design philosophy prioritizes simplicity and performance. Its built-in support for concurrency via goroutines makes it trivial to handle thousands of simultaneous connections without the overhead of traditional threading models.

\`\`\`go
package main

import (
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc("/api/v1/health", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "OK")
    })
    http.ListenAndServe(":8080", nil)
}
\`\`\`

## Structuring the Data Layer

Isolation is key. Each service should own its data store. Sharing a single database across multiple services is a common anti-pattern that leads to tight coupling and deployment bottlenecks.

> "The first rule of distributed systems is: don't distribute your system unless you have to."  
> — Common Wisdom

### Service Mesh with Kubernetes

Kubernetes orchestrates containers and provides automatic service discovery, load balancing, and self-healing. Combined with a service mesh like Istio, you get:

- **Observability** — distributed tracing with Jaeger
- **Security** — mTLS between services  
- **Traffic management** — canary releases and A/B testing

## Conclusion

Building microservices with Go and Kubernetes gives you a solid foundation for high-performance, resilient distributed systems. Focus on service boundaries, own your data layer, and invest early in observability.`,
    gambar_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80",
    kategori: "BACKEND",
    tags: ["GOLANG", "K8S", "DOCKER", "MICROSERVICES"],
    menit_baca: 12,
    diterbitkan: true,
    dibuat_pada: "2023-10-24T00:00:00",
  },
};

const mockRelated = [
  { slug: "react-server-components-deep-dive", judul: "Deep Dive into React Server Components", dibuat_pada: "2023-10-15T00:00:00" },
  { slug: "mastering-typescript-generics", judul: "Mastering TypeScript Generic Types", dibuat_pada: "2023-10-12T00:00:00" },
  { slug: "optimizing-postgresql-queries", judul: "Optimizing Database Queries in PostgreSQL", dibuat_pada: "2023-10-05T00:00:00" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
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
          {line.replace(/^[-*] /, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}
        </li>
      );
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="mb-4" />);
    } else {
      // inline formatting: **bold** and `code`
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
export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [artikel, setArtikel] = useState<Artikel | null>(null);
  const [related, setRelated] = useState<{ slug: string; judul: string; dibuat_pada: string }[]>([]);
  const [readProgress, setReadProgress] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
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
          .eq("diterbitkan", true)
          .single();

        if (error) throw error;
        setArtikel(data as Artikel);

        // fetch related
        const { data: rel } = await supabase
          .from("artikel")
          .select("slug, judul, dibuat_pada")
          .eq("diterbitkan", true)
          .neq("slug", slug)
          .limit(3);
        setRelated(rel ?? []);
      } catch {
        const mock = mockData[slug];
        if (mock) {
          setArtikel({ id: slug, ...mock });
          setRelated(mockRelated.filter((r) => r.slug !== slug).slice(0, 3));
        } else {
          setNotFoundState(true);
        }
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

  return (
    <div className="py-12 min-h-screen">
      {/* Reading Progress Bar (fixed) */}
      <div className="fixed top-0 left-0 w-full h-0.5 bg-white/5 z-50">
        <div
          className="h-full bg-primary transition-all duration-100"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* Back to Blog */}
      <Link href="/blog" className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors mb-10 group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Blog
      </Link>

      {/* Hero */}
      <div className="mb-10 max-w-5xl mx-auto">
        <div className="flex flex-col gap-4 mb-8">
          <span className="font-mono text-primary text-sm tracking-wider uppercase">04. Blog</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white">
            {artikel.judul}
          </h1>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-sm flex-wrap">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formatDate(artikel.dibuat_pada)}
            </span>
            {artikel.menit_baca && (
              <>
                <span className="size-1 rounded-full bg-slate-600" />
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {artikel.menit_baca} min read
                </span>
              </>
            )}
            {artikel.kategori && (
              <>
                <span className="size-1 rounded-full bg-slate-600" />
                <span className="flex items-center gap-1.5">
                  <Tag size={14} />
                  {artikel.kategori}
                </span>
              </>
            )}
          </div>
        </div>

        {artikel.gambar_url && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/5 shadow-2xl mb-0">
            <img src={artikel.gambar_url} alt={artikel.judul} className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Content grid */}
      <div ref={articleRef} className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 pb-20 pt-8">
        {/* Article Body */}
        <article className="lg:col-span-8">
          {/* Lead paragraph */}
          {artikel.kutipan && (
            <p className="text-lg leading-relaxed text-slate-300 mb-8 border-l-4 border-primary pl-6 italic">
              {artikel.kutipan}
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

          {/* Tags */}
          {artikel.tags && artikel.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-white/5">
              {artikel.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-background text-slate-400 px-3 py-1 rounded-full text-xs font-mono border border-white/10"
                >
                  #{tag.toLowerCase()}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-4 flex flex-col gap-8">
          {/* Related Posts */}
          {related.length > 0 && (
            <div className="bg-[#151921] border border-white/5 p-6 rounded-2xl">
              <h3 className="text-white font-bold mb-6">Related Articles</h3>
              <div className="flex flex-col gap-5">
                {related.map((r) => (
                  <Link key={r.slug} href={`/blog/${r.slug}`} className="group flex flex-col gap-1.5">
                    <p className="text-xs font-mono text-primary">{formatDateShort(r.dibuat_pada)}</p>
                    <h4 className="text-slate-300 group-hover:text-primary transition-colors font-medium text-sm leading-snug">
                      {r.judul}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Newsletter Sidebar */}
          <div className="bg-[#151921] border border-primary/20 p-6 rounded-2xl">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Mail size={16} />
              <h3 className="font-bold text-white">Technical Digest</h3>
            </div>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              Get the latest insights on system design delivered to your inbox.
            </p>
            {subscribed ? (
              <p className="text-primary font-mono text-sm font-bold">✓ Subscribed!</p>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); if (email) setSubscribed(true); }} className="flex flex-col gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                  className="bg-background border border-white/10 rounded-xl text-sm px-4 h-10 focus:ring-1 focus:ring-primary focus:border-primary outline-none text-white placeholder:text-slate-600"
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover text-white rounded-xl h-10 text-sm font-bold transition-colors"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

          {/* Back to Blog */}
          <Link
            href="/blog"
            className="group flex items-center justify-between bg-[#151921] border border-white/5 hover:border-primary/40 p-4 rounded-xl transition-all"
          >
            <span className="text-slate-300 text-sm font-medium">Back to All Articles</span>
            <ChevronRight size={16} className="text-slate-500 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </Link>
        </aside>
      </div>

      {/* Footer CTA */}
      <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto">
        <div>
          <h3 className="text-2xl font-bold text-white">Enjoyed the read?</h3>
          <p className="text-slate-400 mt-1">Explore more articles about development and architecture.</p>
        </div>
        <Link
          href="/blog"
          className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-primary hover:border-primary text-white px-8 py-3 rounded-xl font-bold transition-all group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Blog
        </Link>
      </div>
    </div>
  );
}
