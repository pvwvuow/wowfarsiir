# تغییرات بیلد 1.60.1.70840 (در برابر 1.60.1.70790)

_ساخته‌شده خودکار از diff دیتای خام کلاینت (`tools/forever_impact.py`, docs/CHANGE_READINESS.md) · 2026-11-07T05:40:25Z_

خلاصه: 2453 ردیف تازه، 7 حذف، 91 تغییر در 35 جدول. کارها: صفحهٔ تازه 3، بازبینی Brain 3، ترجمه 5، دادهٔ سرور (ForeverDB) 2، چک سایت 1، خودکار 8

## کارها

| نوع | بخش | چه شد | تعداد | چطور |
|---|---|---|---|---|
| صفحهٔ تازه | دانجن و ریید | باس تازه | 34 | کارت باس در صفحهٔ دانجن + لوت + ترجمهٔ boss-title |
| صفحهٔ تازه | دانجن و ریید | دانجن/ریید تازه | 10 | چک‌لیست CHANGE_READINESS E1: صفحه، نقشه، باس‌ها، لوت، SEO، ترجمهٔ اسم |
| صفحهٔ تازه | منطقه و نقشه | منطقهٔ تازه: نقشه و عکس | 29 | عکس نقشه + تست ۲۰ پین + zones-meta |
| بازبینی Brain | آیتم‌ها | استت/قیمت/بایند آیتم قدیمی عوض شد | 16 | تولتیپ این‌ها از اسنپ‌شات 70658 است و شاید الان غلط باشد |
| بازبینی Brain | آیتم‌ها | عدد/فیلد عوض شد (Item) | 2 | بازبینی |
| بازبینی Brain | آیتم‌ها | عدد/فیلد عوض شد (ItemSearchName) | 1 | بازبینی |
| ترجمه | آیتم‌ها | اسم آیتم تازه | 17 | translation-auto پک item-name می‌سازد و issue «پک جدید» خبر می‌دهد |
| ترجمه | NPCها | NPC تازه | 5 | پک npc-name خودکار |
| ترجمه | دستاورد، ارز، فکشن، عنوان، رویداد | اسم تازه (Achievement) | 55 | هنوز پک ترجمهٔ این نوع نداریم: دستی یا پک جدید |
| ترجمه | دستاورد، ارز، فکشن، عنوان، رویداد | اسم تازه (Languages) | 1 | هنوز پک ترجمهٔ این نوع نداریم: دستی یا پک جدید |
| ترجمه | منطقه و نقشه | منطقهٔ تازه | 29 | پک zone-name |
| دادهٔ سرور (ForeverDB) | NPCها | جای و لوت NPC تازه | 5 | در دیتای کلاینت نیست: snapshot تازهٔ ForeverDB (fdb-fetch) |
| دادهٔ سرور (ForeverDB) | کوئست‌ها | کوئست تازه | 10 | متن و جایزه سمت سرور است: ForeverDB / quest capture |
| چک سایت | اسپل و تلنت | اسپل/تلنت عوض شد | 2289 | forever_check همین بیلد را می‌سنجد: site-check.md و queue.json کنار همین فایل |
| خودکار | آیتم‌ها | ردیف تازه در Item | 21 | سازنده‌ها در سینک بعدی برمی‌دارند |
| خودکار | آیتم‌ها | آیتم تازه وارد بانک می‌شود | 17 | forever_new_items با تولتیپ کامل از بیلد خام |
| خودکار | آیتم‌ها | ردیف تازه در ItemSearchName | 6 | سازنده‌ها در سینک بعدی برمی‌دارند |
| خودکار | آیتم‌ها | ردیف تازه در SpellItemEnchantment | 1 | سازنده‌ها در سینک بعدی برمی‌دارند |
| خودکار | سایر | ردیف تازه در ItemXItemEffect | 19 | سازنده‌ها در سینک بعدی برمی‌دارند |
| خودکار | سایر | عدد/فیلد عوض شد (CurvePoint) | 3 | سازنده‌ها با سینک بعدی می‌گیرند |
| خودکار | دستاورد، ارز، فکشن، عنوان، رویداد | ردیف تازه در Lock | 3 | سازنده‌ها در سینک بعدی برمی‌دارند |
| خودکار | دستاورد، ارز، فکشن، عنوان، رویداد | عدد/فیلد عوض شد (CharTitles) | 1 | سازنده‌ها با سینک بعدی می‌گیرند |

<details><summary>صفحهٔ تازه · باس تازه (34)</summary>

- Withermaw (3315)
- Impaan the Imprisoner (3316)
- Bonesnout the Unbroken (3322)
- Blackmaw Behemoth (3323)
- Elder Shaman Bloodmane (3327)
- Varrox Bleakhoof (3334)
- Unbound Spirit (3336)
- Overseer Wrex (3403)
- Blazeroar (3409)
- Tidemistress Ca'zass (3410)
- The Questioner (3415)
- Katerina the Cleaner (3418)
- Nar'gurk (3449)
- Slavecrusher Grox (3450)
- Overseer Mugg (3451)

</details>

