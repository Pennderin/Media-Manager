// ═══════════════════════════════════════════════════════════════════
// TMDB Poster Handler — REST API version
// ═══════════════════════════════════════════════════════════════════

const posterCache = new Map();

function cleanTitle(torrentTitle) {
  let t = torrentTitle;
  t = t.replace(/\.\w{2,4}$/, '');
  const yearMatch = t.match(/[\.\s\(]((19|20)\d{2})[\.\s\)]/);
  const year = yearMatch ? yearMatch[1] : null;
  t = t.replace(/[\.\s](?:S\d{1,2}|Season|Complete|720p|1080p|2160p|4k|UHD|WEB|HDTV|BluRay|BRRip|DVDRip|HDRip|AMZN|NF|DSNP|HULU|x264|x265|H\.?264|H\.?265|HEVC|AAC|DD5|DDP|Atmos|FLAC|REPACK|PROPER|MULTI|REMUX|10bit).*/i, '');
  if (year) t = t.replace(new RegExp(`[\\(\\.]?${year}[\\)\\.]?`), '');
  t = t.replace(/[\.\-\_]/g, ' ').replace(/\s+/g, ' ').trim();
  return { query: t, year };
}

function setupTmdbRoutes(app, store, auth) {
  app.post('/api/tmdb/poster', auth, async (req, res) => {
    try {
      const { title: torrentTitle, type } = req.body;
      const cfg = store.get('tmdb') || {};
      if (!cfg.apiKey) return res.json({ success: false, error: 'No TMDB API key' });

      const cacheKey = `${type}:${torrentTitle}`;
      if (posterCache.has(cacheKey)) return res.json({ success: true, ...posterCache.get(cacheKey) });

      const { query, year } = cleanTitle(torrentTitle);
      if (!query) return res.json({ success: false, error: 'Could not parse title' });

      const endpoint = type === 'tv' ? 'search/tv' : 'search/movie';
      const yearParam = year ? `&${type === 'tv' ? 'first_air_date_year' : 'year'}=${year}` : '';
      const url = `https://api.themoviedb.org/3/${endpoint}?api_key=${cfg.apiKey}&query=${encodeURIComponent(query)}${yearParam}`;

      const r = await fetch(url);
      if (!r.ok) return res.json({ success: false, error: `TMDB ${r.status}` });
      const data = await r.json();

      if (!data.results || !data.results.length) {
        if (year) {
          const url2 = `https://api.themoviedb.org/3/${endpoint}?api_key=${cfg.apiKey}&query=${encodeURIComponent(query)}`;
          const res2 = await fetch(url2);
          if (res2.ok) {
            const data2 = await res2.json();
            if (data2.results && data2.results.length) {
              const item = data2.results[0];
              const result = {
                poster: item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : null,
                title: item.title || item.name,
                overview: (item.overview || '').slice(0, 200) + (item.overview && item.overview.length > 200 ? '...' : ''),
                year: (item.release_date || item.first_air_date || '').slice(0, 4),
                rating: item.vote_average ? item.vote_average.toFixed(1) : null
              };
              posterCache.set(cacheKey, result);
              return res.json({ success: true, ...result });
            }
          }
        }
        posterCache.set(cacheKey, { poster: null });
        return res.json({ success: true, poster: null });
      }

      const item = data.results[0];
      const result = {
        poster: item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : null,
        title: item.title || item.name,
        overview: (item.overview || '').slice(0, 200) + (item.overview && item.overview.length > 200 ? '...' : ''),
        year: (item.release_date || item.first_air_date || '').slice(0, 4),
        rating: item.vote_average ? item.vote_average.toFixed(1) : null
      };
      posterCache.set(cacheKey, result);
      res.json({ success: true, ...result });
    } catch (e) { res.json({ success: false, error: e.message }); }
  });
}

module.exports = { setupTmdbRoutes };
