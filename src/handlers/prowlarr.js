async function prowlarrRequest(store, endpoint) {
  const cfg = store.get('prowlarr') || {};
  if (!cfg.url || !cfg.apiKey) throw new Error('Prowlarr not configured');
  const base = cfg.url.replace(/\/$/, '');
  const res = await fetch(`${base}${endpoint}`, {
    headers: { 'X-Api-Key': cfg.apiKey, 'Accept': 'application/json' }
  });
  if (!res.ok) throw new Error(`Prowlarr ${res.status}: ${res.statusText}`);
  return res.json();
}

// ========== 1337x Direct Scraper ==========
// Scrapes 1337x's actual Popular and Trending pages for accurate top results

const LEET_BASES = ['https://1337x.to', 'https://1337xx.to', 'https://1337x.st'];

async function fetchWithFallback(paths, userAgent) {
  const errors = [];
  for (const base of LEET_BASES) {
    for (const path of (Array.isArray(paths) ? paths : [paths])) {
      try {
        const url = `${base}${path}`;
        const res = await fetch(url, {
          headers: {
            'User-Agent': userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml',
            'Accept-Language': 'en-US,en;q=0.9',
          },
          redirect: 'follow',
        });
        if (res.ok) {
          const html = await res.text();
          // Basic check that we got an actual page with torrent table
          if (html.includes('<table') && html.includes('coll-1')) {
            return html;
          }
        }
      } catch (e) {
        errors.push(`${base}${path}: ${e.message}`);
      }
    }
  }
  throw new Error(`All 1337x sources failed: ${errors.join('; ')}`);
}

function parseSize(sizeStr) {
  if (!sizeStr) return 0;
  const match = sizeStr.replace(/\s/g, '').match(/([\d.]+)\s*(GB|MB|KB|TB)/i);
  if (!match) return 0;
  const num = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  if (unit === 'TB') return num * 1099511627776;
  if (unit === 'GB') return num * 1073741824;
  if (unit === 'MB') return num * 1048576;
  if (unit === 'KB') return num * 1024;
  return 0;
}

function parseTimeStr(timeStr) {
  // Parse 1337x time strings like "6pm Feb. 26th", "9:05am", "2h ago", "1d. ago"
  if (!timeStr) return null;
  const trimmed = timeStr.trim();
  // Relative times like "2h ago", "1d. ago", "30m ago"
  const relMatch = trimmed.match(/(\d+)\s*(h|d|m)\.?\s*ago/i);
  if (relMatch) {
    const val = parseInt(relMatch[1]);
    const unit = relMatch[2].toLowerCase();
    const now = Date.now();
    if (unit === 'm') return new Date(now - val * 60000).toISOString();
    if (unit === 'h') return new Date(now - val * 3600000).toISOString();
    if (unit === 'd') return new Date(now - val * 86400000).toISOString();
  }
  return null; // don't try to parse complex date formats
}

function parse1337xTable(html) {
  // Simple regex-based parser for 1337x table rows - no cheerio dependency needed
  const results = [];
  // Match each table row in tbody
  const tbodyMatch = html.match(/<tbody>([\s\S]*?)<\/tbody>/i);
  if (!tbodyMatch) return results;
  const tbody = tbodyMatch[1];
  
  // Split into rows
  const rows = tbody.split(/<tr[\s>]/i).filter(r => r.includes('coll-1'));
  
  for (const row of rows) {
    try {
      // Title and link - get the second <a> in coll-1 (first is icon)
      const titleCell = row.match(/class="coll-1[^"]*"[\s\S]*?<\/td>/i);
      if (!titleCell) continue;
      
      const links = [...titleCell[0].matchAll(/<a\s+href="([^"]*)"[^>]*>([^<]*)<\/a>/gi)];
      const torrentLink = links.find(l => l[1].startsWith('/torrent/'));
      if (!torrentLink) continue;
      
      const title = torrentLink[2].trim();
      const infoPath = torrentLink[1];
      
      // Seeders (coll-2)
      const seedMatch = row.match(/class="coll-2[^"]*"[^>]*>(\d+)<\/td>/i) || 
                        row.match(/seeds[^>]*>(\d+)</i);
      const seeders = seedMatch ? parseInt(seedMatch[1]) : 0;
      
      // Leechers (coll-3)  
      const leechMatch = row.match(/class="coll-3[^"]*"[^>]*>(\d+)<\/td>/i) ||
                         row.match(/leech[^>]*>(\d+)</i);
      const leechers = leechMatch ? parseInt(leechMatch[1]) : 0;
      
      // Time (coll-date)
      const timeMatch = row.match(/class="coll-date[^"]*"[^>]*>([\s\S]*?)<\/td>/i);
      const timeStr = timeMatch ? timeMatch[1].replace(/<[^>]+>/g, '').trim() : '';
      
      // Size (coll-4)
      const sizeMatch = row.match(/class="coll-4[^"]*"[^>]*>([\s\S]*?)<\/td>/i);
      const sizeStr = sizeMatch ? sizeMatch[1].replace(/<[^>]+>/g, '').trim() : '';
      
      if (title) {
        results.push({
          title,
          infoPath,
          seeders,
          leechers,
          size: parseSize(sizeStr),
          sizeStr,
          timeStr,
          publishDate: parseTimeStr(timeStr),
        });
      }
    } catch (e) {
      // Skip malformed rows
    }
  }
  
  return results;
}

