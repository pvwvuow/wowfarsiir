# foreverchanges.pro — blocked (issue #235, quest-hunt v2, 2026-11-02)

The prompt's primary source stays unreachable for scripts:

- Plain request (curl, Firefox UA): `https://foreverchanges.pro/quest/79192`
  → **HTTP 403**, `server: cloudflare`, `cf-ray: a53d7a4ea8f004ec-HKG`,
  body = Cloudflare "Just a moment..." challenge page.
- Real browser session (headless Playwright): page stays on
  "Just a moment... / Performing security verification" with a Cloudflare
  Turnstile **"Verify you are human" checkbox** (interactive CAPTCHA).

`prompts/quest-hunt.md` forbids bypassing a CAPTCHA, so the hunt stopped here
per the prompt ("if still blocked, say so in the report and go on") and moved
to the open datasets + Wowhead classic fallback. No page of the site was
fetched; the 5,191-id set remains the open-source approximation built by
`tools/build_forever_quest_ids.py`.
