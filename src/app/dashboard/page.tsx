"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { ColumnView, WidgetCard } from "@/components/ColumnView";
import { CommandPalette } from "@/components/CommandPalette";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  LayoutDashboard,
  Plus,
  Settings,
  LogOut,
  FolderPlus,
  Command,
  SlidersHorizontal,
  Sparkles,
  Layers,
} from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { pages, activePageId, setPages, setActivePageId, moveWidget } = useDashboardStore();
  const [activeDragWidget, setActiveDragWidget] = useState<any>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    fetch("/api/pages")
      .then((res) => res.json())
      .then((data) => {
        if (data.pages) {
          setPages(data.pages);
        }
      });
  }, [setPages]);

  const activePage = pages.find((p) => p.id === activePageId) || pages[0];

  const handleDragStart = (event: DragStartEvent) => {
    const widgetId = event.active.id as string;
    if (!activePage) return;
    for (const col of activePage.columns) {
      const w = col.widgets.find((item) => item.id === widgetId);
      if (w) {
        setActiveDragWidget(w);
        break;
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragWidget(null);

    if (!over || !activePage) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    let sourceColId = "";
    let targetColId = "";

    for (const col of activePage.columns) {
      if (col.widgets.some((w) => w.id === activeId)) sourceColId = col.id;
      if (col.widgets.some((w) => w.id === overId) || col.id === overId) targetColId = col.id;
    }

    if (sourceColId && targetColId) {
      moveWidget(activeId, sourceColId, targetColId, 0);
      await fetch("/api/widgets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ widgetId: activeId, columnId: targetColId, order: 0 }),
      });
    }
  };

  const handleAddColumn = async () => {
    if (!activePage) return;
    const res = await fetch("/api/columns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageId: activePage.id, width: 1 }),
    });
    if (res.ok) {
      const data = await res.json();
      const updatedPages = pages.map((p) =>
        p.id === activePage.id
          ? { ...p, columns: [...p.columns, { ...data.column, widgets: [] }] }
          : p
      );
      setPages(updatedPages);
    }
  };

  const handleDeleteColumn = async (columnId: string) => {
    if (!activePage) return;
    const res = await fetch(`/api/columns?id=${columnId}`, { method: "DELETE" });
    if (res.ok) {
      const updatedPages = pages.map((p) =>
        p.id === activePage.id
          ? { ...p, columns: p.columns.filter((c) => c.id !== columnId) }
          : p
      );
      setPages(updatedPages);
    }
  };

  const handleCreatePage = async () => {
    const title = prompt("Name der neuen Seite:", "Neues Dashboard");
    if (!title) return;
    const res = await fetch("/api/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, columnCount: 3 }),
    });
    if (res.ok) {
      const data = await res.json();
      setPages([...pages, data.page]);
      setActivePageId(data.page.id);
    }
  };

  if (!activePage) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 text-slate-400 font-medium">
          <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <span>Lade Dashboard Workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      {/* Top Header Bar */}
      <header className="h-14 border-b border-white/[0.08] bg-[#0E1322]/80 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-cyan-500/20 border border-white/10">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight text-white">
              OmniDash
            </span>
          </div>

          <div className="h-4 w-[1px] bg-white/10" />

          {/* Page Tabs */}
          <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-white/5">
            {pages.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePageId(p.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  p.id === activePage.id
                    ? "bg-slate-800 text-cyan-400 shadow-sm border border-white/10"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                }`}
              >
                {p.title}
              </button>
            ))}
            <button
              onClick={handleCreatePage}
              className="px-2 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-cyan-400 hover:bg-slate-800/40 transition-all flex items-center gap-1"
              title="Neue Seite erstellen"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-900/60 hover:bg-slate-800/60 border border-white/5 rounded-xl flex items-center gap-2 transition-all"
          >
            <Command className="w-3.5 h-3.5" />
            <span>Suchen...</span>
            <kbd className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 border border-white/5">⌘K</kbd>
          </button>

          <button
            onClick={handleAddColumn}
            className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800/60 hover:bg-slate-800 border border-white/10 hover:border-cyan-500/40 rounded-xl flex items-center gap-1.5 transition-all"
          >
            <FolderPlus className="w-3.5 h-3.5 text-cyan-400" />
            <span>+ Spalte</span>
          </button>

          <div className="h-4 w-[1px] bg-white/10 mx-1" />

          <button
            onClick={() => signOut()}
            className="p-2 text-slate-400 hover:text-rose-400 rounded-xl bg-slate-900/60 hover:bg-rose-500/10 border border-white/5 transition-all"
            title="Abmelden"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 p-6 max-w-[1920px] w-full mx-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div
            className="grid gap-5 transition-all"
            style={{
              gridTemplateColumns: `repeat(${activePage.columns.length || 1}, minmax(0, 1fr))`,
            }}
          >
            {activePage.columns.map((column) => (
              <ColumnView key={column.id} column={column} onDeleteColumn={handleDeleteColumn} />
            ))}
          </div>

          <DragOverlay>
            {activeDragWidget ? <WidgetCard widget={activeDragWidget} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      </main>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
}
