// ═══════════════════════════════════════════════════════════════════
// Search routes — TMDB search, IMDB lookup, TV show details
// ═══════════════════════════════════════════════════════════════════

const express = require('express');
const { LRUCache } = require('media-manager-shared');

// TMDB search cache: max 500 entries, 1hr TTL
const tmdbCache = new LRUCache(500, 3600000);

// ── TMDB Search with multi-level fallback ──────────────────────

async function tmdbSearch(query, type, apiKey) {
  if (!apiKey) return [];

  const cacheKey = `${type}:${query}`;
  const cached = tmdbCache.get(cacheKey);
  if (cached) return cached;

  // Extract year if present
  const yearMatch = query.match(/\((\d{4})\)/) || query.match(/\b((?:19|20)\d{2})\b/);
  const year = yearMatch ? yearMatch[1] : null;
  const cleanQuery = query.replace(/\(?\d{4}\)?/, '').trim();

  const mapResults = (data, t) => (data.results || []).slice(0, 10).map(r => ({
    id: r.id,
    title: r.title || r.name,
    year: (r.release_date || r.first_air_date || '').slice(0, 4),
    overview: (r.overview || '').slice(0, 200),
    poster: r.poster_path ? `https://image.tmdb.org/t/p/w300${r.poster_path}` : null,
    rating: r.vote_average ? r.vote_average.toFixed(1) : null,
    type: t,
  }));

  const doSearch = async (q, yr) => {
    const endpoint = type === 'tv' ? 'search/tv' : 'search/movie';
    const yearParam = yr ? `&${type === 'tv' ? 'first_air_date_year' : 'year'}=${yr}` : '';
    const url = `https://api.themoviedb.org/3/${endpoint}?api_key=${apiKey}&query=${encodeURIComponent(q)}${yearParam}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    return mapResults(await res.json(), type);
  };

  // Try 1: exact query with year
  let results = await doSearch(cleanQuery, year);

  // Try 2: without year
  if (results.length === 0 && year) {
    results = await doSearch(cleanQuery, null);
  }

  // Try 3: fuzzy — merge short adjacent words
  if (results.length === 0 && cleanQuery.includes(' ')) {
    const words = cleanQuery.split(/\s+/);
    const merged = words.reduce((acc, w) => {
      if (acc.length && (acc[acc.length - 1].length <= 4 || w.length <= 4)) {
        acc[acc.length - 1] += w;
      } else {
        acc.push(w);
      }
      return acc;
    }, []).join(' ');
    if (merged !== cleanQuery) {
      results = await doSearch(merged, null);
    }
  }

  // Try 4: individual words
  if (results.length === 0 && cleanQuery.length >= 3) {
    const words = cleanQuery.split(/\s+/).filter(w => w.length >= 3);
    for (const word of words) {
      results = await doSearch(word, null);
      if (results.length > 0) break;
    }
  }

  tmdbCache.set(cacheKey, results);
  return results;
}

// ── Route factory ──────────────────────────────────────────────

/**
 * @param {Object} config - Shared app config (read for tmdb.apiKey)
 * @param {Function} requireAuth - Auth middleware
 * @returns {express.Router}
 */
module.exports = function createSearchRoutes(config, requireAuth) {
  const router = express.Router();

  // Search TMDB (user-facing search)
  router.get('/search', requireAuth, async (req, res) => {
    try {
      const { q, type } = req.query;
      if (!q) return res.status(400).json({ error: 'Query required' });
      if (!config.tmdb.apiKey) return res.status(500).json({ error: 'TMDB API key not configured \u2014 add it in Settings' });

      let results = [];
      if (!type || type === 'movie') {
        const movies = await tmdbSearch(q, 'movie', config.tmdb.apiKey);
        results.push(...movies);
      }
      if (!type || type === 'tv') {
        const tv = await tmdbSearch(q, 'tv', config.tmdb.apiKey);
        results.push(...tv);
      }

      results.sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
      res.json({ success: true, results });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // IMDB lookup via TMDB
  router.get('/imdb/:id', requireAuth, async (req, res) => {
    try {
      const apiKey = config.tmdb.apiKey;
      if (!apiKey) return res.status(500).json({ error: 'TMDB API key not configured' });
      const url = `https://api.themoviedb.org/3/find/${req.params.id}?api_key=${apiKey}&external_source=imdb_id`;
      const tmdbRes = await fetch(url);
      if (!tmdbRes.ok) return res.status(404).json({ error: 'Not found on TMDB' });
      const data = await tmdbRes.json();
      const movie = data.movie_results?.[0];
      const tv = data.tv_results?.[0];
      const r = movie || tv;
      if (!r) return res.status(404).json({ error: 'Not found' });
      res.json({
        success: true,
        result: {
          id: r.id,
          title: r.title || r.name,
          year: (r.release_date || r.first_air_date || '').slice(0, 4),
          overview: (r.overview || '').slice(0, 200),
          poster: r.poster_path ? `https://image.tmdb.org/t/p/w300${r.poster_path}` : null,
          rating: r.vote_average ? r.vote_average.toFixed(1) : null,
          type: movie ? 'movie' : 'tv',
        },
      });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // TMDB TV show details
  router.get('/tv/:tmdbId', requireAuth, async (req, res) => {
    try {
      const apiKey = config.tmdb.apiKey;
      if (!apiKey) return res.status(500).json({ error: 'TMDB API key not configured' });
      const tmdbId = req.params.tmdbId;

      const showRes = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${apiKey}`);
      if (!showRes.ok) return res.status(404).json({ error: 'Show not found on TMDB' });
      const show = await showRes.json();

      const today = new Date().toISOString().slice(0, 10);
      const seasons = (show.seasons || [])
        .filter(s => s.season_number > 0)
        .map(s => ({
          number: s.season_number,
          name: s.name,
          episodeCount: s.episode_count,
          airDate: s.air_date,
          aired: s.air_date && s.air_date <= today,
        }));

      res.json({
        success: true,
        title: show.name,
        totalSeasons: seasons.length,
        status: show.status,
        seasons,
      });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // TMDB TV season episodes
  router.get('/tv/:tmdbId/season/:num', requireAuth, async (req, res) => {
    try {
      const apiKey = config.tmdb.apiKey;
      if (!apiKey) return res.status(500).json({ error: 'TMDB API key not configured' });
      const { tmdbId, num } = req.params;

      const seasonRes = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}/season/${num}?api_key=${apiKey}`);
      if (!seasonRes.ok) return res.status(404).json({ error: 'Season not found' });
      const season = await seasonRes.json();

      const today = new Date().toISOString().slice(0, 10);
      const episodes = (season.episodes || []).map(ep => ({
        number: ep.episode_number,
        name: ep.name,
        airDate: ep.air_date,
        aired: ep.air_date && ep.air_date <= today,
        overview: (ep.overview || '').slice(0, 120),
      }));

      res.json({
        success: true,
        seasonNumber: season.season_number,
        name: season.name,
        episodes,
      });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  return router;
};
