import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Portofolio Digital",
    default: "Portofolio Canggih | Software Engineer Professional",
  },
  description: "Eksplorasi portofolio digital, rekam jejak, dan keahlian mendalam di bidang pengembangan perangkat lunak modern.",
  keywords: ["Portofolio", "Software Engineer", "Web Developer", "Next.js", "React", "Indonesia"],
  openGraph: {
    type: "website",
    locale: "id_ID",
    title: "Portofolio Canggih | Software Engineer",
    description: "Membangun produk web mutakhir dengan performa tinggi dan desain mewah menggunakan stack Next.js & Supabase.",
    siteName: "Portofolio Digital",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}

