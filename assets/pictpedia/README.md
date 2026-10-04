# Pictpedia artwork

Created 2026-10-04 with built-in ImageGen. Original reference:
`work/etymopedia/etymopedia_sample/references/invidious.png`.

- `hero.png`: 1536 × 1024 main artwork. References also include `assets/word/book.png` and `assets/word/car.png`.
- `welcome.png`: 1254 × 1254 transparent pair, welcoming / presenting.
- `thinking.png`: 1254 × 1254 transparent pair, thinking / curious.
- `celebrate.png`: 1254 × 1254 transparent pair, smiling / raised arms.

All three reusable character images have real alpha transparency (0–255). Keep the two characters' brown hair, blue shirt / brown shorts and yellow shirt / coral skirt, brown outlines, and warm palette consistent. Original reference and word assets remain untouched.

Generation prompt set: preserve the exact two reference children, their clothes, hair, proportions, warm flat palette and thick brown outlines; show full bodies with no text. Welcome: boy waves and girl presents with open arms. Thinking: hands near chins, curious expressions. Celebrate: delighted smiles with raised arms. Hero: two children explore a giant open picture book, surrounded by dictionary motifs including the reference book and red car, on a warm cream background, no lettering.

Website: `app/eigo-no-e.html`. Direct-file viewing works with the validated snapshot. `#/p/<encoded word ID>` opens the exact dictionary entry as an English letter-order puzzle. Desktop clicks request a separate popup; browser preferences may use a new tab. HTTP continues validating the current illustration before play.

Validation: `node --test app/eigo-no-e/search.test.cjs app/eigo-no-e/catalog-validation.test.cjs`; `node app/eigo-no-e/navigation.browser.cjs` (Playwright + installed Edge). Browser regression covers each category card's empty corner, subcategory links, exact-word popup, repeated letters, solve/reset/undo, and 320/390 px widths on file and HTTP.
