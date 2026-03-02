# Media Manager — Docker/Unraid Edition

Headless media pipeline running on your NAS. SFTP from seedbox → rename via TMDB → organize into Plex libraries. Fully automated, 24/7, no PC required.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  UNRAID NAS                                                 │
│  ┌─────────────────────────┐  ┌──────────────────────────┐  │
│  │  media-manager (9876)   │  │  media-companion (3000)  │  │
│  │  ─────────────────────  │  │  ────────────────────────│  │
│  │  REST API + WebSocket   │◄─┤  PWA mobile frontend     │  │
│  │  Pipeline engine        │  │  Proxies API calls       │  │
│  │  Prowlarr search        │  └──────────────────────────┘  │
│  │  SFTP transfer          │                                │
│  │  TMDB rename            │  /media/movies ─► Plex         │
│  │  NAS file moves         │  /media/tv     ─► Plex         │
│  └───────────┬─────────────┘                                │
│              │ REST/WS                                      │
└──────────────┼──────────────────────────────────────────────┘
               │
    ┌──────────┴──────────┐
    │  Desktop Client     │  (optional — same UI, thin client)
    │  Chrome Extension   │  (magnets → server)
    └─────────────────────┘
```

**Old flow:** Seedbox → SFTP to PC → FileBot on PC → SFTP to NAS  
**New flow:** Seedbox → SFTP to NAS → rename on NAS → local file move ⚡

## Quick Start (Unraid)

### 1. Get the files onto your NAS

Copy this entire directory to your Unraid server (e.g., `/mnt/user/appdata/media-manager/`).

### 2. Configure

```bash
mkdir -p config
cp config.template.json config/config.json
nano config/config.json
```

Fill in your seedbox qBittorrent URL/credentials, SFTP credentials, Prowlarr URL/key, and TMDB API key.

### 3. Edit volume paths in docker-compose.yml

The default paths assume standard Unraid share layout. Adjust the left side of each volume mapping to match YOUR actual paths:

```yaml
- /mnt/user/downloads/staging:/staging        # Temp workspace
- /mnt/user/media/Movies:/media/movies        # Plex Movies library
- /mnt/user/media/TV Shows:/media/tv          # Plex TV library
# ... etc
```

The **right side** (container paths) must match what's in `config.json` → `paths`.

### 4. Build and start

```bash
docker-compose up -d
```

### 5. Verify

```bash
# Health check
curl http://localhost:9876/ping

# Full diagnostics
curl http://localhost:9876/api/diagnostics

# Check connectivity to seedbox
curl http://localhost:9876/api/test/qbit
curl http://localhost:9876/api/test/sftp
curl http://localhost:9876/api/test/prowlarr
curl http://localhost:9876/api/test/tmdb

# View recent logs
curl http://localhost:9876/api/logs
```

## Unraid Community Applications (Manual Docker)

If you prefer to set up each container manually in Unraid's Docker UI instead of docker-compose:

### Media Manager Server

| Setting | Value |
|---------|-------|
| Repository | Build from `/mnt/user/appdata/media-manager/media-manager-server/` |
| Port | 9876 → 9876 |
| Path: /config | `/mnt/user/appdata/media-manager/config` |
| Path: /staging | `/mnt/user/downloads/staging` |
| Path: /media/movies | `/mnt/user/media/Movies` |
| Path: /media/tv | `/mnt/user/media/TV Shows` |
| Variable: TZ | `America/New_York` |

### Media Companion

| Setting | Value |
|---------|-------|
| Repository | Build from `/mnt/user/appdata/media-manager/media-companion-docker/` |
| Port | 3000 → 3000 |
| Path: /config | `/mnt/user/appdata/media-manager/config` |
| Variable: MANAGER_URL | `http://[NAS_IP]:9876` |
| Variable: TZ | `America/New_York` |

## API Reference

All endpoints accept/return JSON. If `server.apiKey` is set in config, include `X-Api-Key` header.

