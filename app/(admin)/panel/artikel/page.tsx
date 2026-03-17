"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Plus, Trash2, Edit, X, Save } from "lucide-react";
import UploadGambar from "@/components/fitur/UploadGambar";
import UploadPdf from "@/components/fitur/UploadPdf";
import Image from "next/image";

interface Artikel {
  id: string;
  judul: string;
  slug: string;
  konten: string | null;
  gambar_sampul: string | null;
  file_pdf: string | null;
  diterbitkan_pada: string | null;
}

export default function ManajemenArtikel() {
  const [artikel, setArtikel] = useState<Artikel[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    judul: "",
    slug: "",
    konten: "",
    gambar_sampul: "",
    file_pdf: "",
  });

  const fetchArtikel = async () => {
    const { data } = await supabase.from('artikel').select('*').order('diterbitkan_pada', { ascending: false });
    if (data) setArtikel(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchArtikel();
  }, []);

  const handleDelete = async (id: string, judul: string) => {
    if (window.confirm(`Yakin ingin menghapus artikel "${judul}"?`)) {
      setLoading(true);
      await supabase.from('artikel').delete().eq('id', id);
      fetchArtikel();
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      judul: "", slug: "", konten: "", gambar_sampul: "", file_pdf: ""
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: Artikel) => {
    setEditingId(item.id);
    setFormData({
      judul: item.judul || "",
      slug: item.slug || "",
      konten: item.konten || "",
      gambar_sampul: item.gambar_sampul || "",
      file_pdf: item.file_pdf || "",
    });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload = {
      judul: formData.judul,
      slug: formData.slug || formData.judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      konten: formData.konten,
      gambar_sampul: formData.gambar_sampul || null,
      file_pdf: formData.file_pdf || null,
    };
    
    try {
      if (editingId) {
        const { error } = await supabase.from('artikel').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('artikel').insert([payload]);
        if (error) throw error;
      }
      
      handleCloseForm();
      fetchArtikel();
    } catch (error) {
      alert(`Terjadi kesalahan: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  function formatDate(iso: string | null) {
    if (!iso) return "-";
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  }

  if (isFormOpen) {
    return (
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {editingId ? "Edit Artikel" : "Tambah Artikel Baru"}
          </h1>
          <button 
            onClick={handleCloseForm}
            className="p-2 text-muted hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5 space-y-6">
          {/* Gambar Sampul */}
          <UploadGambar
            value={formData.gambar_sampul}
            onChange={(url) => setFormData({ ...formData, gambar_sampul: url })}
            folder="artikel-sampul"
            label="Gambar Sampul Artikel"
          />

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">Judul Artikel *</label>
              <input 
                required
                type="text" 
                value={formData.judul}
                onChange={(e) => setFormData({...formData, judul: e.target.value})}
                className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm"
                placeholder="Contoh: Belajar Next.js 14"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">Slug (opsional, auto-generate dari judul)</label>
              <input 
                type="text" 
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm"
                placeholder="url-friendly-judul"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">Konten Artikel (Markdown)</label>
              <textarea 
                rows={12}
                value={formData.konten}
                onChange={(e) => setFormData({...formData, konten: e.target.value})}
                className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm resize-y font-mono"
                placeholder="Tulis artikel dengan format Markdown..."
              />
            </div>

            {/* Upload PDF */}
            <UploadPdf
              value={formData.file_pdf}
              onChange={(url) => setFormData({ ...formData, file_pdf: url })}
              folder="artikel-pdf"
              label="Lampiran PDF (opsional, pengunjung bisa baca)"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/5">
            <button 
              type="button"
              onClick={handleCloseForm}
              className="px-5 py-2.5 rounded-xl font-medium text-muted hover:text-white hover:bg-white/5 transition-colors text-sm"
            >
              Batal
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors text-sm"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <><Save size={18} /> Simpan Data</>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Manajemen Artikel</h1>
          <p className="text-muted">Kelola tulisan blog, berita, atau artikel Anda.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shrink-0"
        >
          <Plus size={18} /> Tambah Artikel Baru
        </button>
      </div>

      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 border-b border-white/10 text-white/70">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Informasi Artikel</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Diterbitkan Pada</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-muted animate-pulse">Memuat data artikel...</td>
                </tr>
              ) : artikel.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-muted">Belum ada data artikel ditemukan.</td>
                </tr>
              ) : (
                artikel.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 border-l-2 border-transparent group-hover:border-primary">
                      <div className="flex items-center gap-4">
                        {item.gambar_sampul ? (
                          <Image
                            src={item.gambar_sampul}
                            alt={item.judul}
                            width={80}
                            height={48}
                            className="w-20 h-12 rounded-lg object-cover border border-white/10 shrink-0"
                            unoptimized
                          />
                        ) : (
                          <div className="w-20 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                            <span className="text-muted text-[10px] font-mono">IMG</span>
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-white text-base mb-1">{item.judul}</div>
                          <div className="text-xs text-muted font-mono flex items-center gap-2">
                            <span>{item.slug}</span>
                            {item.file_pdf && (
                              <span className="px-1.5 py-0.5 bg-red-500/10 text-red-400 rounded text-[10px] font-bold">PDF</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-muted">
                        {formatDate(item.diterbitkan_pada)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 text-muted hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        >
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
