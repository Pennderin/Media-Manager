// ═══════════════════════════════════════════════════════════════════
// Smart Grab Handler — Automated torrent search, scoring, and grab
// Moved from Companion to centralize torrent intelligence on the server
// ═══════════════════════════════════════════════════════════════════

function scoreTorrent(torrent, prefs, type) {
  let score = 0;
  const title = torrent.title;
  const is4K = /2160p|4k|uhd/i.test(title);
  const is1080 = /1080p/i.test(title);
  const is720 = /720p/i.test(title);

  if (prefs.quality === '4k' && is4K) score += 100;
  else if (prefs.quality === '1080p' && is1080) score += 100;
  else if (prefs.quality === '720p' && is720) score += 100;
  else if (prefs.quality === 'any') { if (is1080) score += 80; else if (is4K) score += 70; else if (is720) score += 60; }
  else { if (is1080) score += 50; else if (is4K) score += 40; else if (is720) score += 30; }

  if (/bluray|bdrip|remux/i.test(title)) score += 20;
  if (/web[\.\-\s]?dl|webrip|amzn|nf|dsnp/i.test(title)) score += 15;
  if (/hdtv/i.test(title)) score += 5;
  if (/cam|ts|telesync|hdts/i.test(title)) score -= 100;

  score += Math.min(Math.log2(torrent.seeders + 1) * 8, 50);

  const sizeGB = torrent.size / 1073741824;
  const maxSize = type === 'tv' ? (prefs.maxSizeGBTV || 60) : (prefs.maxSizeGB || 4);
  if (maxSize && sizeGB > maxSize) score -= 50;
  if (sizeGB < 0.3 && type === 'movie') score -= 30;
  if (sizeGB > 1 && sizeGB <= maxSize) score += 10;

  if (type === 'tv' && /complete|season.?pack/i.test(title)) score += 25;
  if (type === 'tv' && /S\d{1,2}E\d{1,2}/i.test(title) && !/complete|season/i.test(title)) score -= 20;

  if ((torrent.indexer || '').toLowerCase().includes('1337x')) score += 15;
  if (/FLUX|NTb|SPARKS|RARBG|YTS|YIFY|EVO|AMIABLE/i.test(title)) score += 10;

  if (/\b(kor|jpn|chi|hin|fra|deu|ita|spa|rus|ara|tur|tha)\b/i.test(title)) score -= 30;
  if (/dubbed|multi/i.test(title) && !/english/i.test(title)) score -= 15;

  const hasEnglishMarker = /\bENG(?:lish)?\b/i.test(title) || /\bEnG\b/.test(title) || /\bDUAL\b/i.test(title);
  const foreignRelease =
    /\bLektor\s*(PL|CZ|HU)\b/i.test(title) || /\bNapisy\s*PL\b/i.test(title) ||
    /\bTRUEFRENCH\b/i.test(title) || /\bFRENCH\b/i.test(title) || /\bLATINO\b/i.test(title) ||
    /\bGerman\s*DL\b/i.test(title) || /\biTALiAN\b/i.test(title) || /\bRUSSIAN\b/i.test(title) ||
    /\bPOLISH\b/i.test(title) || /\bCZECH\b/i.test(title) || /\bHINDI\b/i.test(title) ||
    /\bTAMiL\b/i.test(title) || /\bTELUGU\b/i.test(title) || /\bKOREAN\b/i.test(title) ||
    /\bCHINESE\b/i.test(title) || /\bJAPANESE\b/i.test(title) || /\bARABIC\b/i.test(title) ||
    /\bTURKISH\b/i.test(title) || /\bVFF\b/i.test(title) || /\bVFQ\b/i.test(title) ||
    /\bHC\b/.test(title) || /\bITA(?:\s|$|\b)/i.test(title) || /\bRUS(?:\s|$|\b)/i.test(title) ||
    /^(?:Slepa|La|Le|El|Der|Das|Die)\s\w+\s\//i.test(title);
  if (foreignRelease && !hasEnglishMarker) score -= 500;
  if (hasEnglishMarker && !foreignRelease) score += 5;

  if (torrent.seeders < (prefs.minSeeders || 5)) score -= 200;
  return score;
}

