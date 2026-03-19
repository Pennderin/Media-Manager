// ═══════════════════════════════════════════════════════════════════
// Unified language detection for Media Manager ecosystem
// Consolidated from:
//   - companion/server.js lines 400-435 (foreignRelease regex)
//   - server/src/handlers/smart-grab.js lines 395-454 (FOREIGN_MARKERS)
//   - server/src/handlers/pipeline.js lines 430-486 (filename markers)
//   - server/src/handlers/files.js lines 13-21 (foreignSubIndicators)
// ═══════════════════════════════════════════════════════════════════

/**
 * Comprehensive foreign-language markers compiled into a single regex.
 *
 * Matches torrent titles that indicate non-English content:
 *   - Explicit language labels (FRENCH, GERMAN, RUSSIAN, etc.)
 *   - Dubbing/localization markers (Lektor PL, Napisy PL, VFF, VFQ, etc.)
 *   - Foreign-language title prefixes (La, Le, El, Der, Das, Die followed by "/")
 *   - ISO 639 short codes in word-boundary context (kor, jpn, chi, etc.)
 *   - HC (hardcoded subtitles, usually non-English)
 */
const FOREIGN_MARKERS = new RegExp(
  [
    // Dubbing / localization markers
    '\\bLektor\\s*(?:PL|CZ|HU)\\b',
    '\\bNapisy\\s*PL\\b',
    '\\bTRUEFRENCH\\b',
    '\\bFRENCH\\b',
    '\\bLATINO\\b',
    '\\bGerman\\s*DL\\b',
    // Full language names (case-insensitive via flag)
    '\\biTALiAN\\b',
    '\\bRUSSIAN\\b',
    '\\bPOLISH\\b',
    '\\bCZECH\\b',
    '\\bHINDI\\b',
    '\\bTAMiL\\b',
    '\\bTELUGU\\b',
    '\\bKOREAN\\b',
    '\\bCHINESE\\b',
    '\\bJAPANESE\\b',
    '\\bARABIC\\b',
    '\\bTURKISH\\b',
    // French video markers
    '\\bVFF\\b',
    '\\bVFQ\\b',
    // Hardcoded subs (usually foreign)
    '\\bHC\\b',
    // Short language codes at word boundary or end-of-string
    '\\bITA(?:\\s|$)',
    '\\bRUS(?:\\s|$)',
    // Foreign-language title prefixes (e.g. "La Cosa / ...")
    '^(?:Slepa|La|Le|El|Der|Das|Die)\\s\\w+\\s\\/',
  ].join('|'),
  'i'
);

/**
 * ISO 639 short language codes that appear in torrent titles.
 */
const LANGUAGE_CODES = /\b(kor|jpn|chi|hin|fra|deu|ita|spa|rus|ara|tur|tha)\b/i;

/**
 * Pattern matching English-language markers in a torrent title.
 */
const ENGLISH_MARKERS = /\bENG(?:lish)?\b|\bEnG\b|\bDUAL\b/i;

/**
 * Dubbed/multi-audio without explicit English tag.
 */
const DUBBED_MULTI = /dubbed|multi/i;
const DUBBED_ENGLISH_EXCLUSION = /english/i;

/**
 * Foreign subtitle filename indicators — ISO codes and full names
 * used inside subtitle filenames (e.g. ".chi.", ".spanish", etc.).
 *
 * Consolidated from:
 *   - server/src/handlers/files.js foreignSubIndicators
 *   - server/src/handlers/pipeline.js hasForeignFilenameMarker()
 */
