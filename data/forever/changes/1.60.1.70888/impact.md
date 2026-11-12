# تغییرات بیلد 1.60.1.70888 (در برابر 1.60.1.70862)

_ساخته‌شده خودکار از diff دیتای خام کلاینت (`tools/forever_impact.py`, docs/CHANGE_READINESS.md) · 2026-11-11T14:29:11Z_

خلاصه: 127 ردیف تازه، 1 حذف، 47 تغییر در 15 جدول. کارها: بازبینی Brain 3، ترجمه 2، چک سایت 1، خودکار 6

## کارها

| نوع | بخش | چه شد | تعداد | چطور |
|---|---|---|---|---|
| بازبینی Brain | آیتم‌ها | استت/قیمت/بایند آیتم قدیمی عوض شد | 9 | تولتیپ این‌ها از اسنپ‌شات 70658 است و شاید الان غلط باشد |
| بازبینی Brain | آیتم‌ها | عدد/فیلد عوض شد (Item) | 1 | بازبینی |
| بازبینی Brain | آیتم‌ها | عدد/فیلد عوض شد (ItemSearchName) | 1 | بازبینی |
| ترجمه | آیتم‌ها | متن داستانی آیتم عوض شد | 7 | خط تولتیپ فارسی کهنه است |
| ترجمه | آیتم‌ها | اسم آیتم تازه | 1 | translation-auto پک item-name می‌سازد و issue «پک جدید» خبر می‌دهد |
| چک سایت | اسپل و تلنت | اسپل/تلنت عوض شد | 31 | forever_check همین بیلد را می‌سنجد: site-check.md و queue.json کنار همین فایل |
| خودکار | آیتم‌ها | ردیف تازه در Item | 1 | سازنده‌ها در سینک بعدی برمی‌دارند |
| خودکار | آیتم‌ها | ردیف تازه در ItemSearchName | 1 | سازنده‌ها در سینک بعدی برمی‌دارند |
| خودکار | آیتم‌ها | آیتم تازه وارد بانک می‌شود | 1 | forever_new_items با تولتیپ کامل از بیلد خام |
| خودکار | سایر | ردیف تازه در CurvePoint | 78 | سازنده‌ها در سینک بعدی برمی‌دارند |
| خودکار | سایر | ردیف تازه در Curve | 39 | سازنده‌ها در سینک بعدی برمی‌دارند |
| خودکار | سایر | عدد/فیلد عوض شد (ContentTuning) | 1 | سازنده‌ها با سینک بعدی می‌گیرند |

<details><summary>بازبینی Brain · استت/قیمت/بایند آیتم قدیمی عوض شد (9)</summary>

- Croaky's Head (247826): Flags_0
- Elmpaw's Head (247862): Flags_0
- Berdun's Trusty Rifle (259891): Bonding, RequiredLevel
- Sea Monster's Head (268633): Flags_0
- Wood Bundle (271629): Bonding
- Adaptive Combat Assistant (272437): StatPercentEditor_0
- Weakness Analyzer (272438): StatPercentEditor_0
- Serenity Field (272439): StatPercentEditor_0, StatPercentEditor_1
- Corrupted Kor Gem (6995): Flags_0

</details>

<details><summary>بازبینی Brain · عدد/فیلد عوض شد (Item) (1)</summary>

- id (271629): ClassID, SubclassID

</details>

<details><summary>بازبینی Brain · عدد/فیلد عوض شد (ItemSearchName) (1)</summary>

- Berdun's Trusty Rifle (259891): RequiredLevel

</details>

<details><summary>ترجمه · متن داستانی آیتم عوض شد (7)</summary>

- Minor Healing Potion (287966)
- Lesser Healing Potion (287967)
- Minor Mana Potion (287968)
- Lesser Mana Potion (287969)
- Swiftness Potion (287975)
- Free Action Potion (287976)
- Greater Healing Potion (287977)

</details>

<details><summary>ترجمه · اسم آیتم تازه (1)</summary>

- Berdun's Trusty Rifle (290333)

</details>

<details><summary>چک سایت · اسپل/تلنت عوض شد (31)</summary>

- Spell
- SpellClassOptions
- SpellCooldowns
- SpellEffect
- SpellEquippedItems
- SpellMisc
- SpellShapeshift

</details>

<details><summary>خودکار · ردیف تازه در Item (1)</summary>

- id (290333)

</details>

<details><summary>خودکار · ردیف تازه در ItemSearchName (1)</summary>

- Berdun's Trusty Rifle (290333)

</details>

<details><summary>خودکار · آیتم تازه وارد بانک می‌شود (1)</summary>

- Berdun's Trusty Rifle (290333)

</details>

<details><summary>خودکار · ردیف تازه در CurvePoint (78)</summary>

- id (77130)
- id (77131)
- id (77132)
- id (77133)
- id (372543)
- id (372544)
- id (372545)
- id (372546)
- id (372547)
- id (372548)
- id (372549)
- id (372550)
- id (372551)
- id (372552)
- id (372553)

</details>

<details><summary>خودکار · ردیف تازه در Curve (39)</summary>

- id (23847)
- id (23848)
- id (128304)
- id (128305)
- id (128306)
- id (128307)
- id (128308)
- id (128309)
- id (128310)
- id (128311)
- id (128312)
- id (128313)
- id (128314)
- id (128315)
- id (128316)

</details>

<details><summary>خودکار · عدد/فیلد عوض شد (ContentTuning) (1)</summary>

- id (4522): DMGPrimaryStatScalingCurveID

</details>

## بخش‌ها

| بخش | تازه | حذف | تغییر | جدول‌ها |
|---|---|---|---|---|
| سایر | 117 | 0 | 1 | ContentTuning, Curve, CurvePoint |
| اسپل و تلنت | 7 | 1 | 23 | Spell, SpellClassOptions, SpellCooldowns, SpellEffect, SpellEquippedItems, SpellMisc, SpellShapeshift |
| آیتم‌ها | 3 | 0 | 22 | Item, ItemEffect, ItemSearchName, ItemSparse |
| منطقه و نقشه | 0 | 0 | 1 | AreaTable |
