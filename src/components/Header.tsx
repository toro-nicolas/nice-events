import React from "react";
import { Search, X, CalendarDays } from "lucide-react";

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md px-4 py-3">
      <div className="max-w-md mx-auto flex flex-col gap-2">
        {/* Title and Branding */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-500 text-white shadow-lg shadow-cyan-500/20 animate-pulse">
            <CalendarDays size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-indigo-200 to-violet-400 bg-clip-text text-transparent tracking-tight">
              NICE EVENTS
            </h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un concert, match, artiste..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="Effacer la recherche"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
