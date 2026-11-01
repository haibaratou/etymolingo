# Vocabulary master origin columns

## Local category and tag management

The toolbar's category/tag button opens a separate dialog on `file://` and exact
loopback hosts only. Management code loads on first opening. The main dictionary
list and root explanation reader keep their own existing layout. Hosted public
URLs do not attach the button or load the editor helpers.

Management starts with an empty registry. Open an external canonical JSON when
needed; no private canonical, guard, dictionary or audit snapshot is bundled.
The current viewer's exact identity and meaning/POS provide import validation.
The reference taxonomy is the existing public `app/eigo-no-e/categories.py`
(20 categories, 63 subcategories); its spelling-based suggestions remain marked
as unverified. The eight reviewed semantic records remain read-only.

Edit one ordered `(word, roots, etymology_id)` identity at a time. Duplicate exact
identities cannot be edited. Empty arrays explicitly override classification with
none. Removing management and returning to reviewed/reference fallback is a
separate recovery operation. Browser drafts use a separate local storage key;
they are never described as a canonical/GitHub save.

Use **export patch JSON** and **import patch JSON** for the tested transfer path.
Canonical opening uses the standard file input, even when native file pickers
exist. Direct file writing is disabled. To incorporate exported patches or
recovery plans into the private canonical registry, use the private source's
`tools/vocabulary_classifications.py` validation workflow against the matching
generated dictionary; inspect/adopt its new candidate through the private source
workflow. Neither this viewer nor a download updates that source automatically.

The generic editor/reference/recovery helpers originate from source commit
`1dfd59ee5718b0d793c07c055e78fdfa91535170`. Local integration only adds mounting
hosts, a separate draft key, and the read/import-only file option. It does not run
the private builder or weaken its private-output destination guard.

Run the real-browser regression with installed Playwright and Chrome:

```powershell
$env:PLAYWRIGHT_CHANNEL='chrome'
node app/support/vocabulary-master/test-classification-manager.cjs
```

For a sparse review worktree, `VOCABULARY_RUNTIME_ROOT` can supply unchanged
public viewer dependencies from another local checkout. Optional
`VOCABULARY_CLASSIFICATION_REPORT` writes test screenshots, downloads and JSON
results; choose a private directory outside the public checkout. File viewing is
the default test route. `VOCABULARY_TEST_HTTP=1` additionally selects local HTTP
for the PC workflow when that network access is available. The remote-host gate
is tested as a unit without contacting an external site.

## Root explanation and list viewport

The root header keeps its title, language and affix controls. The read button
opens the full existing commentary, source disclosure and confirmed source link
in a native dialog. Its single scroll surface and sticky close button keep long
explanations readable without taking height from the dictionary list. Closing it
or pressing Escape returns to the read button. Narrow screens also use a compact
root sidebar and concept thumbnail. Very narrow or short screens show the fixed
filters in a horizontal strip, without adding a vertical scroll pane. The list's existing scroll surface, sticky
column headers and incremental row loading are unchanged.

Run the real-browser layout regression with an installed Playwright and browser
(it does not download either). For example, with Chrome:

```powershell
$env:PLAYWRIGHT_CHANNEL='chrome'
node app/support/vocabulary-master/test-root-layout.cjs
```

`PLAYWRIGHT_MODULE` can point to an installed Playwright package. Optional
`VOCABULARY_LAYOUT_REPORT` selects a directory for screenshots and JSON dimensions.
The test opens the actual local entrance and checks *weid-* at eight desktop and
narrow sizes, including 320px and 360px widths. It verifies minimum visible list
height, full commentary and source text, reader close/focus/scroll, fixed filters
and column headers, and row loading during real list scrolling. Expanded filter
panels are outside this explanation-layout regression.

## Search input and image-reference lookup

`app/shared/vocabulary-search.js` builds a read-only index after artwork overrides,
semantic binding and filename-collision handling. Ordinary English, Japanese,
kana, root-token and verified-scene search keeps its existing ranking. Repeated
requests for the same query reuse one result array. Verified scene text updates
the index once when its data arrives, rather than rebuilding scene keys for all
49,180 words on each keystroke.

The image lookup uses the same `wordImageURL` resolver as display. It includes the
active `pica`/`pic` image, explicit `etymology_art` references, and `art_senses`
detail images. `etymology_art` is explicit metadata and may name an image not yet
present or shown; lookup does not certify PNG existence. No spelling guessed
from an image filename is treated as a reference. `board.png` and
`board@rootslug.png` remain separate; every row referencing the exact image is
returned, including multiple senses or duplicate records.

Filename lookup accepts Windows paths, `file:///` strings, URL-encoded names,
HTTP URLs with another repository prefix, and version-query/fragment suffixes.
These strings are normalized locally; searching a URL does not open or fetch it.

Input values update immediately. Rendering is coalesced into the next animation
frame and always uses the latest value. IME composition waits for its committed
text; Enter flushes a pending render, and clearing cancels pending work. The
existing 700ms timer only updates navigation history. The initial table chunk is
100 rows; scrolling continues appending all remaining results.

