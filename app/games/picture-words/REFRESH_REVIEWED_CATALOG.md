# Refresh all generated images

The historical command name remains compatible with existing shortcuts:

```bat
app\games\picture-words\refresh_reviewed_catalog.cmd
app\games\picture-words\refresh_reviewed_catalog.cmd --check
```

Run in a complete public checkout. Both Picture Words and Pictpedia are rebuilt from the same current canonical words, scene sidecar, protected artwork index and actual `assets/word/*.png` bytes. The default command refreshes both applications, optimized reviewed thumbnails and their HTML data cache tokens. `--game-only` is available for isolated game tests. The interpreter fallback order remains `py -3`, `python`, `python3`, then the current user's bundled Codex Python. Python3 and Pillow are required for a normal combined rebuild; missing Pillow stops with an actionable error before outputs are written. No network or private source repository is needed.

## Inclusion and honest missing information

Every observed PNG appears once in both browse catalogs. Exact canonical ownership is resolved independently from descriptions, date, part of speech, rarity, English case and Japanese-reading readiness. Protected exceptional aliases are preserved. A default image is never reused for conflicting homographs. Unresolved files remain visible as `画像の対応確認中`, without a fabricated headword or meaning. Alternate and immutable-copy images are visible as separate image records; word counts do not include them.

A reviewed description requires the exact current canonical first-sense digest and both PNG hashes. Missing, stale or held descriptions are empty data fields with an explicit status. The UI displays `解説未作成`; it never substitutes the dictionary definition or sends an empty/fallback narration utterance. Captions are spoken only after solving, in the selected language. Word-pronunciation controls remain separate.

Each language has its own `availability` object. English answer-format constraints and Japanese reading constraints do not hide the word from the dictionary. Candidate or needs-review readings are not approved automatically. Known image/sense problems are hash-bound in `app/data/generated-image-issues.json` and remain browsable with a reason. Confirmed correspondence problems block play until explicitly resolved. An exact reviewed caption-only scope record can allow play while the description remains held, empty and non-narratable; a missing, stale or malformed scope record never grants that exception. A changed image does not inherit an obsolete caption. Historical date metadata is descriptive, never an inclusion gate, and is never derived from filesystem mtime.

## Stable identities, outputs and offline use

The original save key and IDs remain stable. `app/data/generated-image-legacy-ids.json` preserves existing verified exact answers/IDs; legacy IDs without safe canonical ownership remain image/history records. Current rows are not deduplicated by spelling, so homographs remain distinct. Exact-ID links never silently select a different word when an entry is unknown or unavailable in that language.

Outputs include `catalog.js`, `reviewed-catalog-report.json`, Pictpedia `data.js` and `build-manifest.json`, reviewed hash-bound `scene-assets/<art>@<sha256>.js` packs and optimized thumbnails. Other images use lazy exact original PNG paths. Neither catalog embeds PNG/base64 payloads. HTTP play verifies actual PNG bytes. Under `file://`, reviewed entries use lazy verified image packs; captionless originals load by exact relative path and carry no false caption-review claim. Old packs and thumbnails are not deleted automatically.

Only the existing data/catalog query token in each current HTML file is replaced. Other user interface bytes are preserved, including concurrent local changes. `--check` regenerates in memory and writes nothing; any stale/missing current output fails. The combined command builds both applications before writing outputs. An empty but valid inventory is supported gracefully by the runtimes. A malformed PNG, conflicting protected binding or stale canonical manifest stops the build rather than inventing a replacement.

Hash-bound input JSON/index files must retain LF. CRLF inputs are rejected instead of silently normalized. Do not use the legacy `build_catalog.py` alone to replace the modern catalog; it is retained only for published historical filename/ID evidence. The portable current ownership resolver is `app/data/generated_image_resolver.py` and the shared producer is `app/data/build_generated_image_catalog.py`.

Tests:

```text
python app/data/test_generated_image_resolver.py
python app/games/picture-words/test_refresh_reviewed_catalog.py
node --test app/games/picture-words/*.test.cjs
python app/eigo-no-e/test_build.py
node --test app/eigo-no-e/*.test.cjs
```

The tests derive live membership from the inventory and metadata, not a release count. They cover captionless inclusion, exact ownership, image tampering, stale scenes, unavailable languages, single-letter answers, unknown requests, stable saves, empty inventories and lazy loading. `--root`, `--output-dir`, `--html-output` and `--previous-catalog` support isolated QA. `--inventory` remains a compatibility argument, but a complete actual PNG directory is authoritative under the all-images policy.

## Existing dictionary-link command

The user-added `node app/games/picture-words/build-dictionary-links.cjs [--check]` remains available. It now produces a tiny lazy view of the current exact bound catalog, never copied rows or a bypass of per-language availability. The combined Python refresh updates/verifies the same constant view and exact cross-app identities/provenance without introducing a Node requirement for Windows refresh. Existing direct-link files and old snapshot packs remain preserved; URL requests cannot inject their old readings or images into the current catalog.