function selectBestTorrent(results, type, prefs, tvMode, tvSeason) {
  if (!results.length) return null;

  let filtered = results;
  if (type === 'movie') {
    filtered = results.filter(r => r.categories.some(c => c >= 2000 && c < 3000) || !r.categories.length);
  } else if (type === 'tv') {
    filtered = results.filter(r => r.categories.some(c => c >= 5000 && c < 6000) || !r.categories.length);
  }
  if (!filtered.length) filtered = results;

  if (type === 'tv' && tvMode) {
    const sNum = tvSeason ? String(tvSeason).padStart(2, '0') : null;
    if (tvMode === 'full') {
      const fullPacks = filtered.filter(r => /complete|all.?seasons|s01.*s\d{2}|season.?1.*season.?\d/i.test(r.title.toLowerCase()) || r.size > 10 * 1024 * 1024 * 1024);
      if (fullPacks.length) filtered = fullPacks;
    } else if (tvMode === 'season' && sNum) {
      const seasonPacks = filtered.filter(r => new RegExp(`S${sNum}(?!E\\d)`, 'i').test(r.title) || new RegExp(`Season.?${parseInt(sNum)}(?!\\s*E)`, 'i').test(r.title));
      if (seasonPacks.length) filtered = seasonPacks;
    }
  }

  const scored = filtered.map(r => ({ ...r, _score: scoreTorrent(r, prefs, type) }));
  scored.sort((a, b) => b._score - a._score);
  const best = scored[0];
  if (best._score < 0) return null;
  return best;
}

async function prowlarrSearch(store, query, searchType = 'search') {
  const cfg = store.get('prowlarr') || {};
  if (!cfg.url || !cfg.apiKey) throw new Error('Prowlarr not configured');
  const base = cfg.url.replace(/\/$/, '');
  const headers = { 'X-Api-Key': cfg.apiKey, 'Accept': 'application/json' };

  const idxRes = await fetch(`${base}/api/v1/indexer`, { headers });
  if (!idxRes.ok) throw new Error(`Failed to get indexers: ${idxRes.status}`);
  const allIndexers = await idxRes.json();
  const torrentIndexers = allIndexers.filter(i => i.enable && i.protocol === 'torrent');
  if (!torrentIndexers.length) throw new Error('No enabled torrent indexers');

  const leet = torrentIndexers.find(i => i.name.toLowerCase().includes('1337x'));
  const others = torrentIndexers.filter(i => !i.name.toLowerCase().includes('1337x'));
  const primaryIndexers = leet ? [leet] : torrentIndexers;

  const searchIndexers = async (indexers) => {
    const searches = indexers.map(async (idx) => {
      try {
        const url = `${base}/api/v1/search?query=${encodeURIComponent(query)}&indexerIds=${idx.id}&type=${searchType}`;
        const res = await fetch(url, { headers });
        if (!res.ok) return [];
        const data = await res.json();
        console.log(`[smart-grab] ${idx.name}: ${data.length} results`);
        return data;
      } catch (e) { console.log(`[smart-grab] ${idx.name}: error — ${e.message}`); return []; }
    });
    return (await Promise.all(searches)).flat();
  };

  console.log(`[smart-grab] Searching for "${query}"`);
  let rawResults = await searchIndexers(primaryIndexers);
  if (!rawResults.length && others.length) {
    console.log(`[smart-grab] Primary empty, trying: ${others.map(i => i.name).join(', ')}`);
    rawResults = await searchIndexers(others);
  }

  const allResults = rawResults.map(r => {
    let dlUrl = r.downloadUrl || r.magnetUrl || null;
    if (!dlUrl && r.guid && r.guid.startsWith('magnet:')) dlUrl = r.guid;
    let magnet = r.magnetUrl || null;
    if (!magnet && r.guid && r.guid.startsWith('magnet:')) magnet = r.guid;
    return {
      title: r.title, size: r.size, seeders: r.seeders || 0, leechers: r.leechers || 0,
      indexer: r.indexer, downloadUrl: dlUrl, magnetUrl: magnet,
      infoUrl: r.infoUrl || null, publishDate: r.publishDate, guid: r.guid,
      categories: (r.categories || []).map(c => c.id),
    };
  });
  allResults.sort((a, b) => b.seeders - a.seeders);
  console.log(`[smart-grab] Total: ${allResults.length} results`);
  return allResults;
}

