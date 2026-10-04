# Image issue scopes

`generated-image-issues.json` keeps the original `issues` and `resolutions`
records. A review that narrows an issue to a caption hold is appended to the
`scope_reviews` array; it must not rewrite the issue or masquerade as a repair
resolution. Existing repair resolutions retain their exact behavior.

An accepted scope record has this shape (the hash strings below are placeholders):

```json
{
  "schema": 1,
  "status": "reviewed",
  "w": "cat",
  "p": [],
  "art": "cat",
  "imageSha256": "<current PNG SHA-256>",
  "senseSha256": "<current canonical first-sense SHA-256>",
  "targetIssueSha256": "<exact original issue SHA-256>",
  "scope": "caption_only",
  "blocksPlay": false,
  "reviewed_at": "2026-10-04T17:00:00Z",
  "reason": "Why the exact image remains suitable for play",
  "evidence": {
    "source": "Review artifact or source identifier",
    "reviewer": "Independent reviewer identifier",
    "observation": "Item-specific evidence from the current pixels",
    "imageInspected": true
  }
}
```

The issue fingerprint is SHA-256 of UTF-8 JSON with sorted keys, no ASCII
escaping, and compact separators, as implemented by `issue_digest`. It covers
the complete original issue, including codes, detail, status and bindings.
All evidence strings and the reason must be nonempty; the review timestamp
must contain a time and timezone. An unreviewed proposal is not a scope grant.

The last appended record targeting an issue fingerprint supersedes its earlier
scope reviews. A blocking review (`scope: "play_blocking", blocksPlay: true`),
or a stale or malformed last review, leaves the issue play-blocking. There is
no fallback to an earlier permission. Each current issue must independently
pass review; one non-blocking issue cannot override another active hard hold.

The current headword, ordered roots, artwork identity, image SHA-256 and
first-sense SHA-256 must all match the scope review. Any changed issue,
image, meaning, root or artwork requires fresh explicit review. Ordinary valid
captions and replacement image bytes cannot clear an active hard hold.

The common producer projects every active issue with `scope`, `blocksPlay`,
`issueSha256`, current `imageSha256` and `senseSha256`. A validated caption-only
issue additionally carries the accepted `scopeReview`. Both runtimes require
the complete matching projection; legacy or unspecified issues fail closed.
These are build-time provenance checks, not cryptographic signatures or a
substitute for independently inspecting the image before appending a review.

All active issues continue to hold descriptions empty with `ttsAllowed: false`.
No `reviewedScene`, `sceneAsset`, or reviewed-image pack is emitted for these
rows. Rows stay in both catalogs, and ordinary answer-format and reading gates
still apply independently to English and Japanese play.

Focused checks (no generated output writes):

```sh
python app/games/picture-words/test_refresh_reviewed_catalog.py
node --test app/games/picture-words/reviewed-scenes.test.cjs app/eigo-no-e/all-images.test.cjs app/eigo-no-e/catalog-validation.test.cjs
```
