"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/Badge";
import { Plus, Trash2, Edit } from "lucide-react";

export default function ManajemenProyek() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [proyek, setProyek] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProyek = async () => {
    const { data } = await supabase.from('proyek').select('*').order('dibuat_pada', { ascending: false });
    if (data) setProyek(data);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchProyek();
  }, []);

  const handleDelete = async (id: string, judul: string) => {
    if (window.confirm(`Yakin ingin menghapus proyek "${judul}"?`)) {
      setLoading(true);
      await supabase.from('proyek').delete().eq('id', id);
      fetchProyek();
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Manajemen Proyek</h1>
          <p className="text-muted">Kelola studi kasus dan riwayat portofolio yang akan tampil untuk publik.</p>
        </div>
        <button className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shrink-0">
          <Plus size={18} /> Tambah Proyek Baru
        </button>
      </div>

      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 border-b border-white/10 text-white/70">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Informasi Proyek</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Kategori & Stack</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-center">Tampil di Beranda</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted animate-pulse">Memuat data proyek...</td>
                </tr>
              ) : proyek.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted">Belum ada data proyek ditemukan.</td>
                </tr>
              ) : (
                proyek.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 border-l-2 border-transparent group-hover:border-primary">
                      <div className="font-semibold text-white text-base mb-1">{item.judul}</div>
                      <div className="text-xs text-muted font-mono">{item.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="mb-2">
                        <Badge variant="primary">{item.kategori || "Umum"}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {item.teknologi?.slice(0, 3).map((tech: string) => (
                           <Badge key={tech} variant="outline" className="text-[10px] px-1.5 py-0">{tech}</Badge>
                        ))}
                        {item.teknologi?.length > 3 && (
                          <span className="text-xs text-muted ml-1">+{item.teknologi.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.unggulan ? (
                        <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Ya</Badge>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-muted hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id, item.judul)}
                          className="p-2 text-muted hover:text-red-400 bg-white/5 hover:bg-red-400/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
