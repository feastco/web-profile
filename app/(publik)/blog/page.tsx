"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { Terminal, ArrowRight, ChevronLeft, ChevronRight, Mail } from "lucide-react";

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

// --- Mock Data (fallback jika DB belum ada) ---
const mockArtikel: Artikel[] = [
  {
    id: "1",
    judul: "Architecting Scalable Microservices with Go and Kubernetes",
    slug: "microservices-go-kubernetes",
    kutipan: "Exploring patterns for building resilient distributed systems in modern cloud environments, focusing on observability and fault tolerance.",
    konten: "",
    gambar_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60",
    kategori: "BACKEND",
    tags: ["GOLANG", "K8S", "DOCKER"],
    menit_baca: 12,
    diterbitkan: true,
    dibuat_pada: "2023-10-24T00:00:00",
  },
  {
    id: "2",
    judul: "Deep Dive into React Server Components",
    slug: "react-server-components-deep-dive",
    kutipan: "Learn how RSCs are changing the way we think about data fetching, bundle sizes, and rendering patterns in modern web applications.",
    konten: "",
    gambar_url: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&auto=format&fit=crop&q=60",
    kategori: "REACT",
    tags: ["REACT", "NEXTJS", "SSR"],
    menit_baca: 8,
    diterbitkan: true,
    dibuat_pada: "2023-10-15T00:00:00",
  },
  {
    id: "3",
    judul: "Mastering TypeScript Generic Types",
    slug: "mastering-typescript-generics",
    kutipan: "A comprehensive guide to leveraging generics for type-safe and reusable code architecture that scales across teams.",
    konten: "",
    gambar_url: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&auto=format&fit=crop&q=60",
    kategori: "TYPESCRIPT",
    tags: ["TYPESCRIPT", "JAVASCRIPT"],
    menit_baca: 6,
    diterbitkan: true,
    dibuat_pada: "2023-10-12T00:00:00",
  },
  {
    id: "4",
    judul: "Optimizing Database Queries in PostgreSQL",
    slug: "optimizing-postgresql-queries",
    kutipan: "Practical tips for indexing, query planning, and optimization to boost performance in high-traffic applications.",
    konten: "",
    gambar_url: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=60",
    kategori: "DATABASE",
    tags: ["POSTGRES", "SQL", "DATABASE"],
    menit_baca: 10,
    diterbitkan: true,
    dibuat_pada: "2023-10-05T00:00:00",
  },
  {
    id: "5",
    judul: "CSS Grid vs Flexbox: The Definitive Guide",
    slug: "css-grid-vs-flexbox",
    kutipan: "When to use which layout system for modern web interfaces, deciding based on performance and maintainability.",
    konten: "",
    gambar_url: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop&q=60",
    kategori: "CSS",
    tags: ["CSS", "FRONTEND", "DESIGN"],
    menit_baca: 5,
    diterbitkan: true,
    dibuat_pada: "2023-09-28T00:00:00",
  },
  {
    id: "6",
    judul: "Zero-Downtime Deployment with AWS",
    slug: "zero-downtime-aws-deployment",
    kutipan: "Implementing Blue-Green deployments and Canary releases using AWS CodeDeploy and Application Load Balancers.",
    konten: "",
    gambar_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60",
    kategori: "AWS",
    tags: ["AWS", "DEVOPS", "CLOUD"],
    menit_baca: 15,
    diterbitkan: true,
    dibuat_pada: "2023-09-21T00:00:00",
  },
];

const KATEGORI_FILTERS = ["ALL", "REACT", "TYPESCRIPT", "BACKEND", "DATABASE", "CSS", "AWS"];
const POSTS_PER_PAGE = 5;

// --- Category badge colour map ---
const badgeColor: Record<string, string> = {
  REACT:      "bg-blue-500/10 text-blue-400 border-blue-500/20",
  TYPESCRIPT: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  BACKEND:    "bg-violet-500/10 text-violet-400 border-violet-500/20",
  DATABASE:   "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  CSS:        "bg-pink-500/10 text-pink-400 border-pink-500/20",
  AWS:        "bg-orange-500/10 text-orange-400 border-orange-500/20",
  DEFAULT:    "bg-primary/10 text-primary border-primary/20",
};

function getBadgeColor(kat: string | null) {
  if (!kat) return badgeColor.DEFAULT;
  return badgeColor[kat.toUpperCase()] ?? badgeColor.DEFAULT;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "2-digit", year: "numeric"
  });
}