const FOREIGN_SUBTITLE_INDICATORS = [
  // Full language names
  'arabic', 'chinese', 'czech', 'danish', 'dutch', 'finnish', 'french', 'german',
  'greek', 'hebrew', 'hindi', 'hungarian', 'indonesian', 'italian', 'japanese',
  'korean', 'malay', 'norwegian', 'persian', 'polish', 'portuguese', 'romanian',
  'russian', 'spanish', 'swedish', 'tagalog', 'thai', 'turkish', 'ukrainian',
  'vietnamese', 'bengali', 'croatian', 'serbian', 'slovenian', 'bulgarian',
  // ISO 639 dot-delimited codes
  '.chi.', '.chs.', '.cht.', '.spa.', '.fre.', '.fra.', '.ger.', '.deu.',
  '.ita.', '.jpn.', '.kor.', '.ara.', '.rus.', '.hin.', '.tha.', '.vie.',
  '.pol.', '.tur.', '.dut.', '.nld.', '.swe.', '.por.', '.dan.', '.fin.',
  '.nor.', '.ces.', '.hun.', '.rom.', '.heb.', '.ind.', '.msa.', '.tgl.',
  '.ukr.', '.hrv.', '.srp.', '.slv.', '.bul.', '.ell.', '.ben.', '.fas.',
  '.zho.', '.zht.',
];

/**
 * CJK Unicode range detector for filenames that contain Asian characters.
 */
const CJK_RANGE = /[\u3000-\u9fff\uac00-\ud7af\uff00-\uffef]/;

// ── Public API ───────────────────────────────────────────────────

/**
 * Determine whether a torrent title indicates a foreign (non-English) release.
 *
 * Checks for explicit foreign markers, ISO language codes, dubbed/multi tags,
 * and CJK characters. Returns false if there is also an English marker present
 * (e.g. "DUAL" or "ENG").
 *
 * @param {string} title - Torrent title
 * @returns {boolean}
 */
function isForeignRelease(title) {
  if (!title) return false;

  // If there's an explicit English marker, it's not purely foreign
  if (ENGLISH_MARKERS.test(title)) return false;

  // Check the main foreign markers regex
  if (FOREIGN_MARKERS.test(title)) return true;

  // Check ISO language codes
  if (LANGUAGE_CODES.test(title)) return true;

  // Check dubbed/multi without English
  if (DUBBED_MULTI.test(title) && !DUBBED_ENGLISH_EXCLUSION.test(title)) return true;

  // Check for CJK characters in the title
  if (CJK_RANGE.test(title)) return true;

  return false;
}

/**
 * Determine whether a torrent title is likely English content.
 *
 * Returns true if the title contains an explicit English marker, or if
 * it contains no foreign markers at all (i.e. presumed English by default).
 *
 * @param {string} title - Torrent title
 * @returns {boolean}
 */
function isLikelyEnglish(title) {
  if (!title) return false;

  // Explicit English markers are a strong signal
  if (ENGLISH_MARKERS.test(title)) return true;

  // No foreign markers present — assume English
  return !isForeignRelease(title);
}

/**
 * Check whether a subtitle filename contains foreign-language indicators.
 *
 * Scans for ISO 639 codes (e.g. ".chi.", ".fra.") and full language names
 * (e.g. "spanish", "japanese") within the filename.
 *
 * @param {string} filename - Subtitle filename (not full path)
 * @returns {boolean}
 */
function hasForeignFilenameMarker(filename) {
  if (!filename) return false;
  var lower = filename.toLowerCase();
  for (var i = 0; i < FOREIGN_SUBTITLE_INDICATORS.length; i++) {
    if (lower.indexOf(FOREIGN_SUBTITLE_INDICATORS[i]) !== -1) return true;
  }
  return false;
}

/**
 * Check whether a subtitle filename contains an English-language indicator.
 *
 * Looks for "english", ".eng.", ".en." and similar patterns.
 *
 * @param {string} filename - Subtitle filename (not full path)
 * @returns {boolean}
 */
function hasEnglishFilenameMarker(filename) {
  if (!filename) return false;
  var lower = filename.toLowerCase();
  return lower.indexOf('english') !== -1 ||
    /[\._-]eng[\._-]/.test(lower) ||
    /[\._-]en[\._-]/.test(lower) ||
    /[\._-]eng\./.test(lower) ||
    /[\._-]en\./.test(lower) ||
    lower.indexOf('.eng.') !== -1 ||
    lower.indexOf('.en.') !== -1;
}

module.exports = {
  FOREIGN_MARKERS,
  LANGUAGE_CODES,
  ENGLISH_MARKERS,
  FOREIGN_SUBTITLE_INDICATORS,
  CJK_RANGE,
  isForeignRelease,
  isLikelyEnglish,
  hasForeignFilenameMarker,
  hasEnglishFilenameMarker,
};