<details><summary>صفحهٔ تازه · دانجن/ریید تازه (10)</summary>

- The Shaper's Terrace (3267)
- Blackmaw Hold (3268)
- Alcaz Prison (3269)
- The Drowned City (3270)
- Krol'dok Stronghold (3275)
- The Drowned City (2970)
- Blackmaw Hold (2974)
- Alcaz Prison (2994)
- The Shaper's Terrace (3001)
- Krol'dok Stronghold (3039)

</details>

<details><summary>صفحهٔ تازه · منطقهٔ تازه: نقشه و عکس (29)</summary>

- The Drowned City (16550)
- Blackmaw Hold (16554)
- Excavation Site - Bael Modan (16619)
- Alcaz Prison (16620)
- The Shaper's Terrace (16667)
- Krol'dok Stronghold (16842)
- Shaper's Plateau (16928)
- Pillar of Assimilation (16929)
- The Verdant Plains (16930)
- Lost Tar Pits (16931)
- Ruby Spring (16932)
- Walk of Communion (16933)
- The Highlands Causeway (16934)
- Watcher's Overlook (16935)
- Botanical Grounds (16937)

</details>

<details><summary>بازبینی Brain · استت/قیمت/بایند آیتم قدیمی عوض شد (16)</summary>

- Mild Spices (2678): SellPrice
- Recipe: Flask of Natural Accuracy (274277): OverallQualityID
- Recipe: Flask of Natural Aggression (274278): OverallQualityID
- Recipe: Flask of Natural Precision (274279): OverallQualityID
- Recipe: Flask of Natural Swiftness (274280): OverallQualityID
- Sack of Fish (280426): Flags_0
- Superior Healing Potion (288896): ItemLevel
- Superior Mana Potion (288897): ItemLevel
- Swiftness Potion (288898): ItemLevel
- Earthshaker (288900): Bonding, ItemLevel
- Choker of the Fire Lord (288926): Bonding, ItemLevel
- Quick Strike Ring (288927): Bonding, ItemLevel
- Heavy Dark Iron Ring (288928): Bonding, ItemLevel
- Band of Sulfuras (288929): Bonding, ItemLevel
- Cauterizing Band (288930): Bonding, ItemLevel

</details>

<details><summary>بازبینی Brain · عدد/فیلد عوض شد (Item) (2)</summary>

- id (267079): ItemGroupSoundsID
- id (273845): ItemGroupSoundsID

</details>

<details><summary>بازبینی Brain · عدد/فیلد عوض شد (ItemSearchName) (1)</summary>

- Earthshaker (288900): ItemLevel

</details>

<details><summary>ترجمه · اسم آیتم تازه (17)</summary>

- Noggenfogger Elixir (289081)
- Elixir of Endless Intellect (289082)
- Elixir of Endless Power (289083)
- Elixir of Endless Healing (289084)
- Elixir of Endless Rapidity (289086)
- Elixir of Endless Opportunity (289087)
- Scroll of Endless Fortitude (289088)
- Hammer of Bestial Fury (289292)
- Thunderfury, Blessed Blade of the Windseeker (289294)
- Sulfuras, Hand of Ragnaros (289295)
- Benediction (289296)
- Anathema (289297)
- Rhok'delar, Longbow of the Ancient Keepers (289303)
- Elixir of Endless Mana (289321)
- Elixir of Endless Growth (289329)

</details>

<details><summary>ترجمه · NPC تازه (5)</summary>

- Frosty Lashling (249698)
- Viridian Lashling (249699)
- Flowery Lashling (249700)
- Wilted Lashling (249702)
- Shen'dorei Wisp (273554)

</details>

<details><summary>ترجمه · اسم تازه (Achievement) (55)</summary>

- Hidden: Flight Path Tracker - EK - Westfall (64195)
- Hidden: Flight Path Tracker - EK - Stormwind (64196)
- Hidden: Flight Path Tracker - EK - Arathi (64197)
- Hidden: Flight Path Tracker - EK - Wetlands (64198)
- Hidden: Flight Path Tracker - EK - Badlands (64199)
- Hidden: Flight Path Tracker - EK - Riverglades (64200)
- Hidden: Flight Path Tracker - EK - Redridge (64201)
- Hidden: Flight Path Tracker - EK - Hillsbrad (64202)
- Hidden: Flight Path Tracker - EK - Duskwood (64203)
- Hidden: Flight Path Tracker - EK - Blasted Lands (64236)
- Hidden: Flight Path Tracker - EK - Burning Steppes (64237)
- Hidden: Flight Path Tracker - EK - Eastern Plaguelands (64238)
- Hidden: Flight Path Tracker - EK - Ironforge (64239)
- Hidden: Flight Path Tracker - EK - Loch Modan (64240)
- Hidden: Flight Path Tracker - EK - Searing Gorge (64241)

</details>

<details><summary>ترجمه · اسم تازه (Languages) (1)</summary>

- Zombie (36)

</details>

<details><summary>ترجمه · منطقهٔ تازه (29)</summary>

