"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { LogOut, LayoutDashboard, FolderKanban, Briefcase, Mail } from "lucide-react";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const menuItems = [
    { name: "Dashboard", href: "/panel", icon: <LayoutDashboard size={20} /> },
    { name: "Proyek", href: "/panel/proyek", icon: <FolderKanban size={20} /> },
    { name: "Artikel", href: "/panel/artikel", icon: <FolderKanban size={20} /> },
    { name: "Pengalaman", href: "/panel/pengalaman", icon: <Briefcase size={20} /> },
    { name: "Pesan Inbox", href: "/panel/pesan", icon: <Mail size={20} /> },
  ];

  return (
    <div className="min-h-screen flex bg-background text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 glass-panel hidden md:flex flex-col">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="text-xl font-bold tracking-tighter hover:text-primary transition-colors">
            Porto<span className="text-primary">Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                pathname === item.href ? "bg-primary text-white" : "text-muted hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors font-medium text-sm"
          >
            <LogOut size={20} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <header className="h-16 border-b border-white/5 flex items-center px-6 md:hidden glass-panel sticky top-0 z-10 justify-between">
          <span className="font-bold">PortoAdmin</span>
          <button onClick={handleLogout} className="text-red-400 text-sm">Keluar</button>
        </header>
        <div className="p-6 md:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
