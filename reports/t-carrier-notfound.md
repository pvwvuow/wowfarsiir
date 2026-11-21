# t-carrier-notfound - the talent nodes the 11-pack --apply could not write

Owner order, 22 Nov task 2. The carrier (t_pack_import.py) wrote 329 node dFa
values across the 11 packs; these 74 pack rows found no (cls, tree, name) match
in db/<class>.json - or the matched node has no d to mirror. Per row: the class,
the tree, the talent name and tid from the pack, and the NEAR-MATCH names already
in the site db (same tree first, then the whole class) so Brain can decide the
right mapping. Z guesses nothing and touches nothing here.

| pack tid | class | tree | talent (pack) | near-matches in db (tid) |
|---|---|---|---|---|
| t:761 | druid | Balance | Nature's Grasp | Nature's Grace [Balance] (tree: Balance | fa: برکت طبیعت | d: All non-periodic spell criticals grace you with a blessing of nature, ...) ;; Nature's Majesty [Balance] (tree: Balance | fa: شکوه طبیعت | d: Increases your critical strike chance with spells and melee attacks by...) ;; Nature's Reach [Balance] (tree: Balance | fa: برد طبیعت | d: Increases the range of your offensive Balance spells by 10% and improv...) |
| t:782 | druid | Balance | Improved Thorns | Improved Wrath [Balance] (tree: Balance | fa: تقویت غضب | d: Reduces the cast time of your Wrath spell by 0.1 sec and its Mana cost...) ;; Improved Moonfire [Balance] (tree: Balance | fa: تقویت آتش ماه | d: Increases the damage and critical strike chance of your Moonfire spell...) ;; Improved Tranquility [Restoration] (tree: Restoration | fa: تقویت آرامش | d: Reduces threat caused by Tranquility by 50% and its cooldown by 30%.) |
| t:788 | druid | Balance | Omen of Clarity | none in db |
| t:791 | druid | Balance | Natural Weapons | Natural Reaction [Feral Combat] (tree: Feral Combat | fa: واکنش طبیعی | d: Increases your dodge chance by 1%, and gives you a 20% chance to gain ...) ;; Natural Instinct [Feral Combat] (tree: Feral Combat | fa: غریزهٔ طبیعی | d: Increases the critical strike damage bonus of your melee abilities by ...) ;; Naturalist [Restoration] (tree: Restoration | fa: دانای طبیعت | d: Reduces the cast time of your Healing Touch and Wild Growth spells by ...) |
| t:795 | druid | Feral Combat | Feral Aggression | Feral Swiftness [Feral Combat] (tree: Feral Combat | fa: شتاب وحشی | d: Increases your movement speed while in Cat Form by 15%, and increases ...) ;; Feral Charge [Feral Combat] (tree: Feral Combat | fa: یورش وحشیانه | d: Requires Bear Form, Dire Bear Form
Charge an enemy, immobilizing them ...) ;; Natural Reaction [Feral Combat] (tree: Feral Combat | fa: واکنش طبیعی | d: Increases your dodge chance by 1%, and gives you a 20% chance to gain ...) |
| t:804 | druid | Feral Combat | Feral Charge (Bear) | Feral Charge [Feral Combat] (tree: Feral Combat | fa: یورش وحشیانه | d: Requires Bear Form, Dire Bear Form
Charge an enemy, immobilizing them ...) ;; Natural Shapeshifter [Restoration] (tree: Restoration | fa: تغییرشکل‌دهندهٔ طبیعی | d: Reduces the mana cost of all shapeshifting by 10%.) |
| t:821 | druid | Restoration | Improved Mark of the Wild | Heart of the Wild [Restoration] (tree: Restoration | fa: قلب وحشی | d: Increases your Intellect by 2%. In addition, while in Bear Form or Dir...) ;; Improved Starfire [Balance] (tree: Balance | fa: تقویت آتش ستاره | d: Reduces the cast time of Starfire by 0.1 sec and Starfire has a 3% cha...) ;; Improved Regrowth [Restoration] (tree: Restoration | fa: تقویت رویش دوباره | d: Increases the critical effect chance of your Regrowth spell by 10%.) |
| t:826 | druid | Restoration | Improved Enrage | Improved Wrath [Balance] (tree: Balance | fa: تقویت غضب | d: Reduces the cast time of your Wrath spell by 0.1 sec and its Mana cost...) ;; Improved Moonfire [Balance] (tree: Balance | fa: تقویت آتش ماه | d: Increases the damage and critical strike chance of your Moonfire spell...) ;; Improved Starfire [Balance] (tree: Balance | fa: تقویت آتش ستاره | d: Reduces the cast time of Starfire by 0.1 sec and Starfire has a 3% cha...) |
| t:1301 | hunter | Survival | Humanoid Slaying | Rapid Killing [Marksmanship] (tree: Marksmanship | fa: کشتن سریع | d: Reduces the cooldown on your Rapid Fire ability by 1 min. In addition,...) ;; Improved Stings [Marksmanship] (tree: Marksmanship | fa: تقویت نیش‌ها | d: Increases the damage of your Serpent Sting ability by 6%, reduces the ...) ;; Improved Tracking [Survival] (tree: Survival | fa: تقویت ردیابی | d: While tracking Beasts, Demons, Dragonkin, Elementals, Giants, Humanoid...) |
| t:1309 | hunter | Survival | Improved Feign Death | Improved Mend Pet [Beast Mastery] (tree: Beast Mastery | fa: تقویت درمان حیوان خانگی | d: Gives your Mend Pet spell a 15% chance of cleansing 1 Curse, Disease, ...) ;; Improved Revive Pet [Beast Mastery] (tree: Beast Mastery | fa: تقویت احیای حیوان خانگی | d: Revive Pet's casting time is reduced by 3 sec, mana cost is reduced by...) ;; Improved Wing Clip [Survival] (tree: Survival | fa: تقویت بریدن بال | d: Gives your Wing Clip ability a 7% chance to immobilize the target for ...) |
| t:1343 | hunter | Marksmanship | Improved Hunter's Mark | Improved Tracking [Survival] (tree: Survival | fa: تقویت ردیابی | d: While tracking Beasts, Demons, Dragonkin, Elementals, Giants, Humanoid...) ;; Improved Stings [Marksmanship] (tree: Marksmanship | fa: تقویت نیش‌ها | d: Increases the damage of your Serpent Sting ability by 6%, reduces the ...) ;; Improved Wing Clip [Survival] (tree: Survival | fa: تقویت بریدن بال | d: Gives your Wing Clip ability a 7% chance to immobilize the target for ...) |
| t:1345 | hunter | Marksmanship | Aimed Shot | Sniper Shot [Marksmanship] (tree: Marksmanship | fa: شلیک تک‌تیرانداز | d: A long-range shot that deals ranged damage plus 320 and increases the ...) ;; Scatter Shot [Marksmanship] (tree: Marksmanship | fa: شلیک پراکنده | d: A short-range shot that deals 50% weapon damage and disorients the tar...) ;; Improved Arcane Shot [Marksmanship] (tree: Marksmanship | fa: تقویت شلیک اسرار | d: Reduces the cooldown of your Arcane Shot by 0.3 sec. Does not affect t...) |
| t:1348 | hunter | Marksmanship | Improved Serpent Sting | Improved Stings [Marksmanship] (tree: Marksmanship | fa: تقویت نیش‌ها | d: Increases the damage of your Serpent Sting ability by 6%, reduces the ...) ;; Improved Tracking [Survival] (tree: Survival | fa: تقویت ردیابی | d: While tracking Beasts, Demons, Dragonkin, Elementals, Giants, Humanoid...) ;; Improved Mend Pet [Beast Mastery] (tree: Beast Mastery | fa: تقویت درمان حیوان خانگی | d: Gives your Mend Pet spell a 15% chance of cleansing 1 Curse, Disease, ...) |
| t:1395 | hunter | Beast Mastery | Thick Hide | none in db |
| t:1624 | hunter | Beast Mastery | Improved Eyes of the Beast | Improved Aspect of the Monkey [Beast Mastery] (tree: Beast Mastery | fa: تقویت جنبهٔ میمون | d: Increases the Dodge bonus of your Aspect of the Monkey by 2%. Addition...) ;; Improved Revive Pet [Beast Mastery] (tree: Beast Mastery | fa: تقویت احیای حیوان خانگی | d: Revive Pet's casting time is reduced by 3 sec, mana cost is reduced by...) ;; Improved Mend Pet [Beast Mastery] (tree: Beast Mastery | fa: تقویت درمان حیوان خانگی | d: Gives your Mend Pet spell a 15% chance of cleansing 1 Curse, Disease, ...) |
| t:1321 | hunter | Survival | Killer Instinct | none in db |
| t:1649 | mage | Frost | Elemental Precision | Precision [Frost] (tree: Frost | fa: دقت | d: Improves your chance to hit with all spells by 2%.) |
| t:26 | mage | Fire | Improved Fireball | Improved Fire Ward [Fire] (tree: Fire | fa: تقویت محافظ آتش | d: Causes your Fire Ward to have a 10% chance to reflect Fire spells whil...) ;; Improved Fire Blast [Fire] (tree: Fire | fa: تقویت انفجار آتش | d: Reduces the cooldown of your Fire Blast spell by 1 sec and increases i...) ;; Improved Frostbolt [Frost] (tree: Frost | fa: تقویت گوی یخ | d: Reduces the casting time of your Frostbolt spell by 0.1 sec.) |
| t:76 | mage | Arcane | Arcane Focus | Arcane Power [Arcane] (tree: Arcane | fa: قدرت اسرار | d: For the next 15 sec, your spells deal 30% more damage while costing 30...) ;; Arcane Blast [Arcane] (tree: Arcane | fa: ضربهٔ اسرار | d: Blasts the target with energy, dealing 34 to 38 Arcane damage. Each ti...) ;; Arcane Impact [Arcane] (tree: Arcane | fa: اثر اسرار | d: Increases the critical strike chance of your Arcane spells by 2%.) |
| t:1422 | paladin | Protection | Improved Devotion Aura | Improved Righteous Fury [Protection] (tree: Protection | fa: تقویت خشم دادگر | d: While Righteous Fury is active, all damage taken is reduced by 3%.) ;; Improved Seals [Holy] (tree: Holy | fa: تقویت مهرها | d: Increases the damage done by your Seals and Judgements by 3%.) ;; Improved Hammer of Justice [Protection] (tree: Protection | fa: تقویت چکش عدالت | d: Decreases the cooldown of your Hammer of Justice spell by 5 sec.) |
| t:1429 | paladin | Protection | One-Handed Weapon Specialization | Two-Handed Weapon Specialization [Retribution] (tree: Retribution | fa: تخصص سلاح دو دستی | d: Increases the Physical and Holy damage you deal by 2%, and reduces all...) ;; Shield Specialization [Protection] (tree: Protection | fa: تخصص سپر | d: Increases the amount of damage absorbed by your shield by 15%, and giv...) |
| t:1435 | paladin | Holy | Consecration | Consecrated Ground [Holy] (tree: Holy | fa: زمین مقدس | d: Gives your Holy spells 5% increased damage against the first 4 enemies...) ;; Conviction [Retribution] (tree: Retribution | fa: باور راسخ | d: Improves your chance to get a critical strike with all spells and atta...) ;; Vindication [Retribution] (tree: Retribution | fa: تضعیف حریف | d: Gives your damaging melee attacks a chance to reduce the target's Atta...) |
| t:1442 | paladin | Protection | Blessing of Kings | Infusion of Light [Holy] (tree: Holy | fa: دمیدن نور | d: Your Holy Shock and Flash of Light critical hits reduce the cast time ...) ;; Boundless Light [Holy] (tree: Holy | fa: نور بی‌کران | d: ) ;; Healing Light [Holy] (tree: Holy | fa: نور شفا | d: Increases the amount healed by your Holy Light, Flash of Light, and Ho...) |
| t:1446 | paladin | Holy | Improved Blessing of Wisdom | Improved Hammer of Justice [Protection] (tree: Protection | fa: تقویت چکش عدالت | d: Decreases the cooldown of your Hammer of Justice spell by 5 sec.) ;; Improved Seals [Holy] (tree: Holy | fa: تقویت مهرها | d: Increases the damage done by your Seals and Judgements by 3%.) ;; Improved Righteous Fury [Protection] (tree: Protection | fa: تقویت خشم دادگر | d: While Righteous Fury is active, all damage taken is reduced by 3%.) |
| t:1465 | paladin | Holy | Lasting Judgement | Sanctified Judgement [Retribution] (tree: Retribution | fa: داوری تقدیس‌شده | d: Gives your Judgement ability a 33% chance to return 20% of the Mana co...) ;; Swift Judgement [Protection] (tree: Protection | fa: داوری سریع | d: Unleash the energy of a Seal spell upon an enemy. Does not consume the...) ;; Improved Judgement [Retribution] (tree: Retribution | fa: تقویت داوری مقدس | d: Decreases the cooldown of your Judgement ability by 1 sec.) |
| t:61 | mage | Frost | Piercing Ice | Arcane Impact [Arcane] (tree: Arcane | fa: اثر اسرار | d: Increases the critical strike chance of your Arcane spells by 2%.) ;; Precision [Frost] (tree: Frost | fa: دقت | d: Improves your chance to hit with all spells by 2%.) ;; Heating Up [Fire] (tree: Fire | fa: داغ‌شدن | d: Non-periodic critical strikes with Fireball, Frostfire Bolt, Fire Blas...) |
| t:1202 | priest | Discipline | Force of Will | Prayer of Mending [Holy] (tree: Holy | fa: دعای ترمیم | d: Places a spell on the target that heals them for 172 the next time the...) |
| t:1401 | paladin | Retribution | Improved Blessing of Might | Improved Hammer of Justice [Protection] (tree: Protection | fa: تقویت چکش عدالت | d: Decreases the cooldown of your Hammer of Justice spell by 5 sec.) ;; Infusion of Light [Holy] (tree: Holy | fa: دمیدن نور | d: Your Holy Shock and Flash of Light critical hits reduce the cast time ...) ;; Improved Seals [Holy] (tree: Holy | fa: تقویت مهرها | d: Increases the damage done by your Seals and Judgements by 3%.) |
| t:1405 | paladin | Retribution | Improved Retribution Aura | Improved Righteous Fury [Protection] (tree: Protection | fa: تقویت خشم دادگر | d: While Righteous Fury is active, all damage taken is reduced by 3%.) ;; Improved Seals [Holy] (tree: Holy | fa: تقویت مهرها | d: Increases the damage done by your Seals and Judgements by 3%.) ;; Improved Hammer of Justice [Protection] (tree: Protection | fa: تقویت چکش عدالت | d: Decreases the cooldown of your Hammer of Justice spell by 5 sec.) |
| t:1409 | paladin | Retribution | Sanctity Aura | Sanctified Judgement [Retribution] (tree: Retribution | fa: داوری تقدیس‌شده | d: Gives your Judgement ability a 33% chance to return 20% of the Mana co...) |
| t:1464 | paladin | Retribution | Improved Seal of the Crusader | Improved Seals [Holy] (tree: Holy | fa: تقویت مهرها | d: Increases the damage done by your Seals and Judgements by 3%.) ;; Improved Hammer of Justice [Protection] (tree: Protection | fa: تقویت چکش عدالت | d: Decreases the cooldown of your Hammer of Justice spell by 5 sec.) ;; Improved Righteous Fury [Protection] (tree: Protection | fa: تقویت خشم دادگر | d: While Righteous Fury is active, all damage taken is reduced by 3%.) |
| t:1481 | paladin | Retribution | Seal of Command | Seal of Command [Retribution] (tree: Retribution | fa: مهر فرمان | d: ) |
| t:1626 | paladin | Protection | Improved Concentration Aura | Improved Righteous Fury [Protection] (tree: Protection | fa: تقویت خشم دادگر | d: While Righteous Fury is active, all damage taken is reduced by 3%.) ;; Improved Seals [Holy] (tree: Holy | fa: تقویت مهرها | d: Increases the damage done by your Seals and Judgements by 3%.) ;; Improved Judgement [Retribution] (tree: Retribution | fa: تقویت داوری مقدس | d: Decreases the cooldown of your Judgement ability by 1 sec.) |
| t:1637 | priest | Holy | Lightwell | Searing Light [Holy] (tree: Holy | fa: نور سوزان | d: Increases your Holy damage done by 2%, and gives a 5% chance each time...) |
| t:342 | priest | Discipline | Unbreakable Will | none in db |
| t:344 | priest | Discipline | Improved Power Word: Fortitude | Improved Power Word: Shield [Discipline] (tree: Discipline | fa: تقویت کلام قدرت: سپر | d: Increases the damage absorbed by your Power Word: Shield by 7%.) ;; Improved Shadow Word: Pain [Shadow] (tree: Shadow | fa: تقویت کلام سایه: درد | d: Increases the duration of your Shadow Word: Pain spell by 3 sec.) ;; Improved Inner Fire [Discipline] (tree: Discipline | fa: تقویت آتش درونی | d: Increases the Armor bonus of your Inner Fire spell by 15% and increase...) |
| t:351 | priest | Discipline | Divine Spirit | Divine Fury [Holy] (tree: Holy | fa: خشم الهی | d: Reduces the casting time of your Smite, Holy Fire, Heal, and Greater H...) ;; Divine Aegis [Discipline] (tree: Discipline | fa: سپر الهی | d: Your non-periodic critical heals create a protective shield on the tar...) ;; Spirit Tap [Shadow] (tree: Shadow | fa: تماس روح | d: Gives you a 20% chance to increase your Spirit by 100% for 15 sec afte...) |
| t:1638 | priest | Shadow | Improved Vampiric Embrace | Vampiric Embrace [Shadow] (tree: Shadow | fa: آغوش خون‌آشام | d: Afflicts your target with Shadow energy that causes all party members ...) ;; Improved Psychic Scream [Shadow] (tree: Shadow | fa: تقویت فریاد روانی | d: Reduces the cooldown of your Psychic Scream spell by 2 sec.) ;; Improved Mind Flay [Shadow] (tree: Shadow | fa: تقویت شلاق ذهن | d: Each instance of damage of Mind Flay deals 10% more damage than its pr...) |
| t:274 | rogue | Assassination | Murder | none in db |
| t:276 | rogue | Assassination | Improved Eviscerate | Improved Kick [Combat] (tree: Combat | fa: تقویت لگد | d: Gives your Kick ability a 50% chance to Silence the target for 2 sec.) ;; Improved Slice and Dice [Assassination] (tree: Assassination | fa: تقویت برش و خردکردن | d: Increases the duration of your Slice and Dice ability by 15%.) ;; Improved Expose Armor [Assassination] (tree: Assassination | fa: تقویت آشکارسازی زره | d: Reduces the Energy cost of your Expose Armor ability by 5, and refunds...) |
| t:466 | priest | Shadow | Shadow Affinity | Shadow Weaving [Shadow] (tree: Shadow | fa: بافتن سایه | d: Your Shadow damage spells have a 33% chance to increase the Shadow dam...) ;; Shadowform [Shadow] (tree: Shadow | fa: شکل سایه | d: Assume Shadowform, increasing your Shadow damage by 10%, reducing the ...) ;; Shadow Reach [Shadow] (tree: Shadow | fa: برد سایه | d: Increases the range of your offensive Shadow spells by 10%.) |
| t:483 | priest | Shadow | Improved Fade | Improved Renew [Holy] (tree: Holy | fa: تقویت نوسازی | d: Increases the amount healed by your Renew spell by 5%.) ;; Improved Healing [Holy] (tree: Holy | fa: تقویت شفا | d: Reduces the Mana cost of your Lesser Heal, Heal, Greater Heal, Penance...) ;; Improved Mind Flay [Shadow] (tree: Shadow | fa: تقویت شلاق ذهن | d: Each instance of damage of Mind Flay deals 10% more damage than its pr...) |
| t:1700 | rogue | Subtlety | Sleight of Hand | none in db |
| t:1702 | rogue | Subtlety | Deadliness | Elusiveness [Subtlety] (tree: Subtlety | fa: گریزپذیری | d: Reduces the cooldown of your Vanish and Blind abilities by 45 sec.) ;; Malice [Assassination] (tree: Assassination | fa: کینه | d: Increases your critical strike chance with all attacks and Poisons by ...) ;; Adrenaline Rush [Combat] (tree: Combat | fa: جهش آدرنالین | d: Increases your Energy regeneration rate by 100% for 15 sec.) |
| t:183 | rogue | Combat | Fist Weapon Specialization | Dual Wield Specialization [Combat] (tree: Combat | fa: تخصص دو سلاحی | d: Increases the damage done by your off-hand weapon by 5%.) ;; Weapon Expertise [Combat] (tree: Combat | fa: خبرگی سلاح | d: Reduces the chance for your attacks to be Dodged or Parried by 1%.) |
| t:201 | rogue | Combat | Improved Sinister Strike | Improved Kidney Shot [Assassination] (tree: Assassination | fa: تقویت ضربهٔ کلیه | d: Enemies Stunned by your Kidney Shot ability take 5% increased damage f...) ;; Improved Slice and Dice [Assassination] (tree: Assassination | fa: تقویت برش و خردکردن | d: Increases the duration of your Slice and Dice ability by 15%.) ;; Improved Sprint [Combat] (tree: Combat | fa: تقویت دوی سرعت | d: Gives a 50% chance to remove all movement impairing effects when you a...) |
| t:262 | rogue | Subtlety | Improved Sap | Improved Sprint [Combat] (tree: Combat | fa: تقویت دوی سرعت | d: Gives a 50% chance to remove all movement impairing effects when you a...) ;; Improved Kick [Combat] (tree: Combat | fa: تقویت لگد | d: Gives your Kick ability a 50% chance to Silence the target for 2 sec.) ;; Improved Gouge [Assassination] (tree: Assassination | fa: تقویت خراش | d: Increases the duration of your Gouge ability by 0.5 sec.) |
| t:1643 | shaman | Enhancement | Weapon Mastery | Tidal Mastery [Restoration] (tree: Restoration | fa: استادی جزرومدی | d: Increases the critical effect chance of your healing spells by 1%.) ;; Lightning Mastery [Elemental] (tree: Elemental | fa: استادی آذرخش | d: Gain mastery over Lightning, reducing the cast time of your Lightning ...) ;; Spirit Weapons [Enhancement] (tree: Enhancement | fa: سلاح‌های روح | d: Gives a chance to parry enemy melee attacks, reduces all threat genera...) |
| t:1647 | shaman | Enhancement | Improved Weapon Totems | Improved Healing Wave [Restoration] (tree: Restoration | fa: تقویت موج شفا | d: Reduces the casting time of your Healing Wave spell by 0.1 sec.) ;; Improved Reincarnation [Restoration] (tree: Restoration | fa: تقویت بازگشت به زندگی | d: Reduces the cooldown of your Reincarnation spell by 10 min, increases ...) ;; Improved Stormstrike [Enhancement] (tree: Enhancement | fa: تقویت ضربهٔ توفان | d: When you Stormstrike, you have a 50% chance to gain 50% mana regenerat...) |
| t:573 | shaman | Elemental | Elemental Mastery | Elemental Fury [Elemental] (tree: Elemental | fa: خشم بنیادی | d: Increases the critical strike damage bonus of your Searing and Magma T...) ;; Elemental Alacrity [Elemental] (tree: Elemental | fa: شتاب بنیادی | d: Reduces the cast time of your Lightning Bolt and Chain Lightning spell...) ;; Elemental Warding [Elemental] (tree: Elemental | fa: محافظت بنیادی | d: Reduces damage taken from Fire, Frost, and Nature effects by 3%.) |
| t:582 | shaman | Restoration | Totemic Mastery | Tidal Mastery [Restoration] (tree: Restoration | fa: استادی جزرومدی | d: Increases the critical effect chance of your healing spells by 1%.) ;; Totemic Focus [Restoration] (tree: Restoration | fa: تمرکز توتمی | d: Reduces the Mana cost of your totems and any spells that summon or mov...) ;; Lightning Mastery [Elemental] (tree: Elemental | fa: استادی آذرخش | d: Gain mastery over Lightning, reducing the cast time of your Lightning ...) |
| t:583 | shaman | Restoration | Nature's Guidance | Nature's Swiftness [Restoration] (tree: Restoration | fa: شتاب طبیعت | d: When activated, your next Nature spell with a casting time less than 1...) ;; Natural Grace [Restoration] (tree: Restoration | fa: لطف طبیعت | d: Reduces the threat generated by your spells by 5%.) ;; Earth's Grasp [Enhancement] (tree: Enhancement | fa: چنگ زمین | d: Increases the health of your Stoneclaw Totem by 25% and the radius of ...) |
| t:610 | shaman | Enhancement | Enhancing Totems | Mana Tide Totem [Restoration] (tree: Restoration | fa: توتم جزر مانا | d: Summons a Mana Tide Totem with 5 health at the feet of the caster for ...) ;; Guardian Totems [Enhancement] (tree: Enhancement | fa: توتم‌های نگهبان | d: Increases the amount of damage reduced by your Stoneskin Totem and Win...) ;; Thundering Strikes [Enhancement] (tree: Enhancement | fa: ضربه‌های تندر | d: Improves your chance to get a critical strike with all spells and atta...) |
| t:612 | shaman | Enhancement | Shield Specialization | Improved Reincarnation [Restoration] (tree: Restoration | fa: تقویت بازگشت به زندگی | d: Reduces the cooldown of your Reincarnation spell by 10 min, increases ...) ;; Anticipation [Enhancement] (tree: Enhancement | fa: پیش‌بینی | d: Increases your chance to dodge by an additional 2%.) |
| t:617 | shaman | Enhancement | Two-Handed Axes and Maces | none in db |
| t:1006 | warlock | Affliction | Improved Curse of Weakness | Improved Drains [Affliction] (tree: Affliction | fa: تقویت تخلیه‌ها | d: Increases Health drained, damage done, or Mana drained by your Drain L...) ;; Improved Bane of Agony [Affliction] (tree: Affliction | fa: تقویت بلای رنج | d: Increases the damage done by your Bane of Agony by 5%.) ;; Improved Voidwalker [Demonology] (tree: Demonology | fa: تقویت تهی‌پیما | d: Increases the effectiveness of your Voidwalker's Torment, Consume Shad...) |
| t:1082 | warlock | Affliction | Improved Curse of Exhaustion | Curse of Exhaustion [Affliction] (tree: Affliction | fa: نفرین فرسودگی | d: Reduces the target's movement speed by 30% for 12 sec. Only one Curse ...) ;; Improved Corruption [Affliction] (tree: Affliction | fa: تقویت فساد | d: Reduces the casting time of your Corruption spell by 0.4 sec and incre...) ;; Improved Bane of Agony [Affliction] (tree: Affliction | fa: تقویت بلای رنج | d: Increases the damage done by your Bane of Agony by 5%.) |
| t:1221 | warlock | Demonology | Improved Healthstone | Improved Health Funnel [Demonology] (tree: Demonology | fa: تقویت مجرای سلامتی | d: Increases the amount of health transferred by your Health Funnel spell...) ;; Improved Felhunter [Demonology] (tree: Demonology | fa: تقویت شکارچی پلید | d: Increases the Attack Power reduction of your Felhunter's Tainted Blood...) ;; Improved Drains [Affliction] (tree: Affliction | fa: تقویت تخلیه‌ها | d: Increases Health drained, damage done, or Mana drained by your Drain L...) |
| t:1261 | warlock | Demonology | Improved Firestone | Improved Felhunter [Demonology] (tree: Demonology | fa: تقویت شکارچی پلید | d: Increases the Attack Power reduction of your Felhunter's Tainted Blood...) ;; Improved Corruption [Affliction] (tree: Affliction | fa: تقویت فساد | d: Reduces the casting time of your Corruption spell by 0.4 sec and incre...) ;; Improved Drains [Affliction] (tree: Affliction | fa: تقویت تخلیه‌ها | d: Increases Health drained, damage done, or Mana drained by your Drain L...) |
| t:1263 | warlock | Demonology | Improved Spellstone | Improved Felhunter [Demonology] (tree: Demonology | fa: تقویت شکارچی پلید | d: Increases the Attack Power reduction of your Felhunter's Tainted Blood...) ;; Improved Corruption [Affliction] (tree: Affliction | fa: تقویت فساد | d: Reduces the casting time of your Corruption spell by 0.4 sec and incre...) ;; Improved Health Funnel [Demonology] (tree: Demonology | fa: تقویت مجرای سلامتی | d: Increases the amount of health transferred by your Health Funnel spell...) |
| t:1283 | warlock | Demonology | Improved Subjugate Demon | Improved Bane of Agony [Affliction] (tree: Affliction | fa: تقویت بلای رنج | d: Increases the damage done by your Bane of Agony by 5%.) ;; Improved Corruption [Affliction] (tree: Affliction | fa: تقویت فساد | d: Reduces the casting time of your Corruption spell by 0.4 sec and incre...) ;; Improved Felhunter [Demonology] (tree: Demonology | fa: تقویت شکارچی پلید | d: Increases the Attack Power reduction of your Felhunter's Tainted Blood...) |
| t:961 | warlock | Destruction | Improved Immolate | Improved Imp [Demonology] (tree: Demonology | fa: تقویت ایمپ | d: Increases the damage of your Imp's Firebolt spell by 10% and the effec...) ;; Improved Felhunter [Demonology] (tree: Demonology | fa: تقویت شکارچی پلید | d: Increases the Attack Power reduction of your Felhunter's Tainted Blood...) ;; Improved Voidwalker [Demonology] (tree: Demonology | fa: تقویت تهی‌پیما | d: Increases the effectiveness of your Voidwalker's Torment, Consume Shad...) |
| t:966 | warlock | Destruction | Emberstorm | none in db |
| t:981 | warlock | Destruction | Devastation | Decimation [Demonology] (tree: Demonology | fa: قلع‌وقمع | d: Reduces the cooldown of your Soul Fire spell by 45%. When you cast Sha...) ;; Fel Concentration [Affliction] (tree: Affliction | fa: تمرکز پلید | d: Gives your Drain Life, Drain Mana, Drain Soul, and Wrack spells a 23% ...) ;; Fel Domination [Demonology] (tree: Demonology | fa: سلطهٔ پلید | d: Your next Imp, Voidwalker, Succubus, Incubus, or Felhunter Summon spel...) |
| t:140 | warrior | Protection | Toughness | none in db |
| t:154 | warrior | Fury | Improved Battle Shout | Improved Execute [Fury] (tree: Fury | fa: تقویت ضربهٔ نهایی | d: Reduces the Rage cost of your Execute ability by 3.) ;; Improved Intercept [Fury] (tree: Fury | fa: تقویت رهگیری | d: Reduces the cooldown of your Intercept ability by 5 sec.) ;; Improved Bloodrage [Protection] (tree: Protection | fa: تقویت خشم خونین | d: Increases all the Rage generated by your Bloodrage ability by 25%.) |
| t:156 | warrior | Fury | Flurry | Flurry [Fury] (tree: Fury | fa: رگبار | d: ) |
| t:161 | warrior | Fury | Improved Demoralizing Shout | Improved Heroic Strike [Arms] (tree: Arms | fa: تقویت ضربهٔ قهرمانانه | d: Reduces the cost of your Heroic Strike ability by 1 Rage.) ;; Improved Hamstring [Arms] (tree: Arms | fa: تقویت پارگی تاندون | d: Gives your Hamstring ability a 5% chance to immobilize the target for ...) ;; Improved Bloodrage [Protection] (tree: Protection | fa: تقویت خشم خونین | d: Increases all the Rage generated by your Bloodrage ability by 25%.) |
| t:166 | warrior | Fury | Improved Cleave | Improved Charge [Arms] (tree: Arms | fa: تقویت یورش | d: Increases the Rage generated by your Charge ability by 3.) ;; Improved Slam [Arms] (tree: Arms | fa: تقویت کوبش | d: Reduces the cooldown of your Slam ability by 0.25 sec, the cast time a...) ;; Improved Revenge [Protection] (tree: Protection | fa: تقویت انتقام | d: Increases damage dealt by your Revenge ability by 20%.) |
| t:983 | warlock | Destruction | Improved Firebolt | Improved Felhunter [Demonology] (tree: Demonology | fa: تقویت شکارچی پلید | d: Increases the Attack Power reduction of your Felhunter's Tainted Blood...) ;; Improved Shadow Bolt [Destruction] (tree: Destruction | fa: تقویت تیر سایه | d: Your Shadow Bolt critical strikes increase Shadow damage taken by the ...) ;; Improved Life Tap [Affliction] (tree: Affliction | fa: تقویت تبدیل جان | d: Increases the amount of Mana awarded by your Life Tap spell by 10%.) |
| t:984 | warlock | Destruction | Improved Lash of Pain | Improved Bane of Agony [Affliction] (tree: Affliction | fa: تقویت بلای رنج | d: Increases the damage done by your Bane of Agony by 5%.) ;; Improved Drains [Affliction] (tree: Affliction | fa: تقویت تخلیه‌ها | d: Increases Health drained, damage done, or Mana drained by your Drain L...) ;; Improved Sayaad [Demonology] (tree: Demonology | fa: تقویت سیااد | d: Increases the effect of your Succubus' and Incubus' Lash of Pain and S...) |
| t:986 | warlock | Destruction | Apocalypse | Amplify Curse [Affliction] (tree: Affliction | fa: تقویت نفرین | d: Increases the effect of your next Curse of Weakness or Bane of Agony b...) |
| t:143 | warrior | Protection | Improved Taunt | Improved Slam [Arms] (tree: Arms | fa: تقویت کوبش | d: Reduces the cooldown of your Slam ability by 0.25 sec, the cast time a...) ;; Improved Rend [Arms] (tree: Arms | fa: تقویت دریدن | d: Increases the Bleed damage done by your Rend ability by 12%.) ;; Improved Execute [Fury] (tree: Fury | fa: تقویت ضربهٔ نهایی | d: Reduces the Rage cost of your Execute ability by 3.) |
| t:145 | warrior | Protection | Improved Shield Block | Improved Shield Wall [Protection] (tree: Protection | fa: تقویت دیوار سپر | d: Reduces the cooldown of your Shield Wall ability by 5.5 min.) ;; Improved Shield Bash [Protection] (tree: Protection | fa: تقویت کوبش سپر | d: Gives your Shield Bash ability a 50% chance to Silence the target for ...) ;; Improved Whirlwind [Fury] (tree: Fury | fa: ضربه‌های خشمگین | d: Reduces the Rage cost of your Cleave and Whirlwind abilities by 3.) |

## Rows the resolver skipped (needs Brain Persian)

The site rule B3 forbids raw client tokens in dFa and the acceptance test
requires the FA numbers to match the EN numbers. The carrier resolves the
numeric tokens by position (the example walk); rows whose fa still carries
TEXT tokens ($n, $L singular:plural, letter-only $d) or whose number lineage
does not align are SKIPPED for Brain - the pack wording is ready except for
those spans. Per row: the class, tree, talent name and tid from the pack, and
the resolver reason.

| pack tid | class | tree | talent (pack) | resolver reason |
|---|---|---|---|---|
| t:762 | druid | Balance | Improved Wrath | 3 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:784 | druid | Balance | Improved Starfire | 4 number run(s) in the example but 3 in the EN d - lineage mismatch |
| t:789 | druid | Balance | Nature's Grace | fa still carries non-numeric token(s)  - needs Brain Persian |
| t:793 | druid | Balance | Moonkin Form | 7 number run(s) in the example but 4 in the EN d - lineage mismatch |
| t:794 | druid | Feral Combat | Thick Hide | 4 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:796 | druid | Feral Combat | Ferocity | 2 number run(s) in the example but 1 in the EN d - lineage mismatch |
| t:797 | druid | Feral Combat | Brutal Impact | 4 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:799 | druid | Feral Combat | Feral Instinct | 3 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:801 | druid | Feral Combat | Blood Frenzy | 5 number run(s) in the example but 3 in the EN d - lineage mismatch |
| t:802 | druid | Feral Combat | Shredding Attacks | 3 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:809 | druid | Feral Combat | Leader of the Pack | 4 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:822 | druid | Restoration | Furor | 13 number run(s) in the example but 5 in the EN d - lineage mismatch |
| t:824 | druid | Restoration | Naturalist | 3 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:827 | druid | Restoration | Insect Swarm | 2 number run(s) in the example but 3 in the EN d - lineage mismatch |
| t:1304 | hunter | Survival | Entrapment | 2 number run(s) in the example but 1 in the EN d - lineage mismatch |
| t:1305 | hunter | Survival | Improved Wing Clip | fa still carries non-numeric token(s)  - needs Brain Persian |
| t:1308 | hunter | Survival | Deterrence | 1 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:1341 | hunter | Marksmanship | Improved Concussive Shot | fa still carries non-numeric token(s)  - needs Brain Persian |
| t:1346 | hunter | Marksmanship | Improved Arcane Shot | 2 number run(s) in the example but 1 in the EN d - lineage mismatch |
| t:1353 | hunter | Marksmanship | Scatter Shot | 1 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:1361 | hunter | Marksmanship | Trueshot Aura | fa still carries non-numeric token(s) $d - needs Brain Persian |
| t:1382 | hunter | Beast Mastery | Deadly Aspects | 8 number run(s) in the example but 6 in the EN d - lineage mismatch |
| t:1385 | hunter | Beast Mastery | Improved Mend Pet | 4 number run(s) in the example but 3 in the EN d - lineage mismatch |
| t:1386 | hunter | Beast Mastery | Bestial Wrath | 1 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:1387 | hunter | Beast Mastery | Intimidation | fa still carries non-numeric token(s)  - needs Brain Persian |
| t:1397 | hunter | Beast Mastery | Frenzy | 4 number run(s) in the example but 3 in the EN d - lineage mismatch |
| t:1625 | hunter | Beast Mastery | Improved Revive Pet | 4 number run(s) in the example but 3 in the EN d - lineage mismatch |
| t:1312 | hunter | Survival | Counterattack | 2 number run(s) in the example but 3 in the EN d - lineage mismatch |
| t:25 | mage | Fire | Improved Scorch | 5 number run(s) in the example but 4 in the EN d - lineage mismatch |
| t:27 | mage | Fire | Improved Fire Blast | 3 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:29 | mage | Fire | Pyroblast | 2 number run(s) in the example but 4 in the EN d - lineage mismatch |
| t:30 | mage | Fire | Impact | fa still carries non-numeric token(s)  - needs Brain Persian |
| t:32 | mage | Fire | Blast Wave | 2 number run(s) in the example but 4 in the EN d - lineage mismatch |
| t:34 | mage | Fire | Ignite | fa still carries non-numeric token(s)  - needs Brain Persian |
| t:35 | mage | Fire | Fire Power | 3 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:36 | mage | Fire | Combustion | fa still carries non-numeric token(s) $n - needs Brain Persian |
| t:75 | mage | Arcane | Arcane Concentration | 4 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:87 | mage | Arcane | Arcane Power | 2 number run(s) in the example but 3 in the EN d - lineage mismatch |
| t:88 | mage | Arcane | Improved Counterspell | 2 number run(s) in the example but 1 in the EN d - lineage mismatch |
| t:1421 | paladin | Protection | Redoubt | 3 number run(s) in the example but 4 in the EN d - lineage mismatch |
| t:1424 | paladin | Protection | Shield Specialization | 1 number run(s) in the example but 4 in the EN d - lineage mismatch |
| t:1425 | paladin | Protection | Guardian's Favor | 4 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:1426 | paladin | Protection | Reckoning | 5 number run(s) in the example but 4 in the EN d - lineage mismatch |
| t:1430 | paladin | Protection | Holy Shield | 3 number run(s) in the example but 5 in the EN d - lineage mismatch |
| t:1502 | paladin | Holy | Holy Shock | fa still carries non-numeric token(s)  - needs Brain Persian |
| t:1521 | paladin | Protection | Improved Hammer of Justice | 2 number run(s) in the example but 1 in the EN d - lineage mismatch |
| t:1627 | paladin | Holy | Holy Power | 2 number run(s) in the example but 1 in the EN d - lineage mismatch |
| t:37 | mage | Frost | Improved Frostbolt | 2 number run(s) in the example but 1 in the EN d - lineage mismatch |
| t:38 | mage | Frost | Frostbite | fa still carries non-numeric token(s)  - needs Brain Persian |
| t:62 | mage | Frost | Improved Frost Nova | 2 number run(s) in the example but 1 in the EN d - lineage mismatch |
| t:63 | mage | Frost | Improved Blizzard | fa still carries non-numeric token(s)  - needs Brain Persian |
| t:68 | mage | Frost | Winter's Chill | 5 number run(s) in the example but 4 in the EN d - lineage mismatch |
| t:71 | mage | Frost | Ice Barrier | 9 number run(s) in the example but 4 in the EN d - lineage mismatch |
| t:72 | mage | Frost | Ice Block | 0 number run(s) in the example but 1 in the EN d - lineage mismatch |
| t:1181 | priest | Holy | Divine Fury | 2 number run(s) in the example but 1 in the EN d - lineage mismatch |
| t:1402 | paladin | Retribution | Vengeance | fa still carries non-numeric token(s)  - needs Brain Persian |
| t:1410 | paladin | Retribution | Two-Handed Weapon Specialization | 1 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:1441 | paladin | Retribution | Repentance | 0 number run(s) in the example but 1 in the EN d - lineage mismatch |
| t:1561 | priest | Holy | Spirit of Redemption | fa still carries non-numeric token(s)  - needs Brain Persian |
| t:1631 | paladin | Retribution | Improved Judgement | 2 number run(s) in the example but 1 in the EN d - lineage mismatch |
| t:1633 | paladin | Retribution | Vindication | 6 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:1636 | priest | Holy | Blessed Recovery | fa still carries non-numeric token(s)  - needs Brain Persian |
| t:321 | priest | Discipline | Martyrdom | 4 number run(s) in the example but 3 in the EN d - lineage mismatch |
| t:322 | priest | Discipline | Power Infusion | 1 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:350 | priest | Discipline | Improved Mana Burn | 3 number run(s) in the example but 1 in the EN d - lineage mismatch |
| t:361 | priest | Holy | Inspiration | fa still carries non-numeric token(s)  - needs Brain Persian |
| t:272 | rogue | Assassination | Remorseless Attacks | fa still carries non-numeric token(s)  - needs Brain Persian |
| t:278 | rogue | Assassination | Improved Expose Armor | fa still carries non-numeric token(s) $LPoint:واحد; - needs Brain Persian |
| t:281 | rogue | Assassination | Relentless Strikes | 3 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:442 | priest | Holy | Holy Nova | fa still carries non-numeric token(s)  - needs Brain Persian |
| t:461 | priest | Shadow | Shadow Weaving | 5 number run(s) in the example but 4 in the EN d - lineage mismatch |
| t:464 | priest | Shadow | Blackout | 1 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:465 | priest | Shadow | Spirit Tap | 6 number run(s) in the example but 4 in the EN d - lineage mismatch |
| t:481 | priest | Shadow | Improved Mind Blast | 2 number run(s) in the example but 1 in the EN d - lineage mismatch |
| t:482 | priest | Shadow | Improved Shadow Word: Pain | 2 number run(s) in the example but 1 in the EN d - lineage mismatch |
| t:484 | priest | Shadow | Vampiric Embrace | 1 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:501 | priest | Shadow | Mind Flay | 2 number run(s) in the example but 3 in the EN d - lineage mismatch |
| t:541 | priest | Shadow | Silence | 1 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:542 | priest | Shadow | Improved Psychic Scream | 2 number run(s) in the example but 1 in the EN d - lineage mismatch |
| t:1641 | shaman | Elemental | Elemental Reach | 3 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:1645 | shaman | Elemental | Elemental Devastation | fa still carries non-numeric token(s)  - needs Brain Persian |
| t:1701 | rogue | Subtlety | Heightened Senses | 3 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:182 | rogue | Combat | Hack and Slash | 1 number run(s) in the example but 3 in the EN d - lineage mismatch |
| t:184 | rogue | Combat | Hack and Slash | 1 number run(s) in the example but 3 in the EN d - lineage mismatch |
| t:203 | rogue | Combat | Improved Gouge | 2 number run(s) in the example but 1 in the EN d - lineage mismatch |
| t:205 | rogue | Combat | Adrenaline Rush | 1 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:206 | rogue | Combat | Improved Kick | fa still carries non-numeric token(s)  - needs Brain Persian |
| t:223 | rogue | Combat | Blade Flurry | 1 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:241 | rogue | Subtlety | Master of Deception | 2 number run(s) in the example but 1 in the EN d - lineage mismatch |
| t:244 | rogue | Subtlety | Camouflage | 3 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:247 | rogue | Subtlety | Elusiveness | 2 number run(s) in the example but 1 in the EN d - lineage mismatch |
| t:301 | rogue | Combat | Riposte | fa still carries non-numeric token(s)  - needs Brain Persian |
| t:303 | rogue | Subtlety | Ghostly Strike | 4 number run(s) in the example but 5 in the EN d - lineage mismatch |
| t:381 | rogue | Subtlety | Premeditation | 1 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:561 | shaman | Elemental | Call of Flame | 3 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:681 | rogue | Subtlety | Hemorrhage | 4 number run(s) in the example but 5 in the EN d - lineage mismatch |
| t:1002 | warlock | Affliction | Nightfall | 3 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:567 | shaman | Elemental | Trial by Fire | 5 number run(s) in the example but 3 in the EN d - lineage mismatch |
| t:574 | shaman | Elemental | Elemental Focus | 3 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:575 | shaman | Elemental | Reverberation | 3 number run(s) in the example but 1 in the EN d - lineage mismatch |
| t:581 | shaman | Restoration | Ancestral Healing | fa still carries non-numeric token(s)  - needs Brain Persian |
| t:586 | shaman | Restoration | Improved Healing Wave | 3 number run(s) in the example but 1 in the EN d - lineage mismatch |
| t:589 | shaman | Restoration | Improved Reincarnation | 4 number run(s) in the example but 3 in the EN d - lineage mismatch |
| t:590 | shaman | Restoration | Mana Tide Totem | 8 number run(s) in the example but 5 in the EN d - lineage mismatch |
| t:602 | shaman | Enhancement | Flurry | fa still carries non-numeric token(s)  - needs Brain Persian |
| t:605 | shaman | Enhancement | Improved Ghost Wolf | 3 number run(s) in the example but 1 in the EN d - lineage mismatch |
| t:609 | shaman | Enhancement | Guardian Totems | 3 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:721 | shaman | Elemental | Elemental Alacrity | 3 number run(s) in the example but 1 in the EN d - lineage mismatch |
| t:901 | shaman | Enhancement | Stormstrike | 1 number run(s) in the example but 3 in the EN d - lineage mismatch |
| t:1003 | warlock | Affliction | Improved Corruption | 3 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:1004 | warlock | Affliction | Soul Siphon | 3 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:1041 | warlock | Affliction | Siphon Life | 2 number run(s) in the example but 3 in the EN d - lineage mismatch |
| t:1061 | warlock | Affliction | Amplify Curse | 2 number run(s) in the example but 3 in the EN d - lineage mismatch |
| t:1081 | warlock | Affliction | Curse of Exhaustion | 1 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:1226 | warlock | Demonology | Fel Domination | 3 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:1227 | warlock | Demonology | Master Summoner | 3 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:1281 | warlock | Demonology | Demonic Sacrifice | 13 number run(s) in the example but 7 in the EN d - lineage mismatch |
| t:1282 | warlock | Demonology | Soul Link | 4 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:943 | warlock | Destruction | Bane | 4 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:944 | warlock | Destruction | Improved Shadow Bolt | fa still carries non-numeric token(s)  - needs Brain Persian |
| t:963 | warlock | Destruction | Shadowburn | 1 number run(s) in the example but 3 in the EN d - lineage mismatch |
| t:968 | warlock | Destruction | Conflagrate | 1 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:982 | warlock | Destruction | Aftermath | 5 number run(s) in the example but 4 in the EN d - lineage mismatch |
| t:121 | warrior | Arms | Deep Wounds | fa still carries non-numeric token(s)  - needs Brain Persian |
| t:123 | warrior | Arms | Weaponmaster | 1 number run(s) in the example but 3 in the EN d - lineage mismatch |
| t:124 | warrior | Arms | Improved Heroic Strike | 2 number run(s) in the example but 1 in the EN d - lineage mismatch |
| t:125 | warrior | Arms | Weaponmaster | 1 number run(s) in the example but 3 in the EN d - lineage mismatch |
| t:126 | warrior | Arms | Improved Charge | 2 number run(s) in the example but 1 in the EN d - lineage mismatch |
| t:128 | warrior | Arms | Improved Thunder Clap | 2 number run(s) in the example but 1 in the EN d - lineage mismatch |
| t:129 | warrior | Arms | Improved Hamstring | fa still carries non-numeric token(s)  - needs Brain Persian |
| t:132 | warrior | Arms | Weaponmaster | 1 number run(s) in the example but 3 in the EN d - lineage mismatch |
| t:133 | warrior | Arms | Sweeping Strikes | 0 number run(s) in the example but 1 in the EN d - lineage mismatch |
| t:135 | warrior | Arms | Mortal Strike | 2 number run(s) in the example but 3 in the EN d - lineage mismatch |
| t:1541 | warrior | Fury | Improved Berserker Rage | 3 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:1542 | warrior | Fury | Improved Execute | 2 number run(s) in the example but 1 in the EN d - lineage mismatch |
| t:1543 | warrior | Fury | Improved Intercept | 2 number run(s) in the example but 1 in the EN d - lineage mismatch |
| t:155 | warrior | Fury | Enrage | 2 number run(s) in the example but 3 in the EN d - lineage mismatch |
| t:159 | warrior | Fury | Unbridled Wrath | 4 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:160 | warrior | Fury | Piercing Howl | 2 number run(s) in the example but 3 in the EN d - lineage mismatch |
| t:165 | warrior | Fury | Death Wish | 2 number run(s) in the example but 3 in the EN d - lineage mismatch |
| t:167 | warrior | Fury | Bloodthirst | 3 number run(s) in the example but 4 in the EN d - lineage mismatch |
| t:168 | warrior | Fury | Improved Slam | 6 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:661 | warrior | Fury | Blood Craze | fa still carries non-numeric token(s)  - needs Brain Persian |
| t:146 | warrior | Protection | Improved Sunder Armor | 2 number run(s) in the example but 1 in the EN d - lineage mismatch |
| t:148 | warrior | Protection | Shield Slam | 3 number run(s) in the example but 4 in the EN d - lineage mismatch |
| t:149 | warrior | Protection | Improved Shield Bash | fa still carries non-numeric token(s)  - needs Brain Persian |
| t:150 | warrior | Protection | Improved Shield Wall | 3 number run(s) in the example but 1 in the EN d - lineage mismatch |
| t:151 | warrior | Protection | Improved Disarm | 2 number run(s) in the example but 1 in the EN d - lineage mismatch |
| t:152 | warrior | Protection | Concussion Blow | 0 number run(s) in the example but 1 in the EN d - lineage mismatch |
| t:153 | warrior | Protection | Last Stand | 3 number run(s) in the example but 2 in the EN d - lineage mismatch |
| t:1601 | warrior | Protection | Shield Specialization | 5 number run(s) in the example but 3 in the EN d - lineage mismatch |
