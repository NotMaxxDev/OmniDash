import { create } from "zustand";

export interface BookmarkData {
  id: string;
  widgetId: string;
  parentId?: string | null;
  url: string;
  title: string;
  description?: string | null;
  favicon?: string | null;
  tags?: string | null;
  order: number;
}

export interface WidgetData {
  id: string;
  columnId: string;
  type: string;
  order: number;
  title: string;
  config: string;
  collapsed: boolean;
  color?: string | null;
  bookmarks?: BookmarkData[];
}

export interface ColumnData {
  id: string;
  pageId: string;
  order: number;
  width: number;
  widgets: WidgetData[];
}

export interface PageData {
  id: string;
  userId: string;
  title: string;
  icon: string;
  order: number;
  layoutConfig: string;
  theme: string;
  background: string;
  customCss?: string | null;
  isPublic: boolean;
  slug?: string | null;
  isArchived: boolean;
  columns: ColumnData[];
}

interface DashboardState {
  pages: PageData[];
  activePageId: string | null;
  setPages: (pages: PageData[]) => void;
  setActivePageId: (id: string) => void;
  updateWidgetOrder: (columnId: string, widgetIds: string[]) => void;
  moveWidget: (widgetId: string, sourceColumnId: string, targetColumnId: string, newOrder: number) => void;
  addWidget: (columnId: string, widget: WidgetData) => void;
  deleteWidget: (widgetId: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  pages: [],
  activePageId: null,

  setPages: (pages) =>
    set({
      pages,
      activePageId: pages.length > 0 ? pages[0].id : null,
    }),

  setActivePageId: (id) => set({ activePageId: id }),

  updateWidgetOrder: (columnId, widgetIds) =>
    set((state) => ({
      pages: state.pages.map((page) => ({
        ...page,
        columns: page.columns.map((col) => {
          if (col.id !== columnId) return col;
          const widgetMap = new Map(col.widgets.map((w) => [w.id, w]));
          const reordered = widgetIds
            .map((id, index) => {
              const widget = widgetMap.get(id);
              return widget ? { ...widget, order: index } : null;
            })
            .filter((w): w is WidgetData => w !== null);
          return { ...col, widgets: reordered };
        }),
      })),
    })),

  moveWidget: (widgetId, sourceColumnId, targetColumnId, newOrder) =>
    set((state) => {
      let targetWidget: WidgetData | null = null;

      // Extract widget from source column
      const pagesWithExtracted = state.pages.map((page) => ({
        ...page,
        columns: page.columns.map((col) => {
          if (col.id === sourceColumnId) {
            const w = col.widgets.find((item) => item.id === widgetId);
            if (w) targetWidget = { ...w, columnId: targetColumnId };
            return {
              ...col,
              widgets: col.widgets.filter((item) => item.id !== widgetId),
            };
          }
          return col;
        }),
      }));

      if (!targetWidget) return state;
      const widgetToInsert = targetWidget;

      // Insert widget into target column
      return {
        pages: pagesWithExtracted.map((page) => ({
          ...page,
          columns: page.columns.map((col) => {
            if (col.id === targetColumnId) {
              const updatedWidgets = [...col.widgets];
              updatedWidgets.splice(newOrder, 0, widgetToInsert);
              return {
                ...col,
                widgets: updatedWidgets.map((w, idx) => ({ ...w, order: idx })),
              };
            }
            return col;
          }),
        })),
      };
    }),

  addWidget: (columnId, widget) =>
    set((state) => ({
      pages: state.pages.map((page) => ({
        ...page,
        columns: page.columns.map((col) =>
          col.id === columnId ? { ...col, widgets: [...col.widgets, widget] } : col
        ),
      })),
    })),

  deleteWidget: (widgetId) =>
    set((state) => ({
      pages: state.pages.map((page) => ({
        ...page,
        columns: page.columns.map((col) => ({
          ...col,
          widgets: col.widgets.filter((w) => w.id !== widgetId),
        })),
      })),
    })),
}));
