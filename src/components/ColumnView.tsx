"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { AddWidgetModal } from "@/components/AddWidgetModal";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Search,
  CloudSun,
  CheckSquare,
  FileText,
  Clock,
  Bookmark,
  Plus,
  Settings,
  Grid,
  Trash2,
  FolderPlus,
  ExternalLink,
} from "lucide-react";

export function WidgetCard({ widget, isOverlay }: { widget: any; isOverlay?: boolean }) {
  const { deleteWidget } = useDashboardStore();
  const [parsedConfig, setParsedConfig] = useState<any>({});

  useEffect(() => {
    try {
      setParsedConfig(JSON.parse(widget.config || "{}"));
    } catch (e) {
      setParsedConfig({});
    }
  }, [widget.config]);

  const handleDelete = async () => {
    deleteWidget(widget.id);
    await fetch(`/api/widgets?id=${widget.id}`, { method: "DELETE" });
  };

  return (
    <div
      className={`relative group rounded-xl border border-white/10 bg-slate-900/80 backdrop-blur-md p-4 shadow-xl transition-all duration-200 ${
        isOverlay ? "scale-105 shadow-2xl border-cyan-500/50" : "hover:border-white/20"
      }`}
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          {widget.type === "search" && <Search className="w-4 h-4 text-cyan-400" />}
          {widget.type === "bookmarks" && <Bookmark className="w-4 h-4 text-amber-400" />}
          {widget.type === "weather" && <CloudSun className="w-4 h-4 text-sky-400" />}
          {widget.type === "notes" && <FileText className="w-4 h-4 text-emerald-400" />}
          {widget.type === "todo" && <CheckSquare className="w-4 h-4 text-purple-400" />}
          {widget.type === "clock" && <Clock className="w-4 h-4 text-rose-400" />}
          <h3 className="font-semibold text-sm text-slate-100">{widget.title}</h3>
        </div>
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Widget Body */}
      <div className="text-xs text-slate-300">
        {widget.type === "search" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const q = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value;
              if (q) window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}`, "_blank");
            }}
            className="flex gap-2"
          >
            <input
              name="q"
              type="text"
              placeholder="Google Suche... (Enter)"
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </form>
        )}

        {widget.type === "bookmarks" && (
          <div className="grid grid-cols-2 gap-2">
            {widget.bookmarks?.map((b: any) => (
              <a
                key={b.id}
                href={b.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-200 hover:text-white transition-all border border-transparent hover:border-slate-700"
              >
                {b.favicon ? (
                  <img src={b.favicon} alt="" className="w-4 h-4 rounded" />
                ) : (
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span className="truncate text-xs font-medium">{b.title}</span>
              </a>
            ))}
          </div>
        )}

        {widget.type === "weather" && (
          <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-sky-900/30 to-blue-900/30 border border-sky-500/20">
            <div>
              <p className="text-lg font-bold text-white">18°C</p>
              <p className="text-[11px] text-sky-300">{parsedConfig.location || "Berlin"} • Sonnug</p>
            </div>
            <CloudSun className="w-8 h-8 text-amber-400 animate-pulse" />
          </div>
        )}

        {widget.type === "notes" && (
          <div className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/50 whitespace-pre-wrap font-mono text-[11px] text-slate-300">
            {parsedConfig.content || "Keine Notiz vorhanden..."}
          </div>
        )}

        {widget.type === "todo" && (
          <div className="space-y-1.5">
            {parsedConfig.todos?.map((t: any) => (
              <label key={t.id} className="flex items-center gap-2 text-xs cursor-pointer">
                <input type="checkbox" defaultChecked={t.completed} className="rounded border-slate-700 bg-slate-800" />
                <span className={t.completed ? "line-through text-slate-500" : "text-slate-200"}>{t.text}</span>
              </label>
            ))}
          </div>
        )}

        {widget.type === "clock" && (
          <div className="text-center py-2">
            <p className="text-2xl font-mono font-bold tracking-wider text-cyan-400">
              {new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
            </p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">{parsedConfig.timezone || "Europe/Berlin"}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SortableWidget({ widget }: { widget: any }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: widget.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <WidgetCard widget={widget} />
    </div>
  );
}

export function ColumnView({ column, onDeleteColumn }: { column: any; onDeleteColumn?: (id: string) => void }) {
  const { addWidget } = useDashboardStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddWidget = async (type: string, title: string) => {
    const newWidget = {
      id: "w-" + Date.now(),
      columnId: column.id,
      type,
      order: column.widgets.length,
      title,
      config: "{}",
      collapsed: false,
    };
    addWidget(column.id, newWidget);

    await fetch("/api/widgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ columnId: column.id, type, title }),
    });
  };

  return (
    <div className="flex flex-col gap-3 min-h-[350px] rounded-2xl bg-slate-900/40 border border-white/5 p-3 backdrop-blur-sm relative group/col">
      {/* Column Controls Header */}
      <div className="flex items-center justify-between px-1 opacity-40 group-hover/col:opacity-100 transition-opacity">
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
          Spalte #{column.order + 1}
        </span>
        {onDeleteColumn && (
          <button
            onClick={() => onDeleteColumn(column.id)}
            className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-all"
            title="Spalte löschen"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>

      <SortableContext items={column.widgets.map((w: any) => w.id)} strategy={verticalListSortingStrategy}>
        {column.widgets.map((widget: any) => (
          <SortableWidget key={widget.id} widget={widget} />
        ))}
      </SortableContext>

      {/* Add Widget Trigger */}
      <div className="mt-auto pt-2 flex items-center justify-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full py-2 px-3 text-xs rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 border border-dashed border-white/10 hover:border-cyan-500/40 flex items-center justify-center gap-1.5 transition-all font-medium"
        >
          <Plus className="w-3.5 h-3.5" /> Widget hinzufügen
        </button>
      </div>

      <AddWidgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectWidget={handleAddWidget}
      />
    </div>
  );
}
