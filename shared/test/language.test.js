import { describe, it, expect } from 'vitest';
const {
  isForeignRelease,
  isLikelyEnglish,
  hasForeignFilenameMarker,
  hasEnglishFilenameMarker,
  FOREIGN_MARKERS,
  CJK_RANGE,
} = require('../src/language');

describe('isForeignRelease', function () {
  it('detects TRUEFRENCH releases', function () {
    expect(isForeignRelease('Movie.2024.TRUEFRENCH.1080p.BluRay')).toBe(true);
  });

  it('detects FRENCH releases', function () {
    expect(isForeignRelease('Movie.2024.FRENCH.1080p.WEBRip')).toBe(true);
  });

  it('detects Lektor PL releases', function () {
    expect(isForeignRelease('Movie.2024.Lektor PL.720p')).toBe(true);
  });

  it('detects Lektor CZ releases', function () {
    expect(isForeignRelease('Movie.2024.Lektor CZ.1080p')).toBe(true);
  });

  it('detects Napisy PL releases', function () {
    expect(isForeignRelease('Movie.2024.Napisy PL.1080p')).toBe(true);
  });

  it('detects German DL releases', function () {
    expect(isForeignRelease('Movie.2024.German DL.1080p')).toBe(true);
  });

  it('detects iTALiAN releases', function () {
    expect(isForeignRelease('Movie.2024.iTALiAN.1080p')).toBe(true);
  });

  it('detects RUSSIAN releases', function () {
    expect(isForeignRelease('Movie.2024.RUSSIAN.1080p')).toBe(true);
  });

  it('detects KOREAN releases', function () {
    expect(isForeignRelease('Movie.2024.KOREAN.1080p')).toBe(true);
  });

  it('detects JAPANESE releases', function () {
    expect(isForeignRelease('Movie.2024.JAPANESE.1080p')).toBe(true);
  });

  it('detects CHINESE releases', function () {
    expect(isForeignRelease('Movie.2024.CHINESE.1080p')).toBe(true);
  });

  it('detects ARABIC releases', function () {
    expect(isForeignRelease('Movie.2024.ARABIC.1080p')).toBe(true);
  });

  it('detects TURKISH releases', function () {
    expect(isForeignRelease('Movie.2024.TURKISH.1080p')).toBe(true);
  });

  it('detects VFF (French video) releases', function () {
    expect(isForeignRelease('Movie.2024.VFF.1080p')).toBe(true);
  });

  it('detects VFQ releases', function () {
    expect(isForeignRelease('Movie.2024.VFQ.1080p')).toBe(true);
  });

  it('detects HINDI releases', function () {
    expect(isForeignRelease('Movie.2024.HINDI.1080p')).toBe(true);
  });

  it('detects TAMiL releases', function () {
    expect(isForeignRelease('Movie.2024.TAMiL.1080p')).toBe(true);
  });

  it('detects LATINO releases', function () {
    expect(isForeignRelease('Movie.2024.LATINO.1080p')).toBe(true);
  });

  it('detects dubbed without English marker', function () {
    expect(isForeignRelease('Movie.2024.1080p.dubbed')).toBe(true);
  });

  it('detects multi without English marker', function () {
    expect(isForeignRelease('Movie.2024.1080p.multi')).toBe(true);
  });

  it('does NOT flag standard English releases', function () {
    expect(isForeignRelease('Movie.2024.1080p.BluRay.x264-GROUP')).toBe(false);
  });

  it('does NOT flag releases with ENG marker', function () {
    expect(isForeignRelease('Movie.2024.ENG.1080p.BluRay')).toBe(false);
  });

  it('does NOT flag releases with English marker', function () {
    expect(isForeignRelease('Movie.2024.English.1080p.BluRay')).toBe(false);
  });

  it('does NOT flag DUAL audio releases (presumed to include English)', function () {
    expect(isForeignRelease('Movie.2024.DUAL.1080p.BluRay')).toBe(false);
  });

  it('does NOT flag dubbed release with English marker', function () {
    expect(isForeignRelease('Movie.2024.dubbed.english.1080p')).toBe(false);
  });

  it('handles CJK character detection', function () {
    expect(isForeignRelease('Movie Title in Japanese: \u6620\u753B\u306E\u540D\u524D')).toBe(true);
  });

  it('handles Korean characters', function () {
    expect(isForeignRelease('\uC601\uD654 Movie 2024')).toBe(true);
  });

  it('returns false for empty/null input', function () {
    expect(isForeignRelease('')).toBe(false);
    expect(isForeignRelease(null)).toBe(false);
    expect(isForeignRelease(undefined)).toBe(false);
  });

  it('detects foreign title prefixes like "La Cosa / ..."', function () {
    expect(isForeignRelease('La Cosa / The Thing')).toBe(true);
    expect(isForeignRelease('El Secreto / The Secret')).toBe(true);
    expect(isForeignRelease('Der Untergang / Downfall')).toBe(true);
  });

  it('detects HC (hardcoded subs) as foreign', function () {
    expect(isForeignRelease('Movie.2024.HC.1080p')).toBe(true);
  });

  it('detects ISO language codes like kor, jpn, etc.', function () {
    expect(isForeignRelease('Movie.2024.1080p.kor')).toBe(true);
    expect(isForeignRelease('Movie.2024.1080p.jpn')).toBe(true);
    expect(isForeignRelease('Movie.2024.1080p.fra')).toBe(true);
  });
});

