import { db } from "@/lib/db";

export async function seedDemoData(userId: string) {
  // Check if user already has pages
  const existingPages = await db.page.findMany({ where: { userId } });
  if (existingPages.length > 0) return existingPages[0];

  // Create default main page
  const page = await db.page.create({
    data: {
      userId,
      title: "Mein Dashboard",
      icon: "layout-dashboard",
      order: 0,
      theme: "dark",
      background: "gradient-1",
      columns: {
        create: [
          {
            order: 0,
            width: 1,
            widgets: {
              create: [
                {
                  type: "search",
                  order: 0,
                  title: "Schnellsuche",
                  config: JSON.stringify({ defaultEngine: "google" }),
                },
                {
                  type: "bookmarks",
                  order: 1,
                  title: "Favoriten & Tools",
                  config: JSON.stringify({ viewMode: "grid" }),
                  bookmarks: {
                    create: [
                      { title: "GitHub", url: "https://github.com", favicon: "https://github.githubassets.com/favicons/favicon.png", order: 0 },
                      { title: "ChatGPT", url: "https://chatgpt.com", favicon: "https://chatgpt.com/favicon.ico", order: 1 },
                      { title: "YouTube", url: "https://youtube.com", favicon: "https://www.youtube.com/s/desktop/f5af05a5/img/favicon.ico", order: 2 },
                      { title: "Reddit", url: "https://reddit.com", favicon: "https://www.redditstatic.com/shreddit/assets/favicon/192x192.png", order: 3 },
                    ],
                  },
                },
              ],
            },
          },
          {
            order: 1,
            width: 1,
            widgets: {
              create: [
                {
                  type: "weather",
                  order: 0,
                  title: "Wetter Vorhersage",
                  config: JSON.stringify({ location: "Berlin", unit: "C" }),
                },
                {
                  type: "notes",
                  order: 1,
                  title: "Schnellnotizen",
                  config: JSON.stringify({ content: "Willkommen zu deinem neuen personalisierbaren **OmniDash** Dashboard!\n\n- [x] Phase 1: DB & Auth\n- [ ] Drag & Drop Widgets\n- [ ] RSS, Wetter, Suche & Notizen" }),
                },
              ],
            },
          },
          {
            order: 2,
            width: 1,
            widgets: {
              create: [
                {
                  type: "todo",
                  order: 0,
                  title: "Aufgaben",
                  config: JSON.stringify({
                    todos: [
                      { id: "1", text: "Dashboard nach Wünschen anpassen", completed: false, priority: "high" },
                      { id: "2", text: "Eigene Bookmarks importieren", completed: false, priority: "medium" },
                    ],
                  }),
                },
                {
                  type: "clock",
                  order: 1,
                  title: "Weltuhr",
                  config: JSON.stringify({ timezone: "Europe/Berlin", format: "digital" }),
                },
              ],
            },
          },
        ],
      },
    },
    include: {
      columns: {
        include: {
          widgets: {
            include: {
              bookmarks: true,
            },
          },
        },
      },
    },
  });

  return page;
}