- The Drowned City (16550)
- Blackmaw Hold (16554)
- Excavation Site - Bael Modan (16619)
- Alcaz Prison (16620)
- The Shaper's Terrace (16667)
- Krol'dok Stronghold (16842)
- Shaper's Plateau (16928)
- Pillar of Assimilation (16929)
- The Verdant Plains (16930)
- Lost Tar Pits (16931)
- Ruby Spring (16932)
- Walk of Communion (16933)
- The Highlands Causeway (16934)
- Watcher's Overlook (16935)
- Botanical Grounds (16937)

</details>

<details><summary>دادهٔ سرور (ForeverDB) · جای و لوت NPC تازه (5)</summary>

- Frosty Lashling (249698)
- Viridian Lashling (249699)
- Flowery Lashling (249700)
- Wilted Lashling (249702)
- Shen'dorei Wisp (273554)

</details>

<details><summary>دادهٔ سرور (ForeverDB) · کوئست تازه (10)</summary>

- quest (93161)
- quest (97029)
- quest (98563)
- quest (98642)
- quest (98715)
- quest (98724)
- quest (98745)
- quest (98746)
- quest (98748)
- quest (98749)

</details>

<details><summary>چک سایت · اسپل/تلنت عوض شد (2289)</summary>

- SkillLineAbility
- Spell
- SpellAuraOptions
- SpellAuraRestrictions
- SpellCategories
- SpellClassOptions
- SpellCooldowns
- SpellEffect
- SpellEquippedItems
- SpellInterrupts
- SpellLevels
- SpellMisc
- SpellName
- SpellPower
- SpellRadius

</details>

<details><summary>خودکار · ردیف تازه در Item (21)</summary>

- id (287960)
- id (289081)
- id (289082)
- id (289083)
- id (289084)
- id (289086)
- id (289087)
- id (289088)
- id (289291)
- id (289292)
- id (289293)
- id (289294)
- id (289295)
- id (289296)
- id (289297)

</details>

<details><summary>خودکار · آیتم تازه وارد بانک می‌شود (17)</summary>

- Noggenfogger Elixir (289081)
- Elixir of Endless Intellect (289082)
- Elixir of Endless Power (289083)
- Elixir of Endless Healing (289084)
- Elixir of Endless Rapidity (289086)
- Elixir of Endless Opportunity (289087)
- Scroll of Endless Fortitude (289088)
- Hammer of Bestial Fury (289292)
- Thunderfury, Blessed Blade of the Windseeker (289294)
- Sulfuras, Hand of Ragnaros (289295)
- Benediction (289296)
- Anathema (289297)
- Rhok'delar, Longbow of the Ancient Keepers (289303)
- Elixir of Endless Mana (289321)
- Elixir of Endless Growth (289329)

</details>

<details><summary>خودکار · ردیف تازه در ItemSearchName (6)</summary>

- Hammer of Bestial Fury (289292)
- Thunderfury, Blessed Blade of the Windseeker (289294)
- Sulfuras, Hand of Ragnaros (289295)
- Benediction (289296)
- Anathema (289297)
- Rhok'delar, Longbow of the Ancient Keepers (289303)

</details>

<details><summary>خودکار · ردیف تازه در SpellItemEnchantment (1)</summary>

- Luminarian's Binding (8726)

</details>

<details><summary>خودکار · ردیف تازه در ItemXItemEffect (19)</summary>

- id (170881)
- id (171557)
- id (171558)
- id (171559)
- id (171560)
- id (171562)
- id (171563)
- id (171564)
- id (171705)
- id (171706)
- id (171707)
- id (171708)
- id (171709)
- id (171710)
- id (171715)

</details>

<details><summary>خودکار · عدد/فیلد عوض شد (CurvePoint) (3)</summary>

- id (328755): Pos_1
- id (328756): Pos_1
- id (328757): Pos_1

</details>

<details><summary>خودکار · ردیف تازه در Lock (3)</summary>

- id (4529)
- id (4530)
- id (4531)

</details>

<details><summary>خودکار · عدد/فیلد عوض شد (CharTitles) (1)</summary>

- %s the Blacksmith (1225): Mask_ID

</details>

## بخش‌ها

| بخش | تازه | حذف | تغییر | جدول‌ها |
|---|---|---|---|---|
| اسپل و تلنت | 2217 | 7 | 65 | SkillLineAbility, Spell, SpellAuraOptions, SpellAuraRestrictions, SpellCategories, SpellClassOptions, SpellCooldowns, SpellEffect |
| آیتم‌ها | 70 | 0 | 22 | Item, ItemEffect, ItemSearchName, ItemSparse, SpellItemEnchantment |
| دستاورد، ارز، فکشن، عنوان، رویداد | 59 | 0 | 1 | Achievement, CharTitles, Languages, Lock |
| دانجن و ریید | 44 | 0 | 0 | DungeonEncounter, LfgDungeons, Map |
| منطقه و نقشه | 29 | 0 | 0 | AreaTable |
| سایر | 19 | 0 | 3 | CurvePoint, ItemXItemEffect |
| کوئست‌ها | 10 | 0 | 0 | QuestV2 |
| NPCها | 5 | 0 | 0 | Creature |
