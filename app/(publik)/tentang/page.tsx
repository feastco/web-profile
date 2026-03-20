import type { Metadata } from "next";
import { supabase } from "@/lib/supabase/client";
import { Terminal, Code2, GraduationCap, Award, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Tentang Saya | Background & Experience",
  description: "Pelajari lebih lanjut tentang latar belakang, pengalaman profesional, dan keahlian saya di bidang software engineering.",
  openGraph: {
    title: "Background & Experience",
    description: "Pelajari lebih lanjut tentang latar belakang, pengalaman profesional, dan keahlian saya.",
  },
};

export const revalidate = 0;

interface Pengalaman {
  id: string;
  posisi: string;
  perusahaan: string;
  periode: string;
  deskripsi: string | null;
}

// Static education data - can be moved to Supabase later
const education = [
  {
    id: "edu1",
    degree: "S1 Teknik Informatika",
    institution: "Universitas Negeri Ternate",
    period: "2022 — 2026",
    description: "Focused on software engineering, data structures, algorithms, and web development.",
  },
];

// Static certifications data - can be moved to Supabase later
const certifications = [
  {
    id: "cert1",
    name: "Belajar Dasar Pemrograman Web",
    issuer: "Dicoding Indonesia",
    year: "2024",
  },
  {
    id: "cert2",
    name: "Belajar Dasar Pemrograman JavaScript",
    issuer: "Dicoding Indonesia",
    year: "2024",
  },
  {
    id: "cert3",
    name: "Memulai Dasar Pemrograman untuk Menjadi Pengembang Software",
    issuer: "Dicoding Indonesia",
    year: "2024",
  },
];

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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/5 bg-white/2 text-sm font-medium text-primary mb-6 font-mono">
            <Terminal size={16} />
            <span>~/profile/about_me</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-8 text-foreground leading-tight">
            Background <br className="hidden md:block" />& Experience
          </h1>
          
          <div className="bg-secondary-bg border border-white/5 p-8 md:p-10 rounded-2xl relative overflow-hidden">
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

            {/* Download CV Button (#13) */}
            <div className="mt-8 relative z-10">
              <a
                href="/cv.pdf"
                download
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-sm px-6 py-3 rounded-lg transition-all active:scale-95 shadow-lg shadow-primary/20"
              >
                <Download size={18} />
                Download CV
              </a>
            </div>
          </div>
        </div>

        {/* Professional Timeline */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold tracking-tight mb-10 text-foreground flex items-center gap-3">
            <span className="text-primary font-mono text-sm leading-none bg-primary/10 px-2 py-1 rounded">01.</span>
            Professional Timeline
          </h2>
          
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-[2px] before:bg-linear-to-b before:from-primary/50 before:via-white/5 before:to-transparent">
            {listPengalaman.map((item) => (
              <div key={item.id} className="relative flex items-start gap-8 group">
                
                {/* Timeline dot */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-secondary-bg text-primary shrink-0 relative z-10 transition-colors group-hover:bg-primary/20 group-hover:border-primary/50">
                  <div className="w-2.5 h-2.5 bg-primary rounded-full group-hover:scale-150 transition-transform"></div>
                </div>
                
                {/* Content box */}
                <div className="flex flex-col flex-1 pt-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                    <h3 className="font-bold text-2xl text-foreground">{item.posisi}</h3>
                    <span className="text-primary font-mono text-sm px-3 py-1 rounded-full bg-primary/10 border border-primary/20 shrink-0 inline-flex w-fit">
                      {item.periode}
                    </span>
                  </div>
                  <span className="text-lg text-muted font-medium mb-4 block">{item.perusahaan}</span>
                  
                  {item.deskripsi && (
                    <p className="text-slate-400 leading-relaxed max-w-2xl bg-white/2 border border-white/5 p-5 rounded-xl">
                      {item.deskripsi}
                    </p>
                  )}
                </div>
                
              </div>
            ))}
          </div>
          
          {listPengalaman.length === 0 && (
            <div className="py-24 text-center border overflow-hidden relative border-white/5 rounded-2xl bg-secondary-bg flex flex-col items-center justify-center">
              <p className="text-muted font-mono relative z-10">No experience records found.</p>
            </div>
          )}
        </div>

        {/* Education Section (#12) */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold tracking-tight mb-10 text-foreground flex items-center gap-3">
            <span className="text-primary font-mono text-sm leading-none bg-primary/10 px-2 py-1 rounded">02.</span>
            Education
          </h2>
          
          <div className="space-y-6">
            {education.map((edu) => (
              <div key={edu.id} className="bg-secondary-bg border border-white/5 rounded-xl p-6 md:p-8 group hover:border-primary/30 transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary shrink-0">
                    <GraduationCap size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <h3 className="font-bold text-xl text-foreground">{edu.degree}</h3>
                      <span className="text-primary font-mono text-sm px-3 py-1 rounded-full bg-primary/10 border border-primary/20 shrink-0 w-fit">
                        {edu.period}
                      </span>
                    </div>
                    <p className="text-muted font-medium mb-3">{edu.institution}</p>
                    {edu.description && (
                      <p className="text-slate-400 text-sm leading-relaxed">{edu.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications Section (#12) */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-10 text-foreground flex items-center gap-3">
            <span className="text-primary font-mono text-sm leading-none bg-primary/10 px-2 py-1 rounded">03.</span>
            Certifications
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.map((cert) => (
              <div key={cert.id} className="bg-secondary-bg border border-white/5 rounded-xl p-5 group hover:border-primary/30 transition-all">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-md text-primary shrink-0 mt-0.5">
                    <Award size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">{cert.name}</h4>
                    <p className="text-muted text-xs">{cert.issuer} • {cert.year}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}
