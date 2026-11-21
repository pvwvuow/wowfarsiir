# t-carrier-refusals - the false-refusal audit (owner order, 21 Nov task 1)

The pre-fix carrier (wow #574 merged) keyed the declared drops as `E3` while the
canonical importer (packs tools/import_fa_out_t.py) keys them as bare marker numbers
`3` (MARKER_RE captures the digits). Every drop lookup missed, so rows Brain had
already accepted via `drop=` were refused. The fix: the carrier now IMPORTS the
canonical `check_row()` (packs PR #19) instead of keeping its own copy - after the
fix **all 11 packs dry-run clean, zero refusals**.

Numbers: **87 dropped-marker instances** across t01..t09 (t10/t11 have none).
The **owner-28** = the t01..t05 subset with no glue-cases-108 entry - exactly the
refusal lists the previous round reported (t01:5, t02:2, t03:6, t04:10, t05:5).

## The owner-28 (the refusal list being audited)

| pack | key | marker | tpl count | fa count | drops (TSV) |
|---|---|---|---|---|---|
| t01 | t:783 | 3 | 1 | 0 | `drop=E3` | **owner-28**
| t01 | t:784 | 6 | 1 | 0 | `drop=E6` | **owner-28**
| t01 | t:789 | 6 | 1 | 0 | `drop=E6` | **owner-28**
| t01 | t:794 | 8 | 1 | 0 | `drop=E8` | **owner-28**
| t01 | t:804 | 1 | 1 | 0 | `drop=E1` | **owner-28**
| t02 | t:843 | 4 | 1 | 0 | `drop=E4` | **owner-28**
| t02 | t:1305 | 1 | 1 | 0 | `drop=E1` | **owner-28**
| t03 | t:26 | 5 | 1 | 0 | `drop=E5` | **owner-28**
| t03 | t:34 | 3 | 1 | 0 | `drop=E3` | **owner-28**
| t03 | t:77 | 6 | 1 | 0 | `drop=E6` | **owner-28**
| t03 | t:80 | 7 | 1 | 0 | `drop=E7,E8` | **owner-28**
| t03 | t:80 | 8 | 1 | 0 | `drop=E7,E8` | **owner-28**
| t03 | t:85 | 4 | 1 | 0 | `drop=E4` | **owner-28**
| t04 | t:61 | 3 | 1 | 0 | `drop=E3` | **owner-28**
| t04 | t:66 | 4 | 1 | 0 | `drop=E4,E5` | **owner-28**
| t04 | t:66 | 5 | 1 | 0 | `drop=E4,E5` | **owner-28**
| t04 | t:69 | 2 | 1 | 0 | `drop=E2` | **owner-28**
| t04 | t:73 | 3 | 1 | 0 | `drop=E3` | **owner-28**
| t04 | t:1424 | 4 | 1 | 0 | `drop=E4` | **owner-28**
| t04 | t:1430 | 5 | 1 | 0 | `drop=E5,E9` | **owner-28**
| t04 | t:1444 | 4 | 1 | 0 | `drop=E4,E5` | **owner-28**
| t04 | t:1461 | 6 | 1 | 0 | `drop=E6,E8` | **owner-28**
| t04 | t:1461 | 8 | 1 | 0 | `drop=E6,E8` | **owner-28**
| t05 | t:341 | 4 | 1 | 0 | `drop=E4` | **owner-28**
| t05 | t:344 | 4 | 1 | 0 | `drop=E4` | **owner-28**
| t05 | t:1181 | 5 | 1 | 0 | `drop=E5` | **owner-28**
| t05 | t:1464 | 3 | 1 | 0 | `drop=E3` | **owner-28**
| t05 | t:1635 | 2 | 1 | 0 | `drop=E2` | **owner-28**

## All 87 dropped-marker instances (full audit)

Marker identity = the bare number (canonical form). `drops` = the declaration in
Brain's TSV (the canonical acceptance path); `glue-cases-108` = the documented
glue instance row where one exists; **owner-28** marks the subset above.

| pack | key | marker | tpl count | fa count | drops (TSV) | glue-cases-108 row |
|---|---|---|---|---|---|---|
| t01 | t:783 | 3 | 1 | 0 | `drop=E3` | none | **owner-28**
| t01 | t:784 | 6 | 1 | 0 | `drop=E6` | none | **owner-28**
| t01 | t:789 | 6 | 1 | 0 | `drop=E6` | none | **owner-28**
| t01 | t:794 | 8 | 1 | 0 | `drop=E8` | none | **owner-28**
| t01 | t:804 | 1 | 1 | 0 | `drop=E1` | none | **owner-28**
| t01 | t:821 | 4 | 1 | 0 | `drop=E4` | `- t:821 Improved Mark of the Wild | glued: `⟦E4⟧s` | tpl: `...⟦E3⟧ the ⟦E4⟧s of your ⟦E2⟧ and ⟦E1⟧ s...` |
| t01 | t:921 | 3 | 1 | 0 | `drop=E3` | `- t:921 Overgrowth | glued: `⟦E3⟧s` | tpl: `...⟦E2⟧ the maximum number of ⟦E3⟧s you may have affecte...` |
| t02 | t:843 | 4 | 1 | 0 | `drop=E4` | none | **owner-28**
| t02 | t:1301 | 5 | 1 | 0 | `drop=E5,E6,E7,E8` | `- t:1301 Humanoid Slaying | glued: `⟦E5⟧s` | tpl: `...⟦E1⟧ all ⟦E3⟧ caused against ⟦E7⟧oid ⟦E5⟧s by ...` |
| t02 | t:1301 | 6 | 1 | 0 | `drop=E5,E6,E7,E8` | `- t:1301 Humanoid Slaying | glued: `⟦E6⟧s` | tpl: `...nd ⟦E2⟧ critical ⟦E4⟧ caused against ⟦E8⟧oid ⟦...` |
| t02 | t:1301 | 7 | 1 | 0 | `drop=E5,E6,E7,E8` | `- t:1301 Humanoid Slaying | glued: `⟦E7⟧o` | tpl: `...⟦E1⟧ all ⟦E3⟧ caused against ⟦E7⟧oid ⟦E5⟧s by ...` |
| t02 | t:1301 | 8 | 1 | 0 | `drop=E5,E6,E7,E8` | `- t:1301 Humanoid Slaying | glued: `⟦E8⟧o` | tpl: `...by #1% and ⟦E2⟧ critical ⟦E4⟧ caused against ⟦...` |
| t02 | t:1304 | 2 | 1 | 0 | `drop=E2` | `- t:1304 Entrapment | glued: `⟦E2⟧s` | tpl: `...When your traps are triggered, all affected ⟦E2⟧s ar...` |
| t02 | t:1305 | 1 | 1 | 0 | `drop=E1` | none | **owner-28**
| t02 | t:1310 | 6 | 1 | 0 | `drop=E6` | `- t:1310 Surefooted | glued: `⟦E6⟧s` | tpl: `...⟧ your ⟦E2⟧ by #1% and ⟦E5⟧ the ⟦E4⟧ of ⟦E1⟧ ⟦E6⟧s o...` |
| t02 | t:1385 | 8 | 1 | 0 | `drop=E8` | `- t:1385 Improved Mend Pet | glued: `⟦E8⟧s` | tpl: `...⟧, Magic, or ⟦E1⟧ from your pet each time it ...` |
| t02 | t:1386 | 1 | 1 | 0 | `drop=E1` | `- t:1386 Bestial Wrath | glued: `⟦E1⟧d` | tpl: `...e causing #1% additional ⟦E2⟧ for #2.  While ⟦E1⟧...` |
| t03 | t:26 | 5 | 1 | 0 | `drop=E5` | none | **owner-28**
| t03 | t:34 | 3 | 1 | 0 | `drop=E3` | none | **owner-28**
| t03 | t:35 | 4 | 1 | 0 | `drop=E4,E5` | `- t:35 Fire Power | glued: `⟦E4⟧s` | tpl: `... ⟦E3⟧ done by your ⟦E1⟧ by #1% per your ⟦E7⟧ ⟦E4⟧s on ...` |
| t03 | t:35 | 5 | 1 | 0 | `drop=E4,E5` | `- t:35 Fire Power | glued: `⟦E5⟧s` | tpl: `... ⟦E6⟧, up to a maximum increase of ${#1*4}%. ⟦E5⟧s whi...` |
| t03 | t:77 | 6 | 1 | 0 | `drop=E6` | none | **owner-28**
| t03 | t:80 | 7 | 1 | 0 | `drop=E7,E8` | none | **owner-28**
| t03 | t:80 | 8 | 1 | 0 | `drop=E7,E8` | none | **owner-28**
| t03 | t:85 | 4 | 1 | 0 | `drop=E4` | none | **owner-28**
| t03 | t:1623 | 3 | 1 | 0 | `drop=E3,E4` | `- t:1623 Improved Tracking | glued: `⟦E3⟧o` | tpl: `...easts, ⟦E4⟧s, Dragonkin, Elementals, Giants, ...` |
| t03 | t:1623 | 4 | 1 | 0 | `drop=E3,E4` | `- t:1623 Improved Tracking | glued: `⟦E4⟧s` | tpl: `...While tracking Beasts, ⟦E4⟧s, Dragonkin, Elem...` |
| t04 | t:38 | 2 | 1 | 0 | `drop=E2` | `- t:38 Frostbite | glued: `⟦E2⟧s` | tpl: `...Gives your ⟦E4⟧ ⟦E2⟧s a #1% ⟦E1⟧ to Freeze the ⟦E3⟧ for...` |
| t04 | t:61 | 3 | 1 | 0 | `drop=E3` | none | **owner-28**
| t04 | t:65 | 4 | 1 | 0 | `drop=E4` | `- t:65 Permafrost | glued: `⟦E4⟧s` | tpl: `...⟦E1⟧ the ⟦E2⟧ of your ⟦E6⟧ ⟦E4⟧s by #1% and ⟦E3⟧ the ⟦...` |
| t04 | t:66 | 4 | 1 | 0 | `drop=E4,E5` | none | **owner-28**
| t04 | t:66 | 5 | 1 | 0 | `drop=E4,E5` | none | **owner-28**
| t04 | t:69 | 2 | 1 | 0 | `drop=E2` | none | **owner-28**
| t04 | t:71 | 7 | 1 | 0 | `drop=E7` | `- t:71 Ice Barrier | glued: `⟦E7⟧e` | tpl: `...asing your ⟦E1⟧ by $1326891s1% for #2. While ⟦E7⟧ed, ...` |
| t04 | t:73 | 3 | 1 | 0 | `drop=E3` | none | **owner-28**
| t04 | t:1424 | 4 | 1 | 0 | `drop=E4` | none | **owner-28**
| t04 | t:1430 | 5 | 1 | 0 | `drop=E5,E9` | none | **owner-28**
| t04 | t:1430 | 9 | 1 | 0 | `drop=E5,E9` | `- t:1430 Holy Shield | glued: `⟦E9⟧e` | tpl: `...1% for #2, and deals #3 ⟦E2⟧ for each attack ⟦E9⟧ed...` |
| t04 | t:1444 | 4 | 1 | 0 | `drop=E4,E5` | none | **owner-28**
| t04 | t:1444 | 5 | 1 | 0 | `drop=E4,E5` | `- t:1444 Healing Light | glued: `⟦E5⟧e` | tpl: `...⟦E3⟧ the a⟦E4⟧ ⟦E5⟧ed by your ⟦E2⟧, ⟦E1⟧, and Hol...` |
| t04 | t:1461 | 6 | 1 | 0 | `drop=E6,E8` | none | **owner-28**
| t04 | t:1461 | 8 | 1 | 0 | `drop=E6,E8` | none | **owner-28**
| t04 | t:1463 | 1 | 1 | 0 | `drop=E1` | `- t:1463 Improved Seals | glued: `⟦E1⟧s` | tpl: `...⟦E2⟧ the ⟦E3⟧ done by your Seals and ⟦E1⟧s by #1...` |
| t05 | t:341 | 4 | 1 | 0 | `drop=E4` | none | **owner-28**
| t05 | t:344 | 4 | 1 | 0 | `drop=E4` | none | **owner-28**
| t05 | t:1181 | 5 | 1 | 0 | `drop=E5` | none | **owner-28**
| t05 | t:1441 | 5 | 1 | 0 | `drop=E5` | `- t:1441 Repentance | glued: `⟦E5⟧o` | tpl: `...sed will awaken the ⟦E4⟧. Only works against ⟦E5⟧oid...` |
| t05 | t:1464 | 3 | 1 | 0 | `drop=E3` | none | **owner-28**
| t05 | t:1561 | 4 | 1 | 0 | `drop=E4,E7` | `- t:1561 Spirit of Redemption | glued: `⟦E4⟧s` | tpl: `...attack, be attacked or ⟦E7⟧ed by any ⟦E6⟧ ...` |
| t05 | t:1561 | 7 | 1 | 0 | `drop=E4,E7` | `- t:1561 Spirit of Redemption | glued: `⟦E7⟧e` | tpl: `...The ⟦E2⟧ cannot move, attack, be attacked ...` |
| t05 | t:1635 | 2 | 1 | 0 | `drop=E2` | none | **owner-28**
| t05 | t:1637 | 1 | 1 | 0 | `drop=E1` | `- t:1637 Lightwell | glued: `⟦E1⟧w` | tpl: `...Creates a ⟦E1⟧well near the priest.  Members of yo......` |
| t06 | t:268 | 3 | 1 | 0 | `drop=E3` | none |
| t06 | t:274 | 3 | 1 | 0 | `drop=E3,E4` | `- t:274 Murder | glued: `⟦E3⟧s` | tpl: `... ⟦E2⟧ dealt by #1% against ⟦E4⟧oid and Giant ⟦E3⟧s....`` |
| t06 | t:274 | 4 | 1 | 0 | `drop=E3,E4` | `- t:274 Murder | glued: `⟦E4⟧o` | tpl: `...⟦E1⟧ all ⟦E2⟧ dealt by #1% against ⟦E4⟧oid and Giant ⟦E3⟧...` |
| t06 | t:280 | 5 | 1 | 0 | `drop=E5` | none |
| t06 | t:404 | 3 | 1 | 0 | `drop=E3,E4` | none |
| t06 | t:404 | 4 | 1 | 0 | `drop=E3,E4` | `- t:404 Spiritual Healing | glued: `⟦E4⟧e` | tpl: `...⟦E1⟧ the a⟦E3⟧ ⟦E4⟧ed by your ⟦E2⟧ by #1%....`` |
| t06 | t:406 | 3 | 1 | 0 | `drop=E3,E4` | none |
| t06 | t:406 | 4 | 1 | 0 | `drop=E3,E4` | `- t:406 Improved Renew | glued: `⟦E4⟧e` | tpl: `...⟦E1⟧ the a⟦E3⟧ ⟦E4⟧ed by your ⟦E2⟧ spell by #1%.....` |
| t07 | t:223 | 6 | 1 | 0 | `drop=E6` | none |
| t07 | t:246 | 3 | 1 | 0 | `drop=E3` | none |
| t07 | t:303 | 8 | 1 | 0 | `drop=E8` | `- t:303 Ghostly Strike | glued: `⟦E8⟧p` | tpl: `...A ⟦E6⟧ that deals #1% (#2% if a ⟦E3⟧ is ⟦E8⟧ped i...` |
| t07 | t:561 | 10 | 1 | 0 | `drop=E10` | none |
| t07 | t:681 | 7 | 1 | 0 | `drop=E7` | `- t:681 Hemorrhage | glued: `⟦E7⟧p` | tpl: `...t ⟦E5⟧ that deals #1% ⟦E1⟧ (#2% if a ⟦E3⟧ is ⟦E7⟧ped)...` |
| t07 | t:1641 | 7 | 1 | 0 | `drop=E7` | none |
| t08 | t:564 | 5 | 1 | 0 | `drop=E5` | none |
| t08 | t:574 | 1 | 1 | 0 | `drop=E1` | none |
| t08 | t:575 | 3 | 1 | 0 | `drop=E3` | none |
| t08 | t:592 | 3 | 1 | 0 | `drop=E3` | `- t:592 Purification | glued: `⟦E3⟧i` | tpl: `...⟦E1⟧ the ⟦E3⟧iveness of your ⟦E2⟧ spells by #1%.......` |
| t08 | t:595 | 3 | 1 | 0 | `drop=E3` | none |
| t08 | t:609 | 7 | 1 | 0 | `drop=E7` | none |
| t08 | t:611 | 8 | 1 | 0 | `drop=E8` | `- t:611 Elemental Weapons | glued: `⟦E8⟧b` | tpl: `...2% and ⟦E6⟧ the ⟦E7⟧ caused by your ⟦E1⟧ and ⟦...` |
| t08 | t:1001 | 5 | 1 | 0 | `drop=E5` | none |
| t08 | t:1002 | 9 | 1 | 0 | `drop=E9` | none |
| t08 | t:1646 | 2 | 1 | 0 | `drop=E2` | none |
| t08 | t:1648 | 3 | 1 | 0 | `drop=E3` | none |
| t09 | t:1007 | 3 | 1 | 0 | `drop=E3` | none |
| t09 | t:1221 | 4 | 1 | 0 | `drop=E4` | none |
| t09 | t:1224 | 11 | 1 | 0 | `drop=E11` | none |
| t09 | t:1226 | 3 | 1 | 0 | `drop=E3` | none |
| t09 | t:1227 | 4 | 1 | 0 | `drop=E4` | none |
| t09 | t:1242 | 4 | 1 | 0 | `drop=E4` | none |
| t09 | t:1262 | 3 | 1 | 0 | `drop=E3` | none |
| t09 | t:1263 | 3 | 1 | 0 | `drop=E3,E4` | `- t:1263 Improved Spellstone | glued: `⟦E3⟧t` | tpl: `...⟦E1⟧ the a⟦E4⟧ of ⟦E2⟧ absorbed by your ⟦E3...` |
| t09 | t:1263 | 4 | 1 | 0 | `drop=E3,E4` | none |
| t09 | t:1282 | 3 | 1 | 0 | `drop=E3` | none |

## The fixed carrier: dry-run of ALL 11 packs (real db, wow main bf43fca3b9)

zero refusals; "planned" = node dFa writes the carrier would make; "notes" =
talent nodes absent from db/<class>.json (Brain decides: add nodes or skip).

| pack | fa rows | pre-fix refused instances | planned node writes (dry) | notes |
|---|---|---|---|---|
| t01 | 40 | 7 | 28 | 12 |
| t02 | 40 | 10 | 33 | 7 |
| t03 | 40 | 10 | 36 | 4 |
| t04 | 40 | 16 | 31 | 9 |
| t05 | 40 | 9 | 29 | 11 |
| t06 | 40 | 8 | 35 | 5 |
| t07 | 40 | 6 | 34 | 6 |
| t08 | 40 | 11 | 31 | 9 |
| t09 | 40 | 10 | 31 | 9 |
| t10 | 40 | 0 | 30 | 10 |
| t11 | 13 | 0 | 11 | 2 |

Full per-pack note lists are printed by `python3 tools/t_pack_import.py tNN --dry`

