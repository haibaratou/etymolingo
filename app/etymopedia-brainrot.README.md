# Etymopedia root creature candidate review

`etymopedia-brainrot.html` is a separate, local candidate-review gallery for the 12 root families in `app/data/roots.csv`. It preserves the original Etymopedia page and artwork. English word tags, expandable anatomy descriptions, etymology source links, concept documents, and 512 × 512 transparent PNG downloads accompany each candidate. Candidate totals are calculated from the manifest; adding another candidate does not require changing the page.

## Human review rules

1. Each root may have several structurally different candidates. The initial preview is `v001`, unless the reviewer has previously chosen a different preview in this browser. **A preview selection is not an adoption decision.**
2. No candidate is automatically adopted. Neither manifest `status`, array position, nor a saved preview preference becomes an adoption. Only explicit reviewer actions or an explicitly imported review file set review decisions.
3. Reviewer buttons are `未選択`, `採用`, `修正`, `保留`, and `不採用`, stored as `unselected`, `adopt`, `revise`, `hold`, and `reject`. Optional comments are kept per root and candidate. If multiple candidates of the same root are marked `採用`, the page warns the reviewer; it does not silently choose a winner or change another decision.
4. Thumbnails and previous/next controls change the main preview. The comparison dialog shows all candidates of the same root together; on phones it uses one column. Facial style and anatomy can be evaluated independently in comments.
5. Review decisions and preview preferences persist in browser `localStorage` under `wildwordopia.root-candidate-review.v1`. Storage is local to that browser and origin. If storage is unavailable, JSON export remains available.
6. `チェック結果を保存` downloads a JSON file with schema `wildwordopia-root-candidate-review`, version `1`, and `reviews` entries containing `rootId`, `candidateId`, filenames, name, decision, comment, timestamps, and human review history. All candidates, including unselected ones, are exported.
7. `チェック結果を読み込む` merges a saved review JSON into the current candidates. It updates only matching root/candidate pairs, retains checks for candidates absent from the file, and never rewrites the manifest, PNGs, or concept documents.

The original-art switch is retained. While original artwork is shown, candidate decision controls are hidden to prevent judging the new candidate against the wrong preview. Word-family information and asset links remain available.

## Data and assets

- New artwork: `assets/chara/brainrot/`.
- Manifest: `assets/chara/brainrot/characters.json`, with a top-level `characters` array.
- Local-file fallback: `assets/chara/brainrot/characters.js` assigns the same object to `window.ETYMOPEDIA_BRAINROT`. This avoids relying on a fetch request when the page is opened through `file://`.
- Each character is a root family with `id` and optional baseline fields, plus a `candidates` array. Each candidate has `candidateId`, `file`, `conceptFile`, `name`, `root`, `meaningEn`, `motifs`, and `sources`. Optional `status` and `reviewHistory` remain metadata; they do not automatically approve the candidate. The page also accepts the previous single-character format as one `v001` candidate.
- Each motif has `word`, `part`, and optional `partial` / `note`. The gallery accepts source URLs or objects with `url` and `title`.
- Asset names are based on the canonical root IDs, never the character name: e.g. `root-bha2-v002.png` and `root-bha2-v002.md`. Names and design rationale belong in the concept document and manifest.
- Canonical stems from `roots.csv`: `root-kaput`, `root-ane`, `root-bha2`, `root-gwei`, `root-oino`, `root-reg`, `root-weid`, `root-ye`, `root-mori`, `root-men1`, `root-do`, `root-genu1`.
- Original artwork paths and root order are copied from the small `app/data/roots.csv` inventory. The gallery does not read the packed original HTML or `app/data/pie/`.

## Etymology corrections for this artwork set

- **add** is excluded from the `*dō-` creature. Its primary root is `*dhe-`; a visual plus sign should not be taught as a member of the give family.
- **anemone** is excluded from the `*anə-` creature because its proposed origin is contested. A wind association is not sufficient evidence for the flower's inclusion.
- **memory** is excluded from the `*men-(1)` creature. It belongs to the `*sm-er-` family.

These are artwork and teaching-selection corrections, not changes to the source dictionaries. Compound words are identified as partial connections where appropriate; an entire compound need not come from a single root. The manifest holds the exact selected words and supporting sources.

This comparison is a local artifact until separately published.

## Facial variety

Facial style is judged for each creature rather than applied uniformly. Candidate designs may mix anime-inspired faces, natural animal faces, minimal graphic faces, and uncanny brainrot expressions. Reviewers can request a face from one candidate and anatomy from another in comments. The same-root word anatomy and recognizable vocabulary remain the common design principles.

PNG candidates are 512 by 512 RGBA with actual transparent alpha. Local sample copies and same-stem concept documents are under `work/wildwordopia/sample/`, alongside generation prompts and revision provenance. The previously created `bhel-(2)` and `ped-` samples are separate from these twelve Etymopedia families and do not affect the gallery's counts.

No files are uploaded by this workflow. The manifest and source dictionaries are read-only from the page; review JSON is a separate human decision record. The existing Etymopedia page remains unchanged.

## Rebuilding the local candidate library

Run `work/wildwordopia/build_candidate_library.py` after normalized candidate PNGs and `generation-candidates-*.json` are saved. It performs file copies and UTF-8 text work only; it does not process images, touch dictionaries, upload files, or run Git.

- The initial 12-family manifest is frozen at `sample/_meta/seed-manifest.json` and is never replaced by a rebuild.
- The baseline 14 samples are copied to canonical `root-…-v001.png` filenames. Existing canonical copies are reused; old name-based PNGs can live in `_archive/name-based/` afterward.
- `sample/candidates.json` includes 14 root families, including the earlier bhel-(2) and ped samples. The gallery manifest includes only the original 12 Etymopedia families. Candidate totals come from existing PNGs and generation metadata.
- All manifest entries remain `candidate`; face-only user comments are recorded with `scope: face` and never converted into whole-character adoption.
- Every PNG is paired with a same-stem concept Markdown document. Existing concept documents are preserved to protect human notes. Full creation/face-edit prompts are quoted as historical production records, including superseded uniform-dot-face instructions.
- Selected source files are archived under `sample/_sources/` with canonical filenames. If the original cannot be identified, a saved 512 PNG is kept and marked as a fallback. Exact original creation times remain unknown; filesystem timestamps are not presented as creation times.
- Gallery PNG/MD mirrors are copied from the primary sample library. Any earlier different gallery mirror is backed up under `sample/_meta/gallery-backups/` before synchronization.
