import { supabase } from "@/lib/supabase/client";
import { KartuProyek, Proyek } from "@/components/fitur/KartuProyek";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Code, Palette, FileJson, Server, Coffee, Hexagon, Box, Layers, Flame, Wind, LayoutTemplate, Database, Globe, Monitor, Smartphone, Code2, GitBranch, Github, Package, Send, Triangle, LayoutGrid, HardDrive, Terminal, Braces, FileCode } from "lucide-react";

export const revalidate = 0; // Disable static caching so data changes reflect immediately

const techStackItems = [
  { name: "PHP", icon: Server, color: "text-indigo-400" },
  { name: "HTML5", icon: Code, color: "text-orange-500" },
  { name: "CSS", icon: Palette, color: "text-blue-500" },
  { name: "Java", icon: Coffee, color: "text-red-500" },
  { name: "JavaScript", icon: FileJson, color: "text-yellow-400" },
  { name: "C++", icon: Braces, color: "text-blue-600" },
  { name: "CodeIgniter", icon: Flame, color: "text-orange-600" },
  { name: "Laravel", icon: Layers, color: "text-red-500" },
  { name: "React", icon: Hexagon, color: "text-cyan-400" },
  { name: "Node.js", icon: Box, color: "text-green-500" },
  { name: "Tailwind CSS", icon: Wind, color: "text-sky-400" },
  { name: "Bootstrap", icon: LayoutTemplate, color: "text-purple-500" },
  { name: "MySQL", icon: Database, color: "text-blue-400" },
  { name: "PostgreSQL", icon: Database, color: "text-blue-500" },
  { name: "XML", icon: FileCode, color: "text-orange-400" },
  { name: "JSON", icon: Braces, color: "text-gray-300" },
  { name: "NGINX", icon: Globe, color: "text-green-600" },
  { name: "Apache HTTP Server", icon: Globe, color: "text-red-400" }
];

const devToolsItems = [
  { name: "Visual Studio", icon: Monitor, color: "text-purple-500" },
  { name: "Android Studio", icon: Smartphone, color: "text-green-500" },
  { name: "NetBeans IDE", icon: Code2, color: "text-blue-300" },
  { name: "IntelliJ IDEA", icon: Code2, color: "text-pink-500" },
  { name: "Git", icon: GitBranch, color: "text-orange-500" },
  { name: "GitHub", icon: Github, color: "text-white" },
  { name: "Composer", icon: Package, color: "text-yellow-600" },
  { name: "Postman", icon: Send, color: "text-orange-400" },
  { name: "Vercel", icon: Triangle, color: "text-white" },
  { name: "Windows", icon: LayoutGrid, color: "text-blue-400" },
  { name: "Debian", icon: HardDrive, color: "text-red-500" },
  { name: "Ubuntu", icon: Terminal, color: "text-orange-500" }
];

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
      <section className="relative z-10 pt-8 lg:pt-12 pb-20 min-h-[85vh] flex items-center">
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

            {/* Tech Stack & Tools */}
            <div className="space-y-6">
              {/* Grup Tech Stack */}
              <div>
                <h3 className="font-mono text-xs font-semibold text-muted tracking-widest uppercase mb-3">Tech Stack & Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {techStackItems.map(tech => (
                    <span key={tech.name} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/5 bg-white/[0.02] text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-all cursor-default">
                      <tech.icon size={14} className={tech.color} />
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Grup Tools */}
              <div>
                <h3 className="font-mono text-xs font-semibold text-muted tracking-widest uppercase mb-3">Tools & Environment</h3>
                <div className="flex flex-wrap gap-2">
                  {devToolsItems.map(tool => (
                    <span key={tool.name} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/5 bg-white/[0.02] text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-all cursor-default">
                      <tool.icon size={14} className={tool.color} />
                      {tool.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Foto Profil / Visual */}
          <div className="flex justify-center lg:justify-end pr-0 lg:pr-4 w-full order-first lg:order-last mb-8 lg:mb-0 mt-8 lg:mt-0">
            {/* UBAH UKURAN & POSISI DI SINI:
                - "w-[260px]" adalah ukuran lebar & tinggi foto saat di HP (Mobile).
                - "-translate-y-4 lg:-translate-y-12" mengatur letak naik turun (berbeda untuk HP & Desktop). */}
            <div className="relative w-[260px] sm:w-[320px] lg:w-full max-w-sm xl:max-w-md aspect-square group -translate-y-4 lg:-translate-y-12 duration-300">
              {/* Efek Glow di belakang */}
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] group-hover:bg-primary/30 transition-all duration-700"></div>
              
              {/* Frame Kaca (Glassmorphism) */}
              <div className="relative w-full h-full rounded-full border border-white/10 bg-linear-to-b from-white/5 to-transparent p-3 shadow-2xl backdrop-blur-md">
                <div className="w-full h-full rounded-full overflow-hidden border border-white/5 bg-[#0B0E14] relative flex items-center justify-center">
                  {/* Foto Profil */}
                  <Image 
                    src="/images/profile.jpg"
                    alt="Foto Profil"
                    fill
                    // Anda bisa mengubah object-center menjadi object-top, object-bottom, atau object-[center_30%] untuk menggeser fokus foto
                    className="object-cover object-[center_5%] transition-transform duration-700 group-hover:scale-105"
                    priority
                    sizes="(max-width: 1024px) 100vw, 500px"
                  />
                  {/* Overlay gradien tipis agar menyatu dengan background */}
                  <div className="absolute inset-0 bg-linear-to-tr from-[#0B0E14]/40 via-transparent to-transparent pointer-events-none"></div>
                </div>
              </div>
              
              {/* Floating Badge (Aksen tambahan) */}
              <div className="absolute bottom-6 right-0 lg:-right-6 glass-panel px-5 py-3 rounded-full border border-white/10 shadow-xl flex items-center gap-3 bg-white/5 backdrop-blur-xl z-20">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>
                </div>
                <span className="text-xs font-semibold tracking-wide text-white">Open to Work</span>
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
