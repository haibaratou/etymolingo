# Reviewed prototype build outputs

The development character review entrance is `app/character-manager.html`.
Both review modules run in that document using files under support; the retired
`app/compare.html` and `app/wildwordopia-history.html` are not dependencies and
must not be recreated. No new launcher is needed. The limited UI
installer and verification commands are documented in
[`support/character-manager/README.md`](support/character-manager/README.md).
This integration does not require art, dictionary, gallery or history generation.

After registering new character images, run
`node app/support/character-manager/build-latest-site-images.cjs`.
This refreshes the portable latest-image defaults read by `wild-wordopia.html`
in every browser, with stable PNG content revisions. Explicit shared choices
remain authoritative; unmarked old browser records do not hide current formal
images. New explicit browser previews carry their own selection time. Use
`--accept-choice-changes` after intentionally registering different candidate IDs
or paths; `--check` never writes. It does not modify browser reviews or artwork.

All product entrance HTML files stay directly in `app/`; runtime support and current
builders live in `app/support/`. Apps and games follow the same layout; never recreate
`app/games/`. Use the current commands below. Dated work patches and old repair
snapshots record historical algorithms and layouts; they are not update entry points.


Run these limited builds from a public checkout after its published generated data
and PNG assets have been refreshed. They read published files only and do not read
`app/data/pie/` or modify canonical meanings, PNGs or captions.

```sh
node app/eigo-no-e/build-caption-snapshot.cjs
node app/support/picture-words/build-selection.cjs
```

Both commands work from any directory. `--root <public-checkout>` selects the
checkout; `--report-dir <directory>` selects audit output. The default reports go
under `work/build-reports/`. Node.js is required. Existing production scripts also
call these automatically after successful non-check canonical output writes:

- `python app/eigo-no-e/build.py` refreshes the Pictpedia caption sidecar.
- `python app/support/picture-words/build_catalog.py` refreshes the custom-level/reviewed-image
  selection when writing the normal `catalog.js` target.
- The current production entry point
  `python app/support/picture-words/refresh_reviewed_catalog.py` also refreshes both
  sidecars after its normal output writes. `--game-only` refreshes only selection;
  custom game output directories do not rewrite the deployed sidecars.

`--check` on the Python builders remains read-only. A custom Picture Words output
path does not rewrite the deployed selection. No full source export is performed
by either Node command. The scripts have no dependency on dated work directories
or the earlier before/ backup files.

Pictpedia's sidecar checks composite identity, first-sense digest, image SHA256 and
Git blob SHA, artwork mapping, reviewed status and explicit holds. It rehashes the
current PNGs before preparing the file-mode snapshot. HTTP still fetches current
published captions and verifies a displayed image at runtime. If the canonical word
hash differs from `eigo-no-e/data.js`, first rebuild that public catalogue; do not
bypass the mismatch.

Picture Words selects current reviewed English/Japanese image descriptions with
matching identity and hashes, visual AI score >=50, and the mother's exact stored
difficulty (`mother_weblio_first_v1`). The internal scale remains 1–10; every
canonical dictionary and puzzle displays level / 2 as 0.5–5 stars. It rehashes
every selected PNG. Missing levels or scores stay excluded. The visual score is
AI judgement, not measured answer accuracy.

Generate `custom-learning-levels.json` in the mother source repository and the
compressed public sidecar before rebuilding selection. The historical filenames
and `ETYMON_CUSTOM_LEARNING_LEVELS` global now carry this one canonical policy.
From the source repository run:

```sh
python tools/build_custom_learning_levels.py --words <public>/app/data/generated-etymon/words.json --app-target <public> --report-dir <new-private-report-directory>
```

This limited command reads the explicit exported word snapshot, the mother's
`weblio_words_extended.csv` (`status=ok` ratings), CEFR-J data and the versioned
fixed profile. It does not fetch data or modify dictionary meanings, r or official
levels. Weblio is the primary indicator; missing ratings use the easiest matching
CEFR-J band, then edited r. Existing thresholds and the Weblio-to-ten-level map
are unchanged. The payload records the input SHA256s, policy fingerprint and
per-entry `web`, `raw`, `official`, `basis`, `confidence` and `note` evidence.
See the source repository's `app/data/custom-learning-notes.md` for limitations.
These are provisional hints, not raw frequencies, official CEFR sublevels or
measured learning difficulty. Every empty level is disabled dynamically; level
ten is available when it has eligible questions.

Explorer, Etymopedia, Pictlingo Dictionary and the puzzle consume the same
checked sidecar. Missing, damaged, old-policy or mismatched sense/POS/origin
records stay unclassified. Etymopedia's current-data projection must also match
the sidecar's word-snapshot SHA. Refresh its limited projection after exported
words change; do not bypass that guard. Selection and its entrance cache token
are regenerated by `node app/support/picture-words/build-selection.cjs` after the
current reviewed catalog is ready. Existing save keys and word/image IDs remain
unchanged.

The integrated delivery archive overlays an existing public checkout. It includes
the previous Picture Words changes and their script/style/data dependencies plus
the Pictpedia change, so the earlier change-only ZIP need not be applied separately.
The public base's existing PNG and thumbnail assets are intentionally not duplicated.
Its manifest records included files and required unchanged published-input hashes.
This local work does not publish or push anything.


## Japanese dictionary direct-file data

`app/japanese-dictionary.html` keeps HTTP JSON loading and uses generated classic-script
sidecars only for direct `file://` viewing. After receiving updated public Japanese
JSON, run `python app/support/ja-dict/build_local_data.py`, then the same command
with `--check`. The canonical `app/data/ja/ja_index.json` and `ja_det/*.json` are
read-only inputs; output is `app/data/ja/file/`. No source export, dictionary audit,
fetch, or meaning changes are part of this command. The source-only
`app/build_ja_dict.py` is not present in this distribution checkout.

`tools/build_pages.py` regenerates these sidecars from staged JSON automatically.
The loader, JSON and sidecars must accompany the entrance HTML. See
[`support/ja-dict/README.md`](support/ja-dict/README.md) for update and test commands,
including the distinction between unit tests and actual browser file-mode checks.
