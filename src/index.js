// unislug — zero-dependency slugs for Hindi, Gujarati, Bengali, Cyrillic & Latin.

// ---------- Indic (Devanagari + Gujarati + Bengali) ----------
// Gujarati (U+0A80) and Bengali (U+0980) mirror Devanagari (U+0900) at a fixed
// offset, so we shift them into Devanagari and use a single table.
// Two Bengali-only sounds get private-use placeholders: ং (ng) and ৎ (t).
const BENGALI = [0x0980, 0x09ff, 0x80], GUJARATI = [0x0a80, 0x0aff, 0x180];
const BN_NG = '\uE000', BN_T = '\uE001';

const VOWELS = {
  'अ': 'a', 'आ': 'a', 'इ': 'i', 'ई': 'i', 'उ': 'u', 'ऊ': 'u', 'ऋ': 'ri',
  'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'ऑ': 'o', 'ऍ': 'e',
};
const MATRAS = {
  'ा': 'a', 'ि': 'i', 'ी': 'i', 'ु': 'u', 'ू': 'u', 'ृ': 'ri',
  'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ॉ': 'o', 'ॅ': 'e',
};
const CONSONANTS = {
  'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
  'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'n',
  'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
  'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
  'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
  'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', 'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h', 'ळ': 'l',
};
// consonant + nukta (़) variants
const NUKTA = { 'क': 'q', 'ख': 'kh', 'ग': 'g', 'ज': 'z', 'ड': 'r', 'ढ': 'rh', 'फ': 'f', 'य': 'y' };
const SIGNS = { 'ं': 'n', 'ँ': 'n', 'ः': 'h', [BN_NG]: 'ng', [BN_T]: 't' };
const VIRAMA = '्', NUKTA_MARK = '़';
const DIGIT_BASE_DEV = 0x0966;

function toDevanagari(ch) {
  const c = ch.codePointAt(0);
  if (c === 0x0982) return BN_NG;
  if (c === 0x09ce) return BN_T;
  for (const [from, to, offset] of [BENGALI, GUJARATI]) {
    if (c >= from && c <= to) return String.fromCodePoint(c - offset);
  }
  return ch;
}
const isIndic = (ch) => {
  const c = ch.codePointAt(0);
  return (c >= 0x0900 && c <= 0x097f) || ch === BN_NG || ch === BN_T;
};

function transliterateIndic(text) {
  const chars = Array.from(text).map(toDevanagari);
  let out = '';
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (CONSONANTS[ch]) {
      let sound = CONSONANTS[ch];
      let j = i + 1;
      if (chars[j] === NUKTA_MARK) { sound = NUKTA[ch] || sound; j++; }
      const next = chars[j];
      if (next === VIRAMA) { out += sound; i = j; }                       // conjunct: no vowel
      else if (next && MATRAS[next]) { out += sound + MATRAS[next]; i = j; }
      else if (!next || !isIndic(next) || next === ' ') { out += sound; i = j - 1; } // word-final schwa deletion
      else { out += sound + 'a'; i = j - 1; }                             // inherent "a"
    } else if (VOWELS[ch]) out += VOWELS[ch];
    else if (SIGNS[ch]) out += SIGNS[ch];
    else if (MATRAS[ch] || ch === VIRAMA || ch === NUKTA_MARK) continue;
    else {
      const c = ch.codePointAt(0);
      if (c >= DIGIT_BASE_DEV && c <= DIGIT_BASE_DEV + 9) out += String(c - DIGIT_BASE_DEV);
      else out += ch;
    }
  }
  return out;
}

// ---------- Cyrillic ----------
const CYRILLIC = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
  'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
  'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y',
  'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya', 'є': 'ye', 'і': 'i', 'ї': 'yi', 'ґ': 'g',
};

// ---------- Latin extras NFKD can't decompose ----------
const LATIN = { 'ß': 'ss', 'æ': 'ae', 'œ': 'oe', 'ø': 'o', 'đ': 'd', 'ð': 'd', 'þ': 'th', 'ł': 'l', 'ı': 'i' };

function transliterate(text) {
  const s = transliterateIndic(text.normalize('NFC'));
  let out = '';
  for (const ch of s) {
    const lower = ch.toLowerCase();
    out += CYRILLIC[lower] ?? LATIN[lower] ?? ch;
  }
  return out.normalize('NFKD').replace(/\p{M}+/gu, '');
}

// ---------- Public API ----------
const ZERO_WIDTH = /[\u200B-\u200D\u2060\uFEFF]/g;

/**
 * @param {string} input
 * @param {object} [options]
 * @param {'transliterate'|'keep'} [options.mode='transliterate']
 * @param {string}  [options.separator='-']
 * @param {boolean} [options.lowercase=true]
 * @param {number}  [options.maxLength]
 * @param {Record<string,string>} [options.replacements]  e.g. { '&': 'and', '₹': 'rupees' }
 */
export function slugify(input, options = {}) {
  const { mode = 'transliterate', separator = '-', lowercase = true, maxLength, replacements } = options;
  let s = String(input ?? '').replace(ZERO_WIDTH, '');

  if (replacements) {
    for (const [from, to] of Object.entries(replacements)) s = s.split(from).join(` ${to} `);
  }

  if (mode === 'keep') s = s.normalize('NFC');
  else if (mode === 'transliterate') s = transliterate(s);
  else throw new TypeError(`unislug: unknown mode "${mode}"`);

  if (lowercase) s = s.toLowerCase();

  const sep = separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  s = s
    .replace(/['’`]/g, '')                       // don't -> dont
    .replace(/[^\p{L}\p{N}\p{M}]+/gu, separator) // everything else -> separator
    .replace(new RegExp(`(?:${sep}){2,}`, 'g'), separator)
    .replace(new RegExp(`^(?:${sep})+|(?:${sep})+$`, 'g'), '');

  if (maxLength && s.length > maxLength) {
    s = s.slice(0, maxLength);
    const cut = s.lastIndexOf(separator);
    if (cut > maxLength * 0.5) s = s.slice(0, cut);        // cut on a word boundary when sensible
    s = s.replace(new RegExp(`(?:${sep})+$`), '');
  }
  return s;
}

export default slugify;
