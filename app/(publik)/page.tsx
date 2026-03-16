import { supabase } from "@/lib/supabase/client";
import { KartuProyek, Proyek } from "@/components/fitur/KartuProyek";
import Link from "next/link";
import { ArrowRight, Box, Code2, Cloud, Database, LayoutTemplate } from "lucide-react";

export const revalidate = 0; // Disable static caching so data changes reflect immediately

// DUMMY FALLBACK jika ENV belum disetup
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
  },
  {
    id: "3",
    judul: "Sentinel Auth",
    slug: "sentinel-auth",
    kutipan: "Open-source identity provider implementing OAuth2.0 and biometric verification.",
    kategori: "Security",
    teknologi: ["React", "Go"],
    gambar_andalan: null,
    url_live: "https://example.com",
    url_github: "https://github.com/example",
  }
];

export default async function Beranda() {
  let proyekUnggulan: Proyek[] = [];
  
  // Mencoba melakukan fetching ke Supabase
  try {
    const { data, error } = await supabase
      .from('proyek')
      .select('*')
      .eq('unggulan', true)
      .order('dibuat_pada', { ascending: false })
      .limit(3);
      
    if (error) throw error;
    if (data && data.length > 0) {
      proyekUnggulan = data;
    } else {
      proyekUnggulan = fallbackData; // Fallback jika tabel kosong
    }
  } catch {
    console.warn("Supabase gagal merespons, memastikan fallback data ditampilkan. Pastikan ENV Supabase sudah terisi.");
    proyekUnggulan = fallbackData;
  }

  return (
    <>
      <section className="relative z-10 pt-32 lg:pt-40 pb-20 min-h-[85vh] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full">
          
          {/* Kolom Kiri: Hero Teks */}
          <div className="flex flex-col items-start text-left">
            <div className="inline-flex glass-panel items-center px-4 py-1.5 rounded-full text-xs font-mono font-medium text-primary mb-8 border border-primary/20 bg-primary/5">
              <span className="relative flex h-2 w-2 mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              AVAILABLE FOR NEW PROJECTS
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-[-0.03em] mb-6 leading-[1.1] text-white">
              Architecting <br className="hidden md:block"/>
              <span className="text-primary">Scalable</span> Digital <br className="hidden md:block"/>
              Experiences.
            </h1>

            <p className="text-lg text-muted max-w-xl mb-10 leading-relaxed">
              Full-stack engineer specializing in high-performance React ecosystems and 
              cloud-native Node.js architectures. Turning complex requirements into 
              elegant, efficient code.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full sm:w-auto">
              <Link href="/proyek" className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-md font-medium transition-all flex items-center justify-center">
                View Projects <ArrowRight size={18} className="ml-2" />
              </Link>
              <Link href="/tentang" className="w-full sm:w-auto glass-panel text-white hover:bg-white/5 border border-white/10 px-8 py-3.5 rounded-md font-medium transition-all flex items-center justify-center">
                Read Resume
              </Link>
            </div>

            {/* Tech Stack */}
            <div>
              <h3 className="font-mono text-xs font-semibold text-muted tracking-widest uppercase mb-4">Tech Stack</h3>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/5 bg-white/[0.02] text-sm font-medium text-gray-300">
                  <Box size={16} className="text-cyan-400" /> React
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/5 bg-white/[0.02] text-sm font-medium text-gray-300">
                  <Code2 size={16} className="text-green-500" /> Node.js
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/5 bg-white/[0.02] text-sm font-medium text-gray-300">
                  <LayoutTemplate size={16} className="text-sky-400" /> Tailwind
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/5 bg-white/[0.02] text-sm font-medium text-gray-300">
                  <Database size={16} className="text-blue-400" /> PostgreSQL
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/5 bg-white/[0.02] text-sm font-medium text-gray-300">
                  <Cloud size={16} className="text-orange-400" /> AWS
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Ilustrasi Visual / Mock Terminal */}
          <div className="hidden lg:flex justify-end pr-4">
            <div className="w-full max-w-lg aspect-square relative glass-panel rounded-2xl border border-white/10 bg-linear-to-b from-transparent to-[#151921]/50 p-2 shadow-2xl">
              <div className="absolute -top-3 left-4 bg-[#0B0E14] px-2 text-white/20">
                <div className="w-8 h-2 rounded-full bg-white/10"></div>
              </div>
              <div className="w-full h-full rounded-xl border border-white/5 bg-[#0B0E14]/60 flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-xs">
                {/* Aksen Glowing */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-20 h-20 bg-primary/20 rounded-xl flex items-center justify-center mb-8 border border-primary/30">
                    <Code2 size={40} className="text-primary" strokeWidth={2} />
                  </div>
                  
                  <div className="font-mono text-sm text-center">
                    <p className="text-gray-400 mb-2">npm install @devcore/portfolio</p>
                    <p className="text-primary"> {'>'} Portfolio initialized successfully</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-24 border-t border-white/5 mt-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">Featured Projects</h2>
            <p className="text-muted leading-relaxed">Selection of my most challenging and impactful development work.</p>
          </div>
          <Link href="/proyek" className="relative z-20 flex items-center text-primary hover:text-white font-medium transition-colors">
            View Archive <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proyekUnggulan.map((pro) => (
            <KartuProyek key={pro.id} proyek={pro} />
          ))}
        </div>
        
        <div className="mt-10 md:hidden flex justify-center">
          <Link href="/proyek" className="glass-panel px-8 py-3 rounded-md text-sm font-medium hover:bg-white/5 transition-colors border-white/10">
            View Archive
          </Link>
        </div>
      </section>
    </>
  );
}