// --- Components ---
function FeaturedCard({ artikel }: { artikel: Artikel }) {
  return (
    <Link href={`/blog/${artikel.slug}`} className="group relative grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-xl border border-white/5 bg-[#151921] hover:border-primary/40 transition-all duration-500">
      <div className="lg:col-span-7 h-64 lg:h-auto overflow-hidden">
        {artikel.gambar_url ? (
          <img
            src={artikel.gambar_url}
            alt={artikel.judul}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-background flex items-center justify-center">
            <Terminal size={48} className="text-primary/30" />
          </div>
        )}
      </div>
      <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-6">
          <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-mono font-bold tracking-wider uppercase border border-primary/30">
            Featured Post
          </span>
          <span className="text-slate-400 text-xs font-mono">{formatDate(artikel.dibuat_pada)}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight text-white group-hover:text-primary transition-colors">
          {artikel.judul}
        </h2>
        <p className="text-slate-400 text-base leading-relaxed mb-8">
          {artikel.kutipan}
        </p>
        <div className="flex flex-wrap gap-2 mb-8">
          {artikel.tags?.map((tag) => (
            <span key={tag} className="font-mono text-[10px] text-slate-300 px-2 py-0.5 border border-white/10 rounded">
              {tag}
            </span>
          ))}
        </div>
        <span className="flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all uppercase text-sm tracking-widest">
          Read Article <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}

function ArticleCard({ artikel }: { artikel: Artikel }) {
  return (
    <Link href={`/blog/${artikel.slug}`} className="group flex flex-col bg-[#151921] rounded-xl border border-white/5 overflow-hidden hover:border-primary/40 transition-all duration-300">
      <div className="aspect-video w-full overflow-hidden flex-shrink-0">
        {artikel.gambar_url ? (
          <img
            src={artikel.gambar_url}
            alt={artikel.judul}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-background flex items-center justify-center">
            <Terminal size={32} className="text-primary/30" />
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-mono text-slate-500 uppercase">
            {formatDate(artikel.dibuat_pada)} {artikel.menit_baca ? `• ${artikel.menit_baca} min read` : ""}
          </span>
          {artikel.kategori && (
            <span className={`px-2 py-0.5 rounded-sm text-[10px] font-mono border uppercase tracking-tighter ${getBadgeColor(artikel.kategori)}`}>
              {artikel.kategori}
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold mb-3 leading-snug text-white group-hover:text-primary transition-colors">
          {artikel.judul}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
          {artikel.kutipan}
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
export default function BlogPage() {
  const [artikelList, setArtikelList] = useState<Artikel[]>([]);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    async function fetchArtikel() {
      try {
        const { data, error } = await supabase
          .from("artikel")
          .select("*")
          .eq("diterbitkan", true)
          .order("dibuat_pada", { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) {
          setArtikelList(data as Artikel[]);
        } else {
          setArtikelList(mockArtikel);
        }
      } catch {
        setArtikelList(mockArtikel);
      }
    }
    fetchArtikel();
  }, []);

  const filtered = activeFilter === "ALL"
    ? artikelList
    : artikelList.filter((a) =>
        a.kategori?.toUpperCase() === activeFilter ||
        a.tags?.some((t) => t.toUpperCase() === activeFilter)
      );

  const featured = filtered[0] ?? null;
  const rest = filtered.slice(1);
  const totalPages = Math.ceil(rest.length / POSTS_PER_PAGE);
  const paginated = rest.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const handleFilterChange = (f: string) => {
    setActiveFilter(f);
    setCurrentPage(1);
  };

  return (
    <div className="py-12">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/5 bg-white/[0.02] text-sm font-medium text-primary mb-4 font-mono w-fit">
          <Terminal size={16} />
          <span>~/blog/archive</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">Latest Insights</h1>
        <div className="h-1 w-20 bg-primary mt-4 rounded-full" />
      </div>

      {/* Featured Post */}
      {featured && (
        <section className="mb-16">
          <FeaturedCard artikel={featured} />
        </section>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-3 mb-10 overflow-x-auto pb-2">
        {KATEGORI_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => handleFilterChange(f)}
            className={`px-5 py-2 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all ${
              activeFilter === f
                ? "bg-primary text-white"
                : "bg-white/[0.02] border border-white/5 text-slate-300 hover:border-primary/50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Article Grid */}
      {paginated.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginated.map((a) => (
            <ArticleCard key={a.id} artikel={a} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-white/5 rounded-2xl bg-[#151921]">
          <p className="font-mono text-muted">No articles found in this category.</p>
        </div>
      )}

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

      {/* Newsletter */}
      {/* <section className="mt-24 border-y border-white/5 bg-[#151921]/50 py-20 -mx-6 md:-mx-12 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4 text-primary font-mono text-sm">
            <Mail size={16} />
            <span>NEWSLETTER</span>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-white">Never miss a deep dive.</h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto">
            Subscribe to get my latest technical articles and software architecture insights delivered to your inbox.
          </p>
          {subscribed ? (
            <p className="text-primary font-mono font-bold py-4">✓ You&apos;re subscribed! Thanks for joining.</p>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); if (email) setSubscribed(true); }}
              className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="flex-1 bg-background border border-white/10 rounded-xl px-6 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-xl transition-colors whitespace-nowrap"
              >
                Subscribe Now
              </button>
            </form>
          )}
        </div>
      </section> */}
    </div>
  );
}
