# OmniDash - Personalisierbares Startseiten- & Dashboard-System

OmniDash ist ein modernes, schnelles und vollständig kostenloses Dashboard-System im Stil von start.me.

## 🚀 Features
- **Vollständig kostenlos & Open Source**: Keine Paywalls, keine Pro-Abos.
- **Drag & Drop Workspace**: Freie Anordnung aller Widgets & Spalten.
- **Widgets**:
  - Bookmarks & Link-Ordner (automatischer Favicon Fetcher)
  - Notizen (Rich-Text / Markdown / Checklisten)
  - To-do Liste mit Prioritäten & Unterpunkten
  - Live RSS/Atom Newsfeed Proxy
  - Live-Wetter über Open-Meteo API
  - Multisuche mit Engine-Shortcuts (`g`, `ddg`, `yt`)
  - Weltuhr, Embeds/iFrames, Foto/Bild
- **Sicherheit & Performance**: SSRF-geschützter RSS/Favicon-Proxy, Auth.js Authentication, SQLite/PostgreSQL Unterstützung via Prisma ORM.
- **Quick Command Palette**: Erreichbar via `Cmd + K` / `Ctrl + K`.

## 🛠️ Schnellstart mit Docker (5 Minuten)

```bash
# 1. Repository klonen
git clone https://github.com/user/omnidash.git
cd omnidash

# 2. Docker Container starten
docker compose up -d
```

Öffne anschließend `http://localhost:3000` im Browser!

## 💻 Manuelles Setup für Entwickler

```bash
# Abhängigkeiten installieren
npm install

# SQLite Datenbank initialisieren
npx prisma db push

# Entwicklungs-Server starten
npm run dev
```
