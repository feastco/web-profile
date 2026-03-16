import { supabase } from "@/lib/supabase/client";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github, Terminal, Box } from "lucide-react";
import Link from "next/link";

export const revalidate = 0; // Disable static caching so data changes reflect immediately

export default async function DetailProyek({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let proyek = null;

  try {
    const { data, error } = await supabase
      .from('proyek')
      .select('*')
      .eq('slug', slug)
      .single();
      
    if (error) throw error;
    proyek = data;
  } catch {
    // Sebagai fallback development tanpa db, kita sediakan mock statis
    if (slug === 'omni-dashboard') {
      proyek = {
        judul: "Omni Dashboard",
        kutipan: "A real-time analytics platform monitoring microservices health across global regions.",
        konten: "## Platform Architecture\n\nThis project was built to solve the massive data ingestion problems of our legacy microservices architecture. By implementing an event-driven system with Kafka and real-time WebSockets via Supabase, we managed to reduce dashboard latency from 45 seconds to just under 200ms.\n\n### Key Highlights\n- **Real-time Metrics:** Streaming over 10M events per hour directly to the frontend clients.\n- **Custom UI Kit:** Developed a headless UI library tailored for heavy data grids.\n- **Zero Downtime:** Automated CI/CD pipelines deploying multiple updates daily.\n\nThe resulting product successfully monitored uptime across 15 geographical regions.",
        kategori: "FinTech",
        teknologi: ["React", "Express", "Supabase", "Kafka"],
        url_live: "https://example.com",
        url_github: null,
        dibuat_pada: "2023-11-12T00:00:00"
      };
    } else {
      notFound();
    }
  }

  if (!proyek) {
    notFound();
  }

  return (
    <article className="pt-32 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto w-full">
        {/* Back Link */}
        <Link href="/proyek" className="inline-flex items-center text-muted hover:text-white transition-colors mb-10 group">
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Archive
        </Link>

        {/* Header Unit */}
        <div className="mb-14 relative">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/5 bg-white/[0.02] text-sm font-medium text-primary mb-6 font-mono relative z-10">
            <Terminal size={16} />
            <span>~/projects/{slug}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-white relative z-10">
            {proyek.judul}
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 leading-relaxed font-light relative z-10 max-w-3xl">
            {proyek.kutipan}
          </p>
        </div>

        {/* Meta Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 relative z-10">
          <div className="bg-[#151921] border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center gap-2 text-muted mb-4">
              <Box size={18} />
              <span className="text-sm font-semibold uppercase tracking-wider">Category</span>
            </div>
            <span className="text-lg font-medium text-white">{proyek.kategori || "Uncategorized"}</span>
          </div>

          <div className="bg-[#151921] border border-white/5 p-6 rounded-2xl flex flex-col justify-between md:col-span-2">
            <div className="flex items-center gap-2 text-muted mb-4">
              <CodeIcon size={18} />
              <span className="text-sm font-semibold uppercase tracking-wider">Tech Stack</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {proyek.teknologi?.map((tech: string) => (
                <span key={tech} className="px-3 py-1 font-mono text-sm bg-background border border-white/10 text-slate-300 rounded-md">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Links Panel */}
        <div className="flex flex-wrap gap-4 mb-16 relative z-10">
          {proyek.url_live && (
            <a href={proyek.url_live} target="_blank" rel="noreferrer" className="bg-primary hover:bg-primary-hover text-white flex items-center px-6 py-3.5 rounded-xl font-medium transition-all group shadow-lg shadow-primary/20">
              <ExternalLink size={18} className="mr-2 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"/> Visit Live Site
            </a>
          )}
          {proyek.url_github && (
            <a href={proyek.url_github} target="_blank" rel="noreferrer" className="bg-[#151921] border border-white/10 hover:border-white/20 text-white flex items-center px-6 py-3.5 rounded-xl font-medium transition-all group">
              <Github size={18} className="mr-2 group-hover:-translate-y-0.5 transition-transform"/> Source Code
            </a>
          )}
        </div>

        {/* Article Body */}
        <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-loose prose-headings:text-white prose-a:text-primary hover:prose-a:text-primary">
          {proyek.konten ? (
            <div className="whitespace-pre-wrap">{proyek.konten}</div>
          ) : (
            <div className="py-20 text-center border border-white/5 rounded-2xl bg-[#151921]">
              <p className="font-mono text-muted mb-0">No detailed case study provided.</p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

// Small icon helper
function CodeIcon({ size = 24, className, ...props }: React.ComponentProps<"svg"> & { size?: number | string }) {
  return (
    <svg
      {...props}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

