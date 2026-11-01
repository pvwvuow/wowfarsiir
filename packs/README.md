# packs

- `out/`: packs made by `python3 tools/fa_missing.py export-all` (or `fa_pack.py export ...`). Keep them committed: import checks against them.
- `in/`: files returned by the translator, named `fa-out-<pack>.json`.
- `done/`: one marker per imported pack (written by `fa_missing.py import`).
- `index.json`: list of all packs with status open / returned / done; the ops dashboard reads it.

See docs/TRANSLATION_PACKS_V2.md.
