# probe: wow.gg public API — 2026-11-02

Prompt: `prompts/wowgg-forever-market-v1.md` (wow-ops), step 1. Re-run with:

```
curl -D- 'https://fastapi-dev-bc7d.up.railway.app/api/public/v1/openapi.json'
curl -D- 'https://fastapi-dev-bc7d.up.railway.app/api/public/v1/dump/forever-auctions.json'
```

## What we saw

* Host is up: the app answers `200` on `/docs` and on the root `/openapi.json`
  (the site's own internal API spec — deliberately NOT saved here).
* Everything under the public router `/api/public/v1/*` (openapi.json, docs,
  dump/*.json, anything else) answers `403` with body `{"detail":"Forbidden"}` —
  see `403-openapi.json` + `403-headers.txt`. The `x-hikari-trace: hkg1.*` header
  shows the answer comes from the app's own middleware, not from railway infra.
* Same 403 from a second, unrelated egress IP (harness web fetch), and with a full
  browser header set (Chrome UA, Origin/Referer https://wow.gg, sec-fetch-*). So it
  is not a User-Agent/Origin problem we can fix; most likely the operator blocks
  cloud/datacenter IP ranges (CC BY 4.0 data, anonymous access, but residential-only).
* `https://wow.gg/developers` (fetched 2026-11-02) still advertises exactly this
  base URL with "Anonymous, no key, GET only", 60 req/min per IP (429 + Retry-After
  over the limit) and the datasets "Mythic+, raid and PvP meta, leaderboards,
  talent trees of every expansion plus WoW: Forever auction house and professions".
  Dataset slugs are NOT enumerated on the page; `tools/wowgg_sync.py` discovers
  them from the public openapi.json and filters for `forever` — see
  `docs/WOWGG_PROBE.md` for the assumptions.

## Files

* `403-openapi.json` — the exact body of the 403 (22 bytes).
* `403-headers.txt` — response headers of the 403.
* `developers-page-notes.md` — what https://wow.gg/developers documents about the API.

Nothing else was saved: the site's internal API spec and its /api/ endpoints are
out of scope per the prompt ("Do not read /api/ of wow.gg.com pages, only this
public API").
