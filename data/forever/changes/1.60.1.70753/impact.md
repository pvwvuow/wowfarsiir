# تغییرات بیلد 1.60.1.70753 (در برابر 1.60.1.70707)

_ساخته‌شده خودکار از diff دیتای خام کلاینت (`tools/forever_impact.py`, docs/CHANGE_READINESS.md) · 2026-11-04T15:08:29Z_

خلاصه: 420 ردیف تازه، 107 حذف، 1687 تغییر در 30 جدول. کارها: بازبینی Brain 6، ترجمه 2، چک سایت 1، خودکار 6

## کارها

| نوع | بخش | چه شد | تعداد | چطور |
|---|---|---|---|---|
| بازبینی Brain | کلاس و نژاد | تغییر کلاس یا نژاد | 9 | روی صفحهٔ کلاس‌ها، فیلترها و آدان اثر دارد |
| بازبینی Brain | دانجن و ریید | ترتیب یا فیلد دانجن/باس عوض شد | 3 | با dungeons-final و صفحهٔ دانجن مقایسه کن |
| بازبینی Brain | آیتم‌ها | استت/قیمت/بایند آیتم قدیمی عوض شد | 4 | تولتیپ این‌ها از اسنپ‌شات 70658 است و شاید الان غلط باشد |
| بازبینی Brain | آیتم‌ها | عدد/فیلد عوض شد (Item) | 1 | بازبینی |
| بازبینی Brain | آیتم‌ها | عدد/فیلد عوض شد (ItemSearchName) | 1 | بازبینی |
| بازبینی Brain | دستاورد، ارز، فکشن، عنوان، رویداد | ردیف حذف‌شده در Achievement | 1 | از سایت پاک نمی‌شود؛ فقط علامت و بازبینی |
| ترجمه | آیتم‌ها | اسم آیتم تازه | 40 | translation-auto پک item-name می‌سازد و issue «پک جدید» خبر می‌دهد |
| ترجمه | آیتم‌ها | متن انگلیسی عوض شد (SpellItemEnchantment) | 1 | فارسی قبلی کهنه است |
| چک سایت | اسپل و تلنت | اسپل/تلنت عوض شد | 2141 | forever_check همین بیلد را می‌سنجد: site-check.md و queue.json کنار همین فایل |
| خودکار | آیتم‌ها | آیتم تازه وارد بانک می‌شود | 40 | forever_new_items با تولتیپ کامل از بیلد خام |
| خودکار | آیتم‌ها | ردیف تازه در Item | 3 | سازنده‌ها در سینک بعدی برمی‌دارند |
| خودکار | آیتم‌ها | ردیف تازه در SpellItemEnchantment | 1 | سازنده‌ها در سینک بعدی برمی‌دارند |
| خودکار | اسپل و تلنت | جدول تازه آرشیو شد (تغییر بازی نیست) | 16 | فقط از این بیلد بایگانی می‌شود |
| خودکار | دستاورد، ارز، فکشن، عنوان، رویداد | ردیف تازه در Holidays | 1 | سازنده‌ها در سینک بعدی برمی‌دارند |
| خودکار | منطقه و نقشه | پین/پرواز/نقشه عوض شد (TaxiPath) | 2 | export فایل csv را کپی می‌کند و sync-forever-db پین‌ها را می‌سازد |

<details><summary>بازبینی Brain · تغییر کلاس یا نژاد (9)</summary>

- Blood Elf (10)
- Draenei (11)
- Worgen (22)
- Pandaren (24)
- Pandaren (25)
- Pandaren (26)
- Nightborne (27)
- Lightforged Draenei (30)
- Vulpera (35)

</details>

<details><summary>بازبینی Brain · ترتیب یا فیلد دانجن/باس عوض شد (3)</summary>

- Shade of the Archmage (3303): OrderIndex
- Rath'mael (3354): OrderIndex
- Razorfen Kraul (47): Flags_2

</details>

<details><summary>بازبینی Brain · استت/قیمت/بایند آیتم قدیمی عوض شد (4)</summary>

- Recipe: Transmute Earth to Water (13484): SellPrice
- Toughened Leather Armor (2314): Bonding, OverallQualityID, StatModifier_bonusStat_0, StatModifier_bonusStat_1, StatPercentEditor_0
- Recipe: Minor Spellblasting Potion (250976): BuyPrice, SellPrice
- Gift of Galloping (271871): SellPrice

</details>

<details><summary>بازبینی Brain · عدد/فیلد عوض شد (Item) (1)</summary>

