import type { Metadata } from "next";
import { supabase } from "@/lib/supabase/client";
import { KartuProyek, Proyek } from "@/components/fitur/KartuProyek";
import { Terminal } from "lucide-react";

export const metadata: Metadata = {
  title: "Proyek | Project Archive",
  description: "Koleksi lengkap proyek pengembangan perangkat lunak, mulai dari aplikasi enterprise hingga kontribusi open-source.",
  openGraph: {
    title: "Project Archive",
    description: "Koleksi lengkap proyek pengembangan perangkat lunak saya.",
  },
};

export const revalidate = 0; // Disable static caching so data changes reflect immediately

// DUMMY FALLBACK
const fallbackData: Proyek[] = [
  {
    id: "1",
    judul: "Omni Dashboard",
    slug: "omni-dashboard",
    kutipan: "A real-time analytics platform monitoring microservices health across global regions.",
    kategori: "FinTech",
    teknologi: ["React", "Express"],
    gambar_andalan: null,
    url_live: "https://example.com",
    url_github: null,
  },
  {
    id: "2",
    judul: "Flux Store",
    slug: "flux-store",
    kutipan: "Headless commerce engine built with Next.js and Shopify API for high-conversion retail.",
    kategori: "Commerce",
    teknologi: ["Next.js", "Shopify"],
    gambar_andalan: null,
    url_live: null,
    url_github: "https://github.com/example",
  }
];

export default async function HalamanProyek() {
  let proyekList: Proyek[] = [];
  
  try {
    const { data, error } = await supabase
      .from('proyek')
      .select('*')
      .order('dibuat_pada', { ascending: false });
      
    if (error) throw error;
    proyekList = (data && data.length > 0) ? data : fallbackData;
  } catch {
    proyekList = fallbackData;
  }

  return (
    <div className="pt-8 pb-20 min-h-screen">
      <div className="max-w-3xl mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/5 bg-white/2 text-sm font-medium text-primary mb-6 font-mono">
          <Terminal size={16} />
          <span>~/projects/archive</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-white leading-tight">
          Project Archive
        </h1>
        <p className="text-lg text-muted leading-relaxed">
          Comprehensive collection of my development work, ranging from enterprise applications and complex system architectures to open-source contributions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proyekList.map((pro) => (
          <KartuProyek key={pro.id} proyek={pro} />
        ))}
      </div>

      {proyekList.length === 0 && (
        <div className="py-24 text-center border overflow-hidden relative border-white/5 rounded-2xl bg-secondary-bg flex flex-col items-center justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[80px]"></div>
          <Terminal size={48} className="text-white/20 mb-4 relative z-10" strokeWidth={1} />
          <p className="text-muted font-mono relative z-10">No projects found in the database.</p>
        </div>
      )}
    </div>
  );
}