async function scrape1337xMagnet(infoPath) {
  try {
    const html = await fetchWithFallback(infoPath);
    // Extract magnet link
    const magnetMatch = html.match(/href="(magnet:\?[^"]+)"/i);
    return magnetMatch ? magnetMatch[1] : null;
  } catch {
    return null;
  }
}

async function get1337xPopular(type, period) {
  // type: 'movies', 'tv', or 'anime'
  // period: 'day', 'week', 'month', or 'all'
  
  const paths = [];
  const category = type === 'tv' ? 'tv' : type === 'anime' ? 'anime' : 'movies';
  
  // 1337x doesn't have anime-specific pages, so for anime we return empty
  // (Nyaa will be used instead for anime)
  if (category === 'anime') return [];
  
  if (period === 'day') {
    paths.push(`/popular-${category}`);
    paths.push(`/trending/d/${category}/`);
  } else if (period === 'week') {
    paths.push(`/popular-${category}-week`);
    paths.push(`/trending/w/${category}/`);
  } else if (period === 'month') {
    paths.push(`/popular-${category}-week`);
    paths.push(`/popular-${category}`);
    paths.push(`/trending/w/${category}/`);
  } else {
    // all time — use top-100 page
    paths.push(`/top-100-${category}`);
  }
  
  const allResults = [];
  const seenTitles = new Set();
  
  for (const path of paths) {
    try {
      const html = await fetchWithFallback(path);
      const parsed = parse1337xTable(html);
      for (const r of parsed) {
        // Deduplicate by title
        const key = r.title.toLowerCase();
        if (!seenTitles.has(key)) {
          seenTitles.add(key);
          allResults.push(r);
        }
      }
    } catch (e) {
      // If one page fails, continue with others
    }
  }
  
  // Sort by seeders
  allResults.sort((a, b) => b.seeders - a.seeders);
  return allResults.slice(0, 20);
}

// ========== End 1337x Scraper ==========

// ========== Nyaa.si Scraper ==========

function parseNyaaTable(html) {
  const results = [];
  const tbodyMatch = html.match(/<tbody>([\s\S]*?)<\/tbody>/i);
  if (!tbodyMatch) return results;
  const tbody = tbodyMatch[1];
  const rows = tbody.split(/<tr[\s>]/i).filter(r => r.includes('</tr>'));

  for (const row of rows) {
    try {
      // Title — last <a> in the title column that isn't a comment link
      const titleLinks = [...row.matchAll(/<a[^>]*href="\/view\/(\d+)"[^>]*(?:title="([^"]*)")?[^>]*>([^<]*)<\/a>/gi)];
      const titleLink = titleLinks[titleLinks.length - 1];
      if (!titleLink) continue;
      const title = (titleLink[2] || titleLink[3] || '').trim();
      const viewId = titleLink[1];
      if (!title) continue;

      // Magnet link
      const magnetMatch = row.match(/href="(magnet:\?[^"]+)"/i);
      const magnet = magnetMatch ? magnetMatch[1] : null;

      // Size — typically 3rd or 4th <td>
      const tds = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
      // Nyaa columns: Category, Name, Links, Size, Date, Seeders, Leechers, Downloads
      const sizeStr = tds.find(t => /^\d+(\.\d+)?\s*(GiB|MiB|KiB|TiB|GB|MB|KB|TB)$/i.test(t)) || '';
      const size = parseNyaaSize(sizeStr);

      // Seeders/Leechers — green and red styled tds
      const seedMatch = row.match(/class="text-success[^"]*"[^>]*>(\d+)<\/td>/i);
      const leechMatch = row.match(/class="text-danger[^"]*"[^>]*>(\d+)<\/td>/i);
      const seeders = seedMatch ? parseInt(seedMatch[1]) : 0;
      const leechers = leechMatch ? parseInt(leechMatch[1]) : 0;

      // Date
      const dateMatch = row.match(/data-timestamp="(\d+)"/i);
      const publishDate = dateMatch ? new Date(parseInt(dateMatch[1]) * 1000).toISOString() : null;

      results.push({
        title, seeders, leechers, size, sizeStr,
        publishDate,
        downloadUrl: magnet,
        infoUrl: `https://nyaa.si/view/${viewId}`,
        guid: `nyaa-${viewId}`,
        indexer: 'Nyaa',
        categories: [5070],
        indexerFlags: [],
      });
    } catch (e) { /* skip */ }
  }
  return results;
}

