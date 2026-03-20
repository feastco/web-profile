import type { Metadata } from "next";
import { supabase } from "@/lib/supabase/client";
import BlogListClient from "./BlogListClient";

export const metadata: Metadata = {
  title: "Artikel Terbaru | Blog",
  description: "Kumpulan artikel, panduan teknis, dan insight mendalam seputar software engineering, web development, dan teknologi terbaru.",
  openGraph: {
    title: "Blog — Artikel & Panduan Teknis",
    description: "Temukan artikel, opini, dan guide di dunia software engineering.",
  },
};

export const revalidate = 0;

type Artikel = {
  id: string;
  judul: string;
  slug: string;
  konten: string | null;
  gambar_sampul: string | null;
  diterbitkan_pada: string | null;
};

export default async function ArtikelPage() {
  let artikelList: Artikel[] = [];

  try {
    const { data, error } = await supabase
      .from("artikel")
      .select("*")
      .order("diterbitkan_pada", { ascending: false });

    if (error) throw error;
    if (data) artikelList = data as Artikel[];
  } catch {
    artikelList = [];
  }

  return <BlogListClient artikelList={artikelList} />;
}
