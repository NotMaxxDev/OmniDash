"use client";

import { useState, useEffect } from "react";
import { Search, Command, Layout, Moon, Sun, Monitor, Globe, Download, Upload, Shield } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { pages, setActivePageId } = useDashboardStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredPages = pages.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start justify-center pt-24 p-4">
      <div className="bg-slate-900 border border-white/10 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center px-4 border-b border-white/10 bg-slate-800/50">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Suchen nach Seiten, Links, Widgets oder Befehlen... (Cmd+K)"
            className="w-full bg-transparent py-4 text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <kbd className="px-2 py-0.5 text-[10px] bg-slate-800 text-slate-400 rounded border border-slate-700">ESC</kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest text-slate-500">Seiten</div>
          {filteredPages.map((page) => (
            <button
              key={page.id}
              onClick={() => {
                setActivePageId(page.id);
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white transition-all text-left text-xs"
            >
              <div className="flex items-center gap-2">
                <Layout className="w-4 h-4 text-cyan-400" />
                <span>{page.title}</span>
              </div>
              <span className="text-[10px] text-slate-500">{page.columns.length} Spalten</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
