// ═══════════════════════════════════════════════════════════════════
// Unified torrent scoring algorithm for Media Manager ecosystem
// Consolidated from:
//   - companion/server.js scoreTorrent() + selectBestTorrent()
//   - server/src/handlers/smart-grab.js scoreTorrent() + selectBestTorrent()
// ═══════════════════════════════════════════════════════════════════

var constants = require('./constants');
var language = require('./language');

var QUALITY_TIERS            = constants.QUALITY_TIERS;
var SOURCE_BONUSES           = constants.SOURCE_BONUSES;
var TRUSTED_RELEASE_GROUPS   = constants.TRUSTED_RELEASE_GROUPS;
var PREFERRED_INDEXER        = constants.PREFERRED_INDEXER;
var PREFERRED_INDEXER_BONUS  = constants.PREFERRED_INDEXER_BONUS;
var SEEDER_BONUS             = constants.SEEDER_BONUS;
var SIZE_PENALTIES           = constants.SIZE_PENALTIES;
var BYTES_PER_GB             = constants.BYTES_PER_GB;
var DEFAULT_MIN_SEEDERS      = constants.DEFAULT_MIN_SEEDERS;
var MIN_SEEDERS_PENALTY      = constants.MIN_SEEDERS_PENALTY;
var TV_PACK_BONUS            = constants.TV_PACK_BONUS;
var TV_SINGLE_EPISODE_PENALTY = constants.TV_SINGLE_EPISODE_PENALTY;
var YEAR_MATCH_BONUS         = constants.YEAR_MATCH_BONUS;
var YEAR_MISMATCH_PENALTY    = constants.YEAR_MISMATCH_PENALTY;
var FOREIGN_PENALTY          = constants.FOREIGN_PENALTY;
var FOREIGN_LANG_CODE_PENALTY = constants.FOREIGN_LANG_CODE_PENALTY;
var DUBBED_MULTI_PENALTY     = constants.DUBBED_MULTI_PENALTY;
var ENGLISH_CONFIRMED_BONUS  = constants.ENGLISH_CONFIRMED_BONUS;
var FULL_PACK_MIN_BYTES      = constants.FULL_PACK_MIN_BYTES;
var CATEGORY_MOVIE           = constants.CATEGORY_MOVIE;
var CATEGORY_TV              = constants.CATEGORY_TV;

var isForeignRelease = language.isForeignRelease;

/**
 * Score a single torrent based on quality, source, seeders, size, language, and year.
 *
 * @param {Object} torrent - Torrent result with at least { title, seeders, size, indexer? }
 * @param {Object} prefs   - User preferences { quality, maxSizeGB, maxSizeGBTV, minSeeders }
 * @param {string} type    - Content type: 'movie' or 'tv'
 * @param {number|string} [requestYear] - Expected release year for disambiguation
 * @returns {number} Numeric score (higher = better)
 */
function scoreTorrent(torrent, prefs, type, requestYear) {
  var score = 0;
  var title = torrent.title;

  // ── Quality tier scoring ──────────────────────────────────────
  var qualityMatched = false;
  for (var i = 0; i < QUALITY_TIERS.length; i++) {
    var tier = QUALITY_TIERS[i];
    if (tier.pattern.test(title)) {
      if (prefs.quality === tier.label) {
        score += tier.matchScore;            // exact match with preferred quality
      } else if (prefs.quality === 'any') {
        score += tier.anyScore;              // no preference — rank by tier
      } else {
        score += tier.mismatchScore;         // wrong quality but not worthless
      }
      qualityMatched = true;
      break;
    }
  }

  // ── Source quality bonuses ────────────────────────────────────
  for (var j = 0; j < SOURCE_BONUSES.length; j++) {
    var src = SOURCE_BONUSES[j];
    if (src.pattern.test(title)) {
      score += src.score;
    }
  }

  // ── Seeder bonus (logarithmic — diminishing returns past ~50) ─
  score += Math.min(
    Math.log2((torrent.seeders || 0) + 1) * SEEDER_BONUS.multiplier,
    SEEDER_BONUS.cap
  );

  // ── Size penalties ────────────────────────────────────────────
  var sizeGB = (torrent.size || 0) / BYTES_PER_GB;
  var maxSize = type === 'tv'
    ? (prefs.maxSizeGBTV || SIZE_PENALTIES.maxSizeGBTV)
    : (prefs.maxSizeGB || SIZE_PENALTIES.maxSizeGBMovie);

  if (maxSize && sizeGB > maxSize) {
    score += SIZE_PENALTIES.oversizePenalty;
  }
  if (sizeGB < SIZE_PENALTIES.tooSmallGB && type === 'movie') {
    score += SIZE_PENALTIES.tooSmallPenalty;
  }
  if (sizeGB > SIZE_PENALTIES.reasonableMinGB && sizeGB <= maxSize) {
    score += SIZE_PENALTIES.reasonableSizeBonus;
  }

  // ── TV pack scoring ───────────────────────────────────────────
  if (type === 'tv' && /complete|season.?pack/i.test(title)) {
    score += TV_PACK_BONUS;
  }
  if (type === 'tv' && /S\d{1,2}E\d{1,2}/i.test(title) && !/complete|season/i.test(title)) {
    score += TV_SINGLE_EPISODE_PENALTY;
  }

  // ── Indexer preference ────────────────────────────────────────
  if ((torrent.indexer || '').toLowerCase().indexOf(PREFERRED_INDEXER) !== -1) {
    score += PREFERRED_INDEXER_BONUS;
  }

  // ── Trusted release groups ────────────────────────────────────
  if (TRUSTED_RELEASE_GROUPS.test(title)) {
    score += 10;
  }

  // ── Language penalties ────────────────────────────────────────
  if (/\b(kor|jpn|chi|hin|fra|deu|ita|spa|rus|ara|tur|tha)\b/i.test(title)) {
    score += FOREIGN_LANG_CODE_PENALTY;
  }
  if (/dubbed|multi/i.test(title) && !/english/i.test(title)) {
    score += DUBBED_MULTI_PENALTY;
  }

  // Strong foreign filter — large penalty for non-English releases
  var hasEnglishMarker = language.ENGLISH_MARKERS.test(title);
  var hasForeignMarker = language.FOREIGN_MARKERS.test(title);

  if (hasForeignMarker && !hasEnglishMarker) {
    score += FOREIGN_PENALTY;
  }
  if (hasEnglishMarker && !hasForeignMarker) {
    score += ENGLISH_CONFIRMED_BONUS;
  }

  // ── Year mismatch ────────────────────────────────────────────
  if (requestYear) {
    var yearStr = String(requestYear);
    var titleHasYear = new RegExp('\\b' + yearStr + '\\b').test(title);
    var titleYearMatch = title.match(/\b(19|20)\d{2}\b/);
    if (titleHasYear) {
      score += YEAR_MATCH_BONUS;
    } else if (titleYearMatch && titleYearMatch[0] !== yearStr) {
      score += YEAR_MISMATCH_PENALTY;
    }
  }

  // ── Minimum seeders gate ──────────────────────────────────────
  if ((torrent.seeders || 0) < (prefs.minSeeders || DEFAULT_MIN_SEEDERS)) {
    score += MIN_SEEDERS_PENALTY;
  }

  return score;
}

