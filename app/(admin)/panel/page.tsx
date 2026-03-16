"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Mail, Briefcase, FolderKanban, Book } from "lucide-react";

export default function DashboardAdmin() {
  const [stats, setStats] = useState({ proyek: 0, pesan: 0, artikel: 0, pengalaman: 0 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pesanBaru, setPesanBaru] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      // Fetch counts in parallel
      const [
        { count: proyekCount },
        { count: pesanCount },
        { count: artikelCount },
        { count: pengalamanCount },
        { data: messages }
      ] = await Promise.all([
        supabase.from('proyek').select('*', { count: 'exact', head: true }),
        supabase.from('pesan').select('*', { count: 'exact', head: true }).eq('status', 'belum_dibaca'),
        supabase.from('artikel').select('*', { count: 'exact', head: true }),
        supabase.from('pengalaman').select('*', { count: 'exact', head: true }),
        supabase.from('pesan').select('*').order('dibuat_pada', { ascending: false }).limit(5)
      ]);

      setStats({
        proyek: proyekCount || 0,
        pesan: pesanCount || 0,
        artikel: artikelCount || 0,
        pengalaman: pengalamanCount || 0
      });

      if (messages) setPesanBaru(messages);
      setLoading(false);
    }
    fetchDashboard();
  }, []);

  if (loading) return <div className="text-muted animate-pulse">Memuat dashboard...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted">Selamat datang, kelola konten dan lihat ringkasan status portofolio Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="hover:border-white/10">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted uppercase tracking-wider mb-1">Total Proyek</p>
              <h3 className="text-4xl font-bold text-white">{stats.proyek}</h3>
            </div>
            <div className="p-4 bg-primary/20 text-primary rounded-xl">
              <FolderKanban size={32} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:border-white/10">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted uppercase tracking-wider mb-1">Pengalaman</p>
              <h3 className="text-4xl font-bold text-white">{stats.pengalaman}</h3>
            </div>
            <div className="p-4 bg-primary/20 text-primary rounded-xl">
              <Briefcase size={32} />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-white/10">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted uppercase tracking-wider mb-1">Artikel</p>
              <h3 className="text-4xl font-bold text-white">{stats.artikel}</h3>
            </div>
            <div className="p-4 bg-primary/20 text-primary rounded-xl">
              <Book size={32} />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-white/10 border-primary/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-2xl rounded-full mix-blend-screen" />
          <CardContent className="p-6 flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-muted uppercase tracking-wider mb-1">Pesan Baru</p>
              <h3 className="text-4xl font-bold text-white">{stats.pesan}</h3>
            </div>
            <div className="p-4 bg-primary text-white rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              <Mail size={32} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pesan Masuk Terbaru</CardTitle>
          <CardDescription>Inbox formulir kontak pengunjung (5 pesan terakhir).</CardDescription>
        </CardHeader>
        <CardContent>
          {pesanBaru.length > 0 ? (
            <div className="divide-y divide-white/5">
              {pesanBaru.map((pesan) => (
                <div key={pesan.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-white">{pesan.nama}</span>
                      <span className="text-sm text-muted">{pesan.email}</span>
                      {pesan.status === "belum_dibaca" && (
                        <Badge variant="primary" className="ml-2">Baru</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted line-clamp-1">{pesan.pesan_teks}</p>
                  </div>
                  <span className="text-xs text-muted whitespace-nowrap">
                    {new Date(pesan.dibuat_pada).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted">Belum ada pesan masuk.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
