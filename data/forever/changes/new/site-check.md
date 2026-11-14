# Forever site check: new

Site spellbook + talent trees vs the client data (tools/forever_check.py). Rules: raw client DB2, no hotfixes; talent trees from the Talent tables; talents matched by name, else same position with similar text, else near-identical text; site pos = [TierID+1, ColumnIndex+1]; talent text = rank 1; spellbook text = the site rank; queue = only texts the site had right for the previous build and this build changed.

| part | total | same | text | unverifiable | other | changed in this build |
|---|---|---|---|---|---|---|
| talents | 0 | 0 | 0 | 0 | 0 | 0 |
| spellbook | 497 | 0 | 0 | 0 | 497 | 0 |
| spells_json | 507 | 0 | 0 | 0 | 507 | 0 |

Queue (EN texts the site had right for the previous build and this build changed; review, then `--apply`): **0**


## Spellbook spells not found in the client (497)

- warrior : site `Battle Stance` game `None` not_found
- warrior : site `Heroic Strike` game `None` not_found
- warrior : site `Charge` game `None` not_found
- warrior : site `Rend` game `None` not_found
- warrior : site `Thunder Clap` game `None` not_found
- warrior : site `Hamstring` game `None` not_found
- warrior : site `Overpower` game `None` not_found
- warrior : site `Tactical Mastery` game `None` not_found
- warrior : site `Mocking Blow` game `None` not_found
- warrior : site `Retaliation` game `None` not_found
- warrior : site `Victory Rush` game `None` not_found
- warrior : site `Mortal Strike` game `None` not_found
- warrior : site `Spearing Strike` game `None` not_found
- warrior : site `Sweeping Strikes` game `None` not_found
- warrior : site `Battle Shout` game `None` not_found
- warrior : site `Demoralizing Shout` game `None` not_found
- warrior : site `Cleave` game `None` not_found
- warrior : site `Slam` game `None` not_found
- warrior : site `Intimidating Shout` game `None` not_found
- warrior : site `Execute` game `None` not_found
- warrior : site `Challenging Shout` game `None` not_found
- warrior : site `Berserker Rage` game `None` not_found
- warrior : site `Berserker Stance` game `None` not_found
- warrior : site `Intercept` game `None` not_found
- warrior : site `Whirlwind` game `None` not_found
- warrior : site `Pummel` game `None` not_found
- warrior : site `Bloodthirst` game `None` not_found
- warrior : site `Recklessness` game `None` not_found
- warrior : site `Piercing Howl` game `None` not_found
- warrior : site `Death Wish` game `None` not_found
- warrior : site `Bloodrage` game `None` not_found
- warrior : site `Defensive Stance` game `None` not_found
- warrior : site `Sunder Armor` game `None` not_found
- warrior : site `Taunt` game `None` not_found
- warrior : site `Shield Bash` game `None` not_found
- warrior : site `Revenge` game `None` not_found
- warrior : site `Shield Block` game `None` not_found
- warrior : site `Disarm` game `None` not_found
- warrior : site `Shield Wall` game `None` not_found
- warrior : site `Shield Slam` game `None` not_found
- warrior : site `Last Stand` game `None` not_found
- warrior : site `Concussion Blow` game `None` not_found
- paladin : site `Holy Light` game `None` not_found
- paladin : site `Seal of Righteousness` game `None` not_found
- paladin : site `Purify` game `None` not_found
- paladin : site `Lay on Hands` game `None` not_found
- paladin : site `Redemption` game `None` not_found
- paladin : site `Blessing of Wisdom` game `None` not_found
- paladin : site `Consecration` game `None` not_found
- paladin : site `Exorcism` game `None` not_found
- paladin : site `Flash of Light` game `None` not_found
- paladin : site `Turn Undead` game `None` not_found
- paladin : site `Holy Shock` game `None` not_found
- paladin : site `Seal of Light` game `None` not_found
- paladin : site `Seal of Wisdom` game `None` not_found
- paladin : site `Light's Vigil` game `None` not_found
- paladin : site `Cleanse` game `None` not_found
- paladin : site `Hammer of Wrath` game `None` not_found
- paladin : site `Holy Wrath` game `None` not_found
- paladin : site `Greater Blessing of Wisdom` game `None` not_found
- paladin : site `Divine Favor` game `None` not_found
- paladin : site `Devotion Aura` game `None` not_found
- paladin : site `Divine Protection` game `None` not_found
- paladin : site `Hammer of Justice` game `None` not_found
- paladin : site `Blessing of Protection` game `None` not_found
- paladin : site `Righteous Fury` game `None` not_found
- paladin : site `Seal of Fury` game `None` not_found
- paladin : site `Blessing of Freedom` game `None` not_found
- paladin : site `Blessing of Kings` game `None` not_found
- paladin : site `Concentration Aura` game `None` not_found
- paladin : site `Seal of Justice` game `None` not_found
- paladin : site `Shadow Resistance Aura` game `None` not_found
- paladin : site `Divine Intervention` game `None` not_found
- paladin : site `Frost Resistance Aura` game `None` not_found
- paladin : site `Divine Shield` game `None` not_found
- paladin : site `Fire Resistance Aura` game `None` not_found
- paladin : site `Hammer of the Righteous` game `None` not_found
- paladin : site `Holy Shield` game `None` not_found
- paladin : site `Blessing of Sacrifice` game `None` not_found
- paladin : site `Greater Blessing of Kings` game `None` not_found

