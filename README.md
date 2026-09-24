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

---

## 🛠️ Schnellstart mit Docker Compose (Empfohlen)

Du benötigst **nur Docker** und eine `.env`-Datei.

### 1. `.env` Datei anlegen

Erstelle eine Datei namens `.env` im Projektverzeichnis mit folgenden Mindestwerten:

```env
# 1. Datenbank (Standard: SQLite Datei)
DATABASE_URL="file:./dev.db"

# 2. Geheimes Secret für Auth-Sessions (Beliebiger langer String)
NEXTAUTH_SECRET="dein-super-sicheres-secret-key-12345"

# 3. Öffentliche Domain / App-URL
NEXTAUTH_URL="http://localhost:3000"
```

### 2. Starten

Führe folgenden Befehl im Terminal aus:

```bash
docker compose up -d
```

Öffne anschließend `http://localhost:3000` im Browser!

---

## 💻 Manuelles Setup für Entwickler (Ohne Docker)

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Datenbank Schema generieren & pushen
npx prisma db push

# 3. Entwicklungs-Server starten
npm run dev
```
