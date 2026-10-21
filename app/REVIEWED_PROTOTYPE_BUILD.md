# Reviewed prototype build outputs

Run these limited builds from a public checkout after its published generated data
and PNG assets have been refreshed. They read published files only and do not read
`app/data/pie/` or modify canonical meanings, PNGs or captions.

```sh
node app/eigo-no-e/build-caption-snapshot.cjs
node app/games/picture-words/build-selection.cjs
```

Both commands work from any directory. `--root <public-checkout>` selects the
checkout; `--report-dir <directory>` selects audit output. The default reports go
under `work/build-reports/`. Node.js is required. Existing production scripts also
call these automatically after successful non-check canonical output writes:

- `python app/eigo-no-e/build.py` refreshes the Pictpedia caption sidecar.
- `python app/games/picture-words/build_catalog.py` refreshes the custom-level/reviewed-image
  selection when writing the normal `catalog.js` target.
- The current production entry point
  `python app/games/picture-words/refresh_reviewed_catalog.py` also refreshes both
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
matching identity and hashes, visual AI score >=50, and an exact independently
stored custom learning level (1–10). Official CEFR-J remains a separate reference.
It rehashes every selected PNG. Missing custom levels or scores stay excluded.
The visual score is AI judgement, not measured answer accuracy.

Generate `custom-learning-levels.json` in the source repository and the compressed
public sidecar before rebuilding selection. Run its dedicated
`tools/build_custom_learning_levels.py --words <public>/app/data/generated-etymon/words.json
--app-target <public> --report-dir <new-report-directory>`. This limited command
reads only the specified public word snapshot, official CEFR sidecar and fixed
profile; no full export is needed. Source changes fail closed unless explicitly
accepted; thresholds never recalibrate automatically. See the source repository's
`app/data/custom-learning-notes.md` for fixed boundaries, source limitations and
unclassified reasons. Custom levels are provisional heuristics using CEFR and
edited auxiliary r, not raw frequency, official CEFR sublevels or measured learning
difficulty. Level ten currently has no eligible questions and is disabled.

The integrated delivery archive overlays an existing public checkout. It includes
the previous Picture Words changes and their script/style/data dependencies plus
the Pictpedia change, so the earlier change-only ZIP need not be applied separately.
The public base's existing PNG and thumbnail assets are intentionally not duplicated.
Its manifest records included files and required unchanged published-input hashes.
This local work does not publish or push anything.
