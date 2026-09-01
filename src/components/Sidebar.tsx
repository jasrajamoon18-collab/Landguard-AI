import {
  LayoutDashboard,
  Map,
  Brain,
  Activity,
  Bell,
  MapPin,
  BarChart3,
  Siren,
  Info,
  Shield,
  X,
} from "lucide-react";
import { t } from "@/data/translations";
import type { Language, PageId } from "@/types";

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  language: Language;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const navItems: { id: PageId; icon: React.ElementType }[] = [
  { id: "dashboard", icon: LayoutDashboard },
  { id: "map", icon: Map },
  { id: "prediction", icon: Brain },
  { id: "monitoring", icon: Activity },
  { id: "alerts", icon: Bell },
  { id: "locations", icon: MapPin },
  { id: "analytics", icon: BarChart3 },
  { id: "emergency", icon: Siren },
  { id: "about", icon: Info },
];

export function Sidebar({ currentPage, onNavigate, language, mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-800 shrink-0">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shrink-0">
            <Shield className="text-white" size={22} />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-base leading-tight tracking-wide">LANDGUARD</div>
            <div className="text-[10px] text-cyan-400 font-medium tracking-widest">AI MONITORING</div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden ml-auto p-1 rounded hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-400"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <Icon size={18} className="shrink-0" />
                <span className="truncate">{t(language, item.id)}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer disclaimer */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t(language, "demoMode")}</span>
          </div>
          <p className="mt-2 text-[10px] text-slate-600 leading-relaxed">
            {t(language, "demoDisclaimer")}
          </p>
        </div>
      </aside>
    </>
  );
}
