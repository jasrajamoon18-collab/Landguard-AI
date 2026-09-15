import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import type { Language, PageId, DataStatus } from "@/types";

interface LayoutProps {
  children: React.ReactNode;
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  regionScore: number;
  dataStatus: DataStatus;
  onRefresh: () => void;
  loading: boolean;
  lastRefresh: Date;
  error: string | null;
}

export function Layout({
  children, currentPage, onNavigate, language, onLanguageChange,
  regionScore, dataStatus, onRefresh, loading, lastRefresh, error,
}: LayoutProps) {
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
        <Sidebar
          currentPage={currentPage}
          onNavigate={onNavigate}
          language={language}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        <div className="flex-1 min-w-0 lg:ml-64">
          <Header
            language={language}
            onLanguageChange={onLanguageChange}
            regionScore={regionScore}
            dataStatus={dataStatus}
            onRefresh={onRefresh}
            loading={loading}
            lastRefresh={lastRefresh}
          />
          <main className="p-4 sm:p-6 lg:p-8 mt-14 lg:mt-0">
            {error && (
              <div className="mb-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-400">
                {error}
              </div>
            )}
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
