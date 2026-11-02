# wow.gg/developers — API facts (fetched 2026-11-02, verbatim extracts)

* Base URL: `https://fastapi-dev-bc7d.up.railway.app/api/public/v1/`
* Auth: "Anonymous, no key, GET only." No User-Agent/Origin requirement mentioned.
* Rate limit: "The limit is 60 requests per minute per IP." Remaining quota via
  `X-RateLimit-*` headers; over the limit "the API answers 429 with a Retry-After header".
* Endpoints documented:
  - OpenAPI 3.x schema: `.../api/public/v1/openapi.json` (for ChatGPT Actions / MCP / generators)
  - Interactive docs: `.../api/public/v1/docs`
  - Full dataset dumps without paging: `https://fastapi-dev-bc7d.up.railway.app/api/public/v1/dump/{dataset}.json`
* Coverage: "Mythic+, raid and PvP meta, leaderboards by specialization, talent trees
  of every expansion" plus "WoW: Forever auction house and professions".
  Site tools referenced: "Forever Auction House" (`/auction-house/forever`),
  "MoP Auction House", "WoW Token Price", profession guides.
* Per-response metadata: "Every response carries its source, the canonical wow.gg
  page URL and the update time." (the `canonical_url` field)
* License: CC BY 4.0 — "a link to the canonical URL of the source page (the
  canonical_url field in the response) is required."
* The page does NOT enumerate dataset slugs; the sync tool takes them from the
  public openapi.json (`/dump/...` paths) and filters `forever`, with `--dataset`
  as an override.
