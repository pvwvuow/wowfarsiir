# NOTICE — QuestieDB-derived data in this repository

> خلاصهٔ فارسی: بخش‌هایی از دادهٔ «همیشه» (Forever) این سایت از QuestieDB-Forever گرفته شده است.
> آن بخش‌ها طبق مجوز GPLv3 بازنشر می‌شوند؛ متن مجوز و آدرس مخزن QuestieDB پایین آمده است.
> نام و لوگوی Questie متعلق به تیم Questie است و ما به‌عنوان برند استفاده نمی‌کنیم.

This file is the W13b notice required by `docs/DATA_TRUTH_PLAN.md` (wow-ops) and
`docs/SOURCES.md`. It lists where QuestieDB-derived data is redistributed, under which
licence, and what may not be used.

## What QuestieDB-Forever is

`Questie/QuestieDB` publishes a `data/Forever` set: Classic Era entities whose spawn
coordinates have been converted to the Forever map space (build 69893, map support from
70291). It carries no new Forever entities, no Forever loot and no Forever-only text —
its content is Classic Era data, labelled "Classic positions" wherever our pages show it.

## Which files contain QuestieDB-derived data

The full per-file table (what part is QuestieDB, what is ours, who reads it) lives in
`wow-ops/reports/2026-11-05-lane-c3-inventory.md`; the machine-readable manifest is
`data/forever/LICENSES.json`. In short, QuestieDB-derived content appears in:

- `data/forever/db/npc-*.json`, `npc-index.json` — names / spawn zones / npcFlags of
  NPCs missing from the client;
- `data/forever/db/spawn-*.json` — Classic zone-percent spawn coordinates;
- `data/forever/db/quest-*.json`, `quest-index.json` — EN title / objectives / texts of
  the 3,535 matched quest ids;
- `data/forever/db/ex-*.json` — quest↔item relation maps;
- `data/forever/db/poi/**`, `db/map/**` — map POI points and zone pins;
- parts of `db/dungeon/*` + `dungeons.json`, `db/itemlite-*.json`, `db/src-*.json`,
  `db/forever-quest-ids.json`, `changes/foreverchanges-quests.json`,
  `src/quest-hunt/fc-cache/*`;
- the Forever addon export tables `Quests.lua` (EN texts of matched ids) and the EN keys
  of `Names.lua` (see the inventory report, section C).

## Licence and redistribution

The Questie team allows copying the QuestieDB data under the **GNU General Public
License v3**:

- licence text: <https://www.gnu.org/licenses/gpl-3.0.html>
- QuestieDB repository and the `data/Forever` set: <https://github.com/Questie/QuestieDB>
- credit string used on our pages: "Data from QuestieDB"

Caveat recorded in `docs/DATA_TRUTH_PLAN.md` (W13 facts, 5 Nov 2026): the Questie team
states that unlicensed historic contributions are "all rights reserved" when in doubt,
and the Questie repo ships no licence file of its own. If Brain decides the GPL claim is
not safe for a specific file, that file drops out of the manifest and the data is
replaced (nothing in the site reads QuestieDB-derived data without this notice being
shipped next to it).

## Name and logo

"Questie" and the Questie logo belong to the Questie team. They are **not** ours and are
**not** used as branding anywhere in this repository or on wowfarsi.ir. The only permitted
use is the factual data credit above. Never copy the Questie logo into `assets/`, `img/`
or the addon.
