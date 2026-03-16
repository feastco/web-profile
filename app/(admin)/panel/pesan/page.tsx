"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Mail, Trash2, CheckCircle, Clock } from "lucide-react";

type Pesan = {
  id: string;
  nama: string;
  email: string;
  subjek: string;
  pesan_teks: string;
  status: "belum_dibaca" | "dibaca";
  dibuat_pada: string;
};

export default function PesanAdminPage() {
  const [pesanList, setPesanList] = useState<Pesan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPesan = async () => {
    const { data, error } = await supabase
      .from("pesan")
      .select("*")
      .order("dibuat_pada", { ascending: false });

    if (error) {
      console.error("Error fetching pesan:", error);
    } else {
      setPesanList(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    const init = async () => {
      await fetchPesan();
    };
    init();
  }, []);

//   useEffect(() => {
//   fetchPesan();
//   // Berlangganan perubahan di tabel "pesan" secara realtime
//   const channel = supabase
//     .channel("inbox_realtime")
//     .on(
//       "postgres_changes",
//       { event: "*", schema: "public", table: "pesan" },
//       () => {
//         fetchPesan(); // Ambil data ulang jika ada pesan masuk/hapus/update
//       }
//     )
//     .subscribe();
//   return () => {
//     supabase.removeChannel(channel);
//   };
// }, []);

  async function markAsRead(id: string) {
    const { error } = await supabase
      .from("pesan")
      .update({ status: "dibaca" })
      .eq("id", id);

    if (error) {
      alert("Gagal mengupdate status pesan");
    } else {
      fetchPesan();
    }
  }

  async function deletePesan(id: string) {
    if (!confirm("Hapus pesan ini secara permanen?")) return;

    const { error } = await supabase.from("pesan").delete().eq("id", id);

    if (error) {
      alert("Gagal menghapus pesan");
    } else {
      fetchPesan();
    }
  }

  if (loading) return <div className="text-muted animate-pulse">Memuat pesan...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Pesan Masuk</h1>
        <p className="text-muted font-medium">Kelola pesan dan pertanyaan dari formulir kontak portofolio Anda.</p>
      </div>

      <div className="space-y-6">
        {pesanList.length > 0 ? (
          pesanList.map((pesan) => (
            <Card 
              key={pesan.id} 
              className={`transition-all ${pesan.status === "belum_dibaca" ? "border-primary/50 bg-primary/5 shadow-[0_0_15px_rgba(99,102,241,0.1)]" : "hover:border-white/10"}`}
            >
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${pesan.status === "belum_dibaca" ? "bg-primary text-white" : "bg-white/5 text-muted"}`}>
                      <Mail size={24} />
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-3">
                        {pesan.nama}
                        {pesan.status === "belum_dibaca" && (
                          <Badge variant="primary">Baru</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="font-medium text-slate-400">{pesan.email}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted font-mono">
                    <Clock size={14} />
                    {new Date(pesan.dibuat_pada).toLocaleString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-background/50 rounded-xl border border-white/5">
                  <p className="text-white/90 leading-relaxed whitespace-pre-wrap">{pesan.pesan_teks}</p>
                </div>
                
                <div className="flex items-center justify-end gap-3 pt-2">
                  {pesan.status === "belum_dibaca" && (
                    <button
                      onClick={() => markAsRead(pesan.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all text-sm font-bold border border-green-500/20"
                    >
                      <CheckCircle size={16} />
                      Tandai Dibaca
                    </button>
                  )}
                  <button
                    onClick={() => deletePesan(pesan.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-400/20 transition-all text-sm font-bold border border-red-500/20"
                  >
                    <Trash2 size={16} />
                    Hapus
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
            <Mail size={48} className="mx-auto text-muted mb-4 opacity-20" />
            <p className="text-muted font-medium">Kotak masuk Anda masih kosong.</p>
          </div>
        )}
      </div>
    </div>
  );
}
