import { supabase } from "@/lib/supabase/client";
import { Terminal, Code2 } from "lucide-react";

export const revalidate = 0; // Disable static caching so data changes reflect immediately

interface Pengalaman {
  id: string;
  posisi: string;
  perusahaan: string;
  periode: string;
  deskripsi: string | null;
}

export default async function HalamanTentang() {
  let listPengalaman: Pengalaman[] = [];
  
  try {
    const { data, error } = await supabase
      .from('pengalaman')
      .select('*')
      .order('dibuat_pada', { ascending: false });
      
    if (error) throw error;
    if (data && data.length > 0) {
      listPengalaman = data;
    }
  } catch {
    console.warn("Gagal terhubung ke Supabase. Menggunakan mode statis tanpa data.");
    listPengalaman = [
      {
        id: "mock1",
        posisi: "Senior Software Engineer",
        perusahaan: "Tech Innovation Corp",
        periode: "2021 — Present",
        deskripsi: "Leading the cloud architecture design and platform team for a global SaaS product. Scaled systems to handle 5M+ daily active users."
      },
      {
        id: "mock2",
        posisi: "Fullstack Developer",
        perusahaan: "Creative Digital Studio",
        periode: "2018 — 2021",
        deskripsi: "Architected and delivered multiple web applications. Spearheaded the migration from legacy monolith systems to decoupled Next.js architectures."
      }
    ];
  }

  return (
    <div className="pt-8 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Header Profile */}
        <div className="mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/5 bg-white/[0.02] text-sm font-medium text-primary mb-6 font-mono">
            <Terminal size={16} />
            <span>~/profile/about_me</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-8 text-white leading-tight">
            Background <br className="hidden md:block" />& Experience
          </h1>
          
          <div className="bg-[#151921] border border-white/5 p-8 md:p-10 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            
            <Code2 size={40} strokeWidth={1.5} className="text-primary/40 mb-6" />
            
            <div className="space-y-6 text-lg leading-relaxed text-slate-300 relative z-10">
              <p>
                Hello! I am a software engineer deeply passionate about system architecture, scalable backend performance, and creating flawless frontend experiences. 
                I love turning complex, multifaceted problems into elegant, robust, and intuitive software solutions.
              </p>
              <p>
                With years of combined experience weaving together highly performant user interfaces and solid API layers, 
                I continuously focus on delivering code that not only functions flawlessly but brings tangible value to end-users and scales seamlessly under load.
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-10 text-white flex items-center gap-3">
            <span className="text-primary font-mono text-sm leading-none bg-primary/10 px-2 py-1 rounded">01.</span>
            Professional Timeline
          </h2>
          
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-[2px] before:bg-linear-to-b before:from-primary/50 before:via-white/5 before:to-transparent">
            {listPengalaman.map((item, i) => (
              <div key={item.id} className="relative flex items-start gap-8 group">
                
                {/* Timeline dot */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0B0E14] bg-[#151921] text-primary shrink-0 relative z-10 transition-colors group-hover:bg-primary/20 group-hover:border-primary/50">
                  <div className="w-2.5 h-2.5 bg-primary rounded-full group-hover:scale-150 transition-transform"></div>
                </div>
                
                {/* Content box */}
                <div className="flex flex-col flex-1 pt-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                    <h3 className="font-bold text-2xl text-white">{item.posisi}</h3>
                    <span className="text-primary font-mono text-sm px-3 py-1 rounded-full bg-primary/10 border border-primary/20 shrink-0 inline-flex w-fit">
                      {item.periode}
                    </span>
                  </div>
                  <span className="text-lg text-muted font-medium mb-4 block">{item.perusahaan}</span>
                  
                  {item.deskripsi && (
                    <p className="text-slate-400 leading-relaxed max-w-2xl bg-white/[0.02] border border-white/5 p-5 rounded-xl">
                      {item.deskripsi}
                    </p>
                  )}
                </div>
                
              </div>
            ))}
          </div>
          
          {listPengalaman.length === 0 && (
            <div className="py-24 text-center border overflow-hidden relative border-white/5 rounded-2xl bg-[#151921] flex flex-col items-center justify-center">
              <p className="text-muted font-mono relative z-10">No experience records found.</p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
