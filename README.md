# unislug

Zero-dependency slug generator that actually handles **Hindi, Gujarati, Bengali and Cyrillic**.

```js
import { slugify } from 'unislug';

slugify('हिंदी में स्लग');            // "hindi-men-slag"
slugify('ગુજરાત સમાચાર');            // "gujarat-samachar"
slugify('Crème Brûlée & Co');         // "creme-brulee-co"
slugify('ગુજરાત સમાચાર', { mode: 'keep' }); // "ગુજરાત-સમાચાર"  (native script kept)
```

## Why

Most slug libraries either drop non-Latin letters (you get an empty string) or
only cover a few Latin-script languages. `unislug` gives you two choices:

| Mode | Result for `ગુજરાત સમાચાર` | Use when |
|------|----------------------------|----------|
| `transliterate` (default) | `gujarat-samachar` | You want ASCII-only URLs |
| `keep` | `ગુજરાત-સમાચાર` | You want native-script URLs (good for local SEO) |

## Install

```bash
npm install unislug
```

Works with ESM and CommonJS (`require('unislug')`), ships TypeScript types, no dependencies.

## Options

```ts
slugify(input, {
  mode: 'transliterate',        // or 'keep'
  separator: '-',
  lowercase: true,
  maxLength: 60,                // cuts on a word boundary
  replacements: { '&': 'and', '₹': 'rupees' },
});
```

## Supported scripts

- **Devanagari (Hindi, Marathi, Sanskrit)**: full transliteration with conjuncts, matras, nukta and word-final schwa deletion (`कमल` → `kamal`)
- **Gujarati**: full transliteration (`વડોદરા` → `vadodara`)
- **Bengali**: full transliteration (`বাংলাদেশ` → `bangladesh`)
- **Latin**: diacritics removed, `ß`, `æ`, `ø`, `ł` etc. handled
- **Digits**: Devanagari, Gujarati and Bengali digits become `0-9`

## Notes

Transliteration is deliberately simple and URL-friendly, not a linguistic standard
like ISO 15919: long vowels are shortened (`आ` → `a`) so slugs stay readable.
PRs for more scripts (Tamil, Telugu, Gurmukhi, Kannada, Malayalam, Thai...) are welcome.

## License

MIT