/**
 * Select the best torrent from a list of search results.
 *
 * Filters by category, applies TV mode logic (full series, season pack, episode),
 * scores every candidate, and returns the highest-scoring torrent.
 *
 * @param {Array} results     - Array of torrent objects from Prowlarr/Jackett
 * @param {string} type       - 'movie' or 'tv'
 * @param {Object} prefs      - User scoring preferences
 * @param {string} [tvMode]   - 'full', 'season', 'episode', or 'latest'
 * @param {number} [tvSeason] - Season number for season/episode modes
 * @param {number|string} [requestYear] - Expected release year
 * @param {number} [tvEpisode] - Episode number for episode/latest modes
 * @returns {Object|null} Best torrent with _score property, or null
 */
function selectBestTorrent(results, type, prefs, tvMode, tvSeason, requestYear, tvEpisode) {
  if (!results || !results.length) return null;

  // ── Filter by Prowlarr/Jackett category ───────────────────────
  var filtered = results;
  if (type === 'movie') {
    var movieFiltered = results.filter(function (r) {
      return (r.categories || []).some(function (c) { return c >= CATEGORY_MOVIE.min && c < CATEGORY_MOVIE.max; }) ||
        !(r.categories || []).length;
    });
    if (movieFiltered.length) filtered = movieFiltered;
  } else if (type === 'tv') {
    var tvFiltered = results.filter(function (r) {
      return (r.categories || []).some(function (c) { return c >= CATEGORY_TV.min && c < CATEGORY_TV.max; }) ||
        !(r.categories || []).length;
    });
    if (tvFiltered.length) filtered = tvFiltered;
  }

  // ── TV mode filtering ─────────────────────────────────────────
  if (type === 'tv' && tvMode) {
    var sNum = tvSeason ? String(tvSeason).padStart(2, '0') : null;

    if (tvMode === 'full') {
      var fullPacks = filtered.filter(function (r) {
        return /complete|all.?seasons|s01.*s\d{2}|season.?1.*season.?\d/i.test(r.title) ||
          (r.size || 0) > FULL_PACK_MIN_BYTES;
      });
      if (fullPacks.length) filtered = fullPacks;

    } else if (tvMode === 'season' && sNum) {
      var seasonPacks = filtered.filter(function (r) {
        return new RegExp('S' + sNum + '(?!E\\d)', 'i').test(r.title) ||
          new RegExp('Season.?' + parseInt(sNum) + '(?!\\s*E)', 'i').test(r.title);
      });
      if (seasonPacks.length) filtered = seasonPacks;

    } else if ((tvMode === 'episode' || tvMode === 'latest') && sNum && tvEpisode) {
      var eNum = String(tvEpisode).padStart(2, '0');
      var episodeMatches = filtered.filter(function (r) {
        return new RegExp('S' + sNum + 'E' + eNum + '\\b', 'i').test(r.title);
      });
      if (episodeMatches.length) {
        filtered = episodeMatches;
      } else {
        // Don't silently grab a different episode — return null so fallback logic can try season packs
        return null;
      }
    }
  }

  // ── Score and sort ────────────────────────────────────────────
  var scored = filtered.map(function (r) {
    var s = Object.assign({}, r, { _score: scoreTorrent(r, prefs, type, requestYear) });
    return s;
  });
  scored.sort(function (a, b) { return b._score - a._score; });

  var best = scored[0];
  if (!best || best._score < 0) return null;
  return best;
}

module.exports = {
  scoreTorrent,
  selectBestTorrent,
};
