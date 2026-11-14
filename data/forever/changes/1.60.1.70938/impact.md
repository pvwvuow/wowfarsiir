# تغییرات بیلد 1.60.1.70938 (در برابر 1.60.1.70888)

_ساخته‌شده خودکار از diff دیتای خام کلاینت (`tools/forever_impact.py`, docs/CHANGE_READINESS.md) · 2026-11-14T08:32:18Z_

خلاصه: 82 ردیف تازه، 22 حذف، 1308 تغییر در 26 جدول. کارها: بازبینی Brain 4، ترجمه 2، چک سایت 1، خودکار 6

## کارها

| نوع | بخش | چه شد | تعداد | چطور |
|---|---|---|---|---|
| بازبینی Brain | آیتم‌ها | استت/قیمت/بایند آیتم قدیمی عوض شد | 1028 | تولتیپ این‌ها از اسنپ‌شات 70658 است و شاید الان غلط باشد |
| بازبینی Brain | آیتم‌ها | عدد/فیلد عوض شد (ItemSearchName) | 102 | بازبینی |
| بازبینی Brain | آیتم‌ها | عدد/فیلد عوض شد (Item) | 8 | بازبینی |
| بازبینی Brain | آیتم‌ها | عدد/فیلد عوض شد (SpellItemEnchantment) | 1 | بازبینی |
| ترجمه | آیتم‌ها | متن داستانی آیتم عوض شد | 11 | خط تولتیپ فارسی کهنه است |
| ترجمه | آیتم‌ها | اسم آیتم عوض شد | 1 | فارسی با اسم انگلیسی کلید شده؛ ردیف تازه در پک می‌آید، فارسی قدیمی را تطبیق بده |
| چک سایت | اسپل و تلنت | اسپل/تلنت عوض شد | 231 | forever_check همین بیلد را می‌سنجد: site-check.md و queue.json کنار همین فایل |
| خودکار | آیتم‌ها | ردیف تازه در ItemSearchName | 4 | سازنده‌ها در سینک بعدی برمی‌دارند |
| خودکار | آیتم‌ها | استت/قیمت/بایند آیتم عوض شد (آیتم‌های db2) | 3 | آیتم‌های db2 خودکار بازسازی می‌شوند (forever_new_items refresh) |
| خودکار | سایر | ردیف تازه در CurvePoint | 4 | سازنده‌ها در سینک بعدی برمی‌دارند |
| خودکار | سایر | ردیف تازه در ItemXItemEffect | 3 | سازنده‌ها در سینک بعدی برمی‌دارند |
| خودکار | سایر | ردیف تازه در Curve | 1 | سازنده‌ها در سینک بعدی برمی‌دارند |
| خودکار | دستاورد، ارز، فکشن، عنوان، رویداد | عدد/فیلد عوض شد (Holidays) | 1 | سازنده‌ها با سینک بعدی می‌گیرند |

<details><summary>بازبینی Brain · استت/قیمت/بایند آیتم قدیمی عوض شد (1028)</summary>

- Black Mageweave Gloves (10003): DmgVariance
- Stormcloth Gloves (10011): DmgVariance
- Red Mageweave Gloves (10018): DmgVariance
- Dreamweave Gloves (10019): DmgVariance
- Shadoweave Gloves (10023): DmgVariance
- Black Mageweave Boots (10026): DmgVariance
- Shadoweave Boots (10031): DmgVariance
- Tuxedo Shirt (10034): DmgVariance
- Tuxedo Pants (10035): DmgVariance
- Stormcloth Boots (10039): DmgVariance
- Pious Legwraps (10043): DmgVariance
- Cindercloth Boots (10044): DmgVariance
- Simple Linen Boots (10046): DmgVariance
- Red Mageweave Bag (10051): ContainerSlots
- Orange Martial Shirt (10052): DmgVariance

</details>

<details><summary>بازبینی Brain · عدد/فیلد عوض شد (ItemSearchName) (102)</summary>