function setupSmartGrabRoutes(app, store, auth) {
  // The main smart-grab endpoint: search → score → select → send to pipeline
  app.post('/api/smart-grab', auth, async (req, res) => {
    try {
      let { title, year, type, tmdbId, tvMode, tvSeason, tvEpisode, preferences, skipPlexCheck } = req.body;
      if (!title) return res.status(400).json({ error: 'Title required' });

      const contentType = type || 'movie';
      const prefs = preferences || { quality: '1080p', maxSizeGB: 4, maxSizeGBTV: 60, minSeeders: 5 };

      // Check pipeline queue for duplicates
      const { getJobs } = require('./pipeline');
      const jobs = (getJobs() || []).filter(j => j.status !== 'done' && j.status !== 'failed' && j.status !== 'cancelled');
      if (jobs.length) {
        const normalize = s => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const reqTitle = normalize(title);
        let matchLabel = null;
        if (contentType === 'tv' && tvMode === 'episode' && tvSeason && tvEpisode) {
          matchLabel = `s${String(tvSeason).padStart(2, '0')}e${String(tvEpisode).padStart(2, '0')}`;
        } else if (contentType === 'tv' && tvMode === 'season' && tvSeason) {
          matchLabel = `s${String(tvSeason).padStart(2, '0')}`;
        }
        for (const job of jobs) {
          const jobName = normalize(job.name);
          if (!jobName.includes(reqTitle)) continue;
          if (contentType === 'movie' && (!year || jobName.includes(String(year)))) {
            return res.status(409).json({ error: 'already_in_queue', message: `Already in pipeline: ${job.name}` });
          }
          if (contentType === 'tv' && matchLabel && jobName.includes(matchLabel)) {
            return res.status(409).json({ error: 'already_in_queue', message: `Already in pipeline: ${job.name}` });
          }
          if (contentType === 'tv' && tvMode === 'full') {
            return res.status(409).json({ error: 'already_in_queue', message: `Already in pipeline: ${job.name}` });
          }
        }
      }

      // Plex duplicate check
      if (!skipPlexCheck && (contentType === 'movie' || (contentType === 'tv' && tvMode === 'full'))) {
        try {
          const plexCfg = store.get('plex') || {};
          if (plexCfg.url && plexCfg.token) {
            const plexBase = plexCfg.url.replace(/\/$/, '');
            const plexHeaders = { 'X-Plex-Token': plexCfg.token, Accept: 'application/json' };
            const plexR = await fetch(`${plexBase}/search?query=${encodeURIComponent(title)}`, { headers: plexHeaders, signal: AbortSignal.timeout(5000) });
            if (plexR.ok) {
              const plexData = await plexR.json();
              const items = plexData.MediaContainer?.Metadata || [];
              const found = items.find(i => {
                const t = (i.title || '').toLowerCase();
                if (!t.includes(title.toLowerCase().slice(0, 10))) return false;
                if (year && i.year && String(i.year) !== String(year)) return false;
                return true;
              });
              if (found) {
                return res.status(409).json({
                  error: 'already_in_plex',
                  message: `Already in Plex: ${found.title}${found.year ? ` (${found.year})` : ''}`,
                });
              }
            }
          }
        } catch (e) { console.log('[smart-grab] Plex check failed (non-fatal):', e.message); }
      }

      // Build search query based on TV mode
      let searchQuery;
      let requestLabel = title;
      if (contentType === 'tv' && tvMode) {
        if (tvMode === 'full') { searchQuery = `${title} complete series`; requestLabel = `${title} (Complete Series)`; }
        else if (tvMode === 'season' && tvSeason) {
          const sNum = String(tvSeason).padStart(2, '0');
          searchQuery = `${title} S${sNum}`; requestLabel = `${title} Season ${tvSeason}`;
        } else if (tvMode === 'episode' && tvSeason && tvEpisode) {
          const sNum = String(tvSeason).padStart(2, '0');
          const eNum = String(tvEpisode).padStart(2, '0');
          searchQuery = `${title} S${sNum}E${eNum}`; requestLabel = `${title} S${sNum}E${eNum}`;
        } else if (tvMode === 'latest' && tmdbId) {
          try {
            const tmdbCfg = store.get('tmdb') || {};
            if (tmdbCfg.apiKey) {
              const showRes = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${tmdbCfg.apiKey}`);
              if (showRes.ok) {
                const show = await showRes.json();
                const lastEp = show.last_episode_to_air;
                if (lastEp) {
                  tvSeason = lastEp.season_number; tvEpisode = lastEp.episode_number;
                  const sNum = String(tvSeason).padStart(2, '0');
                  const eNum = String(tvEpisode).padStart(2, '0');
                  searchQuery = `${title} S${sNum}E${eNum}`; requestLabel = `${title} S${sNum}E${eNum} (Latest)`;
                } else {
                  const today = new Date().toISOString().slice(0, 10);
                  const aired = (show.seasons || []).filter(s => s.season_number > 0 && s.air_date && s.air_date <= today);
                  if (aired.length) {
                    const sNum = String(aired[aired.length - 1].season_number).padStart(2, '0');
                    searchQuery = `${title} S${sNum}`; requestLabel = `${title} Season ${aired[aired.length - 1].season_number} (Latest)`;
                  } else { searchQuery = title; requestLabel = `${title} (Latest)`; }
                }
              } else { searchQuery = title; requestLabel = `${title} (Latest)`; }
            } else { searchQuery = title; requestLabel = `${title} (Latest)`; }
          } catch { searchQuery = title; requestLabel = `${title} (Latest)`; }
        } else { searchQuery = title; requestLabel = tvMode === 'latest' ? `${title} (Latest)` : title; }
      } else {
        searchQuery = year ? `${title} ${year}` : title;
      }

      // Search Prowlarr
      let torrents = await prowlarrSearch(store, searchQuery);
      console.log(`[smart-grab] "${searchQuery}" => ${torrents.length} results`);

      // TV fallback searches
      if (contentType === 'tv' && !torrents.length) {
        if (tvMode === 'episode' && tvSeason && tvEpisode) {
          const fallback = `${title} S${String(tvSeason).padStart(2, '0')}`;
          console.log(`[smart-grab] No episode found, trying season: "${fallback}"`);
          torrents = await prowlarrSearch(store, fallback);
          if (torrents.length) { tvMode = 'season'; requestLabel += ' (via season pack)'; }
        } else if (tvMode === 'latest' && tvSeason) {
          torrents = await prowlarrSearch(store, `${title} S${String(tvSeason).padStart(2, '0')}`);
        } else if (tvMode === 'full') {
          torrents = await prowlarrSearch(store, `${title} complete`);
          if (!torrents.length) torrents = await prowlarrSearch(store, `${title} all seasons`);
        }
      }
      if (contentType === 'tv' && !torrents.length) {
        console.log(`[smart-grab] Trying bare title: "${title}"`);
        torrents = await prowlarrSearch(store, title);
      }
      if (!torrents.length) return res.status(404).json({ error: 'No torrents found', query: searchQuery });

      // Select best torrent
      const best = selectBestTorrent(torrents, contentType, prefs, tvMode, tvSeason);
      console.log(`[smart-grab] Best: ${best ? best.title + ' score:' + best._score : 'NONE'}`);
      if (!best) return res.status(404).json({ error: 'No suitable torrents found', query: searchQuery });

      // Resolve magnet if needed
      let grabUrl = (best.magnetUrl && best.magnetUrl.startsWith('magnet:')) ? best.magnetUrl : best.downloadUrl;
      if (grabUrl && !grabUrl.startsWith('magnet:')) {
        try {
          const { setupProwlarrRoutes, ..._ } = require('./prowlarr');
          // Use the resolve-magnet logic inline
          const cfg = store.get('prowlarr') || {};
          const prowBase = cfg.url ? cfg.url.replace(/\/$/, '') : '';
          if (prowBase && cfg.apiKey) {
            const searchQ = (best.title || '').replace(/[\.\-\_\(\)]/g, ' ').replace(/\s+/g, ' ').trim().split(' ').slice(0, 5).join(' ');
            const sRes = await fetch(`${prowBase}/api/v1/search?query=${encodeURIComponent(searchQ)}&type=search&limit=50`, {
              headers: { 'X-Api-Key': cfg.apiKey, 'Accept': 'application/json' }, signal: AbortSignal.timeout(15000)
            });
            if (sRes.ok) {
              const results = await sRes.json();
              const match = results.find(r => r.title === best.title) || results.find(r => r.title?.toLowerCase() === best.title?.toLowerCase());
              if (match) {
                const magnet = match.magnetUrl || (match.guid?.startsWith('magnet:') ? match.guid : null);
                if (magnet) grabUrl = magnet;
              }
            }
          }
        } catch (e) { console.log('[smart-grab] Magnet resolution failed, using original URL'); }
      }

      // Send to pipeline via auto-grab
      const renameType = contentType === 'tv' ? 'tv' : 'movie';
      const moveType = contentType === 'tv' ? 'tv' : 'movies';

      // Internal call to our own /auto-grab endpoint
      const port = parseInt(process.env.PORT) || 9876;
      const grabRes = await fetch(`http://127.0.0.1:${port}/auto-grab`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: grabUrl, title: best.title, type: contentType, infoUrl: best.infoUrl }),
        signal: AbortSignal.timeout(10000),
      });
      if (!grabRes.ok) {
        const errData = await grabRes.json().catch(() => ({}));
        return res.status(500).json({ error: 'Failed to start pipeline: ' + (errData.error || grabRes.status) });
      }

      // Get current pipeline job count for tracking
      const { getJobs: getPJ } = require('./pipeline');
      const currentJobs = getPJ() || [];
      const minPipelineJobId = currentJobs.length ? Math.max(...currentJobs.map(j => j.id || 0)) : 0;

      res.json({
        success: true,
        message: `Queued: ${best.title}`,
        requestLabel,
        torrent: { title: best.title, size: best.size, seeders: best.seeders, indexer: best.indexer, score: best._score },
        tvMode: tvMode || null, tvSeason: tvSeason || null, tvEpisode: tvEpisode || null,
        minPipelineJobId,
      });
    } catch (e) {
      console.error('[smart-grab] Error:', e.message);
      res.status(500).json({ error: e.message });
    }
  });
}

module.exports = { setupSmartGrabRoutes };
