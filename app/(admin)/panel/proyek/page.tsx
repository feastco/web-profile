"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/Badge";
import { Plus, Trash2, Edit, X, Save } from "lucide-react";
import UploadGambar from "@/components/fitur/UploadGambar";
import UploadGaleri from "@/components/fitur/UploadGaleri";
import Image from "next/image";

interface Proyek {
  id: string;
  judul: string;
  slug: string;
  kategori: string | null;
  kutipan: string | null;
  teknologi: string[] | null;
  gambar_andalan: string | null;
  galeri_gambar: string[] | null;
  url_live: string | null;
  url_github: string | null;
  unggulan: boolean;
  konten: string | null;
}

export default function ManajemenProyek() {
  const [proyek, setProyek] = useState<Proyek[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    judul: "",
    slug: "",
    kategori: "",
    kutipan: "",
    teknologi: "",
    gambar_andalan: "",
    galeri_gambar: [] as string[],
    url_live: "",
    url_github: "",
    unggulan: false,
    konten: ""
  });

  const fetchProyek = async () => {
    const { data } = await supabase.from('proyek').select('*').order('dibuat_pada', { ascending: false });
    if (data) setProyek(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProyek();
  }, []);

  const handleDelete = async (id: string, judul: string) => {
    if (window.confirm(`Yakin ingin menghapus proyek "${judul}"?`)) {
      setLoading(true);
      await supabase.from('proyek').delete().eq('id', id);
      fetchProyek();
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      judul: "", slug: "", kategori: "", kutipan: "", teknologi: "",
      gambar_andalan: "", galeri_gambar: [], url_live: "", url_github: "", unggulan: false, konten: ""
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: Proyek) => {
    setEditingId(item.id);
    setFormData({
      judul: item.judul || "",
      slug: item.slug || "",
      kategori: item.kategori || "",
      kutipan: item.kutipan || "",
      teknologi: Array.isArray(item.teknologi) ? item.teknologi.join(", ") : "",
      gambar_andalan: item.gambar_andalan || "",
      galeri_gambar: Array.isArray(item.galeri_gambar) ? item.galeri_gambar : [],
      url_live: item.url_live || "",
      url_github: item.url_github || "",
      unggulan: item.unggulan || false,
      konten: item.konten || ""
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
    
    // Parse technologies
    const techArray = formData.teknologi
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const payload = {
      judul: formData.judul,
      slug: formData.slug || formData.judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      kategori: formData.kategori,
      kutipan: formData.kutipan,
      teknologi: techArray,
      gambar_andalan: formData.gambar_andalan || null,
      galeri_gambar: formData.galeri_gambar.length > 0 ? formData.galeri_gambar : null,
      url_live: formData.url_live || null,
      url_github: formData.url_github || null,
      unggulan: formData.unggulan,
      konten: formData.konten
    };
    
    try {
      if (editingId) {
        // Update
        const { error } = await supabase.from('proyek').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase.from('proyek').insert([payload]);
        if (error) throw error;
      }
      
      handleCloseForm();
      fetchProyek();
    } catch (error) {
      alert(`Terjadi kesalahan: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFormOpen) {
    return (
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {editingId ? "Edit Proyek" : "Tambah Proyek Baru"}
          </h1>
          <button 
            onClick={handleCloseForm}
            className="p-2 text-muted hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5 space-y-6">
          {/* Gambar Utama */}
          <UploadGambar
            value={formData.gambar_andalan}
            onChange={(url) => setFormData({ ...formData, gambar_andalan: url })}
            folder="proyek-sampul"
            label="Gambar Utama Proyek"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-1.5">Judul Proyek *</label>
                <input 
                  required
                  type="text" 
                  value={formData.judul}
                  onChange={(e) => setFormData({...formData, judul: e.target.value})}
                  className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm"
                  placeholder="Contoh: E-Commerce Mobile App"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1.5">Slug (opsional)</label>
                <input 
                  type="text" 
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm"
                  placeholder="url-friendly-judul"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1.5">Kategori *</label>
                <input 
                  required
                  type="text" 
                  value={formData.kategori}
                  onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                  className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm"
                  placeholder="Contoh: Website, Mobile, AI"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1.5">Teknologi (pisahkan dengan koma)</label>
                <input 
                  type="text" 
                  value={formData.teknologi}
                  onChange={(e) => setFormData({...formData, teknologi: e.target.value})}
                  className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm"
                  placeholder="React, Node.js, Tailwind"
                />
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer mt-6 p-4 rounded-xl border border-white/10 bg-white/5">
                  <input
                    type="checkbox"
                    checked={formData.unggulan}
                    onChange={(e) => setFormData({...formData, unggulan: e.target.checked})}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="block font-medium text-white">Jadikan Proyek Unggulan</span>
                    <span className="text-xs text-muted">Akan ditampilkan di halaman beranda.</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted mb-1.5">URL Live</label>
                  <input 
                    type="url" 
                    value={formData.url_live}
                    onChange={(e) => setFormData({...formData, url_live: e.target.value})}
                    className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1.5">URL GitHub</label>
                  <input 
                    type="url" 
                    value={formData.url_github}
                    onChange={(e) => setFormData({...formData, url_github: e.target.value})}
                    className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1.5">Deskripsi Singkat (Kutipan)</label>
                <textarea 
                  rows={2}
                  value={formData.kutipan}
                  onChange={(e) => setFormData({...formData, kutipan: e.target.value})}
                  className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm resize-none"
                  placeholder="Ringkasan proyek..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1.5">Konten Detail / Penjelasan (Markdown)</label>
                <textarea 
                  rows={4}
                  value={formData.konten}
                  onChange={(e) => setFormData({...formData, konten: e.target.value})}
                  className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm resize-y"
                  placeholder="Detail fitur, solusi, dan penjelasan lengkap proyek..."
                />
              </div>
            </div>
          </div>

          {/* Galeri Screenshot */}
          <div className="pt-4 border-t border-white/5">
            <UploadGaleri
              value={formData.galeri_gambar}
              onChange={(urls) => setFormData({ ...formData, galeri_gambar: urls })}
              folder="proyek-galeri"
              label="Galeri Screenshot Proyek"
              maxFiles={10}
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
          <h1 className="text-3xl font-bold tracking-tight mb-2">Manajemen Proyek</h1>
          <p className="text-muted">Kelola studi kasus dan riwayat portofolio yang akan tampil untuk publik.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shrink-0"
        >
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
                      <div className="flex items-center gap-4">
                        {item.gambar_andalan ? (
                          <Image
                            src={item.gambar_andalan}
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
                            {item.galeri_gambar && item.galeri_gambar.length > 0 && (
                              <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-bold">
                                {item.galeri_gambar.length} foto
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="mb-2">
                        <Badge variant="primary">{item.kategori || "Umum"}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {item.teknologi?.slice(0, 3).map((tech: string) => (
                           <Badge key={tech} variant="outline" className="text-[10px] px-1.5 py-0">{tech}</Badge>
                        ))}
                        {item.teknologi && item.teknologi.length > 3 && (
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
