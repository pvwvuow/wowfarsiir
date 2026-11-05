# تغییرات بیلد 1.60.1.70790 (در برابر 1.60.1.70755)

_ساخته‌شده خودکار از diff دیتای خام کلاینت (`tools/forever_impact.py`, docs/CHANGE_READINESS.md) · 2026-11-04T19:59:43Z_

خلاصه: 262 ردیف تازه، 122 حذف، 354 تغییر در 28 جدول. کارها: بازبینی Brain 3، چک سایت 1، خودکار 4

## ⚠️ هشدار

- TraitEdge: 6 ردیف حذف شد (بیش از ۳٪)
- جدول TraitNodeXTraitCond در این بیلد نیست (تغییر ساختار)

## کارها

| نوع | بخش | چه شد | تعداد | چطور |
|---|---|---|---|---|
| بازبینی Brain | آیتم‌ها | استت/قیمت/بایند آیتم قدیمی عوض شد | 6 | تولتیپ این‌ها از اسنپ‌شات 70658 است و شاید الان غلط باشد |
| بازبینی Brain | آیتم‌ها | عدد/فیلد عوض شد (SpellItemEnchantment) | 5 | بازبینی |
| بازبینی Brain | آیتم‌ها | عدد/فیلد عوض شد (Item) | 3 | بازبینی |
| چک سایت | اسپل و تلنت | اسپل/تلنت عوض شد | 713 | forever_check همین بیلد را می‌سنجد: site-check.md و queue.json کنار همین فایل |
| خودکار | آیتم‌ها | ردیف تازه در Item | 1 | سازنده‌ها در سینک بعدی برمی‌دارند |
| خودکار | آیتم‌ها | استت/قیمت/بایند آیتم عوض شد (آیتم‌های db2) | 1 | آیتم‌های db2 خودکار بازسازی می‌شوند (forever_new_items refresh) |
| خودکار | دستاورد، ارز، فکشن، عنوان، رویداد | عدد/فیلد عوض شد (SkillLine) | 7 | سازنده‌ها با سینک بعدی می‌گیرند |
| خودکار | دستاورد، ارز، فکشن، عنوان، رویداد | عدد/فیلد عوض شد (CurrencyTypes) | 2 | سازنده‌ها با سینک بعدی می‌گیرند |

<details><summary>بازبینی Brain · استت/قیمت/بایند آیتم قدیمی عوض شد (6)</summary>

- Torn Page (281347): MaxCount
- Keystone Fragment (281350): BagFamily
- Ancient Runestone (281352): BagFamily
- Stone Key (281358): BagFamily
- Dormant Runestone (281359): BagFamily, MaxCount
- Letter Opener (287090): BuyPrice, SellPrice

</details>

<details><summary>بازبینی Brain · عدد/فیلد عوض شد (SpellItemEnchantment) (5)</summary>

- Deadly Poison V (2630): Charges
- Instant Poison VI (625): Charges
- Deadly Poison IV (627): Charges
- Mind-Numbing Poison III (643): Charges
- Wound Poison IV (706): Charges

</details>

<details><summary>بازبینی Brain · عدد/فیلد عوض شد (Item) (3)</summary>

- id (281350): ClassID
- id (281352): ClassID, ItemGroupSoundsID
- id (281359): ClassID, IconFileDataID, ItemGroupSoundsID

</details>

<details><summary>چک سایت · اسپل/تلنت عوض شد (713)</summary>

- SkillLineAbility
- Spell
- SpellAuraOptions
- SpellCategories
- SpellClassOptions
- SpellCooldowns
- SpellDescriptionVariables
- SpellEffect
- SpellEquippedItems
- SpellLevels
- SpellMisc
- SpellName
- SpellPower
- SpellShapeshift
- SpellTargetRestrictions

</details>

<details><summary>خودکار · ردیف تازه در Item (1)</summary>

- id (289555)

</details>

<details><summary>خودکار · استت/قیمت/بایند آیتم عوض شد (آیتم‌های db2) (1)</summary>

- Brittle Key (221324): BagFamily, BuyPrice, Flags_1, SellPrice

</details>

<details><summary>خودکار · عدد/فیلد عوض شد (SkillLine) (7)</summary>

- Feral Combat (134): Flags
- Assassination (253): Flags
- Fury (256): Flags
- Protection (257): Flags
- Arms (26): Flags
- Combat (38): Flags
- Subtlety (39): Flags

</details>

<details><summary>خودکار · عدد/فیلد عوض شد (CurrencyTypes) (2)</summary>

- [DNT] Class Talent Reset (3498): RechargingCycleDurationMS
- [DNT] Legacy Talent Reset (3499): RechargingCycleDurationMS

</details>

## بخش‌ها

| بخش | تازه | حذف | تغییر | جدول‌ها |
|---|---|---|---|---|
| اسپل و تلنت | 261 | 122 | 330 | SkillLineAbility, Spell, SpellAuraOptions, SpellCategories, SpellClassOptions, SpellCooldowns, SpellDescriptionVariables, SpellEffect |
| آیتم‌ها | 1 | 0 | 15 | Item, ItemSparse, SpellItemEnchantment |
| دستاورد، ارز، فکشن، عنوان، رویداد | 0 | 0 | 9 | CurrencyTypes, SkillLine |
