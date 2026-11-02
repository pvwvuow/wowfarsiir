# Forever site check: 1.60.1.70707 (changes vs 1.60.1.70634)

Site spellbook + talent trees vs the client data (tools/forever_check.py). Rules: site pos = [TierID+1, ColumnIndex+1]; talent text = rank 1; spellbook text = the site rank.

| part | total | same | text | unverifiable | other | changed in this build |
|---|---|---|---|---|---|---|
| talents | 500 | 57 | 308 | 7 | 392 | 112 |
| spellbook | 504 | 391 | 77 | 35 | 3 | 367 |
| spells_json | 514 | 390 | 83 | 35 | 9 | 371 |

Queue (safe EN updates, review then `--apply`): **145**

0. warrior d `Deep Wounds`: Your critical strikes cause your opponent to Bleed, dealing 20% of ... -> Your critical strikes cause your opponent to Bleed, dealing 0% of y... (ref 412609 SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
1. warrior d `Weaponmaster`: Gives your melee weapon attacks a benefit depending on the weapon. ... -> Increases your chance to get a critical strike with Axes and Polear... (SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
2. warrior d `Improved Hamstring`: Gives your Hamstring ability a 5% chance to immobilize the target f... -> Gives your Hamstring ability a 0% chance to immobilize the target f... (ref 23694 SpellCategories.DiminishType: 0 -> 1024; ref 23694 SpellD...)
3. warrior d `Blood Craze`: Regenerates 1% of your total Health over 6 sec after being the vict... -> Regenerates 3% of your total Health over 6 sec after being the vict... (ref 16488 SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
4. warrior d `Enrage`: Gives you a 30% chance to deal 2% increased Physical damage for 12 ... -> Gives you a 30% chance to deal 0% increased Physical damage for 12 ... (ref 12880 SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
5. warrior d `Flurry`: Increases your melee attack speed by 5% for your next 3 swings afte... -> Increases your melee attack speed by 1% for your next 3 swings afte... (ref 12966 SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
6. warrior d `Focused Rage`: Reduces the Rage cost of your offensive abilities by 1. -> Gives your Shield Bash ability a 100% chance to Silence the target ... (ref 18498 SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
7. paladin d `Reverence`: Allows 15% of your Mana regeneration to continue while casting. -> Consecrates the land beneath the Paladin, doing 16 Holy damage over... (SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
8. paladin d `Holy Shock`: Blasts the target with Holy energy, causing 129 to 139 Holy damage ... -> When activated, gives your next Flash of Light, Holy Light, or Holy... (SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
9. paladin d `Redoubt`: Damaging melee attacks against you have a 10% chance to increase yo... -> Damaging melee attacks against you have a 10% chance to increase yo... (ref 20128 SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
10. paladin d `Improved Seal of Fury`: When Seal of Fury's shield is fully absorbed, restore 0 Mana, incre... -> Places a Blessing on the friendly target, increasing total stats by... (SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
11. paladin d `Shield Specialization`: Increases the amount of damage absorbed by your shield by 15%, and ... -> Increases the amount of damage absorbed by your shield by 10%. (SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
12. paladin d `Holy Shield`: Increases chance to block by 30% for 10 sec, and deals 75 Holy dama... -> Increases chance to block by 30% for 10 sec, and deals 110 Holy dam... (SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
13. paladin d `Vindication`: Gives your damaging melee attacks a chance to reduce the target's A... -> Gives your damaging melee attacks a chance to reduce the target's A... (ref 440667 SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
14. paladin d `Seal of Command`: Gives the Paladin a chance to deal additional Holy damage equal to ... -> Gives the Paladin a chance to deal additional Holy damage equal to ... (SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
15. paladin d `Repentance`: Puts the enemy target in a state of meditation, incapacitating them... -> Increases Holy damage done by party members within 30 yards by 10%.... (SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
16. paladin d `Vengeance`: Increases your Physical and Holy damage dealt by 1% for 30 sec afte... -> Increases your Physical and Holy damage dealt by 5% for 30 sec afte... (ref 20050 SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
17. paladin d `Twist of Light`: Reduces the Mana cost of your Seal spells by 20%, and when you repl... -> Puts the enemy target in a state of meditation, incapacitating them... (SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
18. hunter d `Deadly Aspects`: While Aspect of the Hawk is active, Auto Shot has a 2% chance of in... -> While Aspect of the Hawk is active, Auto Shot has a 10% chance of i... (ref 6150 SpellDuration(DurationIndex).DurationPerLevel:  -> 0; ref ...)
19. hunter d `Improved Concussive Shot`: Gives your Concussive Shot a 4% chance to stun the target for 3 sec. -> Gives your Concussive Shot a (100% of Spell Power)% chance to stun ... (ref 19410 SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
20. hunter d `Efficiency`: Reduces the Mana cost of your Shots, Stings, and melee abilities by... -> Reduces the Mana cost of your Shots, Stings, and melee abilities by... (SpellEffect#0.EffectSpellClassMask_2: 8192 -> 2105344)
21. hunter d `Sniper Shot`: A long-range shot that deals ranged damage plus 160 and increases t... -> Increases the Ranged Attack Power of party or raid members within 4... (SpellDuration(DurationIndex).DurationPerLevel:  -> 0; SpellEffect#0...)
22. hunter d `Improved Wing Clip`: Gives your Wing Clip ability a 7% chance to immobilize the target f... -> Gives your Wing Clip ability a 20% chance to immobilize the target ... (ref 19229 SpellCategories.DiminishType: 0 -> 1024; ref 19229 SpellD...)
23. rogue d `Remorseless Attacks`: After killing a non-trivial enemy, gives you a 20% increased critic... -> After killing a non-trivial enemy, gives you a (100% of Spell Power... (ref 14143 SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
24. rogue d `Improved Kick`: Gives your Kick ability a 50% chance to Silence the target for 2 sec. -> Gives your Kick ability a 100% chance to Silence the target for 2 sec. (ref 18425 SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
25. rogue d `Hack and Slash`: Gives your melee weapon attacks a benefit depending on the weapon. ... -> Increases your chance to get a critical strike with Daggers and Fis... (SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
26. rogue d `Ghostly Strike`: A strike that deals 125% (180% if a Dagger is equipped in your Main... -> A strike that deals 125% (180% if a Dagger is equipped in your Main... (SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
27. rogue d `Thousand Cuts`: When your Rupture ability deals periodic damage, the Energy cost of... -> Adds 2 Combo Points to your target. You must add to or use those co... (SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
28. priest d `Martyrdom`: Gives you a 50% chance to gain Focused Casting for 6 sec after bein... -> Gives you a (100% of Spell Power)% chance to gain Focused Casting f... (ref 27828 SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
29. priest d `Renewed Hope`: Your heals from Flash Heal, Lesser Heal, Heal, Greater Heal, and Pe... -> Holy power infuses the target, increasing their Spirit by 17 for 1 hr. (SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
30. priest d `Inspiration`: Your non-periodic critical heals increase your target's Armor by 8%... -> Your non-periodic critical heals increase your target's Armor by (1... (ref 14893 SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
31. priest d `Prayer of Mending`: Places a spell on the target that heals them for 172 the next time ... -> Creates a holy Lightwell near the priest. Members of your raid or p... (SpellDuration(DurationIndex).DurationPerLevel:  -> 0; ref 7001 Spel...)
32. priest d `Spirit Tap`: Gives you a 20% chance to increase your Spirit by 100% for 15 sec a... -> Gives you a (100% of Spell Power)% chance to increase your Spirit b... (ref 15271 SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
33. priest d `Shadow Weaving`: Your Shadow damage spells have a 33% chance to increase the Shadow ... -> Your Shadow damage spells have a 100% chance to increase the Shadow... (ref 15258 SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
34. shaman d `Earthbound`: Your Earthbind Totem Immobilizes nearby targets for 5 sec when cast. -> Your Critical Strikes with direct damage spells increase your chanc... (ref 30165 SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
35. shaman d `Flurry`: Increases your attack speed by 5% for your next 3 swings after deal... -> Increases your attack speed by 1% for your next 3 swings after deal... (ref 16257 SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
36. shaman d `Maelstrom Weapon`: When you deal damage with a melee attack, you have a chance to redu... -> Increases the damage you deal with all weapons by 2%. (SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
37. shaman d `Ancestral Healing`: Increases your target's armor value by 8% for 15 sec after getting ... -> Increases your target's armor value by (100% of Spell Power)% for 1... (ref 16177 SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
38. mage d `Accelerant`: Reduces the casting time of your Fireball, Frostfire Bolt, and Arca... -> Reduces the casting time of your Fireball, Frostfire Bolt, and Arca... (SpellEffect#0.EffectSpellClassMask_1: 4096 -> 36864; description: R...)
39. mage d `Impact`: Gives your Fire spells a 3% chance to stun the target for 2 sec. -> Gives your Fire spells a 10% chance to stun the target for 2 sec. (ref 12355 SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
40. mage d `Ignite`: Your critical strikes from Fire damage spells cause the target to b... -> Your critical strikes from Fire damage spells cause the target to b... (ref 412538 SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
41. mage d `Pyroblast`: Hurls an immense fiery boulder that causes 101 to 131 Fire damage a... -> Hurls an immense fiery boulder that causes 95 to 125 Fire damage an... (SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
42. mage d `Improved Scorch`: Your Scorch spell has a 33% chance to cause your target to be vulne... -> Your Scorch spell has a 100% chance to cause your target to be vuln... (ref 22959 SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
43. mage d `Blast Wave`: A wave of flame radiates outward from the caster, damaging all enem... -> A wave of flame radiates outward from the caster, damaging all enem... (SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
44. mage d `Precision`: Improves your chance to hit with all spells by 2%. -> Improves your chance to hit with all spells by 6%. (SpellEffect#0.EffectAura: 107 -> 55; SpellEffect#0.EffectMiscValue_...)
45. mage d `Frostbite`: Gives your Chill effects a 5% chance to Freeze the target for 5 sec. -> Gives your Chill effects a 15% chance to Freeze the target for 5 sec. (ref 12494 SpellCategories.DiminishType: 0 -> 1024; ref 12494 SpellD...)
46. mage d `Improved Blizzard`: Adds a Chill effect to your Blizzard spell. This effect lowers the ... -> Adds a Chill effect to your Blizzard spell. This effect lowers the ... (ref 12484 SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
47. mage d `Winter's Chill`: Gives your Frostbolt, Frost Blast, and Fingers of Frost empowered I... -> Gives your Frostbolt, Frost Blast, and Fingers of Frost empowered I... (ref 12579 SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
48. warlock d `Nightfall`: Gives your Corruption, Drain Soul, Drain Life, and Wrack spells a 2... -> Gives your Corruption, Drain Soul, Drain Life, and Wrack spells a 4... (ref 17941 SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
49. warlock d `Fel Domination`: Your next Imp, Voidwalker, Succubus, Incubus, or Felhunter Summon s... -> Your next Imp, Voidwalker, Succubus, Incubus, or Felhunter Summon s... (SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
50. warlock d `Improved Shadow Bolt`: Your Shadow Bolt critical strikes increase Shadow damage taken by t... -> Your Shadow Bolt critical strikes increase Shadow damage taken by t... (ref 17794 SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
51. warlock d `Aftermath`: Increases the initial damage of your Immolate spell by 10% and your... -> Increases the initial damage of your Immolate spell by 50% and your... (ref 18118 SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
52. warlock d `Pyroclasm`: Gives your Soul Fire spell a 13% chance to Stun the target for 3 se... -> Your non-periodic critical strikes with your Fire spells increase y... (ref 18093 SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
53. druid d `Nature's Splendor`: Increases the duration of your Moonfire and Rejuvenation spells by ... -> Your spells and attacks have a chance to grant you Clearcasting, re... (ref 16870 SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
54. druid d `Improved Starfire`: Reduces the cast time of Starfire by 0.1 sec and Starfire has a 3% ... -> Reduces the cast time of Starfire by -0.5 sec and Starfire has a 15... (ref 16922 SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
55. druid d `Moonkin Form`: Shapeshift into Moonkin Form, increasing Omen of Clarity's chance t... -> Shapeshift into Moonkin Form, increasing Omen of Clarity's chance t... (SpellDuration(DurationIndex).DurationPerLevel:  -> 0; ref 24907 Spe...)
56. druid d `Savage Fury`: Increases the damage caused by your Claw, Rake, Shred, Maul, and Sw... -> Charge an enemy, immobilizing them and interrupting any spell they ... (ref 19675 SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
57. druid d `Leader of the Pack`: While in Cat Form, Bear Form, or Dire Bear Form, the Leader of the ... -> While in Cat Form, Bear Form, or Dire Bear Form, the Leader of the ... (ref 24932 SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
58. druid d `Gift of Nature`: Increases the effect of all your healing spells by 2%. -> The enemy target is swarmed by insects, decreasing their chance to ... (SpellDuration(DurationIndex).DurationPerLevel:  -> 0)
59. warrior d `Demoralizing Shout`: Reduces the melee attack power of all enemies within 10 yards by 20... -> Reduces the melee attack power of all enemies within 10 yards by 19... (SpellDuration(DurationIndex).DurationPerLevel:  -> 0)

## Talents missing on the site (36)

- warrior Arms: site `None` game `Improved Overpower` missing_on_site pos None/[3, 1] ranks None/2
- warrior Arms: site `None` game `Weaponmaster` missing_on_site pos None/[5, 3] ranks None/5
- warrior Arms: site `None` game `Weaponmaster` missing_on_site pos None/[5, 4] ranks None/5
- warrior Fury: site `None` game `Improved Battle Shout` missing_on_site pos None/[3, 4] ranks None/5
- warrior Fury: site `None` game `Improved Berserker Rage` missing_on_site pos None/[6, 1] ranks None/2
- paladin Protection: site `None` game `Improved Concentration Aura` missing_on_site pos None/[4, 3] ranks None/3
- hunter Beast Mastery: site `None` game `Pathfinding` missing_on_site pos None/[3, 1] ranks None/2
- hunter Marksmanship: site `None` game `Improved Hunter's Mark` missing_on_site pos None/[2, 2] ranks None/5
- hunter Marksmanship: site `None` game `` missing_on_site pos None/[5, 3] ranks None/3
- hunter Survival: site `None` game `Humanoid Slaying` missing_on_site pos None/[1, 2] ranks None/3
- hunter Survival: site `None` game `Improved Feign Death` missing_on_site pos None/[4, 4] ranks None/2
- rogue Combat: site `None` game `Hack and Slash` missing_on_site pos None/[5, 1] ranks None/5
- rogue Combat: site `None` game `Hack and Slash` missing_on_site pos None/[5, 3] ranks None/5
- rogue Combat: site `None` game `Fist Weapon Specialization` missing_on_site pos None/[5, 4] ranks None/5
- rogue Subtlety: site `None` game `Hemorrhage` missing_on_site pos None/[5, 4] ranks None/1
- priest Shadow: site `None` game `Improved Mind Blast` missing_on_site pos None/[3, 2] ranks None/5
- priest Shadow: site `None` game `Vampiric Embrace` missing_on_site pos None/[5, 2] ranks None/1
- shaman Elemental: site `None` game `` missing_on_site pos None/[3, 3] ranks None/5
- shaman Enhancement: site `None` game `Shield Specialization` missing_on_site pos None/[1, 3] ranks None/5
- shaman Restoration: site `None` game `Nature's Guidance` missing_on_site pos None/[3, 1] ranks None/3
- mage Arcane: site `None` game `Arcane Resilience` missing_on_site pos None/[3, 3] ranks None/1
- mage Frost: site `None` game `Ice Block` missing_on_site pos None/[5, 2] ranks None/1
- warlock Affliction: site `None` game `` missing_on_site pos None/[4, 4] ranks None/2
- warlock Affliction: site `None` game `Improved Curse of Exhaustion` missing_on_site pos None/[5, 4] ranks None/4
- warlock Demonology: site `None` game `Master Summoner` missing_on_site pos None/[4, 2] ranks None/2
- warlock Demonology: site `None` game `Improved Firestone` missing_on_site pos None/[5, 4] ranks None/2
- warlock Demonology: site `None` game `Improved Spellstone` missing_on_site pos None/[7, 3] ranks None/2
- warlock Destruction: site `None` game `Improved Firebolt` missing_on_site pos None/[3, 1] ranks None/2
- warlock Destruction: site `None` game `Shadowburn` missing_on_site pos None/[3, 4] ranks None/1
- druid Balance: site `None` game `Nature's Grasp` missing_on_site pos None/[1, 2] ranks None/1
- druid Balance: site `None` game `Improved Thorns` missing_on_site pos None/[3, 1] ranks None/3
- druid Balance: site `None` game `Nature's Reach` missing_on_site pos None/[3, 4] ranks None/2
- druid Feral Combat: site `None` game `` missing_on_site pos None/[4, 3] ranks None/2
- druid Feral Combat: site `None` game `` missing_on_site pos None/[5, 3] ranks None/1
- druid Feral Combat: site `None` game `Heart of the Wild` missing_on_site pos None/[6, 2] ranks None/5
- druid Restoration: site `None` game `Gift of Nature` missing_on_site pos None/[5, 3] ranks None/5

## Site talents not in the game (68)

- warrior Arms: site `Spearing Strike` game `None` not_in_game pos [4, 1]/None ranks 1/None
- warrior Arms: site `Bloodthrill` game `None` not_in_game pos [5, 1]/None ranks 5/None
- warrior Fury: site `Raging Blows` game `None` not_in_game pos [4, 2]/None ranks 1/None
- warrior Fury: site `Gore Drinker` game `None` not_in_game pos [6, 3]/None ranks 2/None
- warrior Protection: site `Iron Will` game `None` not_in_game pos [1, 3]/None ranks 5/None
- paladin Holy: site `Voice of Truth` game `None` not_in_game pos [3, 1]/None ranks 1/None
- paladin Holy: site `Infusion of Light` game `None` not_in_game pos [4, 1]/None ranks 2/None
- paladin Holy: site `Divine Precision` game `None` not_in_game pos [5, 1]/None ranks 3/None
- paladin Protection: site `Swift Judgement` game `None` not_in_game pos [4, 1]/None ranks 1/None
- paladin Protection: site `Iron Creed` game `None` not_in_game pos [6, 3]/None ranks 5/None
- paladin Retribution: site `Champion of the Light` game `None` not_in_game pos [6, 2]/None ranks 3/None
- paladin Retribution: site `Instrument of Law` game `None` not_in_game pos [6, 3]/None ranks 2/None
- hunter Beast Mastery: site `Summon Hawk` game `None` not_in_game pos [4, 4]/None ranks 1/None
- hunter Marksmanship: site `Improved Stings` game `None` not_in_game pos [2, 1]/None ranks 3/None
- hunter Marksmanship: site `Careful Aim` game `None` not_in_game pos [2, 3]/None ranks 5/None
- hunter Marksmanship: site `Lone Wolf` game `None` not_in_game pos [3, 4]/None ranks 1/None
- hunter Marksmanship: site `Rapid Recuperation` game `None` not_in_game pos [5, 1]/None ranks 2/None
- hunter Survival: site `Predator's Edge` game `None` not_in_game pos [4, 2]/None ranks 5/None
- hunter Survival: site `Resourcefulness` game `None` not_in_game pos [5, 1]/None ranks 2/None
- hunter Survival: site `Survivalist's Discipline` game `None` not_in_game pos [5, 3]/None ranks 2/None
- hunter Survival: site `Strider Kick` game `None` not_in_game pos [5, 4]/None ranks 1/None
- rogue Assassination: site `Mutilate` game `None` not_in_game pos [5, 2]/None ranks 1/None
- rogue Assassination: site `Venom` game `None` not_in_game pos [7, 2]/None ranks 1/None
- rogue Combat: site `Flawless Execution` game `None` not_in_game pos [4, 2]/None ranks 1/None
- rogue Subtlety: site `Dirty Tricks` game `None` not_in_game pos [2, 3]/None ranks 2/None
- rogue Subtlety: site `Improved Distract` game `None` not_in_game pos [3, 3]/None ranks 2/None
- rogue Subtlety: site `Quietus` game `None` not_in_game pos [6, 1]/None ranks 5/None
- priest Discipline: site `Power in Light` game `None` not_in_game pos [1, 1]/None ranks 5/None
- priest Discipline: site `Soul Warding` game `None` not_in_game pos [4, 3]/None ranks 1/None
- priest Discipline: site `Penance` game `None` not_in_game pos [5, 2]/None ranks 1/None
- priest Holy: site `Binding Heal` game `None` not_in_game pos [4, 4]/None ranks 1/None
- priest Shadow: site `Improved Mind Flay` game `None` not_in_game pos [3, 4]/None ranks 2/None
- priest Shadow: site `Dark Inspiration` game `None` not_in_game pos [4, 1]/None ranks 5/None
- priest Shadow: site `Early Demise` game `None` not_in_game pos [6, 1]/None ranks 2/None
- shaman Elemental: site `Lava Burst` game `None` not_in_game pos [5, 2]/None ranks 1/None
- shaman Elemental: site `Lightning Overload` game `None` not_in_game pos [5, 3]/None ranks 3/None
- shaman Enhancement: site `Earth's Grasp` game `None` not_in_game pos [1, 1]/None ranks 2/None
- shaman Enhancement: site `Mental Dexterity` game `None` not_in_game pos [2, 2]/None ranks 3/None
- shaman Enhancement: site `Rage of the Farseer` game `None` not_in_game pos [7, 2]/None ranks 1/None
- shaman Restoration: site `Mindfulness` game `None` not_in_game pos [2, 1]/None ranks 3/None
- shaman Restoration: site `Riptide` game `None` not_in_game pos [7, 2]/None ranks 1/None
- mage Arcane: site `Missile Barrage` game `None` not_in_game pos [2, 4]/None ranks 2/None
- mage Arcane: site `Arcane Blast` game `None` not_in_game pos [3, 4]/None ranks 1/None
- mage Arcane: site `Arcane Wrath` game `None` not_in_game pos [4, 4]/None ranks 1/None
- mage Fire: site `Heating Up` game `None` not_in_game pos [4, 3]/None ranks 1/None
- mage Frost: site `Ice Lance` game `None` not_in_game pos [3, 3]/None ranks 1/None
- mage Frost: site `Fingers of Frost` game `None` not_in_game pos [5, 3]/None ranks 2/None
- warlock Affliction: site `Improved Drains` game `None` not_in_game pos [2, 3]/None ranks 3/None
- warlock Affliction: site `Pandemic` game `None` not_in_game pos [3, 4]/None ranks 3/None
- warlock Demonology: site `Demonic Energies` game `None` not_in_game pos [2, 4]/None ranks 2/None
- warlock Demonology: site `Decimation` game `None` not_in_game pos [4, 1]/None ranks 2/None
- warlock Demonology: site `Demonic Brand` game `None` not_in_game pos [4, 4]/None ranks 3/None
- warlock Demonology: site `Demonic Knowledge` game `None` not_in_game pos [5, 3]/None ranks 3/None
- warlock Demonology: site `Demonic Pact` game `None` not_in_game pos [7, 2]/None ranks 1/None
- warlock Destruction: site `Molten Skin` game `None` not_in_game pos [2, 1]/None ranks 5/None
- warlock Destruction: site `Incinerate` game `None` not_in_game pos [7, 2]/None ranks 1/None
- druid Balance: site `Genesis` game `None` not_in_game pos [1, 3]/None ranks 5/None
- druid Balance: site `Insect Swarm` game `None` not_in_game pos [4, 1]/None ranks 1/None
- druid Balance: site `Eclipse` game `None` not_in_game pos [5, 3]/None ranks 3/None
- druid Feral Combat: site `Feral Charge` game `None` not_in_game pos [3, 3]/None ranks 1/None
- druid Feral Combat: site `Shifting Power` game `None` not_in_game pos [4, 1]/None ranks 1/None
- druid Feral Combat: site `Primal Bite` game `None` not_in_game pos [4, 2]/None ranks 1/None
- druid Feral Combat: site `Natural Instinct` game `None` not_in_game pos [5, 4]/None ranks 2/None
- druid Feral Combat: site `Natural Reaction` game `None` not_in_game pos [6, 1]/None ranks 5/None
- druid Feral Combat: site `Rend and Tear` game `None` not_in_game pos [6, 3]/None ranks 5/None
- druid Feral Combat: site `Berserk` game `None` not_in_game pos [7, 2]/None ranks 1/None
- druid Restoration: site `Living Spirit` game `None` not_in_game pos [5, 2]/None ranks 3/None
- druid Restoration: site `Wild Growth` game `None` not_in_game pos [7, 2]/None ranks 1/None

## Talent name / rank / position differences (212)

- warrior Arms: site `Improved Overpower` game `Improved Thunder Clap` name, ranks, text pos [2, 4]/[2, 4] ranks 2/3
- warrior Arms: site `Two-Handed Weapon Specialization` game `Two-Handed Weapon Specialization` ranks pos [4, 2]/[4, 2] ranks 3/5
- warrior Arms: site `Weaponmaster` game `Weaponmaster` pos, text pos [5, 3]/[5, 1] ranks 5/5
- warrior Arms: site `Improved Slam` game `` name, ranks, text pos [6, 1]/[6, 1] ranks 2/5
- warrior Fury: site `Lingering Rage` game `Improved Demoralizing Shout` name, text pos [2, 2]/[2, 2] ranks 5/5
- warrior Fury: site `Furious Precision` game `Improved Cleave` name, text pos [3, 1]/[3, 1] ranks 3/3
- warrior Fury: site `Improved Execute` game `Improved Execute` pos, text pos [4, 4]/[4, 2] ranks 2/2
- warrior Fury: site `Improved Berserker Rage` game `Improved Slam` name, ranks, text pos [5, 1]/[5, 1] ranks 2/5
- warrior Fury: site `Flurry` game `Flurry` pos, text pos [6, 2]/[6, 3] ranks 5/5
- warrior Protection: site `Anticipation` game `Anticipation` pos, text pos [2, 1]/[1, 3] ranks 5/5
- warrior Protection: site `Improved Bloodrage` game `Improved Bloodrage` pos, text pos [1, 1]/[2, 1] ranks 2/2
- warrior Protection: site `Improved Revenge` game `Toughness` name, ranks, text pos [2, 3]/[2, 3] ranks 3/5
- warrior Protection: site `Improved Thunder Clap` game `` name, ranks, text pos [2, 4]/[2, 4] ranks 3/5
- warrior Protection: site `Master of Defense` game `Improved Shield Block` name, ranks, text pos [3, 2]/[3, 2] ranks 2/3
- warrior Protection: site `Improved Disarm` game `Improved Revenge` name, text pos [3, 3]/[3, 3] ranks 3/3
- warrior Protection: site `Defiance` game `` name, ranks, text pos [3, 4]/[3, 4] ranks 3/5
- warrior Protection: site `Vanguard` game `Improved Disarm` name, ranks, text pos [4, 2]/[4, 2] ranks 1/3
- warrior Protection: site `Improved Shield Bash` game `Improved Taunt` name, text pos [4, 3]/[4, 3] ranks 2/2
- warrior Protection: site `Focused Rage` game `Improved Shield Bash` name, ranks, text pos [5, 3]/[5, 3] ranks 3/2
- paladin Holy: site `Spiritual Focus` game `Spiritual Focus` ranks pos [2, 2]/[2, 2] ranks 2/5
- paladin Holy: site `Improved Seals` game `Improved Seals` ranks, text pos [2, 3]/[2, 3] ranks 3/5
- paladin Holy: site `Healing Light` game `Healing Light` pos pos [2, 1]/[3, 1] ranks 3/3
- paladin Holy: site `Reverence` game `Consecration` name, ranks, text pos [3, 2]/[3, 2] ranks 3/1
- paladin Holy: site `Purifying Power` game `` name, text pos [3, 3]/[3, 3] ranks 2/2
- paladin Holy: site `Unyielding Faith` game `Unyielding Faith` pos, text pos [2, 4]/[3, 4] ranks 2/2
- paladin Holy: site `Divine Favor` game `Improved Blessing of Wisdom` name, ranks, text pos [4, 3]/[4, 3] ranks 1/2
- paladin Holy: site `Holy Shock` game `Divine Favor` name, text pos [5, 2]/[5, 2] ranks 1/1
- paladin Holy: site `Consecrated Ground` game `Lasting Judgement` name, ranks, text pos [5, 3]/[5, 3] ranks 2/3
- paladin Holy: site `Light's Vigil` game `Holy Shock` name, text pos [7, 2]/[7, 2] ranks 1/1
- paladin Protection: site `Toughness` game `Improved Devotion Aura` name, text pos [1, 2]/[1, 2] ranks 5/5
- paladin Protection: site `Anticipation` game `Toughness` name, text pos [2, 4]/[2, 4] ranks 5/5
- paladin Protection: site `Improved Seal of Fury` game `Blessing of Kings` name, text pos [3, 1]/[3, 1] ranks 1/1
- paladin Protection: site `Sacred Duty` game `Anticipation` name, ranks, text pos [3, 4]/[3, 4] ranks 2/5
- paladin Protection: site `Improved Hammer of Justice` game `Improved Hammer of Justice` pos, text pos [4, 3]/[4, 2] ranks 3/3
- paladin Protection: site `Templar's Bulwark` game `` name, text pos [5, 2]/[5, 2] ranks 1/1
- paladin Protection: site `One-Handed Weapon Specialization` game `One-Handed Weapon Specialization` ranks, pos, text pos [4, 2]/[6, 3] ranks 3/5
- paladin Retribution: site `Deflection` game `Improved Blessing of Might` name, text pos [1, 2]/[1, 2] ranks 5/5
- paladin Retribution: site `Holy Conduit` game `Improved Seal of the Crusader` name, ranks, text pos [2, 2]/[2, 2] ranks 2/3
- paladin Retribution: site `Conviction` game `Deflection` name, text pos [2, 3]/[2, 3] ranks 5/5
- paladin Retribution: site `Sanctified Judgement` game `Conviction` name, ranks, text pos [3, 2]/[3, 2] ranks 3/5
- paladin Retribution: site `Sacred Arbiter` game `Improved Retribution Aura` name, ranks, text pos [4, 3]/[4, 3] ranks 1/2
- paladin Retribution: site `Repentance` game `Sanctity Aura` name, text pos [5, 3]/[5, 3] ranks 1/1
- paladin Retribution: site `Vengeance` game `Vengeance` ranks, pos, text pos [5, 2]/[6, 2] ranks 3/5
- paladin Retribution: site `Twist of Light` game `Repentance` name, text pos [7, 2]/[7, 2] ranks 1/1
- hunter Beast Mastery: site `Focused Fire` game `Improved Eyes of the Beast` name, text pos [2, 1]/[2, 1] ranks 2/2
- hunter Beast Mastery: site `Improved Aspect of the Monkey` game `Improved Aspect of the Monkey` ranks, text pos [2, 2]/[2, 2] ranks 3/5
- hunter Beast Mastery: site `Pathfinding` game `Thick Hide` name, ranks, text pos [2, 3]/[2, 3] ranks 2/3
- hunter Beast Mastery: site `Improved Mend Pet` game `Improved Mend Pet` pos, text pos [4, 1]/[4, 2] ranks 2/2
- hunter Marksmanship: site `Efficiency` game `Efficiency` pos, text pos [2, 2]/[1, 3] ranks 5/5
- hunter Marksmanship: site `Lethal Attacks` game `Lethal Attacks` pos pos [1, 3]/[2, 3] ranks 5/5
- hunter Marksmanship: site `Rapid Killing` game `Aimed Shot` name, ranks, text pos [3, 1]/[3, 1] ranks 2/1
- hunter Marksmanship: site `Hawk Eye` game `Hawk Eye` pos, text pos [1, 1]/[3, 4] ranks 3/3
- hunter Marksmanship: site `Trueshot Aura` game `Improved Serpent Sting` name, ranks, text pos [4, 2]/[4, 2] ranks 1/5
- hunter Marksmanship: site `Scatter Shot` game `Scatter Shot` pos pos [5, 4]/[5, 1] ranks 1/1
- hunter Marksmanship: site `Barrage` game `Barrage` pos, text pos [5, 3]/[5, 2] ranks 3/3
- hunter Marksmanship: site `Sniper Shot` game `Trueshot Aura` name, text pos [7, 2]/[7, 2] ranks 1/1
- hunter Survival: site `Improved Tracking` game `Improved Tracking` ranks, pos, text pos [1, 2]/[1, 1] ranks 5/3
- hunter Survival: site `Improved Wing Clip` game `Improved Wing Clip` ranks, pos, text pos [2, 4]/[2, 3] ranks 3/5
- hunter Survival: site `Survivalist` game `Survivalist` pos, text pos [2, 3]/[3, 2] ranks 5/5
- hunter Survival: site `Surefooted` game `Surefooted` pos, text pos [3, 2]/[4, 2] ranks 3/3
- hunter Survival: site `Expose Prey` game `Killer Instinct` name, ranks, text pos [5, 2]/[5, 2] ranks 2/3
- hunter Survival: site `Counterattack` game `Counterattack` pos pos [4, 3]/[5, 3] ranks 1/1
- hunter Survival: site `Lacerating Strikes` game `` name, text pos [7, 2]/[7, 2] ranks 1/1
- rogue Assassination: site `Improved Gouge` game `Improved Eviscerate` name, text pos [1, 1]/[1, 1] ranks 3/3
- rogue Assassination: site `Vile Poisons` game `Vile Poisons` pos, text pos [4, 1]/[4, 2] ranks 5/5
- rogue Assassination: site `Cold Blood` game `Cold Blood` pos pos [4, 2]/[5, 2] ranks 1/1
- rogue Assassination: site `Improved Kidney Shot` game `Improved Kidney Shot` ranks, text pos [5, 3]/[5, 3] ranks 2/3
- rogue Assassination: site `Seal Fate` game `Seal Fate` pos, text pos [6, 3]/[6, 2] ranks 5/5
- rogue Assassination: site `Vigor` game `Vigor` ranks, pos, text pos [5, 1]/[7, 2] ranks 2/1
- rogue Combat: site `Improved Eviscerate` game `Improved Gouge` name, text pos [1, 1]/[1, 1] ranks 3/3
- rogue Combat: site `Puncturing Wounds` game `` name, text pos [2, 1]/[2, 1] ranks 3/3
- rogue Combat: site `Deflection` game `Deflection` ranks, text pos [2, 2]/[2, 2] ranks 3/5
- rogue Combat: site `Precision` game `Precision` ranks pos [2, 3]/[2, 3] ranks 3/5
- rogue Combat: site `Hack and Slash` game `Hack and Slash` pos, text pos [5, 3]/[4, 2] ranks 5/5
- rogue Subtlety: site `Master of Deception` game `Master of Deception` ranks, text pos [1, 2]/[1, 2] ranks 3/5
- rogue Subtlety: site `Opportunity` game `Opportunity` ranks, text pos [1, 3]/[1, 3] ranks 2/5
- rogue Subtlety: site `Setup` game `Sleight of Hand` name, ranks, text pos [2, 1]/[2, 1] ranks 3/2
- rogue Subtlety: site `Camouflage` game `Camouflage` pos, text pos [1, 1]/[2, 3] ranks 5/5
- rogue Subtlety: site `Improved Ambush` game `Improved Ambush` pos, text pos [2, 4]/[3, 3] ranks 3/3
- rogue Subtlety: site `Heightened Senses` game `Setup` name, ranks, text pos [4, 1]/[4, 1] ranks 2/3

## spells.json spells not found in the client (6)

- mage : site `Detect Magic` game `None` not_found
- warlock : site `Dark Pact` game `None` not_found
- paladin : site `Blessing of Sanctuary` game `None` not_found
- paladin : site `Greater Blessing of Sanctuary` game `None` not_found
- druid : site `Faerie Fire (Feral)` game `None` not_found
- shaman : site `Tranquil Air Totem` game `None` not_found

## Changed in this build (850)

- warrior `Deep Wounds` (text): ref 412609 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warrior `Weaponmaster` (pos, text): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warrior `Sweeping Strikes` (same): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warrior `Weaponmaster` (missing_on_site): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warrior `Weaponmaster` (missing_on_site): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warrior `Improved Hamstring` (text): ref 23694 SpellCategories.DiminishType: 0 -> 1024; ref 23694 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warrior `Mortal Strike` (same): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warrior `Piercing Howl` (same): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warrior `Blood Craze` (text): ref 16488 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warrior `Enrage` (text): ref 12880 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warrior `Death Wish` (same): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warrior `Flurry` (pos, text): ref 12966 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warrior `Bloodthirst` (same): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warrior `Last Stand` (same): ref 12976 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warrior `Concussion Blow` (same): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warrior `Focused Rage` (name, ranks, text): ref 18498 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- paladin `Reverence` (name, ranks, text): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- paladin `Holy Shock` (name, text): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- paladin `Redoubt` (text): ref 20128 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- paladin `Improved Seal of Fury` (name, text): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- paladin `Shield Specialization` (text): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- paladin `Reckoning` (unverifiable): ref 1326084 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- paladin `Holy Shield` (text): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- paladin `Vindication` (text): ref 440667 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- paladin `Seal of Command` (text): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- paladin `Repentance` (name, text): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- paladin `Vengeance` (ranks, pos, text): ref 20050 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- paladin `Twist of Light` (name, text): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- hunter `Deadly Aspects` (text): ref 6150 SpellDuration(DurationIndex).DurationPerLevel:  -> 0; ref 1299448 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- hunter `Intimidation` (same): SpellDuration(DurationIndex).DurationPerLevel:  -> 0; ref 24394 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- hunter `Frenzy` (same): ref 19615 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- hunter `Bestial Wrath` (same): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- hunter `Improved Concussive Shot` (text): ref 19410 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- hunter `Efficiency` (pos, text): SpellEffect#0.EffectSpellClassMask_2: 8192 -> 2105344
- hunter `Scatter Shot` (pos): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- hunter `Sniper Shot` (name, text): SpellDuration(DurationIndex).DurationPerLevel:  -> 0; SpellEffect#0.EffectBasePointsF: 50 -> 30
- hunter `Humanoid Slaying` (missing_on_site): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- hunter `Improved Wing Clip` (ranks, pos, text): ref 19229 SpellCategories.DiminishType: 0 -> 1024; ref 19229 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- hunter `Deterrence` (same): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- hunter `Counterattack` (pos): SpellCategories.DiminishType: 0 -> 1024; SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- rogue `Remorseless Attacks` (text): ref 14143 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- rogue `Cold Blood` (pos): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- rogue `Riposte` (unverifiable): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- rogue `Improved Kick` (text): ref 18425 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- rogue `Hack and Slash` (pos, text): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- rogue `Hack and Slash` (missing_on_site): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- rogue `Blade Flurry` (same): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- rogue `Fist Weapon Specialization` (missing_on_site): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- rogue `Adrenaline Rush` (same): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- rogue `Ghostly Strike` (text): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- rogue `Hemorrhage` (missing_on_site): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- rogue `Thousand Cuts` (name, text): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- priest `Martyrdom` (text): ref 27828 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- priest `Inner Focus` (same): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- priest `Renewed Hope` (name, ranks, text): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- priest `Power Infusion` (same): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- priest `Blessed Recovery` (same): ref 27813 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- priest `Inspiration` (text): ref 14893 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- priest `Spirit of Redemption` (same): ref 27827 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- priest `Prayer of Mending` (name, text): SpellDuration(DurationIndex).DurationPerLevel:  -> 0; ref 7001 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- priest `Spirit Tap` (pos, text): ref 15271 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- priest `Blackout` (pos): ref 15269 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- priest `Mind Flay` (same): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- priest `Shadow Weaving` (ranks, pos, text): ref 15258 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- priest `Silence` (same): SpellDuration(DurationIndex).DurationPerLevel:  -> 0; ref 1241057 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- priest `Vampiric Embrace` (missing_on_site): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- priest `Shadowform` (same): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- shaman `Elemental Focus` (same): ref 16246 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- shaman `Earthbound` (name, ranks, text): ref 30165 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- shaman `Elemental Mastery` (same): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- shaman `Shield Specialization` (missing_on_site): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- shaman `Flurry` (text): ref 16257 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- shaman `Maelstrom Weapon` (name, text): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- shaman `Stormstrike` (pos): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- shaman `Ancestral Healing` (pos, text): ref 16177 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- shaman `Nature's Swiftness` (same): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- shaman `Mana Tide Totem` (pos): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- mage `Presence of Mind` (same): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- mage `Arcane Power` (same): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- mage `Accelerant` (pos, text): SpellEffect#0.EffectSpellClassMask_1: 4096 -> 36864; description: Reduces the casting time of your Fireball and Frostfire Bolt spells... -> Reduces the casting time of your Fireball, Frostfire Bolt, and Arca...; name: Improved Fireball -> Accelerant
- mage `Impact` (ranks, pos, text): ref 12355 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- mage `Ignite` (text): ref 412538 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- mage `Pyroblast` (text): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- mage `Improved Scorch` (text): ref 22959 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- mage `Blast Wave` (text): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- mage `Combustion` (same): SpellDuration(DurationIndex).DurationPerLevel:  -> 0; ref 28682 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- mage `Precision` (text): SpellEffect#0.EffectAura: 107 -> 55; SpellEffect#0.EffectMiscValue_0: 16 -> 0; SpellEffect#0.EffectSpellClassMask_0: 12714743 -> 0; SpellEffect#0.EffectSpellClassMask_1: 4096 -> 0
- mage `Frostbite` (text): ref 12494 SpellCategories.DiminishType: 0 -> 1024; ref 12494 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- mage `Improved Blizzard` (pos, text): ref 12484 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- mage `Ice Block` (missing_on_site): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- mage `Winter's Chill` (text): ref 12579 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- mage `Ice Barrier` (unverifiable): SpellDuration(DurationIndex).DurationPerLevel:  -> 0; ref 1326891 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warlock `Amplify Curse` (same): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warlock `Nightfall` (text): ref 17941 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warlock `Siphon Life` (same): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warlock `Curse of Exhaustion` (pos): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warlock `Fel Domination` (pos, text): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warlock `Demonic Sacrifice` (pos): ref 18789 SpellDuration(DurationIndex).DurationPerLevel:  -> 0; ref 18790 SpellDuration(DurationIndex).DurationPerLevel:  -> 0; ref 18791 SpellDuration(DurationIndex).DurationPerLevel:  -> 0; ref 18792 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warlock `Soul Link` (pos): ref 18814 SpellDuration(DurationIndex).DurationPerLevel:  -> 0; ref 25228 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warlock `Improved Shadow Bolt` (text): ref 17794 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warlock `Aftermath` (text): ref 18118 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warlock `Shadowburn` (missing_on_site): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warlock `Pyroclasm` (name, text): ref 18093 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- druid `Nature's Grasp` (missing_on_site): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- druid `Nature's Splendor` (name, text): ref 16870 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- druid `Improved Starfire` (text): ref 16922 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- druid `Nature's Grace` (same): ref 16886 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- druid `Moonkin Form` (text): SpellDuration(DurationIndex).DurationPerLevel:  -> 0; ref 24907 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- druid `Savage Fury` (name, ranks, text): ref 19675 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- druid `Leader of the Pack` (pos, text): ref 24932 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- druid `Gift of Nature` (name, ranks, text): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- druid `Nature's Swiftness` (same): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warrior `Battle Stance` (same): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warrior `Charge` (same): ref 7922 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warrior `Rend` (same): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warrior `Thunder Clap` (same): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warrior `Hamstring` (same): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warrior `Mocking Blow` (same): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warrior `Retaliation` (same): SpellDuration(DurationIndex).DurationPerLevel:  -> 0
- warrior `Victory Rush` (unverifiable): description: Instantly attack the target causing ${1+$AP*$m3/100} damage and hea... -> Instantly attack the target causing ${1+$apm*$m3/100} damage and he...; ref 402975 SpellDuration(DurationIndex).DurationPerLevel:  -> 0