- id (277277): ItemPetFoodID

</details>

<details><summary>بازبینی Brain · عدد/فیلد عوض شد (ItemSearchName) (1)</summary>

- Toughened Leather Armor (2314): OverallQualityID

</details>

<details><summary>بازبینی Brain · ردیف حذف‌شده در Achievement (1)</summary>

- id 64283

</details>

<details><summary>ترجمه · اسم آیتم تازه (40)</summary>

- Scorched Rocket Boots (7190)
- Formula: Frozen Heart of the Mountain (249519)
- Formula: Molten Heart of the Mountain (249520)
- Formula: Dormant Heart of the Mountain (249521)
- Plans: Veteran's Chain Shirt (251340)
- Plans: Protector's Chain Shirt (251342)
- Plans: Acolyte's Chain Shirt (251343)
- Plans: Crusader's Chain Shirt (251344)
- Plans: Veteran's Chain Leggings (251345)
- Plans: Guard's Chain Leggings (251346)
- Plans: Protector's Chain Leggings (251347)
- Plans: Acolyte's Chain Leggings (251348)
- Plans: Crusader's Chain Leggings (251349)
- Plans: Veteran's Chain Helm (251350)
- Plans: Guard's Chain Helm (251351)

</details>

<details><summary>ترجمه · متن انگلیسی عوض شد (SpellItemEnchantment) (1)</summary>

- Defense +$k1 (8214)

</details>

<details><summary>چک سایت · اسپل/تلنت عوض شد (2141)</summary>

- SkillLineAbility
- Spell
- SpellAuraOptions
- SpellAuraRestrictions
- SpellCategories
- SpellClassOptions
- SpellCooldowns
- SpellDuration
- SpellEffect
- SpellEquippedItems
- SpellInterrupts
- SpellLevels
- SpellMisc
- SpellName
- SpellPower

</details>

<details><summary>خودکار · آیتم تازه وارد بانک می‌شود (40)</summary>

- Scorched Rocket Boots (7190)
- Formula: Frozen Heart of the Mountain (249519)
- Formula: Molten Heart of the Mountain (249520)
- Formula: Dormant Heart of the Mountain (249521)
- Plans: Veteran's Chain Shirt (251340)
- Plans: Protector's Chain Shirt (251342)
- Plans: Acolyte's Chain Shirt (251343)
- Plans: Crusader's Chain Shirt (251344)
- Plans: Veteran's Chain Leggings (251345)
- Plans: Guard's Chain Leggings (251346)
- Plans: Protector's Chain Leggings (251347)
- Plans: Acolyte's Chain Leggings (251348)
- Plans: Crusader's Chain Leggings (251349)
- Plans: Veteran's Chain Helm (251350)
- Plans: Guard's Chain Helm (251351)

</details>

<details><summary>خودکار · ردیف تازه در Item (3)</summary>

- id (289439)
- id (289559)
- id (289560)

</details>

<details><summary>خودکار · ردیف تازه در SpellItemEnchantment (1)</summary>

- Speed Increase (8737)

</details>

<details><summary>خودکار · جدول تازه آرشیو شد (تغییر بازی نیست) (16)</summary>

- ChrSpecialization
- SkillLineXTraitTree
- TraitCond
- TraitCost
- TraitCurrency
- TraitDefinition
- TraitEdge
- TraitNode
- TraitNodeEntry
- TraitNodeGroup
- TraitNodeGroupXTraitCond
- TraitNodeGroupXTraitNode
- TraitNodeXTraitCond
- TraitNodeXTraitNodeEntry
- TraitTree

</details>

<details><summary>خودکار · ردیف تازه در Holidays (1)</summary>

- id (1896)

</details>

## بخش‌ها

| بخش | تازه | حذف | تغییر | جدول‌ها |
|---|---|---|---|---|
| اسپل و تلنت | 370 | 104 | 1667 | SkillLineAbility, Spell, SpellAuraOptions, SpellAuraRestrictions, SpellCategories, SpellClassOptions, SpellCooldowns, SpellDuration |
| آیتم‌ها | 49 | 0 | 8 | Item, ItemEffect, ItemSearchName, ItemSparse, SpellItemEnchantment |
| کلاس و نژاد | 0 | 0 | 9 | ChrRaces |
| دانجن و ریید | 0 | 0 | 3 | DungeonEncounter, Map |
| دستاورد، ارز، فکشن، عنوان، رویداد | 1 | 1 | 0 | Achievement, Holidays |
| منطقه و نقشه | 0 | 2 | 0 | TaxiPath |
