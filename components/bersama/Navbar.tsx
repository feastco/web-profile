"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Code2, Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/proyek" },
  { name: "Experience", href: "/tentang" },
  { name: "Artikel", href: "/blog" },
  { name: "Contact", href: "/kontak" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B0E14]/80 backdrop-blur-md border-b border-white/5">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group" onClick={() => setIsOpen(false)}>
          <div className="bg-primary/20 p-1.5 rounded-md text-primary group-hover:bg-primary/30 transition-colors">
            <Code2 size={24} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
            DevPortfolio
          </span>
        </Link>
        
        {/* Desktop Nav */}
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

        <div className="flex items-center gap-4">
          <a href="mailto:hello@developer.io" className="hidden sm:inline-flex bg-primary hover:bg-primary-hover text-white text-sm font-medium px-6 py-2.5 rounded-md transition-all active:scale-95">
            Hire Me
          </a>
          
          {/* Hamburger Menu Toggle (Mobile) */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors focus:outline-none"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#0B0E14] border-b border-white/5 shadow-2xl py-4 flex flex-col px-6 gap-4 animate-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "text-base font-medium transition-colors hover:text-white py-2 border-b border-white/5",
                pathname === link.href ||
                (pathname.startsWith('/proyek') && link.href === '/proyek') ||
                (pathname.startsWith('/blog') && link.href === '/blog')
                  ? "text-primary font-semibold border-primary/20"
                  : "text-muted"
              )}
            >
              {link.name}
            </Link>
          ))}
          <a onClick={() => setIsOpen(false)} href="mailto:hello@developer.io" className="sm:hidden bg-primary text-center hover:bg-primary-hover text-white text-base font-medium px-6 py-3 rounded-md transition-all mt-2 active:scale-95">
            Hire Me
          </a>
        </div>
      )}
    </header>
  );
}
