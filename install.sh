#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#  Media Manager + Companion — Unraid Installer
# ═══════════════════════════════════════════════════════════════

clear
echo ""
echo "  ┌─────────────────────────────────────────┐"
echo "  │   Media Manager — Unraid Installer       │"
echo "  └─────────────────────────────────────────┘"
echo ""

# ── Detect NAS IP ────────────────────────────────────────────
NAS_IP=$(hostname -I | awk '{print $1}')
echo "  Your NAS IP: $NAS_IP"
read -p "  Is this correct? [Y/n]: " yn
if [[ "$yn" == "n" || "$yn" == "N" ]]; then
  read -p "  Enter your NAS IP: " NAS_IP
fi

# ── Plex library path ───────────────────────────────────────
echo ""
read -p "  Plex root folder [/mnt/user/Plex]: " PLEX_ROOT
PLEX_ROOT="${PLEX_ROOT:-/mnt/user/Plex}"

# ── Library folder names ─────────────────────────────────────
echo ""
echo "  Library folder names (press Enter for defaults):"
read -p "    Movies       [Movies]: " F_MOV;       F_MOV="${F_MOV:-Movies}"
read -p "    TV Shows     [TV Shows]: " F_TV;       F_TV="${F_TV:-TV Shows}"
read -p "    Kids Movies  [Kids Movies]: " F_KIDS;  F_KIDS="${F_KIDS:-Kids Movies}"
read -p "    Asian Movies [Asian Movies]: " F_AM;   F_AM="${F_AM:-Asian Movies}"
read -p "    Asian Shows  [Asian Shows]: " F_AS;    F_AS="${F_AS:-Asian Shows}"
read -p "    Anime Movies [Anime Movies]: " F_ANM;  F_ANM="${F_ANM:-Anime Movies}"
read -p "    Anime Shows  [Anime Shows]: " F_ANS;   F_ANS="${F_ANS:-Anime Shows}"
read -p "    Staging      [Z Staging]: " F_STG;     F_STG="${F_STG:-Z Staging}"

# ── Confirm ──────────────────────────────────────────────────
echo ""
echo "  ── Summary ──────────────────────────────"
echo "  NAS IP:    $NAS_IP"
echo "  Plex root: $PLEX_ROOT"
echo "  Libraries: $F_MOV, $F_TV, $F_KIDS, $F_AM, $F_AS, $F_ANM, $F_ANS"
echo "  Staging:   $PLEX_ROOT/$F_STG"
echo ""
read -p "  Continue with install? [Y/n]: " go
if [[ "$go" == "n" || "$go" == "N" ]]; then
  echo "  Cancelled."
  exit 0
fi

echo ""
echo "  ── Installing... ──────────────────────────"

# ── Create directories ───────────────────────────────────────
echo "  [1/6] Creating directories..."
mkdir -p /mnt/user/appdata/media-manager/config
mkdir -p "$PLEX_ROOT/$F_STG"
mkdir -p "$PLEX_ROOT/$F_MOV"
mkdir -p "$PLEX_ROOT/$F_TV"
mkdir -p "$PLEX_ROOT/$F_KIDS"
mkdir -p "$PLEX_ROOT/$F_AM"
mkdir -p "$PLEX_ROOT/$F_AS"
mkdir -p "$PLEX_ROOT/$F_ANM"
mkdir -p "$PLEX_ROOT/$F_ANS"

# ── Pull images ──────────────────────────────────────────────
echo "  [2/6] Pulling Docker images (this may take a minute)..."
docker pull ghcr.io/pennderin/media-manager:latest
docker pull ghcr.io/pennderin/media-companion:latest

# ── Stop existing containers if running ──────────────────────
echo "  [3/6] Cleaning up old containers (if any)..."
docker stop media-manager media-companion 2>/dev/null
docker rm media-manager media-companion 2>/dev/null

# ── Start Media Manager ──────────────────────────────────────
echo "  [4/6] Starting Media Manager..."
docker run -d \
  --name media-manager \
  --restart unless-stopped \
  -p 9876:9876 \
  -e PORT=9876 \
  -e CONFIG_DIR=/config \
  -e LOG_LEVEL=info \
  -e PUID=99 \
  -e PGID=100 \
  -e TZ=America/New_York \
  -v /mnt/user/appdata/media-manager/config:/config \
  -v "$PLEX_ROOT/$F_STG:/staging" \
  -v "$PLEX_ROOT/$F_MOV:/media/movies" \
  -v "$PLEX_ROOT/$F_TV:/media/tv" \
  -v "$PLEX_ROOT/$F_KIDS:/media/kids-movies" \
  -v "$PLEX_ROOT/$F_AM:/media/asian-movies" \
  -v "$PLEX_ROOT/$F_AS:/media/asian-shows" \
  -v "$PLEX_ROOT/$F_ANM:/media/anime-movies" \
  -v "$PLEX_ROOT/$F_ANS:/media/anime-shows" \
  ghcr.io/pennderin/media-manager:latest

# ── Start Media Companion ────────────────────────────────────
echo "  [5/6] Starting Media Companion..."
docker run -d \
  --name media-companion \
  --restart unless-stopped \
  -p 3001:3000 \
  -e PORT=3000 \
  -e CONFIG_DIR=/config \
  -e MANAGER_URL=http://$NAS_IP:9876 \
  -e TZ=America/New_York \
  -v /mnt/user/appdata/media-manager/config:/config \
  ghcr.io/pennderin/media-companion:latest

# ── Install Unraid templates ─────────────────────────────────
echo "  [6/6] Installing Unraid templates..."
mkdir -p /boot/config/plugins/dockerMan/templates-user
curl -so /boot/config/plugins/dockerMan/templates-user/my-media-manager.xml \
  "https://raw.githubusercontent.com/Pennderin/Media-Manager/main/unraid-template.xml"
curl -so /boot/config/plugins/dockerMan/templates-user/my-media-companion.xml \
  "https://raw.githubusercontent.com/Pennderin/Media-Companion/main/unraid-template.xml"

# ── Verify ───────────────────────────────────────────────────
echo ""
echo "  ── Verifying... ───────────────────────────"
sleep 3

MM_STATUS=$(curl -s http://localhost:9876/ping 2>/dev/null)
if echo "$MM_STATUS" | grep -q "ok"; then
  echo "  ✅ Media Manager:  running"
else
  echo "  ❌ Media Manager:  not responding (check: docker logs media-manager)"
fi

MC_STATUS=$(curl -s http://localhost:3001 2>/dev/null)
if [ -n "$MC_STATUS" ]; then
  echo "  ✅ Media Companion: running"
else
  echo "  ❌ Media Companion: not responding (check: docker logs media-companion)"
fi

echo ""
echo "  ┌─────────────────────────────────────────┐"
echo "  │           ✅ Install Complete!            │"
echo "  └─────────────────────────────────────────┘"
echo ""
echo "  NEXT STEP — Configure your credentials:"
echo ""
echo "    Open http://$NAS_IP:9876/admin"
echo ""
echo "  You'll need:"
echo "    • Seedbox qBittorrent URL, username & password"
echo "    • Seedbox SFTP host, port, username & password"
echo "    • Prowlarr URL & API key"
echo "    • TMDB API key (free at themoviedb.org)"
echo ""
echo "  After configuring, search for content at:"
echo ""
echo "    http://$NAS_IP:3001"
echo ""
