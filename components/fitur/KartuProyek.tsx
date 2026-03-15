import Link from "next/link";
import { ExternalLink, Folder, Github } from "lucide-react";

export interface Proyek {
  id: string;
  judul: string;
  slug: string;
  kutipan: string | null;
  kategori: string | null;
  teknologi: string[];
  gambar_andalan: string | null;
  url_live: string | null;
  url_github: string | null;
}

export function KartuProyek({ proyek }: { proyek: Proyek }) {
  return (
    <div className="flex flex-col h-full bg-[#151921] border border-white/5 rounded-xl p-6 lg:p-8 hover:-translate-y-2 hover:shadow-[0_10px_30px_-15px_rgba(91,82,255,0.3)] hover:border-primary/30 transition-all duration-300 group">
      
      {/* Header Card: Icons */}
      <div className="flex items-center justify-between mb-8">
        <Folder size={40} strokeWidth={1.5} className="text-primary group-hover:text-primary-light transition-colors" />
        <div className="flex items-center gap-4 text-muted">
          {proyek.url_github && (
            <a href={proyek.url_github} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors" aria-label="GitHub Link">
              <Github size={22} />
            </a>
          )}
          {proyek.url_live && (
            <a href={proyek.url_live} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors" aria-label="External Link">
              <ExternalLink size={22} />
            </a>
          )}
        </div>
      </div>

      {/* Konten Utama */}
      <div className="flex flex-col flex-1">
        <Link href={`/proyek/${proyek.slug}`} className="group/link">
          <h3 className="text-2xl font-bold text-white mb-4 group-hover/link:text-primary transition-colors">
            {proyek.judul}
          </h3>
        </Link>
        <p className="text-muted text-base leading-relaxed line-clamp-4">
          {proyek.kutipan || "Tidak ada deskripsi singkat."}
        </p>
      </div>

      {/* Footer / Tech Stack */}
      <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs text-slate-400">
        {proyek.teknologi.map((tech) => (
          <span key={tech}>{tech}</span>
        ))}
      </div>
      
    </div>
  );
}
