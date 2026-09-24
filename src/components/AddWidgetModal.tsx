"use client";

import { X, Search as SearchIcon, Bookmark, FileText, CheckSquare, CloudSun, Clock, Calendar, Code, Image, Type, Timer, Calculator, TrendingUp, Share2, Layers } from "lucide-react";

interface AddWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWidget: (type: string, title: string) => void;
}

const WIDGET_CATALOG = [
  { type: "bookmarks", title: "Bookmarks & Links", description: "Lesezeichen, Favicons & Ordner", icon: Bookmark, category: "Produktivität" },
  { type: "notes", title: "Notizen & Markdown", description: "Rich-Text, Checklisten & Notizen", icon: FileText, category: "Produktivität" },
  { type: "todo", title: "To-do Liste", description: "Aufgaben mit Priorität & Status", icon: CheckSquare, category: "Produktivität" },
  { type: "search", title: "Multisuche", description: "Suchfeld mit wählbarer Suchmaschine", icon: SearchIcon, category: "Tools" },
  { type: "weather", title: "Wetter", description: "Vorhersage & aktuelle Temperatur", icon: CloudSun, category: "Information" },
  { type: "clock", title: "Weltuhr", description: "Analoge & digitale Zeitzonen", icon: Clock, category: "Information" },
  { type: "calendar", title: "Kalender & iCal", description: "Monatsansicht & Termin-Import", icon: Calendar, category: "Produktivität" },
  { type: "rss", title: "RSS Newsfeed", description: "Feeds von Nachrichten & Blogs", icon: Share2, category: "News" },
  { type: "embed", title: "Embed / iFrame", description: "YouTube, Spotify, Webseiten einbetten", icon: Code, category: "Media" },
  { type: "image", title: "Foto / Bild", description: "Bilder per Upload oder URL", icon: Image, category: "Media" },
  { type: "text", title: "Titel & Trennlinie", description: "Layout-Überschriften & Trenner", icon: Type, category: "Layout" },
  { type: "timer", title: "Countdown & Timer", description: "Stoppuhr & Ereignis-Countdown", icon: Timer, category: "Tools" },
  { type: "calculator", title: "Rechner", description: "Standard-Rechner & Währungskonverter", icon: Calculator, category: "Tools" },
  { type: "ticker", title: "Aktien & Crypto", description: "Kursticker von CoinGecko & Finanz-APIs", icon: TrendingUp, category: "Information" },
  { type: "tabbed", title: "Tabbed Group", description: "Mehrere Widgets in Tabs gruppieren", icon: Layers, category: "Layout" },
];

export function AddWidgetModal({ isOpen, onClose, onSelectWidget }: AddWidgetModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 w-full max-w-3xl rounded-2xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-white">Widget-Galerie</h2>
            <p className="text-xs text-slate-400">Wähle ein Widget aus, um es deinem Dashboard hinzuzufügen</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto py-4 pr-1">
          {WIDGET_CATALOG.map((w) => {
            const IconComponent = w.icon;
            return (
              <button
                key={w.type}
                onClick={() => {
                  onSelectWidget(w.type, w.title);
                  onClose();
                }}
                className="flex flex-col items-start p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-white/5 hover:border-cyan-500/50 transition-all text-left group"
              >
                <div className="p-2.5 bg-slate-700/50 group-hover:bg-cyan-500/20 text-cyan-400 rounded-lg mb-3 transition-colors">
                  <IconComponent className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">{w.title}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{w.description}</p>
                <span className="mt-3 text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-900/60 px-2 py-0.5 rounded">
                  {w.category}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