function parseNyaaSize(str) {
  if (!str) return 0;
  const match = str.match(/([\d.]+)\s*(GiB|MiB|KiB|TiB|GB|MB|KB|TB)/i);
  if (!match) return 0;
  const num = parseFloat(match[1]);
  const unit = match[2].toLowerCase();
  if (unit === 'tib' || unit === 'tb') return num * 1099511627776;
  if (unit === 'gib' || unit === 'gb') return num * 1073741824;
  if (unit === 'mib' || unit === 'mb') return num * 1048576;
  if (unit === 'kib' || unit === 'kb') return num * 1024;
  return 0;
}

async function getNyaaPopular(period) {
  // Nyaa sort options: seeders desc
  // period filter: for day/week/month/all we use different filter params
  // Nyaa filter: f=0 (no filter), c=1_0 (anime - all), s=seeders, o=desc
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
  
  let url;
  if (period === 'all') {
    // All time top seeders
    url = 'https://nyaa.si/?f=0&c=1_0&q=&s=seeders&o=desc';
  } else {
    // Nyaa doesn't have day/week/month filters natively, so we search with no query sorted by seeders
    // and filter by date client-side
    url = 'https://nyaa.si/?f=0&c=1_0&q=&s=seeders&o=desc';
  }

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': ua, 'Accept': 'text/html' },
      redirect: 'follow',
    });
    if (!res.ok) return [];
    const html = await res.text();
    let results = parseNyaaTable(html);

    // Date-based filtering for day/week/month
    if (period !== 'all' && results.length > 0) {
      const now = Date.now();
      const cutoffs = { day: 86400000, week: 604800000, month: 2592000000 };
      const cutoff = cutoffs[period] || cutoffs.month;
      results = results.filter(r => {
        if (!r.publishDate) return true; // keep if no date info
        return (now - new Date(r.publishDate).getTime()) <= cutoff;
      });
    }

    results.sort((a, b) => b.seeders - a.seeders);
    return results.slice(0, 20);
  } catch (e) {
    console.error('[nyaa] Scrape error:', e.message);
    return [];
  }
}

// ========== End Nyaa Scraper ==========

