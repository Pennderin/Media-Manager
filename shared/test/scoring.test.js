import { describe, it, expect } from 'vitest';
const { scoreTorrent, selectBestTorrent } = require('../src/scoring');

// Default preferences used across most tests
const defaultPrefs = { quality: '1080p', maxSizeGB: 4, maxSizeGBTV: 60, minSeeders: 5 };

function makeTorrent(overrides) {
  return Object.assign(
    { title: 'Movie.2024.1080p.BluRay.x264-GROUP', seeders: 50, size: 2 * 1073741824, indexer: '1337x', categories: [] },
    overrides
  );
}

describe('scoreTorrent', function () {
  it('4K scores higher than 1080p when preferred quality is 4k', function () {
    var prefs = Object.assign({}, defaultPrefs, { quality: '4k' });
    var score4k = scoreTorrent(makeTorrent({ title: 'Movie.2024.2160p.UHD.BluRay' }), prefs, 'movie');
    var score1080 = scoreTorrent(makeTorrent({ title: 'Movie.2024.1080p.BluRay' }), prefs, 'movie');
    expect(score4k).toBeGreaterThan(score1080);
  });

  it('1080p scores higher than 4K when preferred quality is 1080p', function () {
    var score1080 = scoreTorrent(makeTorrent({ title: 'Movie.2024.1080p.BluRay' }), defaultPrefs, 'movie');
    var score4k = scoreTorrent(makeTorrent({ title: 'Movie.2024.2160p.BluRay' }), defaultPrefs, 'movie');
    expect(score1080).toBeGreaterThan(score4k);
  });

  it('foreign releases get heavily penalized', function () {
    var english = scoreTorrent(makeTorrent({ title: 'Movie.2024.1080p.BluRay.x264' }), defaultPrefs, 'movie');
    var french = scoreTorrent(makeTorrent({ title: 'Movie.2024.TRUEFRENCH.1080p.BluRay' }), defaultPrefs, 'movie');
    expect(english - french).toBeGreaterThanOrEqual(400);
  });

  it('seeder bonus is logarithmic (diminishing returns)', function () {
    // Use values below the seeder cap (50) to show diminishing returns
    var score5 = scoreTorrent(makeTorrent({ seeders: 5 }), defaultPrefs, 'movie');
    var score20 = scoreTorrent(makeTorrent({ seeders: 20 }), defaultPrefs, 'movie');
    var score50 = scoreTorrent(makeTorrent({ seeders: 50 }), defaultPrefs, 'movie');
    // Each increase should yield a smaller marginal bonus
    var diff1 = score20 - score5;   // 5 -> 20 seeders
    var diff2 = score50 - score20;  // 20 -> 50 seeders
    expect(diff1).toBeGreaterThan(0);
    expect(diff2).toBeGreaterThan(0);
    expect(diff1).toBeGreaterThan(diff2); // diminishing returns
  });

  it('year mismatches get penalized', function () {
    var correct = scoreTorrent(makeTorrent({ title: 'Scrubs.2001.1080p.BluRay' }), defaultPrefs, 'movie', 2001);
    var wrong = scoreTorrent(makeTorrent({ title: 'Scrubs.2026.1080p.BluRay' }), defaultPrefs, 'movie', 2001);
    expect(correct).toBeGreaterThan(wrong);
    expect(correct - wrong).toBeGreaterThanOrEqual(500);
  });

  it('year match gives bonus', function () {
    var withYear = scoreTorrent(makeTorrent({ title: 'Movie.2024.1080p.BluRay' }), defaultPrefs, 'movie', 2024);
    var noYear = scoreTorrent(makeTorrent({ title: 'Movie.1080p.BluRay' }), defaultPrefs, 'movie', 2024);
    expect(withYear).toBeGreaterThan(noYear);
  });

  it('CAM/TS sources score very low', function () {
    var bluray = scoreTorrent(makeTorrent({ title: 'Movie.2024.1080p.BluRay' }), defaultPrefs, 'movie');
    var cam = scoreTorrent(makeTorrent({ title: 'Movie.2024.CAM.1080p' }), defaultPrefs, 'movie');
    expect(bluray).toBeGreaterThan(cam);
    expect(bluray - cam).toBeGreaterThanOrEqual(100);
  });

  it('telesync is also penalized', function () {
    var webrip = scoreTorrent(makeTorrent({ title: 'Movie.2024.1080p.WEBRip' }), defaultPrefs, 'movie');
    var ts = scoreTorrent(makeTorrent({ title: 'Movie.2024.1080p.HDTS' }), defaultPrefs, 'movie');
    expect(webrip).toBeGreaterThan(ts);
  });

  it('BluRay scores higher than WEBRip', function () {
    var bluray = scoreTorrent(makeTorrent({ title: 'Movie.2024.1080p.BluRay' }), defaultPrefs, 'movie');
    var webrip = scoreTorrent(makeTorrent({ title: 'Movie.2024.1080p.WEBRip' }), defaultPrefs, 'movie');
    expect(bluray).toBeGreaterThan(webrip);
  });

  it('torrents below minSeeders get penalized', function () {
    var healthy = scoreTorrent(makeTorrent({ seeders: 50 }), defaultPrefs, 'movie');
    var dead = scoreTorrent(makeTorrent({ seeders: 1 }), defaultPrefs, 'movie');
    expect(healthy).toBeGreaterThan(dead);
    expect(healthy - dead).toBeGreaterThanOrEqual(150);
  });

  it('TV season packs get a bonus', function () {
    var pack = scoreTorrent(makeTorrent({ title: 'Show.S01.Complete.1080p' }), defaultPrefs, 'tv');
    var episode = scoreTorrent(makeTorrent({ title: 'Show.S01E01.1080p' }), defaultPrefs, 'tv');
    expect(pack).toBeGreaterThan(episode);
  });

  it('trusted release groups get a bonus', function () {
    var trusted = scoreTorrent(makeTorrent({ title: 'Movie.2024.1080p.BluRay-SPARKS' }), defaultPrefs, 'movie');
    var unknown = scoreTorrent(makeTorrent({ title: 'Movie.2024.1080p.BluRay-UNKNOWN' }), defaultPrefs, 'movie');
    expect(trusted).toBeGreaterThan(unknown);
  });

  it('oversized movies get penalized', function () {
    var normal = scoreTorrent(makeTorrent({ size: 2 * 1073741824 }), defaultPrefs, 'movie');
    var huge = scoreTorrent(makeTorrent({ size: 10 * 1073741824 }), defaultPrefs, 'movie');
    expect(normal).toBeGreaterThan(huge);
  });

  it('suspiciously small movies get penalized', function () {
    var normal = scoreTorrent(makeTorrent({ size: 2 * 1073741824 }), defaultPrefs, 'movie');
    var tiny = scoreTorrent(makeTorrent({ size: 0.1 * 1073741824 }), defaultPrefs, 'movie');
    expect(normal).toBeGreaterThan(tiny);
  });

  it('English-marked torrents get a small bonus when no foreign markers', function () {
    var eng = scoreTorrent(makeTorrent({ title: 'Movie.2024.1080p.ENG.BluRay' }), defaultPrefs, 'movie');
    var plain = scoreTorrent(makeTorrent({ title: 'Movie.2024.1080p.BluRay' }), defaultPrefs, 'movie');
    expect(eng).toBeGreaterThanOrEqual(plain);
  });
});

