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

## 🛠️ Ein-Klick-Start mit Docker Compose (Kein Code-Download nötig!)

Auf dem Zielserver werden **NUR 2 DATEIEN** benötigt: `docker-compose.yml` und `.env`.

### 1. `.env` Datei anlegen

Erstelle eine Datei namens `.env`:

```env
# 1. Datenbank-Pfad
DATABASE_URL="file:./dev.db"

# 2. Geheimes Secret für Auth-Sessions (Beliebiger langer String)
NEXTAUTH_SECRET="dein-super-sicheres-secret-key-12345"

# 3. Deine öffentliche App-URL
NEXTAUTH_URL="http://localhost:3000"
```

### 2. `docker-compose.yml` anlegen

```yaml
version: '3.8'

services:
  omnidash:
    image: ghcr.io/notmaxxdev/omnidash:latest
    container_name: omnidash
    ports:
      - "3000:3000"
    env_file:
      - .env
    volumes:
      - omnidash_data:/app/prisma
    restart: always

volumes:
  omnidash_data:
```

### 3. Starten

Führe auf deinem Server einfach folgenden Befehl aus:

```bash
docker compose up -d
```

Docker lädt das fertige Image aus der **GitHub Container Registry** (`ghcr.io/notmaxxdev/omnidash:latest`) herunter und startet OmniDash innerhalb weniger Sekunden auf Port 3000!

---

## 💻 Entwicklung & Build aus dem Quellcode

```bash
# 1. Repository klonen
git clone https://github.com/NotMaxxDev/OmniDash.git
cd OmniDash

# 2. Abhängigkeiten installieren
npm install

# 3. Entwicklungs-Server starten
npm run dev
```