Run the search logic, actual-handler DOM-stub and public-image-reference tests:

```powershell
node app/support/vocabulary-master/test-search.cjs
node app/support/vocabulary-master/test-origins.cjs
node app/support/vocabulary-master/profile-search.cjs
```

The task's before/after profiles, atomic-install backup and protected-input hashes
are under `work/search-performance-20261028/`. Profiles measure Node search and
actual row-HTML generation, not browser DOM/layout. The source exporter preserves
the added helper and markup and automatically refreshes its script URL hash.

## Origin columns

The entrance remains `app/vocabulary-master.html`. It reads two explicit columns,
`origin_families` and `origin_languages`, with Japanese display names. The old
`g` / `gs` data stays intact. The old mixed field does not supply a guessed
historical language when the new columns are unavailable.

`app/shared/etymology-origins.js` validates and applies
`app/data/generated-etymon/etymology-origins.js`. The latter is a generated
classic-script sidecar with a `globalThis.ETYMON_ETYMOLOGY_ORIGINS` assignment, so
the same data works over HTTP and when the entrance is opened through `file://`.
The payload has this structure:

```json
{
  "schema": 1,
  "languages": [{"id": "oe", "label": "古英語", "family": "ゲルマン"}],
  "entries": [{
    "w": "water", "p": ["wed-1"], "etymology_id": "",
    "before_ja": "水", "before_en": "water", "before_g": "G", "before_gs": ["G"],
    "origin_families": ["ゲルマン"], "origin_languages": ["古英語"]
  }]
}
```

The sample illustrates the schema, not a source record to import. All historical
classification decisions come from the canonical evidence catalogue. Public
sidecars must not include proprietary dictionary extracts.

Lexical identity is the ordered tuple `(w, p, etymology_id)`: **preserve the
complete order of `p`**. Reordering `p` conflates distinct records such as the two
origins of `desert`. Duplicate exact identities and changed meaning/origin
anchors fail closed. Only the two new columns are attached to runtime word rows.

The 語源 toolbar button opens two rows. The first row selects one or more
families, and the second row selects languages in those families. Choices in one
row combine with OR; the two rows combine with AND. Changing the family removes
incompatible selected languages so a hidden selection cannot exclude all
results. Clearing only one row keeps the other row's choices. The existing
overall reset clears both rows along with the other filters.

The table and personal-note CSV export expose both columns separately. The old
CSV `region` column remains for import compatibility; the appended columns do
not change saved personal notes or note-import behavior.

The small `data/generated-etymon/word-parts-supplement.js` classic sidecar also
exposes `ETYMON_WORD_PARTS_SUPPLEMENT={schema:1,entries:[...]}`. Each entry has
`w`, ordered `p`, `etymology_id`, required `before_g` / `before_ja` / `before_en`,
and the reviewed `parts` string. `bindWordParts` adds only empty values after
checking exact identity, all three anchors, and uniqueness of both the full
identity and the existing `(w,p.join('+'))` display key. Optional `before_gs`
is also checked when supplied. Existing nonblank values always keep priority.
This lets direct-file viewing show the 97 additions without rewriting its
compressed historical snapshot. Over HTTP, those additions already exist and
the same binder makes no changes.

Run the independent logic and actual-toolbar-handler integration tests:

```powershell
node app/support/vocabulary-master/test-origins.cjs
```

Check the current public payloads against both HTTP words and the unchanged
compressed fallback, recording input hashes and protected-field hashes:

```powershell
node app/support/vocabulary-master/verify-origin-data.cjs
```

The verifier writes `work/etymology-two-tier-20261028/ui/runtime-contract-report.json`.
Its `classification_complete` field is separate from technical validation: a
successful binding check does not claim that all entries have reviewed tags.

To create a disposable seven-word browser fixture from the current HTML:

```powershell
node app/support/vocabulary-master/test-origins.cjs --browser-fixture work/etymology-two-tier-20261028/ui/browser-test
```

The fixture uses the real runtime and shared helpers. It has ten self-checking
browser interactions and shows their result at the top after the page is ready.
Creating this file is not proof that a browser test passed. In this run, the
Node tests passed; browser navigation to the local file was denied by the browser
URL policy, and no layout or browser pass is claimed.

The one-time narrow HTML installer and its before/after hashes are retained in
`work/etymology-two-tier-20261028/ui/`. It replaces the file atomically, checks for
concurrent HTML edits immediately before replacement, and verifies that the
compressed dictionary and semantic snapshots were unchanged. It refuses a
second application. Future changes should edit the current entrance, keeping
the sidecar script dependencies in the canonical export/version path.

`word-parts-runtime-report.json` in that work directory records the real-data
Node validation: the embedded fallback's 2,171 existing parts were preserved,
97 matching additions brought it to 2,268, and current HTTP data kept all 2,268
values unchanged. This validates the data binding, not browser layout.
