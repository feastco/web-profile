"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Plus, Trash2, Edit } from "lucide-react";

export default function ManajemenPengalaman() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pengalaman, setPengalaman] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPengalaman = async () => {
    const { data } = await supabase.from('pengalaman').select('*').order('dibuat_pada', { ascending: false });
    if (data) setPengalaman(data);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchPengalaman();
  }, []);

  const handleDelete = async (id: string, posisi: string) => {
    if (window.confirm(`Yakin ingin menghapus pengalaman "${posisi}"?`)) {
      setLoading(true);
      await supabase.from('pengalaman').delete().eq('id', id);
      fetchPengalaman();
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Manajemen Pengalaman</h1>
          <p className="text-muted">Kelola rekam jejak karier Anda yang akan ditampilkan di halaman Tentang.</p>
        </div>
        <button className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shrink-0">
          <Plus size={18} /> Tambah Pengalaman
        </button>
      </div>

      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 border-b border-white/10 text-white/70">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Posisi & Perusahaan</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Periode</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-muted animate-pulse">Memuat data pengalaman...</td>
                </tr>
              ) : pengalaman.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-muted">Belum ada riwayat pengalaman.</td>
                </tr>
              ) : (
                pengalaman.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 border-l-2 border-transparent group-hover:border-primary">
                      <div className="font-semibold text-white text-base mb-1">{item.posisi}</div>
                      <div className="text-muted">{item.perusahaan}</div>
                      {item.deskripsi && (
                        <p className="text-xs text-muted/70 mt-2 line-clamp-1 max-w-md">{item.deskripsi}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-white/90">
                      {item.periode}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-muted hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id, item.posisi)}
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