function setupProwlarrRoutes(app, store, auth) {
  app.get('/api/prowlarr/test', auth, async (req, res) => {
    try {
      const data = await prowlarrRequest(store, '/api/v1/system/status');
      res.json({ success: true, version: data.version });
    } catch (e) { res.json({ success: false, error: e.message }); }
  });

  app.get('/api/prowlarr/indexers', auth, async (req, res) => {
    try {
      const data = await prowlarrRequest(store, '/api/v1/indexer');
      const indexers = data
        .filter(i => i.enable && i.protocol === 'torrent')
        .map(i => ({ id: i.id, name: i.name, categories: i.capabilities?.categories || [] }));
      res.json({ success: true, indexers });
    } catch (e) { res.json({ success: false, error: e.message }); }
  });

  app.post('/api/prowlarr/search', auth, async (req, res) => {
    try {
      const { query, categories, indexerIds } = req.body;
      const cfg = store.get('prowlarr') || {};
      if (!cfg.url || !cfg.apiKey) throw new Error('Prowlarr not configured');
      const base = cfg.url.replace(/\/$/, '');
      const headers = { 'X-Api-Key': cfg.apiKey, 'Accept': 'application/json' };
      
      const idxRes = await fetch(`${base}/api/v1/indexer`, { headers });
      if (!idxRes.ok) throw new Error(`Failed to get indexers: ${idxRes.status}`);
      const allIndexers = await idxRes.json();
      const torrentIndexers = allIndexers.filter(i => i.enable && i.protocol === 'torrent');
      if (!torrentIndexers.length) throw new Error('No enabled torrent indexers found');
      
      const searches = torrentIndexers.map(async (idx) => {
        try {
          const url = `${base}/api/v1/search?query=${encodeURIComponent(query)}&indexerIds=${idx.id}&type=search`;
          const r = await fetch(url, { headers });
          if (!r.ok) return { indexer: idx.name, success: false, results: [] };
          const data = await r.json();
          return { indexer: idx.name, success: true, results: data };
        } catch { return { indexer: idx.name, success: false, results: [] }; }
      });
      
      const outcomes = await Promise.all(searches);
      const indexerStatus = outcomes.map(o => ({ name: o.indexer, success: o.success, count: o.results.length }));
      const allResults = [];
      for (const o of outcomes) {
        for (const r of o.results) {
          let dlUrl = r.downloadUrl || r.magnetUrl || null;
          if (!dlUrl && r.guid && r.guid.startsWith('magnet:')) dlUrl = r.guid;
          allResults.push({
            guid: r.guid, title: r.title, size: r.size,
            seeders: r.seeders || 0, leechers: r.leechers || 0,
            indexer: r.indexer, downloadUrl: dlUrl, infoUrl: r.infoUrl,
            publishDate: r.publishDate,
            categories: (r.categories || []).map(c => c.id),
            indexerFlags: r.indexerFlags || []
          });
        }
      }
      allResults.sort((a, b) => b.seeders - a.seeders);
      res.json({ success: true, results: allResults, indexerStatus });
    } catch (e) { res.json({ success: false, error: e.message }); }
  });

  app.post('/api/prowlarr/browse', auth, async (req, res) => {
    try {
      const { indexerId, category, period } = req.body;
      const cfg = store.get('prowlarr') || {};
      let indexerName = '';
      if (cfg.url && cfg.apiKey) {
        try {
          const base = cfg.url.replace(/\/$/, '');
          const headers = { 'X-Api-Key': cfg.apiKey, 'Accept': 'application/json' };
          const idxRes = await fetch(`${base}/api/v1/indexer`, { headers });
          if (idxRes.ok) {
            const allIdx = await idxRes.json();
            const idx = allIdx.find(i => i.id === indexerId);
            if (idx) indexerName = idx.name;
          }
        } catch {}
      }
      
      const is1337x = /1337/i.test(indexerName);
      const isNyaa = /nyaa/i.test(indexerName);

      if (isNyaa) {
        const scraped = await getNyaaPopular(period || 'week');
        return res.json({ success: true, results: scraped });
      }
      
      if (is1337x) {
        const type = category === 5000 ? 'tv' : 'movies';
        const scraped = await get1337xPopular(type, period || 'week');
        const results = [];
        for (const item of scraped) {
          const result = {
            guid: item.infoPath, title: item.title, size: item.size,
            seeders: item.seeders, leechers: item.leechers,
            indexer: '1337x', downloadUrl: null,
            infoUrl: `https://1337x.to${item.infoPath}`,
            publishDate: item.publishDate, timeStr: item.timeStr,
            categories: category === 5000 ? [5000] : [2000], indexerFlags: []
          };
          try {
            const magnet = await scrape1337xMagnet(item.infoPath);
            if (magnet) result.downloadUrl = magnet;
          } catch {}
          results.push(result);
        }
        return res.json({ success: true, results });
      }
      
      // Fallback: Prowlarr browse
      if (!cfg.url || !cfg.apiKey) throw new Error('Prowlarr not configured');
      const base = cfg.url.replace(/\/$/, '');
      const headers = { 'X-Api-Key': cfg.apiKey, 'Accept': 'application/json' };
      const catParam = category ? `&categories=${category}` : '';
      const url = `${base}/api/v1/search?query=&indexerIds=${indexerId}&type=search${catParam}&limit=500`;
      const r = await fetch(url, { headers });
      if (!r.ok) throw new Error(`Prowlarr returned ${r.status}`);
      const data = await r.json();
      
      let results = data.map(r => {
        let dlUrl = r.downloadUrl || r.magnetUrl || null;
        if (!dlUrl && r.guid && r.guid.startsWith('magnet:')) dlUrl = r.guid;
        return { guid: r.guid, title: r.title, size: r.size, seeders: r.seeders || 0, leechers: r.leechers || 0,
          indexer: r.indexer, downloadUrl: dlUrl, infoUrl: r.infoUrl, publishDate: r.publishDate,
          categories: (r.categories || []).map(c => c.id), indexerFlags: r.indexerFlags || [] };
      });

      if (period && period !== 'all') {
        const now = Date.now();
        const cutoffs = { day: 86400000, week: 604800000, month: 2592000000 };
        const cutoff = cutoffs[period];
        if (cutoff) results = results.filter(r => r.publishDate && (now - new Date(r.publishDate).getTime()) <= cutoff);
      }
      results.sort((a, b) => b.seeders - a.seeders);
      res.json({ success: true, results: results.slice(0, 100) });
    } catch (e) { res.json({ success: false, error: e.message }); }
  });
}

module.exports = { setupProwlarrRoutes };
