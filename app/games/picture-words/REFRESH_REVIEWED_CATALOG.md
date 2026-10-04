# Refresh reviewed Picture Words

Run from a complete public-repository checkout after updating its generated dictionary, reviewed scenes and accepted PNGs:

```bat
app\games\picture-words\refresh_reviewed_catalog.cmd
app\games\picture-words\refresh_reviewed_catalog.cmd --check
```

Python 3 is required. The command checks that Python actually runs, trying `py -3`, `python`, `python3`, then the current user's bundled Codex Python runtime. A launcher without an installed Python is skipped. On other systems, run `python3 app/games/picture-words/refresh_reviewed_catalog.py` with the same options. No external packages or network access are required.

The unchanged `build_catalog.py` supplies normal word eligibility, readings, first-sense/image selection and stable IDs. The refresh filters those candidates to reviewed, exact bilingual scene bindings whose current canonical PNG bytes match both accepted hashes. Keep using the refresh command to generate the playable catalog; the older normal builder remains the candidate-selection component.

Outputs are `catalog.js`, `reviewed-catalog-report.json` and immutable `scene-assets/<art>@<sha256>.js` files. Each row contains its exact `sceneBinding`, a compact `reviewedScene`, and the relative `sceneAsset` path. Catalog metadata binds the raw words, scenes and artwork-index bytes. Lazy scripts register only one PNG payload under its SHA256; the runtime loads a pack on demand. Old unreferenced packs may remain for cached snapshots and are never automatically deleted.

The same command updates only the `catalog.js?v=` value in the current game HTML to the first 12 characters of the catalog's SHA256. Every other HTML byte is preserved, including newer UI edits. The script must occur exactly once; a missing or duplicate match stops the refresh before any output is written. The service worker revalidates its shell online, and this URL also refreshes catalog requests before a service worker controls the page. Offline behavior is unchanged.

Existing surviving IDs retain their previous catalog order. Newly eligible IDs append in normal-builder order. Removed rows do not cause other IDs to be renumbered. The report accounts for all candidate exclusions and reviewed scenes not admitted by ordinary selection rules. It contains no build timestamp, machine-specific path or generated image data.

`--check` regenerates everything in memory and fails if the catalog, report, HTML catalog query or any currently referenced pack is missing or differs. It writes nothing. A stale public manifest, duplicate binding or empty verified result also fails. Individual unreviewed, stale, corrupt or missing scene/image bindings are excluded with reasons. Check failures require inspecting the report and source assets; they do not authorize approving readings or changing dictionary meanings.

The repository’s narrow `.gitattributes` policy preserves LF for hash-bound generated JSON, index, catalog, report and pack files on Windows. If a pre-existing words/scenes/index input contains CRLF, the command stops before generating anything and names the affected file. Save that file with LF line endings while preserving its content, then retry. All generated output uses byte writes with explicit LF. The command does not change Git configuration or silently normalize input bytes. Regenerate outputs after accepted source changes, then publish the coherent dictionary, scenes, catalog and packs together. For HTTP, the runtime verifies current words/scenes manifest hashes, the actual index bytes and original PNG. For file/offline use, it verifies the lazy snapshot bytes before showing them.

Run producer tests with `python app/games/picture-words/test_refresh_reviewed_catalog.py` and `node --test app/games/picture-words/reviewed-catalog.test.cjs`. The browser loader, answer/description speech, UI and offline service-worker integration are separate runtime components.

Production tests derive expected membership and counts from the current canonical inputs, unchanged normal builder, generated metadata and exclusion report. Adding a qualifying reviewed description does not require editing test counts. A separate synthetic two-word fixture verifies that one newly reviewed, normally eligible description grows the catalog deterministically while preserving existing IDs, row data and order.

For sparse QA only, `--root`, `--output-dir`, `--previous-catalog`, `--html-output` and `--inventory` select isolated inputs and outputs. HTML defaults to `picture-words.html` beside the catalog output directory. An existing HTML destination supplies the current UI bytes; otherwise the command copies the input root's current game HTML and changes only its catalog query. An inventory is JSON `{ "schema":1, "entries":[{"path":"assets/word/example.png"}] }` from an exact observed repository inventory; every emitted PNG must still exist locally and pass both hashes. `PICTURE_WORDS_TEST_ROOT` and optional `PICTURE_WORDS_TEST_INVENTORY` supply matching paths to the test suite. Ordinary full checkouts need none of these options.