### Core

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/ping` | Health check |
| GET | `/api/diagnostics` | System info, path checks, memory |
| GET | `/api/logs?since=TIMESTAMP` | Recent server logs |
| GET | `/api/settings` | Config (passwords redacted) |
| GET | `/api/settings/raw` | Config (full, for desktop client) |
| PUT | `/api/settings` | Update single key: `{key, value}` |

### Pipeline

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/pipeline/start` | Start a pipeline job |
| GET | `/api/pipeline/queue` | Get all jobs |
| POST | `/api/pipeline/cancel` | Cancel job: `{id}` |
| POST | `/api/pipeline/retry` | Retry failed job: `{id}` |
| POST | `/api/pipeline/clearFinished` | Clear done/failed jobs |
| GET | `/status` | Companion-compatible status |

### Search & Browse

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/prowlarr/search` | Search indexers: `{query}` |
| POST | `/api/prowlarr/browse` | Browse top content: `{indexerId, category, period}` |
| GET | `/api/prowlarr/indexers` | List enabled indexers |

### Torrents

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/qbit/torrents` | List all torrents |
| POST | `/api/qbit/add` | Add torrent: `{url}` |
| POST | `/api/qbit/pause` | Pause: `{hash}` |
| POST | `/api/qbit/resume` | Resume: `{hash}` |
| POST | `/api/qbit/delete` | Delete: `{hash, deleteFiles}` |

### Chrome Extension / Magnet

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/magnet` | Receive magnet link |
| POST | `/auto-grab` | Auto-queue from Companion |

### WebSocket

Connect to `ws://[host]:9876/ws` for real-time pipeline updates. Messages are JSON with `type` field:
- `pipeline:update` — job queue changed
- `magnet:received` — new magnet from extension

## Diagnostics & Troubleshooting

### Check everything at once

```bash
curl -s http://localhost:9876/api/diagnostics | python3 -m json.tool
```

Returns server uptime, memory usage, path existence/writability, connection status for all services.

### View logs

```bash
# All recent logs
curl -s http://localhost:9876/api/logs | python3 -m json.tool

# Logs since a timestamp (milliseconds)
curl -s "http://localhost:9876/api/logs?since=1709300000000"

# Errors only
curl -s "http://localhost:9876/api/logs?level=error"
```

### Common issues

**"Staging not configured"** — The `/staging` volume isn't mounted, or `config.json` paths.staging doesn't match the container path.

**"SFTP connection refused"** — The container can't reach your seedbox. Check that the seedbox hostname resolves from inside the container:
```bash
docker exec media-manager ping your-seedbox-hostname
```

**"Cannot reach Prowlarr"** — If Prowlarr is also on Unraid, use the NAS IP (not localhost):
```json
"prowlarr": { "url": "http://192.168.1.100:9696" }
```

**Files not moving to NAS** — Check that the media volume paths are writable:
```bash
docker exec media-manager touch /media/movies/test && echo "OK" && docker exec media-manager rm /media/movies/test
```

## Desktop Client (Optional)

The `media-manager-desktop/` directory contains a thin Electron client that provides the same UI as the original app, but all processing happens on the NAS server. 

1. Copy `media-manager-desktop/` to your PC
2. Run `START.bat`
3. Go to Settings → enter your NAS server URL (`http://192.168.1.100:9876`)
4. The Chrome Extension still works — magnets get forwarded to the NAS

## File Structure

```
media-manager-server/       ← Docker: the headless pipeline engine
├── Dockerfile
├── docker-compose.yml      ← Defines both containers
├── config.template.json    ← Copy to config/config.json
├── server.js               ← Express + WebSocket entry point
└── src/handlers/
    ├── pipeline.js          ← Core pipeline orchestration
    ├── qbit.js              ← qBittorrent API
    ├── sftp.js              ← Seedbox SFTP transfers
    ├── renamer.js           ← TMDB-based file renaming
    ├── prowlarr.js          ← Search + 1337x/Nyaa scrapers
    ├── tmdb.js              ← Poster/metadata lookups
    └── files.js             ← Staging listing + NAS moves

media-companion-docker/     ← Docker: mobile PWA + API proxy
├── Dockerfile
├── server.js               ← Express proxy to manager
└── public/                 ← PWA frontend files

media-manager-desktop/      ← Windows: thin Electron client
├── START.bat
├── src/main/main.js        ← Lightweight Electron shell
├── src/main/preload.js     ← Maps window.api → HTTP calls
└── src/renderer/           ← Same UI as original (unchanged)
```
