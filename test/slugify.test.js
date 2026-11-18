import test from 'node:test';
import assert from 'node:assert/strict';
import { slugify } from '../src/index.js';

const eq = (input, expected, opts) => assert.equal(slugify(input, opts), expected);

test('latin & diacritics', () => {
  eq('  Hello,   World!  ', 'hello-world');
  eq('Crème Brûlée à la Straße', 'creme-brulee-a-la-strasse');
  eq("Don't stop", 'dont-stop');
});

test('hindi transliteration', () => {
  eq('हिंदी', 'hindi');
  eq('नमस्ते दुनिया', 'namaste-duniya');
  eq('भारत', 'bharat');
  eq('कमल', 'kamal');
  eq('संस्कृत', 'sanskrit');
  eq('ज़िंदगी', 'zindagi');
});

test('gujarati transliteration', () => {
  eq('ગુજરાત', 'gujarat');
  eq('વડોદરા', 'vadodara');
  eq('નમસ્તે', 'namaste');
  eq('અમદાવાદ', 'amadavad');
});

test('numbers in indic digits', () => {
  eq('२०२६ का बजट', '2026-ka-bajat');
  eq('২০২৬', '2026');
});

test('bengali transliteration', () => {
  eq('বাংলা', 'bangla');
  eq('বাংলাদেশ', 'bangladesh');
  eq('ঢাকা', 'dhaka');
  eq('নমস্কার', 'namaskar');
});

test('cyrillic', () => {
  eq('Привет мир', 'privet-mir');
});

test('keep mode preserves native script', () => {
  eq('हिंदी में स्लग', 'हिंदी-में-स्लग', { mode: 'keep' });
  eq('ગુજરાત સમાચાર!', 'ગુજરાત-સમાચાર', { mode: 'keep' });
  eq('বাংলা ভাষা', 'বাংলা-ভাষা', { mode: 'keep' });
});

test('options', () => {
  eq('Hello World', 'hello_world', { separator: '_' });
  eq('Hello World', 'Hello-World', { lowercase: false });
  eq('Tom & Jerry ₹50', 'tom-and-jerry-rupees-50', { replacements: { '&': 'and', '₹': 'rupees' } });
  eq('the quick brown fox jumps', 'the-quick-brown', { maxLength: 17 });
});

test('edge cases', () => {
  eq('', '');
  eq(null, '');
  eq('---', '');
  assert.throws(() => slugify('x', { mode: 'nope' }), TypeError);
});
