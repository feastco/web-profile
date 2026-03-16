"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Code2 } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/proyek" },
  { name: "Experience", href: "/tentang" }, // Keeping Experience mapped to /tentang for now
  { name: "Artikel", href: "/blog" },
  { name: "Contact", href: "/kontak" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B0E14]/80 backdrop-blur-md border-b border-white/5">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary/20 p-1.5 rounded-md text-primary group-hover:bg-primary/30 transition-colors">
            <Code2 size={24} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
            DevPortfolio
          </span>
        </Link>
        
        <nav className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-white",
                pathname === link.href ||
                (pathname.startsWith('/proyek') && link.href === '/proyek') ||
                (pathname.startsWith('/blog') && link.href === '/blog')
                  ? "text-white border-b-2 border-primary py-1"
                  : "text-muted"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <a href="mailto:hello@developer.io" className="bg-primary hover:bg-primary-hover text-white text-sm font-medium px-6 py-2.5 rounded-md transition-all active:scale-95">
          Hire Me
        </a>
      </div>
    </header>
  );
}
