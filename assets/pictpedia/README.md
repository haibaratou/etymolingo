# Pictpedia artwork

Created 2026-10-04 with built-in ImageGen. Original reference:
`work/etymopedia/etymopedia_sample/references/invidious.png`.

- `hero-carnival.png`: 1536 × 1024 active hero, chaotic dictionary carnival with the two main characters and reference dragon, octopus, robot, and dinosaur. Built-in ImageGen prompt: a dense joyful carnival with the boy surfing a flying pencil, girl riding the dragon, octopus juggling, dinosaur carrying cake, breakdancing robot, and many whimsical dictionary scenes; preserve the reference character identities, warm thick outlines, no text.
- `welcome.png`: 1254 × 1254 transparent pair, welcoming / presenting.
- `thinking.png`: 1254 × 1254 transparent pair, thinking / curious.
- `celebrate.png`: 1254 × 1254 transparent pair, smiling / raised arms.

All three reusable character images have real alpha transparency (0–255). Keep the two characters' brown hair, blue shirt / brown shorts and yellow shirt / coral skirt, brown outlines, and warm palette consistent. Original reference and word assets remain untouched.

Generation prompt set: preserve the exact two reference children, their clothes, hair, proportions, warm flat palette and thick brown outlines; show full bodies with no text. Welcome: boy waves and girl presents with open arms. Thinking: hands near chins, curious expressions. Celebrate: delighted smiles with raised arms. The superseded hero.png is retained as an earlier variation; hero-carnival.png is the active image.

Website: `app/eigo-no-e.html`. Direct-file viewing works with the validated snapshot. `games/picture-words.html?word=<encoded word ID>` opens the existing Pictlingo game at that exact entry and continues through its regular progression. Legacy `#/p/` links redirect to that game. There is no separate puzzle implementation. Desktop clicks request a separate popup; browser preferences may use a new tab. HTTP continues validating the current illustration before play.

Validation: `node --test app/eigo-no-e/search.test.cjs app/eigo-no-e/catalog-validation.test.cjs`; `node app/eigo-no-e/navigation.browser.cjs` (Playwright + installed Edge). Browser regression covers each category card's empty corner, subcategory links, exact-word popup, mother completion/save/next, homograph and English-only entries, invalid IDs, and 320/390 px widths on file and HTTP.

Run node app/games/picture-words/build-dictionary-links.cjs after regenerating the dictionary snapshot. The generated links retain exact IDs, senses, source hashes and image hashes. Missing kana entries use the existing game in English only. Immutable image packs enable file:// use; the normal daily pool is unchanged unless an entry is explicitly requested.
