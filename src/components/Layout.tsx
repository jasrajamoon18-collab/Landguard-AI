import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { t } from "@/data/translations";
import type { Language, PageId } from "@/types";

interface LayoutProps {
  children: React.ReactNode;
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  regionScore: number;
}

export function Layout({ children, currentPage, onNavigate, language, onLanguageChange, regionScore }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-slate-900 border-b border-slate-800 px-4 h-14">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <span className="font-bold text-sm tracking-wide text-cyan-400">LANDGUARD AI</span>
        <div className="w-9" />
      </div>

      <div className="flex">
        {/* Sidebar - desktop */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={onNavigate}
          language={language}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        {/* Main content */}
        <div className="flex-1 min-w-0 lg:ml-64">
          <Header
            language={language}
            onLanguageChange={onLanguageChange}
            regionScore={regionScore}
          />
          <main className="p-4 sm:p-6 lg:p-8 mt-14 lg:mt-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
