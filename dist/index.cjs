var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var index_exports = {};
__export(index_exports, {
  default: () => index_default,
  slugify: () => slugify
});
module.exports = __toCommonJS(index_exports);
const BENGALI = [2432, 2559, 128], GUJARATI = [2688, 2815, 384];
const BN_NG = "\uE000", BN_T = "\uE001";
const VOWELS = {
  "\u0905": "a",
  "\u0906": "a",
  "\u0907": "i",
  "\u0908": "i",
  "\u0909": "u",
  "\u090A": "u",
  "\u090B": "ri",
  "\u090F": "e",
  "\u0910": "ai",
  "\u0913": "o",
  "\u0914": "au",
  "\u0911": "o",
  "\u090D": "e"
};
const MATRAS = {
  "\u093E": "a",
  "\u093F": "i",
  "\u0940": "i",
  "\u0941": "u",
  "\u0942": "u",
  "\u0943": "ri",
  "\u0947": "e",
  "\u0948": "ai",
  "\u094B": "o",
  "\u094C": "au",
  "\u0949": "o",
  "\u0945": "e"
};
const CONSONANTS = {
  "\u0915": "k",
  "\u0916": "kh",
  "\u0917": "g",
  "\u0918": "gh",
  "\u0919": "ng",
  "\u091A": "ch",
  "\u091B": "chh",
  "\u091C": "j",
  "\u091D": "jh",
  "\u091E": "n",
  "\u091F": "t",
  "\u0920": "th",
  "\u0921": "d",
  "\u0922": "dh",
  "\u0923": "n",
  "\u0924": "t",
  "\u0925": "th",
  "\u0926": "d",
  "\u0927": "dh",
  "\u0928": "n",
  "\u092A": "p",
  "\u092B": "ph",
  "\u092C": "b",
  "\u092D": "bh",
  "\u092E": "m",
  "\u092F": "y",
  "\u0930": "r",
  "\u0932": "l",
  "\u0935": "v",
  "\u0936": "sh",
  "\u0937": "sh",
  "\u0938": "s",
  "\u0939": "h",
  "\u0933": "l"
};
const NUKTA = { "\u0915": "q", "\u0916": "kh", "\u0917": "g", "\u091C": "z", "\u0921": "r", "\u0922": "rh", "\u092B": "f", "\u092F": "y" };
const SIGNS = { "\u0902": "n", "\u0901": "n", "\u0903": "h", [BN_NG]: "ng", [BN_T]: "t" };
const VIRAMA = "\u094D", NUKTA_MARK = "\u093C";
const DIGIT_BASE_DEV = 2406;
function toDevanagari(ch) {
  const c = ch.codePointAt(0);
  if (c === 2434) return BN_NG;
  if (c === 2510) return BN_T;
  for (const [from, to, offset] of [BENGALI, GUJARATI]) {
    if (c >= from && c <= to) return String.fromCodePoint(c - offset);
  }
  return ch;
}
const isIndic = (ch) => {
  const c = ch.codePointAt(0);
  return c >= 2304 && c <= 2431 || ch === BN_NG || ch === BN_T;
};
function transliterateIndic(text) {
  const chars = Array.from(text).map(toDevanagari);
  let out = "";
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (CONSONANTS[ch]) {
      let sound = CONSONANTS[ch];
      let j = i + 1;
      if (chars[j] === NUKTA_MARK) {
        sound = NUKTA[ch] || sound;
        j++;
      }
      const next = chars[j];
      if (next === VIRAMA) {
        out += sound;
        i = j;
      } else if (next && MATRAS[next]) {
        out += sound + MATRAS[next];
        i = j;
      } else if (!next || !isIndic(next) || next === " ") {
        out += sound;
        i = j - 1;
      } else {
        out += sound + "a";
        i = j - 1;
      }
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
const CYRILLIC = {
  "\u0430": "a",
  "\u0431": "b",
  "\u0432": "v",
  "\u0433": "g",
  "\u0434": "d",
  "\u0435": "e",
  "\u0451": "yo",
  "\u0436": "zh",
  "\u0437": "z",
  "\u0438": "i",
  "\u0439": "y",
  "\u043A": "k",
  "\u043B": "l",
  "\u043C": "m",
  "\u043D": "n",
  "\u043E": "o",
  "\u043F": "p",
  "\u0440": "r",
  "\u0441": "s",
  "\u0442": "t",
  "\u0443": "u",
  "\u0444": "f",
  "\u0445": "kh",
  "\u0446": "ts",
  "\u0447": "ch",
  "\u0448": "sh",
  "\u0449": "shch",
  "\u044A": "",
  "\u044B": "y",
  "\u044C": "",
  "\u044D": "e",
  "\u044E": "yu",
  "\u044F": "ya",
  "\u0454": "ye",
  "\u0456": "i",
  "\u0457": "yi",
  "\u0491": "g"
};
const LATIN = { "\xDF": "ss", "\xE6": "ae", "\u0153": "oe", "\xF8": "o", "\u0111": "d", "\xF0": "d", "\xFE": "th", "\u0142": "l", "\u0131": "i" };
function transliterate(text) {
  const s = transliterateIndic(text.normalize("NFC"));
  let out = "";
  for (const ch of s) {
    const lower = ch.toLowerCase();
    out += CYRILLIC[lower] ?? LATIN[lower] ?? ch;
  }
  return out.normalize("NFKD").replace(/\p{M}+/gu, "");
}
const ZERO_WIDTH = /[\u200B-\u200D\u2060\uFEFF]/g;
function slugify(input, options = {}) {
  const { mode = "transliterate", separator = "-", lowercase = true, maxLength, replacements } = options;
  let s = String(input ?? "").replace(ZERO_WIDTH, "");
  if (replacements) {
    for (const [from, to] of Object.entries(replacements)) s = s.split(from).join(` ${to} `);
  }
  if (mode === "keep") s = s.normalize("NFC");
  else if (mode === "transliterate") s = transliterate(s);
  else throw new TypeError(`unislug: unknown mode "${mode}"`);
  if (lowercase) s = s.toLowerCase();
  const sep = separator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  s = s.replace(/['’`]/g, "").replace(/[^\p{L}\p{N}\p{M}]+/gu, separator).replace(new RegExp(`(?:${sep}){2,}`, "g"), separator).replace(new RegExp(`^(?:${sep})+|(?:${sep})+$`, "g"), "");
  if (maxLength && s.length > maxLength) {
    s = s.slice(0, maxLength);
    const cut = s.lastIndexOf(separator);
    if (cut > maxLength * 0.5) s = s.slice(0, cut);
    s = s.replace(new RegExp(`(?:${sep})+$`), "");
  }
  return s;
}
var index_default = slugify;