- Veteran's Chain Shirt (250488): Flags_1
- Guard's Chain Shirt (250489): Flags_1
- Veteran's Chain Leggings (250493): Flags_1
- Guard's Chain Leggings (250494): Flags_1
- Veteran's Chain Helm (250498): Flags_1
- Guard's Chain Helm (250499): Flags_1
- Prefect's Boots (250549): Flags_1
- Officer's Gloves (250551): Flags_1
- Sentinel's Gloves (250552): Flags_1
- Warder's Gloves (250553): Flags_1
- Prefect's Gloves (250554): Flags_1
- Justicar's Gloves (250555): Flags_1
- Officer's Belt (250556): Flags_1
- Sentinel's Belt (250557): Flags_1
- Warder's Belt (250558): Flags_1

</details>

<details><summary>بازبینی Brain · عدد/فیلد عوض شد (Item) (8)</summary>

- id (10418): SubclassID
- id (276538): IconFileDataID
- id (276539): IconFileDataID
- id (276540): IconFileDataID
- id (276541): IconFileDataID
- id (277109): SheatheType
- id (281312): SheatheType
- id (9239): ItemGroupSoundsID, Material

</details>

<details><summary>بازبینی Brain · عدد/فیلد عوض شد (SpellItemEnchantment) (1)</summary>

- Spirit +$k1 (8203): EffectArg_0

</details>

<details><summary>ترجمه · متن داستانی آیتم عوض شد (11)</summary>

- Sprite Darter Egg (11474)
- Red Dragon Orb (19054)
- Green Dragon Orb (19055)
- Blue Murloc Egg (20371)
- Recipe: Elixir of Holy Power (21547)
- Pink Murloc Egg (22114)
- White Murloc Egg (22780)
- Polar Bear Collar (22781)
- White Tiger Cub (23712)
- Hippogryph Hatchling (23713)
- Uber Diablo Stone (268879)

</details>

<details><summary>ترجمه · اسم آیتم عوض شد (1)</summary>

- Recipe: Elixir of Greater Firepower → Recipe: Elixir of Holy Power (21547)

</details>

<details><summary>چک سایت · اسپل/تلنت عوض شد (231)</summary>

- SkillLineAbility
- Spell
- SpellAuraOptions
- SpellCategories
- SpellClassOptions
- SpellCooldowns
- SpellEffect
- SpellInterrupts
- SpellLevels
- SpellMisc
- SpellName
- SpellPower
- SpellReagents
- SpellShapeshift
- SpellTargetRestrictions

</details>

<details><summary>خودکار · ردیف تازه در ItemSearchName (4)</summary>

- Spiritcaller Kilt (276538)
- Spiritcaller Gloves (276539)
- Spiritcaller Mantle (276540)
- Spiritcaller Boots (276541)

</details>

<details><summary>خودکار · استت/قیمت/بایند آیتم عوض شد (آیتم‌های db2) (3)</summary>

- Gamemaster's Slippers (11508): DmgVariance
- Gamemaster Hood (12064): DmgVariance
- Gamemaster's Robe (2586): DmgVariance

</details>

<details><summary>خودکار · ردیف تازه در CurvePoint (4)</summary>

- id (372617)
- id (372618)
- id (372619)
- id (372620)

</details>

<details><summary>خودکار · ردیف تازه در ItemXItemEffect (3)</summary>

- id (172562)
- id (172563)
- id (172566)

</details>

<details><summary>خودکار · ردیف تازه در Curve (1)</summary>

- id (128341)

</details>

<details><summary>خودکار · عدد/فیلد عوض شد (Holidays) (1)</summary>

- id (161): Duration_0

</details>

## بخش‌ها

| بخش | تازه | حذف | تغییر | جدول‌ها |
|---|---|---|---|---|
| آیتم‌ها | 7 | 0 | 1159 | Item, ItemEffect, ItemSearchName, ItemSparse, SpellItemEnchantment |
| اسپل و تلنت | 67 | 22 | 142 | SkillLineAbility, Spell, SpellAuraOptions, SpellCategories, SpellClassOptions, SpellCooldowns, SpellEffect, SpellInterrupts |
| سایر | 8 | 0 | 0 | Curve, CurvePoint, ItemXItemEffect |
| منطقه و نقشه | 0 | 0 | 6 | AreaTable |
| دستاورد، ارز، فکشن، عنوان، رویداد | 0 | 0 | 1 | Holidays |