describe('selectBestTorrent', function () {
  it('picks the highest-scoring torrent', function () {
    var results = [
      makeTorrent({ title: 'Movie.2024.CAM', seeders: 5, size: 1 * 1073741824 }),
      makeTorrent({ title: 'Movie.2024.1080p.BluRay', seeders: 100, size: 2 * 1073741824 }),
      makeTorrent({ title: 'Movie.2024.720p.WEBRip', seeders: 30, size: 1 * 1073741824 }),
    ];
    var best = selectBestTorrent(results, 'movie', defaultPrefs);
    expect(best.title).toBe('Movie.2024.1080p.BluRay');
  });

  it('returns null for empty results', function () {
    expect(selectBestTorrent([], 'movie', defaultPrefs)).toBeNull();
    expect(selectBestTorrent(null, 'movie', defaultPrefs)).toBeNull();
  });

  it('filters by movie category when available', function () {
    var results = [
      makeTorrent({ title: 'Movie.2024.1080p.BluRay', categories: [2030], seeders: 50 }),
      makeTorrent({ title: 'Show.S01.1080p.BluRay', categories: [5040], seeders: 100 }),
    ];
    var best = selectBestTorrent(results, 'movie', defaultPrefs);
    expect(best.title).toContain('Movie');
  });

  it('filters by TV category when available', function () {
    var results = [
      makeTorrent({ title: 'Movie.2024.1080p.BluRay', categories: [2030], seeders: 100 }),
      makeTorrent({ title: 'Show.S01.1080p.BluRay', categories: [5040], seeders: 50 }),
    ];
    var best = selectBestTorrent(results, 'tv', defaultPrefs);
    expect(best.title).toContain('Show');
  });

  it('prefers season packs in season tvMode', function () {
    var results = [
      makeTorrent({ title: 'Show.S01E01.1080p.WEBRip', seeders: 80, size: 1 * 1073741824 }),
      makeTorrent({ title: 'Show.S01.1080p.BluRay', seeders: 50, size: 10 * 1073741824 }),
    ];
    var best = selectBestTorrent(results, 'tv', defaultPrefs, 'season', 1);
    expect(best.title).toContain('S01');
    expect(best.title).not.toContain('E01');
  });

  it('prefers specific episode in episode tvMode', function () {
    var results = [
      makeTorrent({ title: 'Show.S02.Complete.1080p', seeders: 100, size: 20 * 1073741824 }),
      makeTorrent({ title: 'Show.S02E05.1080p.WEBRip', seeders: 50, size: 1 * 1073741824 }),
    ];
    var best = selectBestTorrent(results, 'tv', defaultPrefs, 'episode', 2, null, 5);
    expect(best.title).toContain('S02E05');
  });

  it('returns null when all scores are negative', function () {
    var results = [
      makeTorrent({ title: 'Movie.TRUEFRENCH.CAM', seeders: 0, size: 0.05 * 1073741824 }),
    ];
    var best = selectBestTorrent(results, 'movie', defaultPrefs);
    expect(best).toBeNull();
  });

  it('falls back to all results when category filter removes everything', function () {
    var results = [
      makeTorrent({ title: 'Movie.2024.1080p.BluRay', categories: [9999], seeders: 50 }),
    ];
    var best = selectBestTorrent(results, 'movie', defaultPrefs);
    expect(best).not.toBeNull();
    expect(best.title).toContain('Movie');
  });

  it('uses requestYear for disambiguation', function () {
    var results = [
      makeTorrent({ title: 'Scrubs.2001.1080p.BluRay', seeders: 50, size: 2 * 1073741824 }),
      makeTorrent({ title: 'Scrubs.2026.1080p.BluRay', seeders: 50, size: 2 * 1073741824 }),
    ];
    var best = selectBestTorrent(results, 'tv', defaultPrefs, null, null, 2001);
    expect(best.title).toContain('2001');
  });
});
