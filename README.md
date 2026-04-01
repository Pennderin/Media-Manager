# Media Manager

A self-hosted media pipeline for your NAS. Grab a magnet link, and Media Manager downloads it via qBittorrent, renames files with TMDB metadata, and drops them into the right Plex library folder — automatically.

This is a **manual grab** tool. It doesn't replace Radarr/Sonarr — it fills the gap when you want to grab something specific that isn't in your *arr stack. Think of it as a streamlined pipeline: paste a magnet, pick a library, and walk away.

## How It Works

```
Magnet link → qBittorrent downloads → Copy to library → TMDB rename → Done
```

The server runs as a Docker container on your NAS. It exposes:

- **Admin UI** at `/admin` — manage settings, configure libraries, watch the pipeline in real time
- **REST API** — used by the Desktop app and Chrome extension to submit magnets and manage jobs
- **WebSocket** — live pipeline progress updates pushed to all connected clients

You can also send magnets to a **second qBittorrent instance** on your PC (behind a VPN) using the "MyPC" target — useful for content you want on your desktop instead of your NAS.

## Requirements

- A NAS or Linux server that can run Docker (Unraid, TrueNAS, Ubuntu, etc.)
- [qBittorrent](https://www.qbittorrent.org/) with the Web UI enabled
- A free [TMDB API key](https://www.themoviedb.org/settings/api) (for file renaming)
- Plex library folders (or any media folders you want to organize into)

## Install

### 1. Create your folder structure

Pick a location for the app data and make sure your media library folders exist:

```bash
mkdir -p /path/to/appdata/media-manager/config
```

### 2. Clone the repo

```bash
git clone https://github.com/Penderrin-Projects/Media-Manager.git
cd Media-Manager
```

### 3. Set up Docker Compose

Edit `docker-compose.yml` and adjust the volume paths to match your NAS. Each media library on your NAS needs its own volume mount:

```yaml
services:
  media-manager:
    build: .
    container_name: media-manager
    restart: unless-stopped
    ports:
      - "9876:9876"
    volumes:
      # Config — persists your settings between restarts
      - /path/to/appdata/media-manager/config:/config

      # Torrents — where qBittorrent saves completed downloads
      # Must be the same folder qBit uses, mounted into the container
      - /path/to/torrents:/torrents

      # Media libraries — one mount per library
      # The right side (container path) is what you enter in the admin UI
      - /path/to/Movies:/media/movies
      - /path/to/TV Shows:/media/tv
      # Add more as needed:
      # - /path/to/Anime:/media/anime
      # - /path/to/Kids Movies:/media/kids-movies
    environment:
      - TZ=America/New_York   # Your timezone
      - LOG_LEVEL=info         # debug, info, warn, error
```

> **Key concept:** The left side of each `-v` mount is the real folder on your NAS. The right side is the path inside the container. When you configure libraries in the admin UI, you use the **container path** (right side).

### 4. Start the container

```bash
docker-compose up -d
```

### 5. Open the Admin UI

```
http://YOUR_NAS_IP:9876/admin
```

## Configure

Go to the **Settings** tab and fill in each section:

### qBittorrent (NAS)

| Field | What to enter |
|-------|---------------|
| **Web UI URL** | Your qBit web interface address, e.g. `http://192.168.1.100:8085` |
| **Username** | Your qBit Web UI username |
| **Password** | Your qBit Web UI password |
| **Download Path** | The path *inside the container* where qBit's downloads appear. If you mounted `-v /path/to/torrents:/torrents`, enter `/torrents` |

Click **Test** to verify the connection. You should see "Connected" with the qBit version.

### TMDB

1. Go to [themoviedb.org](https://www.themoviedb.org/) and create a free account
2. Navigate to Settings → API → Request an API key
3. Paste the key into the **API Key** field
4. Click **Test** — you should see "OK"

### Library Paths

Click **+ Add Library** for each media folder you want to use. Each library has:

| Field | What it does |
|-------|-------------|
| **Name** | A label you'll see when adding torrents (e.g. "Movies", "Anime Shows") |
| **Path** | The container path matching your Docker volume mount (e.g. `/media/movies`) |
| **Shows** | Check this for TV series libraries. Enables season folders and episode naming (S01E01). Leave unchecked for movie libraries. |

> **Example:** You have `/mnt/user/Plex/Anime Movies` on your NAS, mounted as `-v /mnt/user/Plex/Anime Movies:/media/anime-movies`. In the admin UI, create a library named "Anime Movies" with path `/media/anime-movies` and leave Shows unchecked.

Click **Save All Settings** when done.

### qBittorrent (MyPC) — Optional

If you also want to send magnets to a qBittorrent on your desktop PC:

| Field | What to enter |
|-------|---------------|
| **Web UI URL** | Your PC's qBit URL, e.g. `http://192.168.1.50:8080` |
| **Username** | PC qBit username |
| **Password** | PC qBit password |

> **Tip:** For safety, go into your PC's qBit settings (Advanced → Network Interface) and bind it to your VPN adapter. This acts as a kill switch — torrents only download when the VPN is connected.

## Adding a New Library Later

Two steps:

1. **Add a Docker volume mount** — edit your compose file, add the `-v` line, and recreate the container (`docker-compose up -d`)
2. **Add the library in the Admin UI** — Settings → Library Paths → + Add Library → name it, set the container path, check "Shows" if it's a TV library, and save

## How to Use

Media Manager doesn't have a built-in search — that's what Radarr/Sonarr are for. Instead, you feed it magnet links:

- **Chrome Extension** — Click any magnet link on a website and it's automatically sent to Media Manager. See the [Desktop App](https://github.com/Penderrin-Projects/Media-Manager-Desktop) repo.
- **Desktop App** — Paste a magnet URL, pick your library and rename options, and click Add. See the [Desktop App](https://github.com/Penderrin-Projects/Media-Manager-Desktop) repo.
- **API** — POST a magnet directly:

```bash
curl -X POST http://YOUR_NAS_IP:9876/auto-grab \
  -H "Content-Type: application/json" \
  -d '{"url": "magnet:?xt=urn:btih:...", "title": "Movie Name", "type": "movie"}'
```

Set `type` to `movie` or `tv` to control rename behavior and default library.

### Pipeline Targets

When adding a torrent, you choose a target:

- **Media** (default) — Full pipeline: download on NAS → copy to library → TMDB rename
- **MyPC** — Just forwards the magnet to your PC's qBittorrent. No rename, no library move.

### Monitoring

Watch your jobs in real time from the **Pipeline** tab in the admin UI. Each job shows its current step, download progress, and any errors. The page updates live via WebSocket — no need to refresh.

## Security

The admin UI and API are **open by default** (no authentication). This is fine for a home network, but if your NAS is exposed to the internet, add an API key to your config file:

```json
{
  "server": {
    "apiKey": "pick-a-strong-secret"
  }
}
```

All API calls and the Desktop app will need to include this key to connect.

## Updating

Pull the latest code and rebuild:

```bash
cd Media-Manager
git pull
docker-compose up -d --build
```

Your settings are stored in the `/config` volume and persist across updates.

## Companion Apps

- **[Media Manager Desktop](https://github.com/Penderrin-Projects/Media-Manager-Desktop)** — Windows Electron app with a visual pipeline queue, add-torrent modal with rename/library options, and a Chrome extension for one-click magnet capture from any torrent site.