describe('isLikelyEnglish', function () {
  it('returns true for standard English releases', function () {
    expect(isLikelyEnglish('Movie.2024.1080p.BluRay.x264-GROUP')).toBe(true);
  });

  it('returns true for releases with explicit ENG marker', function () {
    expect(isLikelyEnglish('Movie.2024.ENG.1080p')).toBe(true);
  });

  it('returns false for TRUEFRENCH releases', function () {
    expect(isLikelyEnglish('Movie.2024.TRUEFRENCH.1080p')).toBe(false);
  });

  it('returns false for Lektor PL releases', function () {
    expect(isLikelyEnglish('Movie.2024.Lektor PL.1080p')).toBe(false);
  });

  it('returns false for CJK titles', function () {
    expect(isLikelyEnglish('\u6620\u753B\u306E\u540D\u524D 2024')).toBe(false);
  });

  it('returns false for empty input', function () {
    expect(isLikelyEnglish('')).toBe(false);
    expect(isLikelyEnglish(null)).toBe(false);
  });

  it('returns true for DUAL (presumed English included)', function () {
    expect(isLikelyEnglish('Movie.2024.DUAL.1080p.BluRay')).toBe(true);
  });
});

describe('hasForeignFilenameMarker', function () {
  it('detects .chi. in subtitle filename', function () {
    expect(hasForeignFilenameMarker('movie.chi.srt')).toBe(true);
  });

  it('detects .spa. in subtitle filename', function () {
    expect(hasForeignFilenameMarker('movie.spa.srt')).toBe(true);
  });

  it('detects full language name "spanish"', function () {
    expect(hasForeignFilenameMarker('movie.spanish.srt')).toBe(true);
  });

  it('detects "japanese" in filename', function () {
    expect(hasForeignFilenameMarker('movie.japanese.srt')).toBe(true);
  });

  it('detects .fra. in filename', function () {
    expect(hasForeignFilenameMarker('subtitle.fra.srt')).toBe(true);
  });

  it('does NOT flag English subtitles', function () {
    expect(hasForeignFilenameMarker('movie.eng.srt')).toBe(false);
  });

  it('does NOT flag plain filenames', function () {
    expect(hasForeignFilenameMarker('movie.srt')).toBe(false);
  });

  it('returns false for null/empty', function () {
    expect(hasForeignFilenameMarker('')).toBe(false);
    expect(hasForeignFilenameMarker(null)).toBe(false);
  });
});

describe('hasEnglishFilenameMarker', function () {
  it('detects "english" in filename', function () {
    expect(hasEnglishFilenameMarker('movie.english.srt')).toBe(true);
  });

  it('detects .eng. in filename', function () {
    expect(hasEnglishFilenameMarker('movie.eng.srt')).toBe(true);
  });

  it('detects .en. in filename', function () {
    expect(hasEnglishFilenameMarker('movie.en.srt')).toBe(true);
  });

  it('detects _eng. in filename', function () {
    expect(hasEnglishFilenameMarker('movie_eng.srt')).toBe(true);
  });

  it('does NOT flag foreign subtitles', function () {
    expect(hasEnglishFilenameMarker('movie.spa.srt')).toBe(false);
  });

  it('does NOT flag plain filenames', function () {
    expect(hasEnglishFilenameMarker('movie.srt')).toBe(false);
  });

  it('returns false for null/empty', function () {
    expect(hasEnglishFilenameMarker('')).toBe(false);
    expect(hasEnglishFilenameMarker(null)).toBe(false);
  });
});

describe('FOREIGN_MARKERS regex', function () {
  it('is a valid RegExp', function () {
    expect(FOREIGN_MARKERS).toBeInstanceOf(RegExp);
  });

  it('matches TRUEFRENCH', function () {
    expect(FOREIGN_MARKERS.test('Something TRUEFRENCH 1080p')).toBe(true);
  });

  it('does not match plain English text', function () {
    expect(FOREIGN_MARKERS.test('The.Matrix.1999.1080p.BluRay')).toBe(false);
  });
});

describe('CJK_RANGE regex', function () {
  it('matches Chinese characters', function () {
    expect(CJK_RANGE.test('\u4F60\u597D')).toBe(true);
  });

  it('matches Japanese characters', function () {
    expect(CJK_RANGE.test('\u3053\u3093\u306B\u3061\u306F')).toBe(true);
  });

  it('matches Korean characters', function () {
    expect(CJK_RANGE.test('\uC548\uB155\uD558\uC138\uC694')).toBe(true);
  });

  it('does not match Latin characters', function () {
    expect(CJK_RANGE.test('Hello World')).toBe(false);
  });
});
