# تغییرات بیلد 1.60.1.70862 (در برابر 1.60.1.70840)

_ساخته‌شده خودکار از diff دیتای خام کلاینت (`tools/forever_impact.py`, docs/CHANGE_READINESS.md) · 2026-11-07T09:37:05Z_

خلاصه: 63 ردیف تازه، 5 حذف، 37 تغییر در 12 جدول. کارها: بازبینی Brain 2، چک سایت 1، خودکار 2

## کارها

| نوع | بخش | چه شد | تعداد | چطور |
|---|---|---|---|---|
| بازبینی Brain | آیتم‌ها | استت/قیمت/بایند آیتم قدیمی عوض شد | 6 | تولتیپ این‌ها از اسنپ‌شات 70658 است و شاید الان غلط باشد |
| بازبینی Brain | آیتم‌ها | عدد/فیلد عوض شد (Item) | 1 | بازبینی |
| چک سایت | اسپل و تلنت | اسپل/تلنت عوض شد | 39 | forever_check همین بیلد را می‌سنجد: site-check.md و queue.json کنار همین فایل |
| خودکار | سایر | ردیف تازه در Curve | 33 | سازنده‌ها در سینک بعدی برمی‌دارند |
| خودکار | سایر | ردیف تازه در CurvePoint | 26 | سازنده‌ها در سینک بعدی برمی‌دارند |

<details><summary>بازبینی Brain · استت/قیمت/بایند آیتم قدیمی عوض شد (6)</summary>

- Filled Crystal Catalyst (266426): Flags_0
- Scoutmaster's Eye (268581): Flags_0
- Executioner's Mace (269351): Flags_0
- Blademaster's Banner (271425): Flags_0
- Ghostmaw's Fang (271828): Flags_0
- Abominable Head (280438): RequiredLevel

</details>

<details><summary>بازبینی Brain · عدد/فیلد عوض شد (Item) (1)</summary>

- id (278989): IconFileDataID

</details>

<details><summary>چک سایت · اسپل/تلنت عوض شد (39)</summary>

- Spell
- SpellAuraOptions
- SpellCategories
- SpellCooldowns
- SpellEffect
- SpellLevels
- SpellMisc
- SpellPower

</details>

<details><summary>خودکار · ردیف تازه در Curve (33)</summary>

- id (127981)
- id (127982)
- id (127983)
- id (127984)
- id (127985)
- id (127986)
- id (127987)
- id (127988)
- id (127989)
- id (127990)
- id (127991)
- id (127992)
- id (127993)
- id (127994)
- id (127995)

</details>

<details><summary>خودکار · ردیف تازه در CurvePoint (26)</summary>

- id (371549)
- id (371550)
- id (371551)
- id (371552)
- id (371553)
- id (371554)
- id (371555)
- id (371561)
- id (371562)
- id (371568)
- id (371569)
- id (371570)
- id (371571)
- id (371572)
- id (371573)

</details>

## بخش‌ها

| بخش | تازه | حذف | تغییر | جدول‌ها |
|---|---|---|---|---|
| سایر | 59 | 0 | 0 | Curve, CurvePoint |
| اسپل و تلنت | 4 | 5 | 30 | Spell, SpellAuraOptions, SpellCategories, SpellCooldowns, SpellEffect, SpellLevels, SpellMisc, SpellPower |
| آیتم‌ها | 0 | 0 | 7 | Item, ItemSparse |
