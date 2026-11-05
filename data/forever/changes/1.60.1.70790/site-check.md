# Forever site check: 1.60.1.70790 (changes vs 1.60.1.70755)

Site spellbook + talent trees vs the client data (tools/forever_check.py). Rules: raw client DB2, no hotfixes; talent trees from the Trait tables; talents matched by name, else same position with similar text, else near-identical text; site pos = [TierID+1, ColumnIndex+1]; talent text = rank 1; spellbook text = the site rank; queue = only texts the site had right for the previous build and this build changed.

| part | total | same | text | unverifiable | other | changed in this build |
|---|---|---|---|---|---|---|
| talents | 477 | 129 | 290 | 29 | 63 | 41 |
| spellbook | 497 | 415 | 43 | 35 | 8 | 36 |
| spells_json | 507 | 416 | 46 | 35 | 14 | 36 |

Queue (EN texts the site had right for the previous build and this build changed; review, then `--apply`): **52**

0. warrior d `Spearing Strike`: A brutal attack that deals 40% weapon damage. Deals an additional 8... -> A brutal attack that deals 75% weapon damage. Deals an additional 7... (SpellEffect#1.EffectBasePointsF: 40 -> 75; SpellEffect#2.EffectBase...)
1. rogue n `Improved Eviscerate`: Improved Eviscerate -> Coup de Grace (renamed in 1.60.1.70790)
2. rogue n `Improved Sinister Strike`: Improved Sinister Strike -> Efficient Strikes (renamed in 1.60.1.70790)
3. rogue d `Flawless Execution`: Reduces the Energy cost of your Eviscerate ability by 10. -> Reduces the Energy cost of your Eviscerate ability by 15. (SpellEffect#0.EffectBasePointsF: -10 -> -15)
4. rogue d `Aggression`: Increases the damage of your Sinister Strike, Backstab, and Eviscer... -> Increases the damage of your Sinister Strike and Eviscerate abiliti... (SpellEffect#0.EffectSpellClassMask_0: 131078 -> 131074; description...)
5. shaman d `Convection`: Reduces the mana cost of your Shock, Lightning Bolt, Lava Burst, an... -> Reduces the mana cost of your Shock, Lightning Bolt, and Chain Ligh... (description: Reduces the mana cost of your Shock, Lightning Bolt, L...)
6. shaman n `Elemental Mastery`: Elemental Mastery -> Lightning Mastery (renamed in 1.60.1.70790)
7. shaman d `Elemental Mastery`: Gain mastery over Fire and Lightning, reducing the cast time of Lig... -> Gain mastery over Lightning, reducing the cast time of your Lightni... (SpellMisc.SpellIconFileDataID: 136115 -> 136111; aura: Lightning Bo...)
8. shaman d `Stormstrike`: Instantly strike for normal weapon damage and increase the damage y... -> Instantly strike for 150% weapon damage and increase the damage you... (SpellCooldowns.RecoveryTime: 8000 -> 6000; SpellEffect#2.Effect:  -...)
9. shaman d `Riptide`: Heals a friendly target for 486 to 534, an additional 445 over 15 s... -> Heals a friendly target for 445 over 15 sec, and increases the effe... (SpellCooldowns.CategoryRecoveryTime: 6000 -> 12000; SpellEffect#0.E...)
10. mage d `Arctic Reach`: Increases the range of your Frostbolt, Frost Blast, Ice Lance, and ... -> Increases the range of your Frostbolt, Ice Lance, and Blizzard spel... (description: Increases the range of your Frostbolt, Frost Blast, Ic...)
11. warlock d `Wrack`: Tears the target apart from within, inflicting 36 Shadow damage eve... -> Tears the target apart from within, inflicting 86 Shadow damage eve... (SpellEffect#0.EffectBonusCoefficient: 0.14300000668 -> 0.2860000133...)
12. warrior d `Spearing Strike`: A brutal attack that deals 40% weapon damage. Deals an additional 8... -> A brutal attack that deals 75% weapon damage. Deals an additional 7... (SpellEffect#1.EffectBasePointsF: 40 -> 75; SpellEffect#2.EffectBase...)
13. hunter d `Trueshot Aura`: Increases the Ranged Attack Power of party or raid members within 4... -> Increases the Ranged Attack Power of party or raid members within 4... (SpellEffect#0.EffectBasePointsF: 50 -> 100)
14. rogue d `Mutilate`: Instantly attacks with both weapons for 75% weapon damage plus an a... -> Instantly attacks with both weapons for 90% weapon damage plus an a... (subtext: Rank 4 -> Rank 3; ref 1241586 SpellEffect#0.EffectBasePoin...)
15. rogue d `Mind-numbing Poison III`: Coats a weapon with poison that lasts for 30 minutes. Each strike h... -> Coats a weapon with poison that lasts for 30 minutes. Each strike h... (SpellEffect#2.EffectBasePointsF: 150 -> 225; ref 11399 SpellEffect#...)
16. rogue d `Deadly Poison IV`: Coats a weapon with poison that lasts for 30 minutes. Each strike h... -> Coats a weapon with poison that lasts for 30 minutes. Each strike h... (SpellEffect#2.EffectBasePointsF: 160 -> 240; ref 11356 SpellEffect#...)
17. rogue d `Wound Poison IV`: Coats a weapon with poison that lasts for 30 minutes. Each strike h... -> Coats a weapon with poison that lasts for 30 minutes. Each strike h... (SpellEffect#2.EffectBasePointsF: 160 -> 240; ref 13227 SpellEffect#...)
18. rogue d `Deadly Poison V`: Coats a weapon with poison that lasts for 30 minutes. Each strike h... -> Coats a weapon with poison that lasts for 30 minutes. Each strike h... (SpellEffect#2.EffectBasePointsF: 180 -> 240; ref 11356 SpellEffect#...)
19. rogue d `Instant Poison VI`: Coats a weapon with poison that lasts for 30 minutes. Each strike h... -> Coats a weapon with poison that lasts for 30 minutes. Each strike h... (SpellEffect#2.EffectBasePointsF: 175 -> 250; ref 11340 SpellEffect#...)
20. shaman d `Lightning Bolt`: Casts a bolt of lightning at the target for 190 to 211 Nature damage. -> Casts a bolt of lightning at the target for 342 to 381 Nature damage. (SpellEffect#0.EffectBasePointsF: 196 -> 353; SpellEffect#0.EffectRe...)
21. shaman d `Earth Shock`: Instantly shocks the target with concussive force, causing 293 to 3... -> Instantly shocks the target with concussive force, causing 517 to 5... (SpellEffect#0.EffectBasePointsF: 301 -> 531; SpellEffect#0.EffectRe...)
22. shaman d `Flame Shock`: Instantly sears the target with fire, causing 166 Fire damage immed... -> Instantly sears the target with fire, causing 292 Fire damage immed... (SpellEffect#0.EffectBasePointsF: 166 -> 292; SpellEffect#0.EffectRe...)
23. shaman d `Frost Shock`: Instantly shocks the target with frost, causing 279 to 295 Frost da... -> Instantly shocks the target with frost, causing 495 to 524 Frost da... (SpellEffect#1.EffectBasePointsF: 283 -> 506)
24. shaman d `Chain Lightning`: Hurls a lightning bolt at the enemy, dealing 119 to 133 Nature dama... -> Hurls a lightning bolt at the enemy, dealing 495 to 552 Nature dama... (SpellCastTimes(CastingTimeIndex).Base: 2000 -> 2500; SpellCastTimes...)
25. shaman n `Elemental Mastery`: Elemental Mastery -> Lightning Mastery (renamed in 1.60.1.70790)
26. shaman n `Totemic Projection`: Totemic Projection -> Totemic Call (renamed in 1.60.1.70790)
27. shaman d `Stormstrike`: Instantly strike for normal weapon damage and increase the damage y... -> Instantly strike for 150% weapon damage and increase the damage you... (SpellCooldowns.RecoveryTime: 8000 -> 6000; SpellEffect#2.Effect:  -...)
28. shaman d `Riptide`: Heals a friendly target for 799 to 883, an additional 805 over 15 s... -> Heals a friendly target for 805 over 15 sec, and increases the effe... (SpellCooldowns.CategoryRecoveryTime: 6000 -> 12000; SpellEffect#0.E...)
29. warlock d `Wrack`: Tears the target apart from within, inflicting 36 Shadow damage eve... -> Tears the target apart from within, inflicting 86 Shadow damage eve... (SpellEffect#0.EffectBonusCoefficient: 0.14300000668 -> 0.2860000133...)
30. druid d `Starfire`: Causes 350 to 412 Arcane damage to the target. -> Causes 490 to 576 Arcane damage to the target. (SpellEffect#0.EffectBasePointsF: 381 -> 533; SpellEffect#0.EffectRe...)
31. druid d `Ferocious Bite`: Finishing move that causes damage per combo point and converts each... -> Finishing move that causes damage per combo point and converts each... (SpellEffect#0.EffectBasePointsF: 82 -> 102; SpellEffect#0.EffectPoi...)
32. warrior tip `Spearing Strike`: A brutal attack that deals 40% weapon damage. Deals an additional 8... -> A brutal attack that deals 75% weapon damage. Deals an additional 7... (SpellEffect#1.EffectBasePointsF: 40 -> 75; SpellEffect#2.EffectBase...)
33. hunter tip `Trueshot Aura`: Increases the Ranged Attack Power of party or raid members within 4... -> Increases the Ranged Attack Power of party or raid members within 4... (SpellEffect#0.EffectBasePointsF: 50 -> 100)
34. rogue tip `Mutilate`: Instantly attacks with both weapons for 75% weapon damage plus an a... -> Instantly attacks with both weapons for 90% weapon damage plus an a... (subtext: Rank 4 -> Rank 3; ref 1241586 SpellEffect#0.EffectBasePoin...)
35. rogue tip `Mind-numbing Poison III`: Coats a weapon with poison that lasts for 30 minutes. Each strike h... -> Coats a weapon with poison that lasts for 30 minutes. Each strike h... (SpellEffect#2.EffectBasePointsF: 150 -> 225; ref 11399 SpellEffect#...)
36. rogue tip `Deadly Poison IV`: Coats a weapon with poison that lasts for 30 minutes. Each strike h... -> Coats a weapon with poison that lasts for 30 minutes. Each strike h... (SpellEffect#2.EffectBasePointsF: 160 -> 240; ref 11356 SpellEffect#...)
37. rogue tip `Wound Poison IV`: Coats a weapon with poison that lasts for 30 minutes. Each strike h... -> Coats a weapon with poison that lasts for 30 minutes. Each strike h... (SpellEffect#2.EffectBasePointsF: 160 -> 240; ref 13227 SpellEffect#...)
38. rogue tip `Deadly Poison V`: Coats a weapon with poison that lasts for 30 minutes. Each strike h... -> Coats a weapon with poison that lasts for 30 minutes. Each strike h... (SpellEffect#2.EffectBasePointsF: 180 -> 240; ref 11356 SpellEffect#...)
39. rogue tip `Instant Poison VI`: Coats a weapon with poison that lasts for 30 minutes. Each strike h... -> Coats a weapon with poison that lasts for 30 minutes. Each strike h... (SpellEffect#2.EffectBasePointsF: 175 -> 250; ref 11340 SpellEffect#...)
40. warlock tip `Wrack`: Tears the target apart from within, inflicting 36 Shadow damage eve... -> Tears the target apart from within, inflicting 86 Shadow damage eve... (SpellEffect#0.EffectBonusCoefficient: 0.14300000668 -> 0.2860000133...)
41. druid tip `Starfire`: Causes 350 to 412 Arcane damage to the target. -> Causes 490 to 576 Arcane damage to the target. (SpellEffect#0.EffectBasePointsF: 381 -> 533; SpellEffect#0.EffectRe...)
42. druid tip `Ferocious Bite`: Finishing move that causes damage per combo point and converts each... -> Finishing move that causes damage per combo point and converts each... (SpellEffect#0.EffectBasePointsF: 82 -> 102; SpellEffect#0.EffectPoi...)
43. shaman tip `Lightning Bolt`: Casts a bolt of lightning at the target for 190 to 211 Nature damage. -> Casts a bolt of lightning at the target for 342 to 381 Nature damage. (SpellEffect#0.EffectBasePointsF: 196 -> 353; SpellEffect#0.EffectRe...)
44. shaman tip `Earth Shock`: Instantly shocks the target with concussive force, causing 293 to 3... -> Instantly shocks the target with concussive force, causing 517 to 5... (SpellEffect#0.EffectBasePointsF: 301 -> 531; SpellEffect#0.EffectRe...)
45. shaman tip `Flame Shock`: Instantly sears the target with fire, causing 166 Fire damage immed... -> Instantly sears the target with fire, causing 292 Fire damage immed... (SpellEffect#0.EffectBasePointsF: 166 -> 292; SpellEffect#0.EffectRe...)
46. shaman tip `Frost Shock`: Instantly shocks the target with frost, causing 279 to 295 Frost da... -> Instantly shocks the target with frost, causing 495 to 524 Frost da... (SpellEffect#1.EffectBasePointsF: 283 -> 506)
47. shaman tip `Chain Lightning`: Hurls a lightning bolt at the enemy, dealing 119 to 133 Nature dama... -> Hurls a lightning bolt at the enemy, dealing 495 to 552 Nature dama... (SpellCastTimes(CastingTimeIndex).Base: 2000 -> 2500; SpellCastTimes...)
48. shaman n `Elemental Mastery`: Elemental Mastery -> Lightning Mastery (renamed in 1.60.1.70790)
49. shaman n `Totemic Projection`: Totemic Projection -> Totemic Call (renamed in 1.60.1.70790)
50. shaman tip `Stormstrike`: Instantly strike for normal weapon damage and increase the damage y... -> Instantly strike for 150% weapon damage and increase the damage you... (SpellCooldowns.RecoveryTime: 8000 -> 6000; SpellEffect#2.Effect:  -...)
51. shaman tip `Riptide`: Heals a friendly target for 799 to 883, an additional 805 over 15 s... -> Heals a friendly target for 805 over 15 sec, and increases the effe... (SpellCooldowns.CategoryRecoveryTime: 6000 -> 12000; SpellEffect#0.E...)

## Talents missing on the site (20)

- warrior Fury: site `None` game `Reckless Swings` missing_on_site pos None/[4, 2] ranks None/1
- warrior Fury: site `None` game `Improved Whirlwind` missing_on_site pos None/[6, 1] ranks None/2
- paladin Holy: site `None` game `Oath of Light` missing_on_site pos None/[4, 3] ranks None/1
- paladin Holy: site `None` game `Boundless Light` missing_on_site pos None/[5, 3] ranks None/2
- paladin Protection: site `None` game `Stoicism` missing_on_site pos None/[5, 1] ranks None/2
- paladin Protection: site `None` game `Shieldsworn` missing_on_site pos None/[7, 2] ranks None/1
- paladin Retribution: site `None` game `Seal of Command` missing_on_site pos None/[3, 3] ranks None/1
- paladin Retribution: site `None` game `Turn Evil` missing_on_site pos None/[5, 1] ranks None/2
- hunter Tree 2: site `None` game `Improved Serpent Sting` missing_on_site pos None/[63, 4] ranks None/5
- hunter Tree 4: site `None` game `Lightning Reflexes` missing_on_site pos None/[1, 1] ranks None/5
- rogue Assassination: site `None` game `Blood Splatter` missing_on_site pos None/[3, 2] ranks None/1
- rogue Combat: site `None` game `Composure` missing_on_site pos None/[3, 4] ranks None/2
- rogue Combat: site `None` game `Flash of Steel` missing_on_site pos None/[6, 3] ranks None/5
- rogue Subtlety: site `None` game `Quick Getaway` missing_on_site pos None/[4, 4] ranks None/2
- rogue Subtlety: site `None` game `Boot Knife` missing_on_site pos None/[6, 3] ranks None/5
- rogue Subtlety: site `None` game `Death Mark` missing_on_site pos None/[7, 2] ranks None/1
- priest Shadow: site `None` game `Holy Specialization` missing_on_site pos None/[33, 1] ranks None/5
- shaman Elemental: site `None` game `Call of Thunder` missing_on_site pos None/[5, 2] ranks None/1
- druid Feral Combat: site `None` game `Lacerate` missing_on_site pos None/[4, 2] ranks None/1
- druid Feral Combat: site `None` game `Predatory Discipline` missing_on_site pos None/[4, 3] ranks None/1

## Site talents not in the game (7)

- warrior Fury: site `Raging Blows` game `None` not_in_game pos [4, 2]/None ranks 1/None
- rogue Assassination: site `Murder` game `None` not_in_game pos [2, 2]/None ranks 2/None
- rogue Subtlety: site `Improved Distract` game `None` not_in_game pos [3, 3]/None ranks 2/None
- rogue Subtlety: site `Quietus` game `None` not_in_game pos [6, 1]/None ranks 5/None
- rogue Subtlety: site `Cutthroat` game `None` not_in_game pos [6, 3]/None ranks 5/None
- rogue Subtlety: site `Thousand Cuts` game `None` not_in_game pos [7, 2]/None ranks 1/None
- shaman Elemental: site `Lava Burst` game `None` not_in_game pos [5, 2]/None ranks 1/None

## Talent name / rank / position differences (32)

- warrior Arms: site `Improved Tactical Mastery` game `Improved Tactical Mastery` ranks, text pos [2, 2]/[2, 2] ranks 5/3
- warrior Arms: site `Bloodthrill` game `Bloodthrill` ranks, text pos [5, 1]/[5, 1] ranks 5/2
- warrior Fury: site `Enrage` game `Enrage` pos, text pos [4, 3]/[3, 4] ranks 5/5
- warrior Fury: site `Gore Drinker` game `Gore Drinker` pos, text pos [6, 3]/[5, 3] ranks 2/2
- warrior Fury: site `Flurry` game `Flurry` ranks, pos, text pos [6, 2]/[6, 3] ranks 5/3
- rogue Assassination: site `Improved Expose Armor` game `Improved Expose Armor` pos, text pos [3, 2]/[2, 2] ranks 2/2
- rogue Assassination: site `Vigor` game `Vigor` pos, text pos [5, 1]/[3, 1] ranks 2/2
- rogue Assassination: site `Lethality` game `Lethality` ranks, text pos [3, 3]/[3, 3] ranks 5/2
- rogue Assassination: site `Relentless Strikes` game `Relentless Strikes` ranks, pos, unverifiable pos [3, 1]/[5, 1] ranks 1/5
- rogue Assassination: site `Venom` game `Venom` pos, text pos [7, 2]/[5, 2] ranks 1/1
- rogue Assassination: site `Seal Fate` game `Seal Fate` ranks, text pos [6, 3]/[6, 3] ranks 5/3
- rogue Assassination: site `Mutilate` game `Mutilate` pos, text pos [5, 2]/[7, 2] ranks 1/1
- rogue Combat: site `Improved Eviscerate` game `Coup de Grace` name, text pos [1, 1]/[1, 1] ranks 3/3
- rogue Combat: site `Improved Sinister Strike` game `Efficient Strikes` name, text pos [1, 2]/[1, 2] ranks 2/2
- rogue Combat: site `Improved Sprint` game `Improved Sprint` pos, text pos [3, 4]/[2, 4] ranks 2/2
- rogue Combat: site `Weapon Expertise` game `Weapon Expertise` pos, text pos [6, 2]/[4, 3] ranks 2/2
- rogue Combat: site `Aggression` game `Aggression` pos, text pos [6, 3]/[4, 4] ranks 3/3
- rogue Combat: site `Dual Wield Specialization` game `Dual Wield Specialization` ranks, pos, text pos [4, 3]/[5, 1] ranks 5/2
- rogue Subtlety: site `Setup` game `Setup` pos, unverifiable pos [2, 1]/[1, 1] ranks 3/3
- rogue Subtlety: site `Opportunity` game `Opportunity` ranks, text pos [1, 3]/[1, 3] ranks 2/5
- rogue Subtlety: site `Dirty Deeds` game `Dirty Deeds` pos, text pos [5, 1]/[2, 1] ranks 2/2
- rogue Subtlety: site `Camouflage` game `Camouflage` ranks, pos, text pos [1, 1]/[2, 2] ranks 5/3
- rogue Subtlety: site `Improved Ambush` game `Improved Ambush` pos, text pos [2, 4]/[2, 3] ranks 3/3
- rogue Subtlety: site `Dirty Tricks` game `Dirty Tricks` pos, text pos [2, 3]/[2, 4] ranks 2/2
- rogue Subtlety: site `Premeditation` game `Premeditation` pos pos [4, 2]/[3, 2] ranks 1/1
- rogue Subtlety: site `Serrated Blades` game `Serrated Blades` pos, text pos [4, 3]/[3, 3] ranks 3/3
- rogue Subtlety: site `Elusiveness` game `Elusiveness` pos, text pos [2, 2]/[4, 1] ranks 2/2
- rogue Subtlety: site `Ghostly Strike` game `Ghostly Strike` pos, text pos [3, 2]/[4, 2] ranks 1/1
- rogue Subtlety: site `Heightened Senses` game `Heightened Senses` pos, text pos [4, 1]/[5, 1] ranks 2/2
- shaman Elemental: site `Elemental Mastery` game `Lightning Mastery` name, text pos [7, 2]/[7, 2] ranks 1/1
- shaman Enhancement: site `Improved Lightning Shield` game `Improved Lightning Shield` pos pos [2, 4]/[2, 3] ranks 3/3
- shaman Enhancement: site `Improved Ghost Wolf` game `Improved Ghost Wolf` pos, text pos [2, 3]/[4, 4] ranks 2/2

## Spellbook spells not found in the client (2)

- shaman : site `Elemental Mastery` game `Lightning Mastery` renamed
- shaman : site `Totemic Projection` game `Totemic Call` renamed

## spells.json spells not found in the client (8)

- mage : site `Detect Magic` game `None` not_found
- warlock : site `Dark Pact` game `None` not_found
- paladin : site `Blessing of Sanctuary` game `None` not_found
- paladin : site `Greater Blessing of Sanctuary` game `None` not_found
- druid : site `Faerie Fire (Feral)` game `None` not_found
- shaman : site `Elemental Mastery` game `Lightning Mastery` renamed
- shaman : site `Totemic Projection` game `Totemic Call` renamed
- shaman : site `Tranquil Air Totem` game `None` not_found

## Talent text differences (sample) (120 of 290)

- warrior Arms `Improved Heroic Strike`: site: Reduces the cost of your Heroic Strike ability by 1 Rage. || game: Reduces the cost of your Heroic Strike ability by -1 Rage.
- warrior Arms `Improved Rend`: site: Increases the Bleed damage done by your Rend ability by 12%. || game: Increases the Bleed damage done by your Rend ability by 15%.
- warrior Arms `Improved Tactical Mastery`: site: Tactical Mastery lets you retain up to an additional 3 Rage when you change stances. || game: Tactical Mastery lets you retain up to an additional 15 Rage when you change stances.
- warrior Arms `Deep Wounds`: site: Your critical strikes cause your opponent to Bleed, dealing 20% of your melee weapon's average damage over 12 sec. || game: Your critical strikes cause your opponent to Bleed, dealing 0% of your melee weapon's average damage over 12 sec.
- warrior Arms `Spearing Strike`: site: A brutal attack that deals 40% weapon damage. Deals an additional 80% weapon damage against Giants, Dragonkin, and mounted targets. Mounted targets are dismounted. || game: A brutal attack that deals 75% weapon damage. Deals an additional 75% weapon damage against Giants, Dragonkin, and mounted targets. Mounted targets are dismounted.
- warrior Arms `Bloodthrill`: site: Grants your Main Hand melee attacks against enemies afflicted by your Rend a 4% chance to allow an activation of Overpower. || game: Grants your Main Hand melee attacks against enemies afflicted by your Rend a 15% chance to allow an activation of Overpower.
- warrior Arms `Weaponmaster`: site: Gives your melee weapon attacks a benefit depending on the weapon.   Axe/Polearm: Increases your  critical strike chance by 1%.   Mace/Staff: Your attacks ignore  3% of your target's armor.   Sword: Your successful me... || game: Gives your melee weapon attacks a benefit depending on the weapon.   |CFFFFFFFFAxe/Polearm:|R Increases your  critical strike chance by 5%.   |CFFFFFFFFMace/Staff:|R Your attacks ignore  15% of your target's armor.   ...
- warrior Arms `Improved Slam`: site: Reduces the global cooldown and cast time of your Slam ability by 0.25 sec. In addition, Slam no longer interrupts or delays your melee swing and Slam's cooldown is reduced by 3.0 sec. || game: Reduces the cooldown of your Slam ability by 5 sec, the cast time and global cooldown by 0.5 sec, and Slam no longer interrupts or delays your melee swing.
- warrior Arms `Improved Hamstring`: site: Gives your Hamstring ability a 5% chance to immobilize the target for 5 sec. || game: Gives your Hamstring ability a 0% chance to immobilize the target for 5 sec.
- warrior Fury `Booming Voice`: site: Increases the area of effect of your Shouts by 10% and reduces their Rage cost by 5%. || game: Increases the area of effect of your Shouts by 50% and reduces the Rage cost by of your Shouts and Howls by 25%.
- warrior Fury `Cruelty`: site: Improves your chance to get a critical strike with melee attacks by 1%. || game: Improves your chance to get a critical strike with melee attacks by 5%.
- warrior Fury `Lingering Rage`: site: Increases the time before your Rage begins to decay after leaving combat by 2 sec. || game: Increases the time before your Rage begins to decay after leaving combat by 0 sec.
- warrior Fury `Unbridled Wrath`: site: Gives you a 12% chance to generate 1 additional Rage when you deal melee damage with a weapon. || game: Gives you a 0% chance to generate 1 additional Rage when you deal melee damage with a weapon.
- warrior Fury `Furious Precision`: site: Increases your chance to hit with off-hand attacks by 4%. || game: Increases your chance to hit with off-hand attacks by 10%.
- warrior Fury `Blood Craze`: site: Regenerates 1% of your total Health over 6 sec after being the victim of a critical strike or suffering more than 20% of your maximum Health from a single attack. || game: Regenerates 3% of your total Health over 6 sec after being the victim of a critical strike or suffering more than 20% of your maximum Health from a single attack.
- warrior Fury `Enrage`: site: Gives you a 30% chance to deal 2% increased Physical damage for 12 sec after being the victim of any damaging attack. || game: Gives you a 30% chance to deal 0% increased Physical damage for 12 sec after being the victim of any damaging attack.
- warrior Fury `Dual Wield Specialization`: site: Increases the damage done by your off-hand weapon by 5% and the Rage generated by your off-hand attacks by 10%. || game: Increases the damage done by your off-hand weapon by 5% and the Rage generated by your off-hand attacks by 5%.
- warrior Fury `Improved Execute`: site: Reduces the Rage cost of your Execute ability by 3. || game: Reduces the Rage cost of your Execute ability by -5.
- warrior Fury `Improved Berserker Rage`: site: Your Berserker Rage ability will instantly generate 5 Rage and has a 50% chance to remove all movement impairing effects when activated. || game: Your Berserker Rage ability will instantly generate 10 Rage and has a 100% chance to remove all movement impairing effects when activated.
- warrior Fury `Gore Drinker`: site: Your Enrage, Berserker Rage, Bloodrage, Death Wish, and Bloodthirst abilities cause your next 3 melee attacks to restore 0.5% of your maximum Health. || game: Your Enrage, Berserker Rage, Bloodrage, Death Wish, and Bloodthirst abilities cause your next 3 melee attacks to restore 1% of your maximum Health.
- warrior Fury `Improved Intercept`: site: Reduces the cooldown of your Intercept ability by 5 sec. || game: Reduces the cooldown of your Intercept ability by -10 sec.
- warrior Fury `Flurry`: site: Increases your melee attack speed by 5% for your next 3 swings after dealing a melee critical strike. || game: Increases your melee attack speed by 1% for your next 3 swings after dealing a melee critical strike.
- warrior Protection `Improved Bloodrage`: site: Increases all the Rage generated by your Bloodrage ability by 25%. || game: Increases all the Rage generated by your Bloodrage ability by 50%.
- warrior Protection `Shield Specialization`: site: Increases your chance to Block attacks with your shield by 1% and grants you a 20% chance to generate 5 Rage when you Block. || game: Increases your chance to Block attacks with your shield by 5% and grants you a 100% chance to generate 5 Rage when you Block.
- warrior Protection `Iron Will`: site: Reduces the duration of Stun and Fear effects inflicted on you by 3%. || game: Reduces the duration of Stun and Fear effects inflicted on you by 15%.
- warrior Protection `Anticipation`: site: Increases your Defense Skill by 4. || game: Increases your Defense Skill by 20.
- warrior Protection `Improved Revenge`: site: Increases damage dealt by your Revenge ability by 20%. || game: Increases damage dealt by your Revenge ability by 60%.
- warrior Protection `Improved Thunder Clap`: site: Reduces the Rage cost of your Thunder Clap ability by 2. || game: Reduces the Rage cost of your Thunder Clap ability by -6.
- warrior Protection `Master of Defense`: site: Grants you a 50% chance to generate 5 Rage when you Dodge or Parry while a shield is equipped. || game: Grants you a 0% chance to generate 5 Rage when you Dodge or Parry while a shield is equipped.
- warrior Protection `Improved Disarm`: site: Reduces the cooldown of your Disarm ability by 7 secs. || game: Reduces the cooldown of your Disarm ability by -20 secs.
- warrior Protection `Defiance`: site: Increases all threat generated in Defensive stance by an additional 5% while a shield is equipped. || game: Increases all threat generated in Defensive stance by an additional 15% while a shield is equipped.
- warrior Protection `Improved Sunder Armor`: site: Reduces the Rage cost of your Sunder Armor ability by 1. || game: Reduces the Rage cost of your Sunder Armor ability by -3.
- warrior Protection `Improved Shield Bash`: site: Gives your Shield Bash ability a 50% chance to Silence the target for 3 sec. || game: Gives your Shield Bash ability a 100% chance to Silence the target for 3 sec.
- warrior Protection `Improved Shield Wall`: site: Reduces the cooldown of your Shield Wall ability by 5.5 min. || game: Reduces the cooldown of your Shield Wall ability by 11 min.
- warrior Protection `Focused Rage`: site: Reduces the Rage cost of your offensive abilities by 1. || game: Reduces the Rage cost of your offensive abilities by -3.
- warrior Protection `Bastion`: site: Increases all damage you deal by 2% while a shield is equipped. || game: Increases all damage you deal by 10% while a shield is equipped.
- paladin Holy `Reverence`: site: Allows 15% of your Mana regeneration to continue while casting. || game: Allows 30% of your Mana regeneration to continue while casting.
- paladin Holy `Purifying Power`: site: Reduces the mana cost of your Cleanse and Purify spells by 10% and reduces the cooldown of your Exorcism and Holy Wrath spells by 17%. || game: Reduces the mana cost of your Cleanse and Purify spells by 20% and reduces the cooldown of your Exorcism and Holy Wrath spells by 50%.
- paladin Holy `Holy Conduit`: site: Reduces the mana cost of your Consecration, Holy Wrath, Exorcism, and Hammer of Wrath spells by 20%. || game: Reduces the mana cost of your Consecration, Holy Wrath, Exorcism, and Hammer of Wrath spells by 40%.
- paladin Holy `Divine Precision`: site: Improves your chance to hit with Holy spells by 4%, and reduces the duration of Silence effects on you by 10%. || game: Improves your chance to hit with Holy spells by 8%, and reduces the duration of Silence effects on you by 20%.
- paladin Holy `Infusion of Light`: site: Your Holy Shock and Flash of Light critical hits reduce the cast time of your next Holy Light cast within 15 sec by 0.5 sec. || game: Your Holy Shock and Flash of Light critical hits reduce the cast time of your next Holy Light cast within 15 sec by 1 sec.
- paladin Holy `Consecrated Ground`: site: Gives your Holy spells 5% increased damage against the first 4 enemies that enter your Consecration. || game: Gives your Holy spells 10% increased damage against the first 4 enemies that enter your Consecration.
- paladin Protection `Guardian's Favor`: site: Reduces the cooldown of your Blessing of Protection by 1 min and increases the duration of your Blessing of Freedom by 3 sec. || game: Reduces the cooldown of your Blessing of Protection by -1 min and increases the duration of your Blessing of Freedom by 3 sec.
- paladin Protection `Sacred Duty`: site: Reduces the cooldown of your Divine Shield, Divine Protection, and Templar's Bulwark spells by 30 sec, and reduces the duration of Forbearance by 5 sec. || game: Reduces the cooldown of your Divine Shield, Divine Protection, and Templar's Bulwark spells by 60 sec, and reduces the duration of Forbearance by 10 sec.
- paladin Protection `Improved Hammer of Justice`: site: Decreases the cooldown of your Hammer of Justice spell by 5 sec. || game: Decreases the cooldown of your Hammer of Justice spell by -5 sec.
- paladin Protection `Improved Righteous Fury`: site: While Righteous Fury is active, all damage taken is reduced by 3%. || game: While Righteous Fury is active, all damage taken is reduced by 6%.
- paladin Protection `Anticipation`: site: Increases your Defense Skill by 4. || game: Increases your Defense Skill by 20.
- paladin Protection `Iron Creed`: site: Increases the threat generated by your Holy Strike ability by 10%. While Righteous Fury is active, Holy Strike also reduces your damage taken by 2% for 6 sec. || game: Increases the threat generated by your Holy Strike ability by 30%. While Righteous Fury is active, Holy Strike also reduces your damage taken by 15% for 6 sec.
- paladin Retribution `Benediction`: site: Reduces the Mana cost of all instant cast spells and abilities by 2%. || game: Reduces the Mana cost of all instant cast spells and abilities by 10%.
- paladin Retribution `Improved Judgement`: site: Decreases the cooldown of your Judgement ability by 1 sec. || game: Decreases the cooldown of your Judgement ability by -1 sec.
- paladin Retribution `Conviction`: site: Improves your chance to get a critical strike with all spells and attacks by 2%. || game: Improves your chance to get a critical strike with all spells and attacks by 5%.
- paladin Retribution `Sanctified Judgement`: site: Gives your Judgement ability a 33% chance to return 20% of the Mana cost of the judged seal. || game: Gives your Judgement ability a 100% chance to return 60% of the Mana cost of the judged seal.
- paladin Retribution `Unyielding Faith`: site: Reduces the duration of Fear and Disorient effects on you by 15%. || game: Reduces the duration of Fear and Disorient effects on you by 30%.
- paladin Retribution `Pursuit of Justice`: site: Increases movement speed and mounted movement speed by 8%. This does not stack with other movement speed increasing effects. || game: Increases movement speed and mounted movement speed by 15%. This does not stack with other movement speed increasing effects.
- paladin Retribution `Eye for an Eye`: site: All critical strikes against you cause 5% of the damage taken to the attacker as well. The damage caused by Eye for an Eye will not exceed 50% of the Paladin's total health. || game: All critical strikes against you cause 15% of the damage taken to the attacker as well. The damage caused by Eye for an Eye will not exceed 50% of the Paladin's total health.
- paladin Retribution `Two-Handed Weapon Specialization`: site: Increases the physical damage you deal by 2%, and reduces all threat you generate by 7% while a two-handed melee weapon is equipped. || game: Increases the Physical and Holy damage you deal by 2%, and reduces all threat you generate by 20% while a two-handed melee weapon is equipped.
- paladin Retribution `Vengeance`: site: Increases your Physical and Holy damage dealt by 1% for 30 sec after landing a non-periodic critical strike. Stacks up to 3 times. || game: Increases your Physical and Holy damage dealt by 5% for 30 sec after landing a non-periodic critical strike. Stacks up to 5 times.
- paladin Retribution `Champion of the Light`: site: Increases your spell damage by up to 12% of your Intellect, and reduces the cast time of your Hammer of Wrath by 0.2 sec. || game: Increases your spell damage by up to 100% of your Intellect, and reduces the cast time of your Hammer of Wrath by 1 sec.
- hunter Tree 1 `Deadly Aspects`: site: While Aspect of the Hawk is active, Auto Shot has a 2% chance of increasing ranged attack speed by 30% for 12 sec. While Aspect of the Beast is active, all melee auto attacks have a 2% chance of increasing melee attac... || game: While Aspect of the Hawk is active, Auto Shot has a 10% chance of increasing ranged attack speed by 30% for 12 sec. While Aspect of the Beast is active, all melee auto attacks have a 10% chance of increasing melee att...
- hunter Tree 1 `Endurance Training`: site: Increases the Health and Armor of your pets by 3%. || game: Increases the Health and Armor of your pets by 15%.
- hunter Tree 1 `Focused Fire`: site: Increases all damage you and your pet deal by 1% while your pet is active. || game: Increases all damage you and your pet deal by 2% while your pet is active.
- hunter Tree 1 `Improved Aspect of the Monkey`: site: Increases the Dodge bonus of your Aspect of the Monkey by 2%. Additionally, your pet gains 50% of the effect of your Aspect of the Monkey ability. || game: Increases the Dodge bonus of your Aspect of the Monkey by 4%. Additionally, your pet gains 50% of the effect of your Aspect of the Monkey ability.
- hunter Tree 1 `Improved Revive Pet`: site: Revive Pet's casting time is reduced by 3 sec, mana cost is reduced by 20%, and increases the health your pet returns with by an additional 15%. || game: Revive Pet's casting time is reduced by -6 sec, mana cost is reduced by 40%, and increases the health your pet returns with by an additional 30%.
- hunter Tree 1 `Pathfinding`: site: Increases the speed bonus of your Aspect of the Cheetah and Aspect of the Pack by 3%. || game: Increases the speed bonus of your Aspect of the Cheetah and Aspect of the Pack by 6%.
- hunter Tree 1 `Unleashed Fury`: site: Increases the damage done by your pets and hawks by 3%. || game: Increases the damage done by your pets and hawks by 20%.
- hunter Tree 1 `Improved Mend Pet`: site: Gives your Mend Pet spell a 15% chance of cleansing 1 Curse, Disease, Magic, or Poison effect from your pet each time it heals and reduces the Mana cost by 10%. || game: Gives your Mend Pet spell a 50% chance of cleansing 1 Curse, Disease, Magic, or Poison effect from your pet each time it heals and reduces the Mana cost by 20%.
- hunter Tree 1 `Ferocity`: site: Increases the critical strike chance of your pets and hawks by 2%. || game: Increases the critical strike chance of your pets and hawks by 16%.
- hunter Tree 1 `Spirit Bond`: site: While your pet is active, you and your pet will regenerate 1% of total health every 10 sec. || game: While your pet is active, you and your pet will regenerate 1% of total health every 5 sec.
- hunter Tree 1 `Bestial Discipline`: site: Increases the Focus regeneration of your pets by 10% and allows 25% of your Mana regeneration to continue while casting. || game: Increases the Focus regeneration of your pets by 100% and allows 50% of your Mana regeneration to continue while casting.
- hunter Tree 2 `Hawk Eye`: site: Increases the range of your ranged weapons by 2 yards. || game: Increases the range of your ranged weapons by 6 yards.
- hunter Tree 2 `Improved Stings`: site: Increases the damage of your Serpent Sting ability by 6%, reduces the cooldown of your Viper Sting ability by 2 sec, and increases the duration of your Scorpid Sting ability by 15 sec. || game: Increases the damage of your Serpent Sting ability by 20%, reduces the cooldown of your Viper Sting ability by 6 sec, and increases the duration of your Scorpid Sting ability by 45 sec.
- hunter Tree 2 `Efficiency`: site: Reduces the Mana cost of your Shots, Stings, and melee abilities by 3%. || game: Reduces the Mana cost of your Shots, Stings, and melee abilities by 15%.
- hunter Tree 2 `Careful Aim`: site: Increases your Attack Power by 20% of your Intellect. || game: Increases your Attack Power by 100% of your Intellect.
- hunter Tree 2 `Rapid Killing`: site: Reduces the cooldown on your Rapid Fire ability by 1 min. In addition, when you kill a non-trivial enemy or it dies while afflicted by your Serpent Sting, you gain Rapid Killing, increasing the damage of your next Sho... || game: Reduces the cooldown on your Rapid Fire ability by 2 min. In addition, when you kill a non-trivial enemy or it dies while afflicted by your Serpent Sting, you gain Rapid Killing, increasing the damage of your next Sho...
- hunter Tree 2 `Improved Arcane Shot`: site: Reduces the cooldown of your Arcane Shot by 0.3 sec. Does not affect the cooldown of abilities which share a cooldown with Arcane Shot. || game: Reduces the cooldown of your Arcane Shot by -1.5 sec. Does not affect the cooldown of abilities which share a cooldown with Arcane Shot.
- hunter Tree 2 `Mortal Shots`: site: Increases the critical strike damage bonus on all ranged abilities by 6%. || game: Increases the critical strike damage bonus on all ranged abilities by 30%.
- hunter Tree 2 `Rapid Recuperation`: site: Afflicting a target with Serpent Sting allows 25% of your Mana Regeneration to continue while casting for 15 sec, increased to 50% when Rapid Killing is consumed. || game: Afflicting a target with Serpent Sting allows 50% of your Mana Regeneration to continue while casting for 15 sec, increased to 100% when Rapid Killing is consumed.
- hunter Tree 2 `Barrage`: site: Increases the damage done by your Multi-Shot, Aimed Shot, and Volley abilities by 5%. || game: Increases the damage done by your Multi-Shot, Aimed Shot, and Volley abilities by 15%.
- hunter Tree 2 `Ranged Weapon Specialization`: site: Increases the damage you deal with ranged weapons by 1%. || game: Increases the damage you deal with ranged weapons by 5%.
- hunter Tree 3 `Improved Tracking`: site: While tracking Beasts, Demons, Dragonkin, Elementals, Giants, Humanoids, or Undead, all damage you deal to the tracked creature type is increased by 1%. || game: While tracking Beasts, Demons, Dragonkin, Elementals, Giants, Humanoids, or Undead, all damage you deal to the tracked creature type is increased by 5%.
- hunter Tree 3 `Deflection`: site: Increases your Parry chance by 1%. || game: Increases your Parry chance by 5%.
- hunter Tree 3 `Entrapment`: site: When your traps are triggered, all affected targets are Entrapped, preventing them from moving for 1 sec. || game: When your traps are triggered, all affected targets are Entrapped, preventing them from moving for 5 sec.
- hunter Tree 3 `Savage Strikes`: site: Increases the critical strike chance of all your melee abilities by 2%. || game: Increases the critical strike chance of all your melee abilities by 20%.
- hunter Tree 3 `Survivalist`: site: Increases your total Health by 2%. || game: Increases your total Health by 10%.
- hunter Tree 3 `Improved Wing Clip`: site: Gives your Wing Clip ability a 7% chance to immobilize the target for 5 sec. || game: Gives your Wing Clip ability a 20% chance to immobilize the target for 5 sec.
- hunter Tree 3 `Clever Traps`: site: Increases the duration of Freezing and Frost trap effects by 15% and the damage of Immolation and Explosive trap effects by 15%. || game: Increases the duration of Freezing and Frost trap effects by 30% and the damage of Immolation and Explosive trap effects by 30%.
- hunter Tree 3 `Surefooted`: site: Increases your hit chance by 1% and reduces the duration of movement impairing effects on you by 10%. || game: Increases your hit chance by 3% and reduces the duration of movement impairing effects on you by 30%.
- hunter Tree 3 `Survival Tactics`: site: Increases your chance to hit with your Trap and Feign Death abilities by 5%. || game: Increases your chance to hit with your Trap and Feign Death abilities by 17%.
- hunter Tree 3 `Predator's Edge`: site: Increases your melee ability critical strike damage by 6% and your Off Hand weapon damage by 10%. || game: Increases your melee ability critical strike damage by 30% and your Off Hand weapon damage by 50%.
- hunter Tree 3 `Resourcefulness`: site: Reduces the Mana cost of your Trap and melee abilities by 30%, and grants your melee and ranged ability Critical Strikes a 50% chance to allow 50% of your Mana Regeneration to continue while casting for 30 sec. || game: Reduces the Mana cost of your Trap and melee abilities by 60%, and grants your melee and ranged ability Critical Strikes a 100% chance to allow 50% of your Mana Regeneration to continue while casting for 30 sec.
- hunter Tree 3 `Expose Prey`: site: Grants your melee and ranged attacks against enemies afflicted by Hunter's Mark a 5% chance to allow an activation of Mongoose Bite. Lasts 10 sec. || game: Grants your melee and ranged attacks against enemies afflicted by Hunter's Mark a 10% chance to allow an activation of Mongoose Bite. Lasts 10 sec.
- hunter Tree 3 `Survivalist's Discipline`: site: Reduces the cooldown of your Trap and Deterrence abilities by 20%. || game: Reduces the cooldown of your Trap and Deterrence abilities by 40%.
- hunter Tree 3 `Lightning Reflexes`: site: Increases your Agility by 3%. || game: Increases your Agility by 15%.
- rogue Assassination `Improved Gouge`: site: Increases the duration of your Gouge ability by 0.5 sec. || game: Increases the duration of your Gouge ability by 1.5 sec.
- rogue Assassination `Malice`: site: Increases your critical strike chance with all attacks and Poisons by 1%. || game: Increases your critical strike chance with all attacks and Poisons by 5%.
- rogue Assassination `Ruthlessness`: site: Gives your finishing moves a 20% chance to add a Combo Point to your target. || game: Gives your finishing moves a 60% chance to add a Combo Point to your target.
- rogue Assassination `Improved Expose Armor`: site: Reduces the Energy cost of your Expose Armor ability by 5, and refunds 1 Combo Points when cast with 5 Combo Points. || game: Reduces the Energy cost of your Expose Armor ability by 10, and refunds 2 Combo Points when cast with 5 Combo Points.
- rogue Assassination `Vigor`: site: Increases your maximum Energy by 5. || game: Increases your maximum Energy by 10.
- rogue Assassination `Lethality`: site: Increases the critical strike damage bonus of your Sinister Strike, Gouge, Backstab, Mutilate, Ghostly Strike, and Hemorrhage abilities by 4%. || game: Increases the critical strike damage bonus of your Sinister Strike, Gouge, Backstab, Mutilate, Ghostly Strike, and Hemorrhage abilities by 6%.
- rogue Assassination `Vile Poisons`: site: Increases the damage dealt by your poisons by 4% and gives your poisons an additional 8% chance to resist dispel effects. || game: Increases the damage dealt by your poisons by 20% and gives your poisons an additional 40% chance to resist dispel effects.
- rogue Assassination `Improved Poisons`: site: Increases the chance to apply Poisons to your target by 2%, and gives Poison applications a 10% chance to not consume a charge. || game: Increases the chance to apply Poisons to your target by 10%, and gives Poison applications a 50% chance to not consume a charge.
- rogue Assassination `Venom`: site: Finishing move that increases the damage of your Poisons by 30% and your chance to apply Poisons by 10%. Lasts longer per combo point: 1 point : 9 sec 2 points: 12 sec 3 points: 15 sec 4 points: 18 sec 5 points: 21 sec || game: Causes your Shank ability to increase your Poison damage by 30% and your chance to apply Poisons by 20% for 6 sec.
- rogue Assassination `Improved Kidney Shot`: site: Enemies Stunned by your Kidney Shot ability take 5% increased damage from your poisons and attacks. || game: Enemies Stunned by your Kidney Shot ability take 10% increased damage from your poisons and attacks.
- rogue Assassination `Seal Fate`: site: Your critical strikes from abilities that add Combo Points have a 20% chance to add an additional Combo Point. || game: Your critical strikes from abilities that add Combo Points have a 0% chance to add an additional Combo Point.
- rogue Assassination `Mutilate`: site: Instantly attacks with both weapons for 75% weapon damage plus an additional 17 with each weapon. Damage increased by 20% against Poisoned targets. Awards 2 Combo Points. || game: Instantly attacks with both weapons for 90% weapon damage plus an additional 39.6 with each weapon. Damage increased by 20% against Poisoned targets. Awards 2 Combo Points.
- rogue Combat `Improved Eviscerate`: site: Increases the damage done by your Eviscerate ability by 7%. || game: Increases the damage done by your Eviscerate ability by 20%, and the damage and storage rate of your Death Mark ability by 20%.
- rogue Combat `Improved Sinister Strike`: site: Reduces the Energy cost of your Sinister Strike ability by 3. || game: Reduces the Energy cost of your Sinister Strike and Hemorrhage abilities by 5.
- rogue Combat `Lightning Reflexes`: site: Increases your Dodge chance by 1%. || game: Increases your Dodge chance by 5%.
- rogue Combat `Puncturing Wounds`: site: Increases the critical strike chance of your Backstab by 10% and your Mutilate by 5%, and gives Backstab a 15% chance to add an additional Combo Point. || game: Increases the critical strike chance of your Backstab by 30% and your Mutilate by 15%, and gives Backstab a 45% chance to add an additional Combo Point.
- rogue Combat `Deflection`: site: Increases your Parry chance by 2%. || game: Increases your Parry chance by 1%.
- rogue Combat `Improved Sprint`: site: Gives a 50% chance to remove all movement impairing effects when you activate your Sprint ability. || game: Gives a 100% chance to remove all movement impairing effects when you activate your Sprint ability.
- rogue Combat `Endurance`: site: Reduces the cooldown of your Sprint and Evasion abilities by 30%. || game: Reduces the cooldown of your Sprint and Evasion abilities by 60%.
- rogue Combat `Improved Kick`: site: Gives your Kick ability a 50% chance to Silence the target for 2 sec. || game: Gives your Kick ability a 100% chance to Silence the target for 2 sec.
- rogue Combat `Flawless Execution`: site: Reduces the Energy cost of your Eviscerate ability by 10. || game: Reduces the Energy cost of your Eviscerate ability by 15.
- rogue Combat `Weapon Expertise`: site: Reduces the chance for your attacks to be Dodged or Parried by 1%. || game: Reduces the chance for your attacks to be Dodged or Parried by 2%.
- rogue Combat `Aggression`: site: Increases the damage of your Sinister Strike, Backstab, and Eviscerate abilities by 2%. || game: Increases the damage of your Sinister Strike and Eviscerate abilities by 2%.
- rogue Combat `Dual Wield Specialization`: site: Increases the damage done by your off-hand weapon by 5%. || game: Increases the damage done by your off-hand weapon by 50%.
- rogue Combat `Hack and Slash`: site: Gives your melee weapon attacks a benefit depending on the weapon.   Axe/Sword: Your successful  melee attacks have a 1% chance  to trigger an extra attack on the   target.   Dagger/Fist: Increases your  critical stri... || game: Gives your melee weapon attacks a benefit depending on the weapon.   |CFFFFFFFFAxe/Sword:|R Your successful  melee attacks have a 5% chance  to trigger an extra attack on the   target.   |CFFFFFFFFDagger/Fist:|R Incre...
- rogue Subtlety `Master of Deception`: site: Reduces the chance enemies have to detect you while in Stealth mode as if you were 1 levels higher. || game: Reduces the chance enemies have to detect you while in Stealth mode as if you were 3 levels higher.
- rogue Subtlety `Opportunity`: site: Increases the damage dealt by your Backstab, Garrote, Ambush, and Mutilate abilities by 5%. || game: Increases the damage dealt by your Backstab, Garrote, Ambush, and Mutilate abilities by 10%.

## Spellbook text differences (sample) (40 of 43)

- warrior  `Spearing Strike`: site: A brutal attack that deals 40% weapon damage. Deals an additional 80% weapon damage against Giants, Dragonkin, and mounted targets. Mounted targets are dismounted. || game: A brutal attack that deals 75% weapon damage. Deals an additional 75% weapon damage against Giants, Dragonkin, and mounted targets. Mounted targets are dismounted.
- paladin  `Holy Shock`: site: Blasts the target with Holy energy, causing 334 to 362 Holy damage to an enemy, or 307 to 333 healing to an ally. || game: Deals 334 to 362 Holy damage.
- hunter  `Aspect of the Hawk`: site: The hunter takes on the aspects of a hawk, increasing Ranged Attack Power by 110. Only one Aspect can be active at a time. || game: The hunter takes on the aspects of a hawk, increasing Ranged Attack Power by 120. Only one Aspect can be active at a time.
- hunter  `Trueshot Aura`: site: Increases the Ranged Attack Power of party or raid members within 45 yards by 50. Lasts 30 min. || game: Increases the Ranged Attack Power of party or raid members within 45 yards by 100. Lasts 30 min.
- hunter  `Explosive Trap`: site: 33 Fire damage every 2 seconds. || game: Place a Fire trap that explodes when an enemy approaches, causing 208 to 264 Fire damage and 330 additional Fire damage over 20 sec to all within 10 yards. Trap will exist for 1 min. Only one Fire trap can be active a...
- rogue  `Garrote`: site: Garrote the enemy, causing 552 damage over 18 sec, increased by your Attack Power. Must be stealthed and behind the target. Awards 1 combo points. || game: Garrote the enemy, causing 552 damage over 18 sec, increased by your Attack Power. Must be stealthed and behind the target. Awards 1 combo point.
- rogue  `Ambush`: site: Ambush the target, causing 250% weapon damage plus 290 to the target. Must be stealthed and behind the target. Requires a dagger in the main hand. Awards 1 combo points. || game: Ambush the target, causing 250% weapon damage plus 290 to the target. Must be stealthed and behind the target. Requires a dagger in the main hand. Awards 1 combo point.
- rogue  `Mutilate`: site: Instantly attacks with both weapons for 75% weapon damage plus an additional 50.25 with each weapon. Damage increased by 20% against Poisoned targets. Awards 2 Combo Points. || game: Instantly attacks with both weapons for 90% weapon damage plus an additional 79.2 with each weapon. Damage increased by 20% against Poisoned targets. Awards 2 Combo Points.
- rogue  `Venom`: site: Finishing move that increases the damage of your Poisons by 30% and your chance to apply Poisons by 10%. Lasts longer per combo point: 1 point : 9 sec 2 points: 12 sec 3 points: 15 sec 4 points: 18 sec 5 points: 21 sec || game: Causes your Shank ability to increase your Poison damage by 30% and your chance to apply Poisons by 20% for 6 sec.
- rogue  `Sinister Strike`: site: An instant strike that causes 68 damage in addition to your normal weapon damage. Awards 1 combo points. || game: An instant strike that causes 68 damage in addition to your normal weapon damage. Awards 1 combo point.
- rogue  `Backstab`: site: Backstab the target, causing 150% weapon damage plus 150 to the target. Must be behind the target. Requires a dagger in the main hand. Awards 1 combo points. || game: Backstab the target, causing 150% weapon damage plus 150 to the target. Must be behind the target. Requires a dagger in the main hand. Awards 1 combo point.
- rogue  `Gouge`: site: Causes 75 damage, stops your attack, and incapacitates the target for 4 sec. The target must be facing you. Any damage taken will break the effect. Awards 1 combo points. || game: Causes 75 damage, stops your attack, and incapacitates the target for 4 sec. The target must be facing you. Any damage taken will break the effect. Awards 1 combo point.
- rogue  `Ghostly Strike`: site: A strike that deals 125% (180% if a Dagger is equipped in your Main Hand) weapon damage and increases your chance to dodge by 15% for 7 sec. Awards 1 combo points. || game: A strike that deals 125% (180% if a Dagger is equipped in your Main Hand) weapon damage, increases your chance to dodge by 15% for 7 sec, and causes your next Ambush or Garrote cast within 7 sec to not require Stealth...
- rogue  `Hemorrhage`: site: An instant strike that deals 100% weapon damage (145% if a Dagger is equipped) and causes the target to take 15% increased Rupture damage from the Rogue. Lasts 15 sec. Awards 1 Combo Points. || game: An instant strike that deals 100% weapon damage (145% if a Dagger is equipped) and causes the target to take 15% increased Rupture and Garrote damage from the Rogue. Lasts 15 sec. Awards 1 Combo Point.
- rogue  `Deadly Poison`: site: Inflicts 2 Nature damage to an enemy every 10 sec. for 2 min. || game: Coats a weapon with poison that lasts for 30 minutes. Each strike has a 30% chance of poisoning the enemy for 24 Nature damage over 12 sec. Stacks up to 5 times on a single target. 90 charges.
- rogue  `Mind-numbing Poison III`: site: Coats a weapon with poison that lasts for 30 minutes. Each strike has a 20% chance of poisoning the enemy, increasing their casting time by 60% for 14 sec. 150 charges. || game: Coats a weapon with poison that lasts for 30 minutes. Each strike has a 20% chance of poisoning the enemy, increasing their casting time by 60% for 14 sec. 225 charges.
- rogue  `Deadly Poison IV`: site: Coats a weapon with poison that lasts for 30 minutes. Each strike has a 30% chance of poisoning the enemy for 72 Nature damage over 12 sec. Stacks up to 5 times on a single target. 160 charges. || game: Coats a weapon with poison that lasts for 30 minutes. Each strike has a 30% chance of poisoning the enemy for 72 Nature damage over 12 sec. Stacks up to 5 times on a single target. 240 charges.
- rogue  `Wound Poison IV`: site: Coats a weapon with poison that lasts for 30 minutes. Each strike has a 30% chance of poisoning the enemy, reducing all healing effects used on them by 165 for 15 sec. Stacks up to 5 times on a single target. 160 char... || game: Coats a weapon with poison that lasts for 30 minutes. Each strike has a 30% chance of poisoning the enemy, reducing all healing effects used on them by 165 for 15 sec. Stacks up to 5 times on a single target. 240 char...
- rogue  `Deadly Poison V`: site: Coats a weapon with poison that lasts for 30 minutes. Each strike has a 30% chance of poisoning the enemy for 92 Nature damage over 12 sec. Stacks up to 5 times on a single target. 180 charges. || game: Coats a weapon with poison that lasts for 30 minutes. Each strike has a 30% chance of poisoning the enemy for 92 Nature damage over 12 sec. Stacks up to 5 times on a single target. 240 charges.
- rogue  `Instant Poison VI`: site: Coats a weapon with poison that lasts for 30 minutes. Each strike has a 20% chance of poisoning the enemy which instantly inflicts 76 to 100 Nature damage. 175 charges. || game: Coats a weapon with poison that lasts for 30 minutes. Each strike has a 20% chance of poisoning the enemy which instantly inflicts 76 to 100 Nature damage. 250 charges.
- priest  `Lightwell Renew`: site: Restore 320 health every 2 sec. || game: 
- shaman  `Lightning Bolt`: site: Casts a bolt of lightning at the target for 190 to 211 Nature damage. || game: Casts a bolt of lightning at the target for 342 to 381 Nature damage.
- shaman  `Earth Shock`: site: Instantly shocks the target with concussive force, causing 293 to 309 Nature damage. It also interrupts spellcasting and prevents any spell in that school from being cast for 2 sec. Causes a high amount of threat. || game: Instantly shocks the target with concussive force, causing 517 to 545 Nature damage. It also interrupts spellcasting and prevents any spell in that school from being cast for 2 sec. Causes a high amount of threat.
- shaman  `Flame Shock`: site: Instantly sears the target with fire, causing 166 Fire damage immediately and 176 Fire damage over 12 sec. || game: Instantly sears the target with fire, causing 292 Fire damage immediately and 320 Fire damage over 12 sec.
- shaman  `Frost Shock`: site: Instantly shocks the target with frost, causing 279 to 295 Frost damage and slowing movement speed by 50%. Lasts 8 sec. || game: Instantly shocks the target with frost, causing 495 to 524 Frost damage and slowing movement speed by 50%. Lasts 8 sec.
- shaman  `Chain Lightning`: site: Hurls a lightning bolt at the enemy, dealing 119 to 133 Nature damage and then jumping to additional nearby enemies. Each jump reduces the damage by 30%. Affects 3 total targets. || game: Hurls a lightning bolt at the enemy, dealing 495 to 552 Nature damage and then jumping to additional nearby enemies. Each jump reduces the damage by 30%. Affects 3 total targets.
- shaman  `Flametongue Weapon`: site: Imbue the Shaman's weapon with fire. Each hit causes 35 to 112 additional Fire damage, based on the speed of the weapon. Slower weapons cause more fire damage per swing. When applied to main hand, disables any benefit... || game: Imbue the Shaman's weapon with fire. Each hit causes (35.494 + (10% of Spell Power)) to (112.4 + (10% of Spell Power)) additional Fire damage, based on the speed of the weapon. Slower weapons cause more fire damage pe...
- shaman  `Stormstrike`: site: Instantly strike for normal weapon damage and increase the damage you deal to the target with your next Lightning Bolt, Chain Lightning, or Earth Shock spell by 20% for 12 sec. || game: Instantly strike for 150% weapon damage and increase the damage you deal to the target with your next Lightning Bolt, Chain Lightning, or Earth Shock spell by 20% for 12 sec.
- shaman  `Cure Poison`: site: Cures 1 poison effects on the target. || game: Cures 1 poison effect on the target.
- shaman  `Riptide`: site: Heals a friendly target for 799 to 883, an additional 805 over 15 sec, and increases the effectiveness of your Chain Heal casts directly on that target by 25%. || game: Heals a friendly target for 805 over 15 sec, and increases the effectiveness of your Chain Heal casts directly on that target by 25%.
- mage  `Arcane Wrath`: site: Launches a projectile of pure Arcane energy at the enemy target, causing 406 to 496 Arcane damage. This spell gains additional Spell Damage equal to 5% of your maximum Mana. || game: Launches a projectile of pure Arcane energy at the enemy target, causing 122 to 146 Arcane damage. This spell gains additional Spell Damage equal to 5% of your maximum Mana.
- warlock  `Wrack`: site: Tears the target apart from within, inflicting 36 Shadow damage every 1 sec and increasing the damage they take from your other Shadow damage over time effects by 10% for 6 sec. || game: Tears the target apart from within, inflicting 86 Shadow damage every 1 sec and increasing the damage they take from your other Shadow damage over time effects by 10% for 6 sec.
- warlock  `Fel Domination`: site: Your next Imp, Voidwalker, Succubus, Incubus, or Felhunter Summon spell has its casting time reduced by 5.5 sec and its Mana cost reduced by 50%. || game: Your next Imp, Voidwalker, Succubus, Incubus, or Felhunter Summon spell has its casting time reduced by -5.5 sec and its Mana cost reduced by 50%.
- druid  `Nature's Grasp`: site: The next 1 melee attacks that strike the caster will afflict the attacker with Entangling Roots (Rank 6). Castable while shapeshifted. Lasts 45 sec. || game: The next 1 melee attack that strikes the caster will afflict the attacker with Entangling Roots (Rank 6). Castable while shapeshifted. Lasts 45 sec.
- druid  `Starfire`: site: Causes 350 to 412 Arcane damage to the target. || game: Causes 490 to 576 Arcane damage to the target.
- druid  `Claw`: site: Claw the enemy for 110% normal damage plus 115. Awards 1 combo points. || game: Claw the enemy for 140% normal damage plus 115. Awards 1 combo point.
- druid  `Shred`: site: Shred the target, causing 155% damage plus 80 to the target. Must be behind the target. Awards 1 combo points. || game: Shred the target, causing 200% damage plus 80 to the target. Must be behind the target. Awards 1 combo point.
- druid  `Rake`: site: Rake the target for 61 damage and an additional 102 damage over 9 sec. Awards 1 combo points. || game: Rake the target for 76 damage and an additional 126 damage over 9 sec. Awards 1 combo point.
- druid  `Ferocious Bite`: site: Finishing move that causes damage per combo point and converts each extra point of energy into 2.7 additional damage. Damage is increased by your Attack Power.  1 point : 199-259 damage  2 points: 346-406 damage  3 po... || game: Finishing move that causes damage per combo point and converts each extra point of energy into 3.3 additional damage. Damage is increased by your Attack Power.  1 point : 245-321 damage  2 points: 426-502 damage  3 po...
- druid  `Ravage`: site: Ravage the target, causing 350% damage plus 343 to the target. Must be prowling and behind the target. Awards 1 combo points. || game: Ravage the target, causing 435% damage plus 343 to the target. Must be prowling and behind the target. Awards 1 combo point.

## Changed in this build (113)

- warrior `Spearing Strike` (text): SpellEffect#1.EffectBasePointsF: 40 -> 75; SpellEffect#2.EffectBasePointsF: 2 -> 1
- warrior `Sweeping Strikes` (same): SpellMisc.Attributes_14: 0 -> 64
- warrior `Improved Slam` (text): SpellEffect#2.EffectBasePointsF: -3000 -> -5000; description: Reduces the global cooldown and cast time of your Slam ability by $... -> Reduces the cooldown of your Slam ability by ${$m3/-1000}.1 sec, th...
- warrior `Booming Voice` (text): SpellEffect#1.EffectSpellClassMask_1: 0 -> 32; description: Increases the area of effect of your Shouts by $s1% and reduces the... -> Increases the area of effect of your Shouts by $s1% and reduces the...
- warrior `Reckless Swings` (missing_on_site): SpellAuraOptions.ProcChance:  -> 100; SpellAuraOptions.ProcCharges:  -> 4; SpellAuraOptions.ProcTypeMask_0:  -> 4; SpellCategories.StartRecoveryCategory:  -> 133
- warrior `Improved Whirlwind` (missing_on_site): SpellEffect#0.EffectAura: 4 -> 107; SpellEffect#0.EffectBasePointsF: 100 -> -2000; SpellEffect#0.EffectMiscValue_0: 0 -> 11; SpellEffect#0.EffectSpellClassMask_1: 0 -> 4
- warrior `Concussion Blow` (same): SpellMisc.Attributes_14: 0 -> 64
- paladin `Two-Handed Weapon Specialization` (text): SpellEffect#0.EffectMiscValue_0: 1 -> 3; description: Increases the physical damage you deal by $s1%, and reduces all thr... -> Increases the Physical and Holy damage you deal by $s1%, and reduce...
- paladin `Vengeance` (text): ref 20050 SpellAuraOptions.CumulativeAura: 3 -> 5
- hunter `Trueshot Aura` (same): SpellEffect#0.EffectBasePointsF: 15 -> 20
- hunter `Sniper Shot` (same): SpellEffect#0.EffectBasePointsF: 160 -> 320
- hunter `Lacerating Strikes` (same): ref 1310536 SpellMisc.Attributes_4: 256 -> 1048832
- rogue `Blood Splatter` (missing_on_site): SpellClassOptions.SpellClassSet:  -> 8; SpellEffect#0.Effect:  -> 6; SpellEffect#0.EffectAura:  -> 107; SpellEffect#0.EffectBasePointsF:  -> 4000
- rogue `Venom` (pos, text): SpellClassOptions.SpellClassSet:  -> 8; SpellEffect#0.Effect:  -> 6; SpellEffect#0.EffectAura:  -> 4; SpellEffect#0.EffectBasePointsF:  -> 100
- rogue `Mutilate` (pos, text): subtext: Rank 2 -> Rank 1; ref 399960 SpellEffect#0.EffectBasePointsF: 33 -> 44; ref 399960 SpellEffect#1.EffectBasePointsF: 75 -> 90; ref 399960 subtext: Rank 2 -> Rank 1
- rogue `Improved Eviscerate` (name, text): SpellEffect#1.Effect:  -> 6; SpellEffect#1.EffectAura:  -> 108; SpellEffect#1.EffectBasePointsF:  -> 20; SpellEffect#1.EffectBonusCoefficient:  -> 1
- rogue `Improved Sinister Strike` (name, text): SpellEffect#0.EffectSpellClassMask_0: 2 -> 33554434; description: Reduces the Energy cost of your Sinister Strike ability by $s1. -> Reduces the Energy cost of your Sinister Strike and Hemorrhage abil...; name: Improved Sinister Strike -> Efficient Strikes
- rogue `Composure` (missing_on_site): SpellClassOptions.SpellClassSet:  -> 8; SpellEffect#0.Effect:  -> 6; SpellEffect#0.EffectAura:  -> 107; SpellEffect#0.EffectBonusCoefficient:  -> 1
- rogue `Flawless Execution` (text): SpellEffect#0.EffectBasePointsF: -10 -> -15
- rogue `Aggression` (pos, text): SpellEffect#0.EffectSpellClassMask_0: 131078 -> 131074; description: Increases the damage of your Sinister Strike, Backstab, and Eviscer... -> Increases the damage of your Sinister Strike and Eviscerate abiliti...
- rogue `Flash of Steel` (missing_on_site): SpellClassOptions.SpellClassSet:  -> 8; SpellEffect#0.Effect:  -> 6; SpellEffect#0.EffectAura:  -> 107; SpellEffect#0.EffectBasePointsF:  -> 15
- rogue `Setup` (pos, unverifiable): description: Gives you a $m1% chance to add a Combo Point to your target after D... -> Gives you a $m1% chance to add a Combo Point to your target after D...
- rogue `Ghostly Strike` (pos, text): SpellEffect#4.Effect:  -> 121; SpellEffect#4.EffectBonusCoefficient:  -> 1; SpellEffect#4.EffectChainAmplitude:  -> 1; SpellEffect#4.EffectIndex:  -> 4
- rogue `Quick Getaway` (missing_on_site): SpellAuraOptions.ProcChance:  -> 100; SpellAuraOptions.ProcTypeMask_1:  -> 4; SpellEffect#0.EffectBasePointsF: 10 -> 1; SpellEffect#1.EffectAura: 4 -> 231
- rogue `Hemorrhage` (text): SpellEffect#2.EffectSpellClassMask_0: 1048576 -> 1048832; aura: Taking $w3% increased Rupture damage from the caster. -> Taking $w3% increased Rupture and Garrote damage from the caster.; description: An instant strike that deals $m4% weapon damage ($m5% if a Dagger i... -> An instant strike that deals $m4% weapon damage ($m5% if a Dagger i...
- rogue `Boot Knife` (missing_on_site): SpellClassOptions.SpellClassSet:  -> 8; SpellEffect#0.Effect:  -> 6; SpellEffect#0.EffectAura:  -> 4; SpellEffect#0.EffectBasePointsF:  -> 100
- rogue `Death Mark` (missing_on_site): SpellMisc.RangeIndex: 529 -> 3; SpellRange(RangeIndex).DisplayNameShort_lang: Twenty-Five -> Short; SpellRange(RangeIndex).DisplayName_lang: Twenty-Five yards -> Short Range; SpellRange(RangeIndex).RangeMax_0: 25 -> 20
- shaman `Convection` (text): description: Reduces the mana cost of your Shock, Lightning Bolt, Lava Burst, an... -> Reduces the mana cost of your Shock, Lightning Bolt, and Chain Ligh...
- shaman `Elemental Alacrity` (text): description: Reduces the cast time of your Lightning Bolt, Chain Lightning, and ... -> Reduces the cast time of your Lightning Bolt and Chain Lightning sp...
- shaman `Call of Flame` (text): description: Increases the damage done by your Fire Totems and by your Flame Sho... -> Increases the damage done by your Fire Totems and by your Flame Sho...
- shaman `Eye of the Storm` (text): description: Gives your Lightning Bolt, Chain Lightning, and Lava Burst spells a... -> Gives your Lightning Bolt and Chain Lightning spells a $m1% chance ...
- shaman `Elemental Reach` (text): SpellEffect#2.EffectAura: 107 -> 4; SpellEffect#2.EffectMiscValue_0: 11 -> 0; SpellEffect#2.EffectSpellClassMask_3: 128 -> 0; description: Increases the range of your Lightning Bolt, Chain Lightning, Fire N... -> Increases the range of your Lightning Bolt, Chain Lightning, and Fi...
- shaman `Call of Thunder` (missing_on_site): SpellEffect#0.EffectBasePointsF: 3 -> 5
- shaman `Elemental Mastery` (name, text): SpellMisc.SpellIconFileDataID: 136115 -> 136111; aura: Lightning Bolt and Lava Burst cast time reduced by ${$m1/-1000}.1 s... -> Lightning Bolt cast time reduced by ${$m1/-1000}.1 sec and Chain Li...; description: Gain mastery over Fire and Lightning, reducing the cast time of Lig... -> Gain mastery over Lightning, reducing the cast time of your Lightni...; name: Elemental Mastery -> Lightning Mastery
- shaman `Stormstrike` (text): SpellCooldowns.RecoveryTime: 8000 -> 6000; SpellEffect#2.Effect:  -> 31; SpellEffect#2.EffectBasePointsF:  -> 150; SpellEffect#2.EffectChainAmplitude:  -> 1
- shaman `Riptide` (text): SpellCooldowns.CategoryRecoveryTime: 6000 -> 12000; SpellEffect#0.Effect: 10 -> 3; SpellEffect#0.EffectBasePointsF: 480 -> 0; SpellPower#0.ManaCost: 245 -> 150
- mage `Missile Barrage` (text): description: Gives your Arcane Blast spell a $m1% chance, and your Arcane Wrath,... -> Gives your Arcane Blast spell a $m1% chance, and your Arcane Wrath,...
- mage `Improved Frostbolt` (text): description: Reduces the casting time of your Frostbolt and Frost Blast spells b... -> Reduces the casting time of your Frostbolt spell by $/1000;S1 sec.
- mage `Arctic Reach` (text): description: Increases the range of your Frostbolt, Frost Blast, Ice Lance, and ... -> Increases the range of your Frostbolt, Ice Lance, and Blizzard spel...
- mage `Winter's Chill` (text): description: Gives your Frostbolt, Frost Blast, and Fingers of Frost empowered I... -> Gives your Frostbolt and Fingers of Frost empowered Ice Lance spell...
- warlock `Wrack` (text): SpellEffect#0.EffectBonusCoefficient: 0.14300000668 -> 0.28600001335; SpellEffect#0.EffectRealPointsPerLevel: 0 -> 2.5
- warrior `Spearing Strike` (text): SpellEffect#1.EffectBasePointsF: 40 -> 75; SpellEffect#2.EffectBasePointsF: 2 -> 1
- warrior `Sweeping Strikes` (same): SpellMisc.Attributes_14: 0 -> 64
- warrior `Slam` (same): SpellCooldowns.CategoryRecoveryTime: 18000 -> 15000
- warrior `Concussion Blow` (same): SpellMisc.Attributes_14: 0 -> 64
- hunter `Serpent Sting` (same): SpellEffect#0.EffectBasePointsF: 111 -> 135
- hunter `Arcane Shot` (same): SpellEffect#0.EffectBasePointsF: 217 -> 280
- hunter `Aimed Shot` (same): SpellEffect#0.EffectBasePointsF: 166 -> 350
- hunter `Trueshot Aura` (text): SpellEffect#0.EffectBasePointsF: 50 -> 100
- hunter `Sniper Shot` (same): SpellEffect#0.EffectBasePointsF: 295 -> 590
- rogue `Rupture` (unverifiable): description: Finishing move that causes damage over time, increased by your Atta... -> Finishing move that causes damage over time, increased by your Atta...
- rogue `Mutilate` (rank, text): subtext: Rank 4 -> Rank 3; ref 1241586 SpellEffect#0.EffectBasePointsF: 67 -> 88; ref 1241586 SpellEffect#1.EffectBasePointsF: 75 -> 90; ref 1241586 subtext: Rank 4 -> Rank 3
- rogue `Venom` (text): SpellClassOptions.SpellClassSet:  -> 8; SpellEffect#0.Effect:  -> 6; SpellEffect#0.EffectAura:  -> 4; SpellEffect#0.EffectBasePointsF:  -> 100
- rogue `Sap` (same): SpellMisc.Attributes_5: 32 -> 0; description: Incapacitates the target for up to $d. Only works on Humanoids that... -> Incapacitates the target for up to $d. Only works on Humanoids that...
- rogue `Ghostly Strike` (text): SpellEffect#4.Effect:  -> 121; SpellEffect#4.EffectBonusCoefficient:  -> 1; SpellEffect#4.EffectChainAmplitude:  -> 1; SpellEffect#4.EffectIndex:  -> 4
- rogue `Hemorrhage` (text): SpellEffect#2.EffectSpellClassMask_0: 1048576 -> 1048832; aura: Taking $w3% increased Rupture damage from the caster. -> Taking $w3% increased Rupture and Garrote damage from the caster.; description: An instant strike that deals $m4% weapon damage ($m5% if a Dagger i... -> An instant strike that deals $m4% weapon damage ($m5% if a Dagger i...
- rogue `Mind-numbing Poison III` (text): SpellEffect#2.EffectBasePointsF: 150 -> 225; ref 11399 SpellEffect#1.EffectBasePointsF: 150 -> 225
- rogue `Deadly Poison IV` (text): SpellEffect#2.EffectBasePointsF: 160 -> 240; ref 11356 SpellEffect#2.EffectBasePointsF: 160 -> 240
- rogue `Wound Poison IV` (text): SpellEffect#2.EffectBasePointsF: 160 -> 240; ref 13227 SpellEffect#1.EffectBasePointsF: 160 -> 240
- rogue `Deadly Poison V` (text): SpellEffect#2.EffectBasePointsF: 180 -> 240; ref 11356 SpellEffect#2.EffectBasePointsF: 160 -> 240
- rogue `Instant Poison VI` (text): SpellEffect#2.EffectBasePointsF: 175 -> 250; ref 11340 SpellEffect#1.EffectBasePointsF: 175 -> 250
- shaman `Lightning Bolt` (text): SpellEffect#0.EffectBasePointsF: 196 -> 353; SpellEffect#0.EffectRealPointsPerLevel: 1.20000004768 -> 2.09999990463
- shaman `Earth Shock` (text): SpellEffect#0.EffectBasePointsF: 301 -> 531; SpellEffect#0.EffectRealPointsPerLevel: 1.89999997616 -> 3.40000009537
- shaman `Flame Shock` (text): SpellEffect#0.EffectBasePointsF: 166 -> 292; SpellEffect#0.EffectRealPointsPerLevel: 2.09999990463 -> 3.79999995232; SpellEffect#1.EffectBasePointsF: 44 -> 80
- shaman `Frost Shock` (text): SpellEffect#1.EffectBasePointsF: 283 -> 506
- shaman `Chain Lightning` (text): SpellCastTimes(CastingTimeIndex).Base: 2000 -> 2500; SpellCastTimes(CastingTimeIndex).Minimum: 2000 -> 2500; SpellEffect#0.EffectBasePointsF: 123 -> 510; SpellEffect#0.EffectBonusCoefficient: 0.57099997997 -> 0.71399998665
- shaman `Stormstrike` (text): SpellCooldowns.RecoveryTime: 8000 -> 6000; SpellEffect#2.Effect:  -> 31; SpellEffect#2.EffectBasePointsF:  -> 150; SpellEffect#2.EffectChainAmplitude:  -> 1
- shaman `Riptide` (text): SpellCooldowns.CategoryRecoveryTime: 6000 -> 12000; SpellEffect#0.Effect: 10 -> 3; SpellEffect#0.EffectBasePointsF: 841 -> 0; SpellPower#0.ManaCost: 385 -> 230
- warlock `Wrack` (text): SpellEffect#0.EffectBonusCoefficient: 0.14300000668 -> 0.28600001335; SpellEffect#0.EffectRealPointsPerLevel: 0 -> 2.5
- druid `Starfire` (text): SpellEffect#0.EffectBasePointsF: 381 -> 533; SpellEffect#0.EffectRealPointsPerLevel: 2.40000009537 -> 3.40000009537
- druid `Claw` (text): SpellEffect#1.EffectBasePointsF: 110 -> 140
- druid `Rip` (unverifiable): SpellEffect#0.EffectBasePointsF: 15 -> 19; SpellEffect#0.EffectPointsPerResource: 25.5 -> 31.89999961853
- druid `Shred` (text): SpellEffect#1.EffectBasePointsF: 155 -> 200
- druid `Rake` (text): SpellEffect#0.EffectBasePointsF: 61 -> 76; SpellEffect#1.EffectBasePointsF: 34 -> 42
- druid `Ferocious Bite` (text): SpellEffect#0.EffectBasePointsF: 82 -> 102; SpellEffect#0.EffectPointsPerResource: 147 -> 181; SpellEffect#1.EffectBasePointsF: 270 -> 330; description: Finishing move that causes damage per combo point and converts each... -> Finishing move that causes damage per combo point and converts each...
- druid `Ravage` (text): SpellEffect#1.EffectBasePointsF: 350 -> 435
- druid `Pounce` (text): ref 9826 SpellEffect#0.EffectBasePointsF: 25 -> 31
- warrior `Spearing Strike` (text): SpellEffect#1.EffectBasePointsF: 40 -> 75; SpellEffect#2.EffectBasePointsF: 2 -> 1
- warrior `Sweeping Strikes` (same): SpellMisc.Attributes_14: 0 -> 64
- warrior `Slam` (same): SpellCooldowns.CategoryRecoveryTime: 18000 -> 15000
- warrior `Concussion Blow` (same): SpellMisc.Attributes_14: 0 -> 64
- hunter `Serpent Sting` (same): SpellEffect#0.EffectBasePointsF: 111 -> 135
- hunter `Arcane Shot` (same): SpellEffect#0.EffectBasePointsF: 217 -> 280
- hunter `Aimed Shot` (same): SpellEffect#0.EffectBasePointsF: 166 -> 350
- hunter `Trueshot Aura` (text): SpellEffect#0.EffectBasePointsF: 50 -> 100
- hunter `Sniper Shot` (same): SpellEffect#0.EffectBasePointsF: 295 -> 590
- rogue `Rupture` (unverifiable): description: Finishing move that causes damage over time, increased by your Atta... -> Finishing move that causes damage over time, increased by your Atta...
- rogue `Mutilate` (rank, text): subtext: Rank 4 -> Rank 3; ref 1241586 SpellEffect#0.EffectBasePointsF: 67 -> 88; ref 1241586 SpellEffect#1.EffectBasePointsF: 75 -> 90; ref 1241586 subtext: Rank 4 -> Rank 3
- rogue `Venom` (text): SpellClassOptions.SpellClassSet:  -> 8; SpellEffect#0.Effect:  -> 6; SpellEffect#0.EffectAura:  -> 4; SpellEffect#0.EffectBasePointsF:  -> 100
- rogue `Sap` (same): SpellMisc.Attributes_5: 32 -> 0; description: Incapacitates the target for up to $d. Only works on Humanoids that... -> Incapacitates the target for up to $d. Only works on Humanoids that...
- rogue `Ghostly Strike` (text): SpellEffect#4.Effect:  -> 121; SpellEffect#4.EffectBonusCoefficient:  -> 1; SpellEffect#4.EffectChainAmplitude:  -> 1; SpellEffect#4.EffectIndex:  -> 4
- rogue `Hemorrhage` (text): SpellEffect#2.EffectSpellClassMask_0: 1048576 -> 1048832; aura: Taking $w3% increased Rupture damage from the caster. -> Taking $w3% increased Rupture and Garrote damage from the caster.; description: An instant strike that deals $m4% weapon damage ($m5% if a Dagger i... -> An instant strike that deals $m4% weapon damage ($m5% if a Dagger i...
- rogue `Mind-numbing Poison III` (text): SpellEffect#2.EffectBasePointsF: 150 -> 225; ref 11399 SpellEffect#1.EffectBasePointsF: 150 -> 225
- rogue `Deadly Poison IV` (text): SpellEffect#2.EffectBasePointsF: 160 -> 240; ref 11356 SpellEffect#2.EffectBasePointsF: 160 -> 240
- rogue `Wound Poison IV` (text): SpellEffect#2.EffectBasePointsF: 160 -> 240; ref 13227 SpellEffect#1.EffectBasePointsF: 160 -> 240
- rogue `Deadly Poison V` (text): SpellEffect#2.EffectBasePointsF: 180 -> 240; ref 11356 SpellEffect#2.EffectBasePointsF: 160 -> 240
- rogue `Instant Poison VI` (text): SpellEffect#2.EffectBasePointsF: 175 -> 250; ref 11340 SpellEffect#1.EffectBasePointsF: 175 -> 250
- warlock `Wrack` (text): SpellEffect#0.EffectBonusCoefficient: 0.14300000668 -> 0.28600001335; SpellEffect#0.EffectRealPointsPerLevel: 0 -> 2.5
- druid `Starfire` (text): SpellEffect#0.EffectBasePointsF: 381 -> 533; SpellEffect#0.EffectRealPointsPerLevel: 2.40000009537 -> 3.40000009537
- druid `Claw` (text): SpellEffect#1.EffectBasePointsF: 110 -> 140
- druid `Rip` (unverifiable): SpellEffect#0.EffectBasePointsF: 15 -> 19; SpellEffect#0.EffectPointsPerResource: 25.5 -> 31.89999961853
- druid `Shred` (text): SpellEffect#1.EffectBasePointsF: 155 -> 200
- druid `Rake` (text): SpellEffect#0.EffectBasePointsF: 61 -> 76; SpellEffect#1.EffectBasePointsF: 34 -> 42
- druid `Ferocious Bite` (text): SpellEffect#0.EffectBasePointsF: 82 -> 102; SpellEffect#0.EffectPointsPerResource: 147 -> 181; SpellEffect#1.EffectBasePointsF: 270 -> 330; description: Finishing move that causes damage per combo point and converts each... -> Finishing move that causes damage per combo point and converts each...
- druid `Ravage` (text): SpellEffect#1.EffectBasePointsF: 350 -> 435
- druid `Pounce` (text): ref 9826 SpellEffect#0.EffectBasePointsF: 25 -> 31
- shaman `Lightning Bolt` (text): SpellEffect#0.EffectBasePointsF: 196 -> 353; SpellEffect#0.EffectRealPointsPerLevel: 1.20000004768 -> 2.09999990463
- shaman `Earth Shock` (text): SpellEffect#0.EffectBasePointsF: 301 -> 531; SpellEffect#0.EffectRealPointsPerLevel: 1.89999997616 -> 3.40000009537
- shaman `Flame Shock` (text): SpellEffect#0.EffectBasePointsF: 166 -> 292; SpellEffect#0.EffectRealPointsPerLevel: 2.09999990463 -> 3.79999995232; SpellEffect#1.EffectBasePointsF: 44 -> 80
- shaman `Frost Shock` (text): SpellEffect#1.EffectBasePointsF: 283 -> 506
- shaman `Chain Lightning` (text): SpellCastTimes(CastingTimeIndex).Base: 2000 -> 2500; SpellCastTimes(CastingTimeIndex).Minimum: 2000 -> 2500; SpellEffect#0.EffectBasePointsF: 123 -> 510; SpellEffect#0.EffectBonusCoefficient: 0.57099997997 -> 0.71399998665
- shaman `Stormstrike` (text): SpellCooldowns.RecoveryTime: 8000 -> 6000; SpellEffect#2.Effect:  -> 31; SpellEffect#2.EffectBasePointsF:  -> 150; SpellEffect#2.EffectChainAmplitude:  -> 1
- shaman `Riptide` (text): SpellCooldowns.CategoryRecoveryTime: 6000 -> 12000; SpellEffect#0.Effect: 10 -> 3; SpellEffect#0.EffectBasePointsF: 841 -> 0; SpellPower#0.ManaCost: 385 -> 230
