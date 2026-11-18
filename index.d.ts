export interface SlugifyOptions {
  /** 'transliterate' converts to Latin letters (default). 'keep' preserves native script. */
  mode?: 'transliterate' | 'keep';
  /** Word separator. Default: '-' */
  separator?: string;
  /** Lowercase the result. Default: true */
  lowercase?: boolean;
  /** Max length; cuts on a word boundary when possible. */
  maxLength?: number;
  /** Text replacements applied first, e.g. { '&': 'and', '₹': 'rupees' } */
  replacements?: Record<string, string>;
}

export function slugify(input: string, options?: SlugifyOptions): string;
export default slugify;