## spells.json spells not found in the client (507)

- warrior : site `Battle Stance` game `None` not_found
- warrior : site `Heroic Strike` game `None` not_found
- warrior : site `Charge` game `None` not_found
- warrior : site `Rend` game `None` not_found
- warrior : site `Thunder Clap` game `None` not_found
- warrior : site `Hamstring` game `None` not_found
- warrior : site `Overpower` game `None` not_found
- warrior : site `Tactical Mastery` game `None` not_found
- warrior : site `Mocking Blow` game `None` not_found
- warrior : site `Retaliation` game `None` not_found
- warrior : site `Victory Rush` game `None` not_found
- warrior : site `Mortal Strike` game `None` not_found
- warrior : site `Spearing Strike` game `None` not_found
- warrior : site `Sweeping Strikes` game `None` not_found
- warrior : site `Battle Shout` game `None` not_found
- warrior : site `Demoralizing Shout` game `None` not_found
- warrior : site `Cleave` game `None` not_found
- warrior : site `Slam` game `None` not_found
- warrior : site `Intimidating Shout` game `None` not_found
- warrior : site `Execute` game `None` not_found
- warrior : site `Challenging Shout` game `None` not_found
- warrior : site `Berserker Rage` game `None` not_found
- warrior : site `Berserker Stance` game `None` not_found
- warrior : site `Intercept` game `None` not_found
- warrior : site `Whirlwind` game `None` not_found
- warrior : site `Pummel` game `None` not_found
- warrior : site `Bloodthirst` game `None` not_found
- warrior : site `Recklessness` game `None` not_found
- warrior : site `Piercing Howl` game `None` not_found
- warrior : site `Death Wish` game `None` not_found
- warrior : site `Bloodrage` game `None` not_found
- warrior : site `Defensive Stance` game `None` not_found
- warrior : site `Sunder Armor` game `None` not_found
- warrior : site `Taunt` game `None` not_found
- warrior : site `Shield Bash` game `None` not_found
- warrior : site `Revenge` game `None` not_found
- warrior : site `Shield Block` game `None` not_found
- warrior : site `Disarm` game `None` not_found
- warrior : site `Shield Wall` game `None` not_found
- warrior : site `Shield Slam` game `None` not_found
- warrior : site `Last Stand` game `None` not_found
- warrior : site `Concussion Blow` game `None` not_found
- hunter : site `Tame Beast` game `None` not_found
- hunter : site `Aspect of the Monkey` game `None` not_found
- hunter : site `Aspect of the Hawk` game `None` not_found
- hunter : site `Call Pet` game `None` not_found
- hunter : site `Dismiss Pet` game `None` not_found
- hunter : site `Feed Pet` game `None` not_found
- hunter : site `Revive Pet` game `None` not_found
- hunter : site `Mend Pet` game `None` not_found
- hunter : site `Eagle Eye` game `None` not_found
- hunter : site `Eyes of the Beast` game `None` not_found
- hunter : site `Scare Beast` game `None` not_found
- hunter : site `Aspect of the Cheetah` game `None` not_found
- hunter : site `Beast Lore` game `None` not_found
- hunter : site `Summon Hawk` game `None` not_found
- hunter : site `Aspect of the Beast` game `None` not_found
- hunter : site `Aspect of the Pack` game `None` not_found
- hunter : site `Aspect of the Wild` game `None` not_found
- hunter : site `Tranquilizing Shot` game `None` not_found
- hunter : site `Intimidation` game `None` not_found
- hunter : site `Bestial Wrath` game `None` not_found
- hunter : site `Auto Shot` game `None` not_found
- hunter : site `Serpent Sting` game `None` not_found
- hunter : site `Arcane Shot` game `None` not_found
- hunter : site `Hunter's Mark` game `None` not_found
- hunter : site `Concussive Shot` game `None` not_found
- hunter : site `Distracting Shot` game `None` not_found
- hunter : site `Multi-Shot` game `None` not_found
- hunter : site `Aimed Shot` game `None` not_found
- hunter : site `Scorpid Sting` game `None` not_found
- hunter : site `Trueshot Aura` game `None` not_found
- hunter : site `Rapid Fire` game `None` not_found
- hunter : site `Flare` game `None` not_found
- hunter : site `Viper Sting` game `None` not_found
- hunter : site `Sniper Shot` game `None` not_found
- hunter : site `Volley` game `None` not_found
- hunter : site `Scatter Shot` game `None` not_found
- hunter : site `Raptor Strike` game `None` not_found
- hunter : site `Track Beasts` game `None` not_found
