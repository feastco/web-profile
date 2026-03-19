"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Terminal, Send, Github, Instagram, Linkedin, MessageCircle } from "lucide-react";

export default function KontakPage() {
  const [formData, setFormData] = useState({ nama: "", email: "", pesan: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const { error } = await supabase
        .from('pesan')
        .insert([
          { nama: formData.nama, email: formData.email, pesan_teks: formData.pesan }
        ]);

      if (error) {
        throw error;
      }

      setStatus("success");
      setFormData({ nama: "", email: "", pesan: "" });
    } catch (err: unknown) {
      console.error(err);
      setStatus("error");
      const errorMessage = err instanceof Error ? err.message : "Gagal mengirim pesan. Silakan coba lagi nanti.";
      setErrorMessage(errorMessage);
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-xl mx-auto w-full">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/5 bg-white/[0.02] text-sm font-medium text-primary mb-6 font-mono">
            <Terminal size={16} />
            <span>~/contact/init</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight mb-4 text-white">Let&apos;s Connect</h1>
          <p className="text-lg text-muted mb-8">
            Interested in collaboration or have a question? Fill out the form below and I&apos;ll get back to you shortly.
          </p>

          <div className="flex items-center justify-center gap-4">
            <a href="https://github.com/vascodxg" target="_blank" rel="noopener noreferrer" className="p-3 bg-[#151921] border border-white/10 rounded-full text-gray-400 hover:text-white hover:border-white/30 transition-all hover:scale-110 shadow-lg" aria-label="GitHub">
              <Github size={20} />
            </a>
            <a href="https://linkedin.com/in/" target="_blank" rel="noopener noreferrer" className="p-3 bg-[#151921] border border-white/10 rounded-full text-gray-400 hover:text-[#0A66C2] hover:border-[#0A66C2]/50 transition-all hover:scale-110 shadow-lg" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="p-3 bg-[#151921] border border-white/10 rounded-full text-gray-400 hover:text-[#E1306C] hover:border-[#E1306C]/50 transition-all hover:scale-110 shadow-lg" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="p-3 bg-[#151921] border border-white/10 rounded-full text-gray-400 hover:text-[#25D366] hover:border-[#25D366]/50 transition-all hover:scale-110 shadow-lg" aria-label="WhatsApp">
              <MessageCircle size={20} />
            </a>
          </div>
        </div>

        <div className="bg-[#151921] p-8 md:p-10 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          
          {status === "success" ? (
            <div className="text-center py-12 relative z-10">
              <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Send size={24} className="ml-1" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Message Delivered!</h3>
              <p className="text-muted mb-8">Thank you for reaching out. I&apos;ll read through your message and reply as soon as possible.</p>
              <button 
                onClick={() => setStatus("idle")}
                className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-md font-medium transition-colors border border-white/10"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label htmlFor="nama" className="text-sm font-semibold text-slate-300">Full Name</label>
                <input 
                  id="nama" 
                  type="text" 
                  required 
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  className="w-full bg-[#0B0E14] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  placeholder="John Doe"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-slate-300">Email Address</label>
                <input 
                  id="email" 
                  type="email" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-[#0B0E14] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="pesan" className="text-sm font-semibold text-slate-300">Message</label>
                <textarea 
                  id="pesan" 
                  required 
                  rows={5}
                  value={formData.pesan}
                  onChange={(e) => setFormData({...formData, pesan: e.target.value})}
                  className="w-full bg-[#0B0E14] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none"
                  placeholder="Hello, I would like to discuss..."
                />
              </div>

              {status === "error" && (
                <p className="text-red-400 text-sm font-medium">{errorMessage}</p>
              )}

              <button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary-hover text-white px-4 py-3.5 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
                disabled={status === "loading"}
              >
                {status === "loading" ? "Sending..." : (
                  <>Send Message <Send size={18} /></>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
