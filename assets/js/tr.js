/* tr.js v3.10 — wowfarsi GLOBAL translation-style engine ( all sections )
   ------------------------------------------------------------------------
   v3.10 (namesClass — «اسم class ها و spec ها هم وارد بازی کن که درک کنیم
   اینارو هم برای مارکر و وارد بخش سبک ترجمه بشه»):
     - NEW marker family {{cls:EN|FA}} -> the namesClass switch («اسم کلاس‌ها
       و شاخه‌ها»): class + spec names written by the build markerizer
       (tools/markerize_fa.py load_classes — glossary-locked canon) flip with
       their OWN switch, independent of namesSpell/terms/textReq
     - the drawer row joins the واژه‌نامهٔ بازی group (29 locked names);
       vocabAll (کل واژه‌نامه با یک کلید) now covers 8 families
     - SHARE CODE v4.1: the frozen 14-bit order is UNTOUCHED — namesClass
       rides bit 14 (appended AFTER the frozen 14), so every legacy WF4/WF3/
       WF2 code still decodes; new codes emit 15 bits (the Lua addon can
       ignore the extra bit until it adopts the key)
     - faClasses (retail.js) now answers namesClass instead of textReq —
       one switch owns class names everywhere
     - engine bits (CATMAP/MK resolution/protect/TOKENS) untouched

   v3.9 (the واژه‌نامه view is now a real menu everywhere — «نوشته ها دکمه
   ندارن اصن قاطیه همه چیز اشتباهه»):
     - the drill-down views reuse rowHtml() (.tr-row/.tr-sw/…), but those
       BASE styles lived only in retail.css: item pages rendered fine while
       the spellbook and every other page collapsed into a text run with
       invisible switches (trdrawer.css only carried color overrides)
     - fix lives in trdrawer.css v3.9: the full row+switch base is scoped
       to .tr-bar-drawer — self-contained on every page; combo AND member
       rows both show (retail.css's .tr-bar.tr-simple hiding no longer
       leaks into the drawer; only the ensureCss URL below changed here)
     - engine, share-code bits, popInnerHtml (legacy mount popup): untouched

   v3.8 (the drawer body = the studio menu — «منوی سبک ترجمه یک کشو رو ک
   باز میکنی به هم ریختس»):
     - the drawer column carried v3.5's accordion pile: 4 presets, two
       accordons spilling 8 toggle rows each, share rows with stray
       X-looking icons — a wall of floating text the user called MESSY
     - fix: the drawer body now IS studioMenuHtml(true) — the sectioned
       drill-down menu the user approved for اتاق کاستوم: root view =
       4 presets + 4 «برو داخل» rows (+ اتاق کاستوم link), each category
       GOES INTO its own view with a back row. Both places identical.
     - flash() walks into the owning view for drawer AND studio kinds
     - trdrawer.css gains the stmenu styles scoped to .tr-bar-drawer
       (studio.css is not loaded outside translate.html)
     - engine, share-code bits, popInnerHtml (legacy mount popup): untouched

   v3.7 (the drawer works on EVERY page — «اینده نگری کن چون بزودی صفحات
   زیادی خواهیم داشت و نباید مشکل داشته باشه»):
     - the user: the سبک ترجمه menu was OK on item pages but broke on the
       spellbook and other pages («تو صفحه کتاب اسپل و دیگر صفحات درست کار
       نمیکنه»). Two root causes fixed:
       1) tr.js was only loaded by 3 pages — every other page had NO سبک
          ترجمه button at all. nav-menu.js now auto-loads tr.js on every
          page (news/article templates included), so future pages inherit
          it for free.
       2) trdrawer.css was a per-page <link>; pages loading tr.js through
          the loader had no drawer styles. tr.js now injects the stylesheet
          itself (ensureCss, sub-directory aware via TR_BASE) and mounts
          the drawer only after the CSS is applied — no unstyled FAB flash.
     - the column material fix lives in trdrawer.css v3.7 (readable over
       any page content); engine, share-code, studio bits: untouched

   v3.6 (اتاق کاستوم gets its OWN fixed menu — the drawer is for items only):
     - the user: «منو مثل بقیه منوهای سایت‌ها بچسبه به اون محتوا … کاربر کلیک
       کنه روی واژه نامه بازی یک منو بره داخل نه که کشویی باز بشه … اتاق
       کاستوم اصلا نباید منو هاید بشه همونجا ثابته — اون برای بخش ایتم‌هاست»
     - mountStudio(container): a PERMANENT column for translate.html, glued
       to the preview, never hidden, no drawer/scrim/FAB — root view is just
       a few buttons (4 presets + 4 «برو داخل» rows); clicking a category
       GOES INTO its own view (back row returns). The left-edge drawer stays
       untouched for item/spellbook and every other page.
     - flash() knows the studio kind: it walks INTO the owning view first
     - drawer/pop HTML, engine, share-code bits: untouched

   v3.5 (settings rework round 2 — «ساده مینیمال، بدون پنل بزرگ»):
     - the drawer has NO panel chrome any more (trdrawer.css): the column is
       fully transparent — texts and buttons FLOAT on the site background
       (same material as the page); no head bar, no cards, no seams
     - the column is now just a FEW buttons:
         4 mode buttons (presets as plain text rows)
         واژه‌نامهٔ بازی / خط‌های تولتیپ  — two accordion buttons; رابط سایت
           lives INSIDE تولتیپ as one more row (user: «اون رابط رو هم بیار
           توی تولتیپ»)
         اشتراک‌گذاری سبک ترجمهٔ من  (one tap: reveals the code + copies)
         سبک ترجمهٔ بقیه…  (reveals: «کد سبک بقیه رو بگیر و اینجا ثبت کن»
           + input + ثبت)
     - the simple/advanced toggle is GONE from the UI: inside an accordion
       both the combo quick-toggle AND its member rows stay visible; the
       adv storage/API remain for compat
     - flash() opens the owning accordion first, then scrolls to the row
     - no auto-open restore on plain pages: the float loads CLOSED, only
       the studio room (translate.html) forces it open
     - ENGINE UNTOUCHED: 14 frozen keys/order (WF4 share-code spec + addon
       parity), CATMAP, MK, TERMS, storage keys, derive/preset logic

   v3.3 (settings-panel rework — «انگار کاربر اومده به تنظیمات»):
     - the panel is ORGANIZED, not a flat list: three sections with headers
       and one-line descriptions —
         واژه‌نامهٔ بازی  (کل واژه‌نامه با یک کلید + هر دسته جدا با شمارندهٔ واژه)
         خط‌های تولتیپ    (هر خط تولتیپ با مثال واقعی)
         رابط سایت
     - the واژه‌ها bank categories are now VISIBLE in the panel: each name
       row carries the locked-word count of its entity family (item_ref 666,
       spell+skill+talent_tree 542, npc+creature+creature_type+faction 486,
       zone 163, term 413) and a REAL sample word, so the user sees exactly
       what flips — «کاربر بدونه چیارو میخاد کاستوم کنه».
     - «قید و یکتا» and other translationese titles are gone: natural
       Persian labels + a real example line under every switch (the example
       is the actual tooltip text the switch controls).
     - SIMPLE mode rebuilt: 6 switches (کل واژه‌نامه، توضیحات، آمار،
       جزئیات تولتیپ، متن‌های تزئینی، رابط) instead of the old 2;
       ADVANCED shows all 14 + examples. Combo keys wordlNames->vocabAll.
     - CAT_LB badge fixes: قید->اتصال، متن طعم->متن تزئینی.
     - ENGINE UNTOUCHED: 14 frozen keys/order (WF4 share-code spec + addon
       parity), CATMAP, MK, TERMS, storage keys, derive/preset logic.

   v3.2 (external review round 2):
     - WF4 checksum v2: base36 VALUES over the payload, position weights,
       mod the PRIME 37, cc = 3 base36 chars of h1*37+h2 (spec + proof below
       in the SHARE CODE section; exhaustive fuzz: 0 accepted errors — the
       old charCode/mod-36 hash leaked 146 transpositions + 1.46% of typos).
       Legacy WF4 (2-char cc), WF3, WF2 still DECODE (old codes stay valid).
     - terms vocabulary += health/defense/hit (runtime mirror of the
       build-time word list; مانا/حمله‌ی variants live in the offline list).
     - faTokens: generated family-marker spans are parked past the anchor
       pass — the EN fallback inside a marker can no longer be re-wrapped
       into nested .tok-tm spans (4 spans -> 2).
     - NEW marker family {{ts:EN|FA}} -> textStats: glossary terms INSIDE
       stats/damage lines (Damage/Agility/Armor/Block…) belong to the
       line's own switch, so the whole stat block flips with ONE switch
       («آمار، آسیب و اعداد») — user feedback: needing terms+textStats
       together for a basic tooltip was wrong. terms keeps desc/flavor.
     - build-time markerize (tools/markerize_fa.py): FA word-boundary guard,
       ezafe/kasre absorbed into the marker FA part, numeric alignment +
       line-count guards, coverage report with reasons, verify fails on
       zero files + atomic writes (see tools/test_markerize.py fixtures).

   v3.1 (external review round): the game glossary moved RUNTIME -> BUILD-TIME.
     - fa-*.json lines are markerized offline (tools/markerize_fa.py): every
       glossary term present in BOTH the EN line and its aligned FA line is
       wrapped {{tm:Hit Rating|رتبهٔ اصابت}} — so the terms switch now turns
       terms EN<->FA in BOTH directions inside real data lines.
     - NEW marker family, ONE map marker -> switch:
         {{sp:EN|FA}} namesSpell   {{it:EN|FA}} namesItem (SET names too)
         {{npc:EN|FA}} namesNpc    {{zn:EN|FA}} namesZone
         {{qs:EN|FA}} namesQuest   {{ob:EN|FA}} namesObj
         {{tm:EN|FA}} terms
       every wrapper carries class tok-* AND data-tk so click/hover target
       the RIGHT switch (was: clicks landed on the line's own category).
     - NO runtime EN->FA glossary any more (it corrupted embedded EN names:
       "Hunter's Mark" -> «شکارچی's Mark»). tokens() keeps a light ANCHOR
       pass — wraps EN glossary terms in .tok-tm[data-tk=terms] WITHOUT
       translating — so hover/blink still shows what terms owns when OFF.
     - share codes WF3 -> WF4: checksum over BASE36 VALUES (not charCodes)
       with position weights, mod the PRIME 37, emitted as 3 base36 chars.
       Prime modulus + bounded values (0..35) mean an adjacent transposition
       or a single-char substitution can NEVER multiply to 0 mod 37 — both
       are always caught (round-2 review fuzz: the old charCode/mod-36 hash
       let 146/46,034 transpositions and 1.46% of typos through — 36 is
       composite, 0↔x/1↔y/2↔z differ by 72 = 2·36).
       Legacy WF4 (2-char cc), WF3 + WF2 still decode. The Lua addon must
       implement the WF4 v2 spec exactly.
     - panel: SIMPLE/ADVANCED — in simple mode the four world-name switches
       collapse into one «اسم‌های دنیای بازی» row and textReq/textBind/
       textDetail into «جزئیات تولتیپ». Bits stay frozen per real switch.
     - fixes: unknown preset mode no longer discards custom switches;
       toggle() re-derives the mode exactly like applyCode; cross-tab
       storage sync; outside-click listener wired once; coin digits follow
       the line language (tokens(txt,linker,fa)); protection regex built
       from the MARKERS list.

   v3 core (unchanged): every switch is a CONTENT TYPE that applies to ALL
   sections the same way: item tooltips, set names/bonuses, quests,
   talents, guides, the map, and later the game addon. One bucket per kind:

     نام‌ها   namesItem   آیتم‌ها و ست‌ها (ست = همان آیتم، یک رده)
              namesSpell  اسپل‌ها و تلنت‌ها — همه‌جا، حتی داخل متن {{sp:}}
              namesNpc    NPCها            namesZone  مکان‌ها و نقشه
              namesQuest  عنوان کوئست‌ها    namesObj   آبجکت‌ها
     اصطلاحات terms       واژه‌نامهٔ بازی (hit rating, attack power, …).
                          خاموش = این واژه‌ها در همه‌بخش‌ها انگلیسی می‌مانند.
     متن‌ها   textDesc    توضیحات و افکت‌ها — Use/Equip/Chance/پاداش ست/متن
                          کوئست: همه یک رده‌اند (ست فرقی ندارد)
              textStats   آمار، آسیب و اعداد      textReq   نیازمندی‌ها
              textBind    قید و یکتا              textFlavor متن طعم
              textDetail  جزئیات (سطح آیتم، ماندگاری، قیمت فروش، نوع اسلات)
     رابط     uiLabels    برچسب‌ها و دسته‌های سایت

   ONE PIPELINE: every renderer calls WFTR.tokens() (EN text) or
   WFTR.faTokens() (FA text) — no mirrored copies in retail.js / studio.js.
   faTokens resolves the marker family per switch, then the token markup.
   Input is pre-escaped HTML-safe text (same contract retail.js had).

   FA data (data/forever/db/fa-<id%24>.json) format UNCHANGED:
     "tip": [["cls","متن","cat"],...] with cat in CATMAP; set names live in
     "sets" (-> namesItem), quest titles/text in "q" (namesQuest/textDesc).

   SHARE CODE (offline config sharing, site + game addon)
   -------------------------------------------------------
   WF4-<base36 bitmask>-<ccc>   bit i (LSB first) = SHARE_KEYS[i]:
     namesItem, namesSpell, namesNpc, namesZone, namesQuest, namesObj,
     terms, textDesc, textStats, textReq, textBind, textDetail,
     textFlavor, uiLabels        (14 FROZEN bits — the addon spec)
     + namesClass                (bit 14, v4.1 — appended, never re-ordered;
       legacy 14-bit codes decode with namesClass off, the addon may ignore
       bit 14 until it ships the key)
   ccc = 3 base36 chars of (h1*37 + h2), where over "WF4-"+payload:
     v_i = parseInt(char_i, 36)          (0..35 — '-' → 0)
     h1 = (Σ v_i·(i+1)) mod 37 ; h2 = (Σ v_i·(i+3)) mod 37
   WHY THIS IS SAFE (math the addon can rely on): 37 is prime; |Δv| between
   two charset chars ≤ 35 and (2i+3) ≤ 35 for any payload we will ever emit
   (< 19 chars), so an adjacent transposition changes h1 by
   (vq-vp)(2i+3) ≢ 0 (mod 37) ALWAYS; a single-char substitution changes it
   by (v'-v)(i+1), and |v'-v| ≤ 35 < 37 → also always caught. Random junk
   passes 1/1369. Legacy formats still decode: old WF4 (2-char cc over
   charCodes mod 36), WF3 (1-char sum, 14 bits), WF2 (22 bits, remapped).
   The game addon implements this exact spec in Lua.
*/
(function () {
  "use strict";
  /* ---------- the 14 GLOBAL content-type switches (order = share-code bits) ----------
     v3.3: three SECTIONS. rows carry n = locked-word count of the entity
     family (entities.json) and ex = a REAL sample the switch flips. */
  var GROUPS = [
    { id: "vocab", lbl: "واژه‌نامهٔ بازی", n: "۲٬۲۷۰+ واژهٔ قفل‌شده",
      desc: "اسم‌ها و اصطلاح‌های قفل‌شدهٔ داخل همهٔ متن‌ها — تولتیپ، ست، کوئست، استعداد، راهنما و نقشه.", rows: [
      { k: "namesItem",  lbl: "اسم آیتم‌ها و ست‌ها", en: "Item & set names", n: 666, ex: "تندرفوری، تیغهٔ مبارک بادبین" },
      { k: "namesSpell", lbl: "اسم اسپل‌ها و استعدادها", en: "Spell & talent names", n: 542, ex: "گردباد، تشنگی خون" },
      { k: "namesClass", lbl: "اسم کلاس‌ها و شاخه‌ها", en: "Class & spec names", n: 29, ex: "جنگاور، کیفر، استادی حیوان" },
      { k: "namesNpc",   lbl: "اسم شخصیت‌ها و موجودها", en: "NPCs, creatures & factions", n: 486, ex: "هایلرد دمیتریان، اژدهای برونزی" },
      { k: "namesZone",  lbl: "اسم مناطق و دانجن‌ها", en: "Zones & dungeons", n: 163, ex: "تاناریس، سکولومنس" },
      { k: "namesQuest", lbl: "عنوان کوئست‌ها", en: "Quest titles", ex: "برخیز، تندرفوری!" },
      { k: "namesObj",   lbl: "اسم آبجکت‌ها", en: "Game objects", ex: "صندوق گنج آتش‌خاک" },
      { k: "terms",      lbl: "اصطلاح‌های بازی", en: "Game glossary", n: 413, ex: "hit rating، attack power، stamina" }
    ] },
    { id: "texts", lbl: "خط‌های تولتیپ", desc: "هر خط از تولتیپ آیتم و ست جدا کنترل می‌شود — با نمونهٔ واقعی:", rows: [
      { k: "textDesc",   lbl: "توضیحات و افکت‌ها", en: "Descriptions & effects", ex: "به هنگام پوشیدن: قدرت حملهٔ شما ۶۰۰ افزایش می‌یابد." },
      { k: "textStats",  lbl: "آمار و اعداد", en: "Stats, damage, numbers", ex: "+۸ استقامت · ۳۰۰ آسیب طبیعت" },
      { k: "textReq",    lbl: "نیازمندی‌ها", en: "Requirements", ex: "نیازمند سطح ۶۰ · نیازمند جنگاور" },
      { k: "textBind",   lbl: "اتصال و یکتایی", en: "Binds / Unique", ex: "هنگام برداشتن قید می‌شود · یکتا" },
      { k: "textDetail", lbl: "جزئیات آیتم", en: "Item level, durability, sell price, slot", ex: "سطح آیتم ۸۰ · قیمت فروش: ۲۵ طلا" },
      { k: "textFlavor", lbl: "متن‌های تزئینی", en: "Flavor text", ex: "هیچ‌کس ندانست این تیغه از کجا آمد…" }
    ] },
    { id: "ui", lbl: "رابط سایت", desc: "برچسب‌های فارسی دور و بر تولتیپ‌ها و صفحه‌ها.", rows: [
      { k: "uiLabels", lbl: "برچسب‌های رابط سایت", en: "Site labels", ex: "سطح آیتم · حداکثر انبار" }
    ] }
  ];
  var REC = { namesItem: 0, namesSpell: 0, namesClass: 1, namesNpc: 0, namesZone: 0, namesQuest: 1, namesObj: 0,
    terms: 1, textDesc: 1, textStats: 1, textReq: 1, textBind: 1, textDetail: 1, textFlavor: 0, uiLabels: 1 };
  /* فقط آمار — the user's example: stat lines + requirements Persian, everything else English */
  var STATSONLY = { namesItem: 0, namesSpell: 0, namesClass: 0, namesNpc: 0, namesZone: 0, namesQuest: 0, namesObj: 0,
    terms: 0, textDesc: 0, textStats: 1, textReq: 1, textBind: 0, textDetail: 0, textFlavor: 0, uiLabels: 0 };
  var PRESETS = [
    ["recommended", "پیشنهادی", "اسمی انگلیسی می‌ماند؛ متن‌ها فارسی می‌شوند"],
    ["fa", "کاملاً فارسی", "هر چه ترجمه داشته باشد فارسی می‌شود"],
    ["stats", "فقط آمار", "فقط آمار و نیازمندی‌ها فارسی"],
    ["custom", "سفارشی", "ترکیب دلخواه تو — هر دسته جدا"]
  ];
  var PRESET_NAME = { recommended: "پیشنهادی", fa: "کاملاً فارسی", stats: "فقط آمار", custom: "سفارشی" };
  var CAT_LB = { ilvl: "سطح آیتم", bind: "اتصال", slot: "نوع اسلات", stats: "آمار", dur: "ماندگاری",
    req: "نیازمندی", spell: "متن اسپل", flavor: "متن تزئینی", sell: "قیمت فروش", setb: "ست", misc: "سایر",
    classes: "کلاس‌ها", open: "توضیحات" };
  /* fa-*.json line category -> global switch (the addon mirrors this map) */
  var CATMAP = { ilvl: "textDetail", bind: "textBind", slot: "textDetail", stats: "textStats",
    dur: "textDetail", req: "textReq", spell: "textDesc", flavor: "textFlavor", sell: "textDetail",
    setb: "textDesc", misc: "textDesc",
    classes: "textReq", open: "textDesc" };
  var ALLKEYS = [], g, r;
  for (g = 0; g < GROUPS.length; g++) for (r = 0; r < GROUPS[g].rows.length; r++) ALLKEYS.push(GROUPS[g].rows[r].k);
  /* share-code bit order (v4.1): the frozen 14 + namesClass APPENDED at bit
     14. UI order (GROUPS) and code order are independent — legacy codes
     never change meaning. */
  var SHARE_KEYS = ["namesItem", "namesSpell", "namesNpc", "namesZone", "namesQuest", "namesObj",
    "terms", "textDesc", "textStats", "textReq", "textBind", "textDetail",
    "textFlavor", "uiLabels", "namesClass"];
  /* frozen v2 key order — legacy WF2 share codes decode through this */
  var KEYS_V2 = ["itemNames", "itemTips", "tipIlvl", "tipBind", "tipSlot", "tipStats", "tipDur",
    "tipReq", "tipSpell", "tipSpnm", "tipTerm", "tipFlavor", "tipSell", "tipSetb",
    "npc", "zones", "objects", "sets", "questTitles", "questDesc", "spells", "cats"];
  var V2MAP = { itemNames: "namesItem", sets: "namesItem", tipSpnm: "namesSpell", spells: "namesSpell",
    npc: "namesNpc", zones: "namesZone", questTitles: "namesQuest", objects: "namesObj",
    tipTerm: "terms", tipSpell: "textDesc", questDesc: "textDesc", tipSetb: "textDesc",
    tipStats: "textStats", tipReq: "textReq", tipBind: "textBind",
    tipIlvl: "textDetail", tipDur: "textDetail", tipSell: "textDetail", tipSlot: "textDetail",
    tipFlavor: "textFlavor", cats: "uiLabels" };
  var TEXTKEYS = ["terms", "textDesc", "textStats", "textReq", "textBind", "textDetail", "textFlavor"];

  /* ---------- SIMPLE / ADVANCED panel modes ----------
     Bits stay frozen per real switch; combos are a UI view only.
     v3.3: vocabAll = the user's «کل واژه‌نامه با یک انتخاب» — one switch
     for the whole words-bank (8 families since v3.10); tipDetails unchanged. */
  var COMBOS = [
    { k: "vocabAll", lbl: "کل واژه‌نامه با یک کلید", en: "All names & terms",
      ex: "آیتم، اسپل، کلاس و شاخه، شخصیت، مکان، کوئست، آبجکت + اصطلاح‌های بازی",
      keys: ["namesItem", "namesSpell", "namesClass", "namesNpc", "namesZone", "namesQuest", "namesObj", "terms"] },
    { k: "tipDetails", lbl: "جزئیات تولتیپ با یک کلید", en: "Tooltip details — all",
      ex: "نیازمندی‌ها · اتصال و یکتایی · جزئیات آیتم",
      keys: ["textReq", "textBind", "textDetail"] }
  ];
  var COMBO_BY_KEY = {}, COMBO_OF_MEMBER = {}, ci, cj;
  for (ci = 0; ci < COMBOS.length; ci++) {
    COMBO_BY_KEY[COMBOS[ci].k] = COMBOS[ci];
    for (cj = 0; cj < COMBOS[ci].keys.length; cj++) COMBO_OF_MEMBER[COMBOS[ci].keys[cj]] = COMBOS[ci].k;
  }

  /* ---------- the marker family (data lines + studio samples) ----------
     ONE map: marker code -> the global switch that owns it. The same pair
     is what tools/markerize_fa.py writes into fa-*.json at build time. */
  var MK = { sp: "namesSpell", tm: "terms", ts: "textStats", it: "namesItem", npc: "namesNpc",
    zn: "namesZone", qs: "namesQuest", ob: "namesObj", cls: "namesClass",
    set: "namesItem" };
  /* set = the item-SET name marker {{set:EN|FA}} (written into the fa bank's
     setb lines); it flips with namesItem — per the marker doc, "SET names too". */
  /* cls = class + spec names («جنگاور», «کیفر», «استادی حیوان»…), written by
     the build markerizer from the glossary-locked bank — owned by namesClass,
     NOT namesSpell/textReq, so the drawer flips them independently. */
  /* ts = glossary term INSIDE a stats/damage line (Damage/Agility/Armor…):
     owned by textStats, NOT terms — so the whole stat block flips with ONE
     switch («آمار، آسیب و اعداد»). terms stays for desc/flavor glossary. */
  var MARKERS = ["sp", "tm", "it", "npc", "zn", "qs", "ob", "i", "cc", "col", "g", "s", "c", "sock", "t"];
  /* protection regex built FROM THE LIST (was hand-written): only the markup
     markers — the marker family (MK) must survive protection so faTokens can
     resolve it per switch */
  var PROTECT_RE = new RegExp("\\{\\{(?:" + MARKERS.filter(function (m) { return !MK[m]; }).join("|") + "):[^}]*\\}\\}", "g");

  /* ---------- EN game terms (ANCHOR pass + build mirror) ----------
     Noun vocabulary only — line labels (Item Level / Sell Price / Requires…)
     belong to their own line switch, NOT to terms. The Python build script
     (tools/markerize_fa.py) superset-mirrors this list: its vocabulary is
     this list PLUS the allowlisted gameplay rows of the user glossary
     (data/forever/glossary.json — «واژه‌ها» bank), so new glossary aliases
     flow into build-time markerization automatically. */
  var TERMS = [
    "armor penetration rating", "critical strike rating", "resilience rating",
    "melee attack power", "critical strike chance",
    "ranged attack power", "feral attack power", "expertise rating",
    "defense rating", "haste rating", "hit rating", "crit rating",
    "ranged attack speed",
    "spell power", "attack power", "spell damage", "attack speed", "movement speed",
    "physical damage", "fire damage", "frost damage", "shadow damage",
    "nature damage", "arcane damage", "holy damage",
    "fire resistance", "frost resistance", "shadow resistance",
    "nature resistance", "arcane resistance",
    "critical strike", "critical hit", "crit chance", "chance on hit",
    "mana per 5 sec", "health per 5 sec", "per 5 sec", "all stats",
    "socket bonus", "meta socket", "red socket", "blue socket", "yellow socket",
    "sockets", "socket",
    "runic power", "strength", "agility", "stamina", "spirit", "intellect",
    "resistance", "dodge", "parry", "damage", "healing", "block",
    "mana", "energy", "rage", "health", "defense", "hit"
  ];
  var tmRe;
  (function () {
    var t = TERMS.slice().sort(function (a, b) { return b.length - a.length; });
    tmRe = new RegExp("\\b(" + t.map(function (w) { return w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("|") + ")\\b", "gi");
  })();

  /* class names — used by retail.js chips/facts rows (textReq switch) and
     by the build markerizer; the addon mirrors this table too */
  var CLASSES = { "Warrior": "جنگاور", "Paladin": "پالادین", "Hunter": "شکارچی", "Rogue": "راهزن",
    "Priest": "روحانی", "Shaman": "شمن", "Mage": "جادوگر", "Warlock": "احضارکننده",
    "Monk": "راهب", "Druid": "دروئید", "Death Knight": "شوالیهٔ مرگ", "Demon Hunter": "شکارچی شیطان" };

  var KEY = "wf-tr-cfg", KEY_CATS = "wf-tr-cats", KEY_ADV = "wf-tr-adv";
  var listeners = [];
  var cfg = load();
  var catsOn = loadCats();
  var adv = loadAdv();
  if (cfg.needSave) { delete cfg.needSave; save(); }

  function clone(o) { var r = {}, k; for (k in o) r[k] = o[k]; return r; }
  function allOn() { var d = {}, i; for (i = 0; i < ALLKEYS.length; i++) d[ALLKEYS[i]] = 1; return d; }
  function blank() { var d = {}, i; for (i = 0; i < ALLKEYS.length; i++) d[ALLKEYS[i]] = 0; return d; }
  function remapV2(old) { /* v2 switches -> v3 content types (OR-merge) */
    var d = blank(), src;
    for (src in V2MAP) if (old[src]) d[V2MAP[src]] = 1;
    if (old.itemTips === 0) { /* v2 tooltip master was off -> tooltip-driven types off */
      var i;
      for (i = 0; i < TEXTKEYS.length; i++) d[TEXTKEYS[i]] = 0;
    }
    return d;
  }
  function load() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY) || "null"), k, d, m;
      if (c && c.d) {
        if (c.v === 3) {
          d = clone(REC);
          for (k in d) if (typeof c.d[k] !== "undefined") d[k] = c.d[k] ? 1 : 0;
          if (c.m === "fa") d = allOn();
          else if (c.m === "recommended") d = clone(REC);
          else if (c.m === "stats") d = clone(STATSONLY);
          /* unknown/absent mode: KEEP the stored switches, re-derive the mode
             (was: forced «recommended» and threw the user's mix away) */
          m = PRESET_NAME[c.m] ? c.m : deriveMode(d);
          return { v: 3, m: m, d: d };
        }
        /* v1/v2 config -> migrate */
        m = PRESET_NAME[c.m] ? c.m : "custom";
        d = m === "fa" ? allOn() : (m === "recommended" ? clone(REC) : (m === "stats" ? clone(STATSONLY) : remapV2(c.d)));
        return { v: 3, m: m === "custom" ? deriveMode(d) : m, d: d, needSave: true };
      }
    } catch (e) { /* private mode etc. */ }
    return { v: 3, m: "recommended", d: clone(REC) };
  }
  function loadCats() {
    try { return localStorage.getItem(KEY_CATS) === "1"; } catch (e) { return false; }
  }
  function loadAdv() {
    try { return localStorage.getItem(KEY_ADV) === "1"; } catch (e) { return false; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(cfg)); } catch (e) { /* ignore */ }
  }
  function saveCats() {
    try { localStorage.setItem(KEY_CATS, catsOn ? "1" : "0"); } catch (e) { /* ignore */ }
  }
  function saveAdv() {
    try { localStorage.setItem(KEY_ADV, adv ? "1" : "0"); } catch (e) { /* ignore */ }
  }
  function fire() { for (var i = 0; i < listeners.length; i++) listeners[i](); }
  function deriveMode(d) {
    var fa = true, rec = true, st = true, i;
    for (i = 0; i < ALLKEYS.length; i++) {
      var v = d[ALLKEYS[i]] ? 1 : 0;
      if (v !== 1) fa = false;
      if (v !== (REC[ALLKEYS[i]] ? 1 : 0)) rec = false;
      if (v !== (STATSONLY[ALLKEYS[i]] ? 1 : 0)) st = false;
    }
    return fa ? "fa" : (rec ? "recommended" : (st ? "stats" : "custom"));
  }
  function applyPreset(m) {
    if (m === "fa") return allOn();
    if (m === "stats") return clone(STATSONLY);
    if (m === "recommended") return clone(REC);
    return clone(cfg.d); /* custom keeps current switches */
  }
  function setMode(m) {
    if (!PRESET_NAME[m]) return;
    cfg = { v: 3, m: m, d: applyPreset(m) };
    save(); refreshUI(); fire();
  }
  function toggle(k) {
    var combo = COMBO_BY_KEY[k];
    if (combo) {
      var allOnNow = true, i;
      for (i = 0; i < combo.keys.length; i++) if (!cfg.d[combo.keys[i]]) allOnNow = false;
      var target = allOnNow ? 0 : 1;
      for (i = 0; i < combo.keys.length; i++) cfg.d[combo.keys[i]] = target;
    } else {
      if (ALLKEYS.indexOf(k) < 0) return;
      cfg.d[k] = cfg.d[k] ? 0 : 1;
    }
    /* same rule as applyCode: the mode is always derived from the switches */
    cfg.m = deriveMode(cfg.d);
    save(); refreshUI(); fire();
  }
  function on(k) { return !!cfg.d[k]; }
  function faNum(v) { return String(v).replace(/[0-9]/g, function (d) { return "۰۱۲۳۴۵۶۷۸۹".charAt(+d); }); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ======================= THE ONE TEXT PIPELINE =======================
     tokens(escapedText, linker, faDigits) — markup -> HTML (EN lines).
       faDigits=true renders coin digits Persian (FA lines / site chrome).
       Also runs the light ANCHOR pass: EN glossary terms get wrapped in
       .tok-tm[data-tk=terms] (NO translation) so hover/blink/click show
       what the terms switch owns even when it is OFF.
     faTokens(escapedText, linker) — resolves the marker family per switch
       ({{sp|tm|it|npc|zn|qs|ob:EN|FA}}) then hands off to tokens(fa=true).
       The runtime EN->FA glossary is GONE — markerization is build-time
       (tools/markerize_fa.py), which also keeps embedded EN names safe. */
  var QCOL = { 0: "#b4b4b4", 1: "#ffffff", 2: "#1eff00", 3: "#3a9bff", 4: "#c06cff", 5: "#ff8000", 6: "#e6cc80", 7: "#00cc98" };
  var CC = { c1: "#c79c6e", c2: "#f58cba", c3: "#abd473", c4: "#fff569", c5: "#ffffff", c6: "#c41e3a", c7: "#0070de", c8: "#69ccf0", c9: "#9482c9", c10: "#00ff96", c11: "#ff7d0a", c12: "#a330c9", c13: "#33937f" };
  /* lane-a9 D: game colour codes |cn<NAME>:…|r — the opener and the |r are
     stripped, the inner text stays; ONLY known quality tokens get the site
     quality colour, everything else renders plain. Data check 2026-11-06:
     the shipped rows carry IQ1 (60), EPIC_PURPLE_COLOR (136),
     RARE_BLUE_COLOR (102), always paired with |r. IQ<n> = QCOL[n] by
     definition; the two long names map to their quality. */
  var CN_QUAL = { IQ0: QCOL[0], IQ1: QCOL[1], IQ2: QCOL[2], IQ3: QCOL[3], IQ4: QCOL[4], IQ5: QCOL[5], IQ6: QCOL[6], IQ7: QCOL[7],
    EPIC_PURPLE_COLOR: QCOL[4], RARE_BLUE_COLOR: QCOL[3] };
  var CN_RE = /\|cn([A-Za-z0-9_]+):((?:(?!\|r).)*)\|r/g;
  /* spell variables the game computes ("$/1000;s1", "$439164s1") never show
     raw — the small game chip the talent pages use, raw token in the tooltip */
  var SPVAR_RE = /\$(?:\/\d+;[sS]|\d+[sS])\d+/g;
  function gameCodes(s) {
    /* lane-a10: the stray-|r / unpaired-opener strips run while {{...}} markers
       are still in the string (tokens() calls gameCodes(anchorPass(txt)) BEFORE
       the marker replacement) — a display text that starts with a lowercase r
       ("{{i:123|rough stone|1}}", "{{npc:X|rogue}}") carries a literal |r inside
       the marker, and the old global strip ate it and broke the marker. Same
       idea as anchorPass: split on {{...}} segments and never strip inside one. */
    var parts = String(s).split(/(\{\{[^}]*\}\})/), out = [], i;
    for (i = 0; i < parts.length; i++) {
      if (i % 2) { out.push(parts[i]); continue; } /* marker segment — untouched */
      if (!parts[i]) continue;
      out.push(parts[i]
        .replace(CN_RE, function (m, name, inner) {
          var c = CN_QUAL[name];
          return c ? '<span style="color:' + c + '">' + inner + "</span>" : inner;
        })
        .replace(/\|r/g, "") /* stray closers (paired ones consumed above) */
        .replace(/\|cn[A-Za-z0-9_]+:/g, "") /* unpaired openers — keep inner text plain */
        .replace(SPVAR_RE, function (m) { return '<span class="tk" title="' + m + '"></span>'; }));
    }
    return out.join("");
  }
  function defLink(pid) { return "item.html?ver=forever&id=" + pid; }
  /* anchor pass — skip {{...}} marker segments so nested constructs and
     item-link display texts are never wrapped */
  function anchorPass(s) {
    var parts = String(s).split(/(\{\{[^}]*\}\})/), out = [], i;
    for (i = 0; i < parts.length; i++) {
      if (i % 2) { out.push(parts[i]); continue; } /* marker segment — untouched */
      if (!parts[i]) continue;
      out.push(parts[i].replace(tmRe, '<span class="tok-tm" data-tk="terms">$&</span>'));
    }
    return out.join("");
  }
  /* family-marker spans are parked in SPANS and restored AFTER tokens(),
     so the anchor pass can never re-wrap their EN fallback text into
     nested .tok-tm spans (round-2 review: 4 spans instead of 2) */
  var SPANS = [];
  function tokens(txt, linker, fa) {
    var L = linker || defLink;
    var s = gameCodes(anchorPass(String(txt)));
    return s
      .replace(/\{\{i:(\d+)\|([^}]*)\|(\d*)\}\}/g, function (m, pid, t, q) {
        return '<a class="rt-en" dir="ltr" style="color:' + (QCOL[+q] || "#f0c75e") + '" href="' + L(pid) + '">' + t + "</a>";
      })
      .replace(/\{\{cc:(c\d+)\|([^}]*)\}\}/g, function (m, c, t) {
        return '<span class="rt-en" style="color:' + (CC[c] || "#fff") + '">' + t + "</span>";
      })
      .replace(/\{\{col:(#[0-9a-fA-F]{3,8})\|([^}]*)\}\}/g, '<span style="color:$1">$2</span>')
      .replace(/\{\{([gsc]):(\d+)\}\}/g, function (m, k, v) {
        return '<span class="mny m-' + ({ g: "gold", s: "silver", c: "copper" })[k] + '">' + (fa ? faNum(v) : v) + "</span>";
      })
      .replace(/\{\{sock:(\w+)\}\}/g, '<i class="sock sk-$1"></i>')
      .replace(/\{\{t:([^|}]*)\|([^}]*)\}\}/g, function (m, c, t) {
        return c.charAt(0) === "#"
          ? '<span style="color:' + c + '">' + t + "</span>"
          : '<span class="' + esc(c) + '">' + t + "</span>";
      });
  }
  function faTokens(txt, linker) {
    var s = String(txt);
    var marks = [];
    /* protect all {{...}} markup from the marker resolution pass */
    s = s.replace(PROTECT_RE, function (m) {
      marks.push(m); return "\u0001" + (marks.length - 1) + "\u0001";
    });
    /* resolve the marker family — wrappers are stable hover/click anchors;
       each generated span is parked (\u0002) until after tokens() so the
       anchor pass inside tokens() cannot wrap its EN fallback text again
       into nested .tok-tm spans (round-2 review: 4 spans instead of 2) */
    var mks = ["sp", "tm", "ts", "it", "npc", "zn", "qs", "ob", "cls", "set"], i;
    for (i = 0; i < mks.length; i++) {
      (function (mk) {
        var sw = MK[mk];
        s = s.replace(new RegExp("\\{\\{" + mk + ":([^|}]*)\\|([^}]*)\\}\\}", "g"),
          function (m, en, faTxt) {
            SPANS.push('<span class="tok-' + mk + '" data-tk="' + sw + '">' +
              (on(sw) ? faTxt : '<span class="rt-en" dir="ltr">' + en + "</span>") + "</span>");
            return "\u0002" + (SPANS.length - 1) + "\u0002";
          });
      })(mks[i]);
    }
    s = s.replace(/\u0001(\d+)\u0001/g, function (m, ix) { return marks[+ix]; });
    return tokens(s, linker, true).replace(/\u0002(\d+)\u0002/g, function (m, ix) {
      return SPANS[+ix];
    });
  }

  /* ---------- share codes (format spec in the file header) ---------- */
  var CODE_PREFIX = "WF4-";
  function b36(n) { return Number(n).toString(36); }
  /* WF4 checksum v2 (round-2 review): sums over the BASE36 VALUE of each
     char (0..35, '-' → 0) with position weights, mod the PRIME 37.
     h1·37+h2 fits 1369 states → cc = 3 base36 chars.
     Proof (why nothing slips through for our lengths): 37 is prime and
     every factor below is nonzero and < 37 —
       adjacent transposition: Δh = vp − vq ≠ 0 (any consecutive-weight sum)
       other transposition:    Δh = (vq−vp)(q−p), |vq−vp|,|q−p| ≤ 35 < 37
       single-char substitute: Δh1 = (v′−v)(i+1), |v′−v| ≤ 35 < 37
     → no error can multiply to 0 mod 37. (The old charCode/mod-36 hash was
     blind to charCode differences that are multiples of 36: 0↔x, 1↔y, 2↔z —
     the review's fuzz found 146/46,034 accepted transpositions + 1.46%
     typo acceptance. tools/test_wf4.js now fuzzes the new format.) */
  function wf4check(s) {
    var h1 = 0, h2 = 0, i, v;
    for (i = 0; i < s.length; i++) {
      v = parseInt(s.charAt(i), 36);
      if (!isFinite(v) || v < 0) v = 0;
      h1 = (h1 + v * (i + 1)) % 37;
      h2 = (h2 + v * (i + 3)) % 37;
    }
    return ("00" + b36(h1 * 37 + h2)).slice(-3);
  }
  function wf4checkLegacy(s) { /* pre-v2 WF4: charCode sums mod 36 (decode only) */
    var h1 = 0, h2 = 0, i;
    for (i = 0; i < s.length; i++) {
      var v = s.charCodeAt(i);
      h1 = (h1 + v * (i + 1)) % 36;
      h2 = (h2 + v * (i + 3)) % 36;
    }
    return b36(h1) + b36(h2);
  }
  function codeChecksum(s) { /* legacy WF3/WF2 single-char sum */
    var sum = 0, i;
    for (i = 0; i < s.length; i++) sum += s.charCodeAt(i);
    return b36(sum % 36);
  }
  function encodeCode(d) {
    var bits = 0, i;
    for (i = 0; i < SHARE_KEYS.length; i++) if (d[SHARE_KEYS[i]]) bits |= (1 << i);
    var pay = b36(bits);
    return CODE_PREFIX + pay + "-" + wf4check(CODE_PREFIX + pay);
  }
  function decodeCode(str) {
    var s = String(str || ""), m = s.match(/WF4-([0-9a-z]+)-([0-9a-z]{3})/i);
    if (m) {
      var pay4 = m[1].toLowerCase();
      if (wf4check(CODE_PREFIX + pay4) !== m[2].toLowerCase()) return null;
      var c4 = parseInt(m[2], 36);
      if (!isFinite(c4) || c4 > 36 * 37 + 36) return null;
      var bits4 = parseInt(pay4, 36);
      if (!isFinite(bits4) || bits4 < 0) return null;
      var d4 = blank(), i4;
      for (i4 = 0; i4 < SHARE_KEYS.length; i4++) d4[SHARE_KEYS[i4]] = (bits4 >> i4) & 1;
      return d4;
    }
    m = s.match(/WF4-([0-9a-z]+)-([0-9a-z]{2})/i); /* legacy 2-char WF4 */
    if (m) {
      var payl = m[1].toLowerCase();
      if (wf4checkLegacy(CODE_PREFIX + payl) !== m[2].toLowerCase()) return null;
      var bitsl = parseInt(payl, 36);
      if (!isFinite(bitsl) || bitsl < 0) return null;
      var dl = blank(), il;
      for (il = 0; il < SHARE_KEYS.length; il++) dl[SHARE_KEYS[il]] = (bitsl >> il) & 1;
      return dl;
    }
    m = s.match(/WF3-([0-9a-z]+)-([0-9a-z])/i);
    if (m) {
      var pay = m[1].toLowerCase();
      if (codeChecksum("WF3-" + pay) !== m[2].toLowerCase()) return null;
      var bits = parseInt(pay, 36);
      if (!isFinite(bits) || bits < 0) return null;
      var d = blank(), i;
      for (i = 0; i < SHARE_KEYS.length; i++) d[SHARE_KEYS[i]] = (bits >> i) & 1;
      return d;
    }
    m = s.match(/WF2-([0-9a-z]+)-([0-9a-z])/i); /* v2 legacy -> remap */
    if (!m) return null;
    var pay2 = m[1].toLowerCase();
    if (codeChecksum("WF2-" + pay2) !== m[2].toLowerCase()) return null;
    var bits2 = parseInt(pay2, 36);
    if (!isFinite(bits2) || bits2 < 0) return null;
    var old = {}, keys = KEYS_V2, j;
    for (j = 0; j < keys.length; j++) old[keys[j]] = (bits2 >> j) & 1;
    return remapV2(old);
  }
  function applyCode(str) {
    var d = decodeCode(str);
    if (!d) return false;
    cfg = { v: 3, m: deriveMode(d), d: d };
    save(); refreshUI(); fire();
    return true;
  }

  /* ---------- panel ---------- */
  var mounted = null; /* {bar, pop, btn, presetEls, domEls, statsEl} */
  var docWired = false; /* outside-click closer: wire ONCE (was: every mount) */
  function rowHtml(d, combo) {
    var inCombo = !combo && !!COMBO_OF_MEMBER[d.k];
    return '<div class="tr-row tr-row-' + d.k + (combo ? " tr-combo" : " tr-member" + (inCombo ? " tr-incombo" : "")) + '" data-k="' + d.k + '">'
      + '<span class="tr-dot" aria-hidden="true"></span>'
      + '<span class="tr-lbl"><span class="tr-t">' + esc(d.lbl)
      + (d.n ? '<i class="tr-n">' + faNum(d.n) + "</i>" : "") + "</span>"
      + (d.ex ? '<span class="tr-ex" dir="auto">' + esc(d.ex) + "</span>" : "")
      + "</span>"
      + '<button type="button" class="tr-sw" role="switch" aria-checked="false" aria-label="' + esc(d.lbl) + '"><i></i></button>'
      + "</div>";
  }
  /* v3.3: SECTIONS with header + description — every row keeps a real
     example line so the user sees exactly what flips (settings-page feel).
     simple mode: combo rows stand in for their members — BOTH kinds are
     always in the DOM; CSS (.tr-simple / .tr-combo / .tr-incombo) picks
     what is visible so flipping advanced at runtime just works */
  function rowsHtml() {
    var h = "", emitted = {}, gi, ri;
    for (gi = 0; gi < GROUPS.length; gi++) {
      var gr = GROUPS[gi];
      h += '<p class="tr-sec-h">' + esc(gr.lbl) + (gr.n ? '<span class="tr-sec-n">' + esc(gr.n) + "</span>" : "") + "</p>";
      if (gr.desc) h += '<p class="tr-sec-d">' + esc(gr.desc) + "</p>";
      for (ri = 0; ri < gr.rows.length; ri++) {
        var row = gr.rows[ri], ck = COMBO_OF_MEMBER[row.k];
        if (ck && !emitted[ck]) { emitted[ck] = 1; h += rowHtml(COMBO_BY_KEY[ck], true); }
        h += rowHtml(row);
      }
    }
    return h;
  }
  /* v3.5: the column is a FEW buttons — two accordion categories, the ui
     group folded into تولتیپ («اون رابط رو هم بیار توی تولتیپ»). The share-
     code bit order is untouched: only the VIEW groups. */
  var UI_SECS = [
    { id: "vocab", lbl: "واژه‌نامهٔ بازی", rows: GROUPS[0].rows },
    { id: "texts", lbl: "خط‌های تولتیپ", rows: GROUPS[1].rows.concat(GROUPS[2].rows) }
  ];
  function secHtml(sec) {
    var h = '<div class="tr-sec" data-sec="' + sec.id + '">'
      + '<button type="button" class="tr-secbtn" aria-expanded="false">' + esc(sec.lbl)
      + '<i class="tr-chev" aria-hidden="true"></i></button>'
      + '<div class="tr-secbody" hidden>';
    var emitted = {};
    for (var i = 0; i < sec.rows.length; i++) {
      var row = sec.rows[i], ck = COMBO_OF_MEMBER[row.k];
      if (ck && !emitted[ck]) { emitted[ck] = 1; h += rowHtml(COMBO_BY_KEY[ck], true); }
      h += rowHtml(row);
    }
    if (sec.id === "texts") {
      h += '<label class="tr-catsrow"><input type="checkbox" class="tr-catscb"' + (catsOn ? " checked" : "") + "> "
        + "راهنما: دستهٔ هر خط روی تولتیپ نشان داده شود</label>";
    }
    return h + "</div></div>";
  }
  /* v3.5: the pop CONTENT — shared by the drawer (and the unused legacy
     popup). A few plain buttons; long paragraphs are gone. */
  function popInnerHtml() {
    var h = "";
    h += '<p class="tr-pop-h"><span>سبک ترجمه</span><i aria-hidden="true"></i></p>';
    h += '<div class="tr-presets">';
    PRESETS.forEach(function (p) {
      h += '<button type="button" class="tr-preset" data-m="' + p[0] + '" title="' + esc(p[2]) + '"><b>' + esc(p[1]) + "</b></button>";
    });
    h += "</div>";
    UI_SECS.forEach(function (sec) { h += secHtml(sec); });
    h += '<p class="tr-stats" hidden></p>';
    h += '<div class="tr-share">'
      + '<button type="button" class="tr-shrbtn2 tr-share-my">اشتراک‌گذاری سبک ترجمهٔ من</button>'
      + '<div class="tr-mycode" hidden>'
      + '<div class="tr-shrow"><input class="tr-shr-out" dir="ltr" readonly spellcheck="false" aria-label="کد تنظیمات شما">'
      + '<button type="button" class="tr-shrbtn tr-shrcopy">کپی</button></div>'
      + "</div>"
      + '<button type="button" class="tr-shrbtn2 tr-share-other">سبک ترجمهٔ بقیه…</button>'
      + '<div class="tr-other" hidden>'
      + '<p class="tr-other-hint">کد سبک بقیه رو بگیر و اینجا ثبت کن</p>'
      + '<div class="tr-shrow"><input class="tr-shr-in" dir="ltr" spellcheck="false" placeholder="WF4-…" aria-label="کد سبک ترجمهٔ بقیه">'
      + '<button type="button" class="tr-shrbtn tr-shrapply">ثبت</button></div>'
      + "</div>"
      + '<p class="tr-shrmsg" hidden></p>'
      + "</div>";
    h += '<a class="tr-studiolink" href="translate.html">اتاق کاستوم ترجمه — پیش‌نمایش زنده <i dir="ltr">&crarr;</i></a>';
    return h;
  }
  /* legacy popup chrome (still exposed via mount(); the drawer is the default) */
  function barHtml() {
    return '<div class="tr-bar">'
      + '<button type="button" class="tr-btn" aria-expanded="false" aria-haspopup="true">'
      + '<i class="tr-ic" aria-hidden="true"></i><span>سبک ترجمه:</span><b class="tr-cur">' + esc(PRESET_NAME[cfg.m]) + "</b><i class=\"tr-chv\" aria-hidden=\"true\"></i></button>"
      + '<div class="tr-pop" hidden role="dialog" aria-label="سبک ترجمه">'
      + popInnerHtml()
      + "</div></div>";
  }
  function refreshUI() {
    if (!mounted) return;
    var cur = mounted.bar.querySelector(".tr-cur");
    if (cur) cur.textContent = PRESET_NAME[cfg.m];
    /* v3.5: the simple/advanced toggle is gone from the UI — the accordion
       IS the grouping, so the combo quick-toggles and their member rows
       both stay visible (trdrawer.css shows .tr-incombo in the drawer) */
    mounted.bar.classList.add("tr-simple");
    var ab = mounted.bar.querySelector(".tr-advbtn");
    if (ab) ab.textContent = adv ? "حالت ساده — فقط دسته‌های اصلی" : "حالت پیشرفته — هر ۱۴ دسته با مثال";
    mounted.presetEls.forEach(function (el) {
      el.className = "tr-preset" + (el.getAttribute("data-m") === cfg.m ? " on" : "");
    });
    mounted.domEls.forEach(function (row) {
      var k = row.getAttribute("data-k");
      var sw = row.querySelector(".tr-sw");
      var val;
      if (COMBO_BY_KEY[k]) {
        val = true;
        COMBO_BY_KEY[k].keys.forEach(function (mk) { if (!cfg.d[mk]) val = false; });
      } else val = !!cfg.d[k];
      if (sw) sw.setAttribute("aria-checked", val ? "true" : "false");
      row.className = "tr-row tr-row-" + k
        + (COMBO_BY_KEY[k] ? " tr-combo" : " tr-member" + (COMBO_OF_MEMBER[k] ? " tr-incombo" : "")) + (val ? " on" : "");
    });
    var cb = mounted.bar.querySelector(".tr-catscb");
    if (cb) cb.checked = catsOn;
    document.body.classList.toggle("wf-tr-cats", catsOn);
    var out = mounted.bar.querySelector(".tr-shr-out");
    if (out) out.value = encodeCode(cfg.d);
  }
  var msgState = null; /* {txt, ok, until} — survives panel re-mount after apply */
  var msgTimer = null;
  function shrMsg(txt, ok) {
    msgState = { txt: txt, ok: ok, until: Date.now() + 2600 };
    var el = mounted && mounted.bar.querySelector(".tr-shrmsg");
    if (!el) return;
    el.hidden = false;
    el.textContent = txt;
    el.className = "tr-shrmsg " + (ok ? "ok" : "err");
    if (msgTimer) clearTimeout(msgTimer);
    msgTimer = setTimeout(function () {
      msgState = null;
      var cur = mounted && mounted.bar.querySelector(".tr-shrmsg");
      if (cur) cur.hidden = true;
    }, 2600);
  }
  /* mount(container, inline) — legacy API: inline=true renders the pop as a
     permanent open column instead of a popup. The v3.4 drawer is the default. */
  /* shared wiring for presets / switches / advanced / cats / share code —
     used by BOTH the legacy popup and the v3.4 drawer */
  function wirePanel(root) {
    var presetEls = [].slice.call(root.querySelectorAll(".tr-preset"));
    var domEls = [].slice.call(root.querySelectorAll(".tr-row"));
    presetEls.forEach(function (el) {
      el.addEventListener("click", function () { setMode(el.getAttribute("data-m")); });
    });
    domEls.forEach(function (row) {
      row.querySelector(".tr-sw").addEventListener("click", function () { toggle(row.getAttribute("data-k")); });
    });
    /* v3.5 accordion categories: open/close, no persistence — the float
       loads as «فقط چند دکمه», flash() opens a section when needed */
    [].slice.call(root.querySelectorAll(".tr-secbtn")).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var sec = btn.closest(".tr-sec");
        if (!sec) return;
        var body = sec.querySelector(".tr-secbody");
        var open = sec.classList.toggle("open");
        if (body) body.hidden = !open;
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
    /* share-my: one tap reveals the code AND copies it */
    var myBtn = root.querySelector(".tr-share-my");
    var myCode = root.querySelector(".tr-mycode");
    if (myBtn) myBtn.addEventListener("click", function () {
      if (myCode) myCode.hidden = false;
      var code = encodeCode(cfg.d);
      var done = function () { shrMsg("کد کپی شد — برای دوستانت بفرست ✓", true); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(done, function () { fallbackCopy(code); done(); });
      } else { fallbackCopy(code); done(); }
    });
    /* share-other: reveals the import field with its one-line instruction */
    var othBtn = root.querySelector(".tr-share-other");
    var othBox = root.querySelector(".tr-other");
    if (othBtn && othBox) othBtn.addEventListener("click", function () {
      othBox.hidden = false;
      var inf = othBox.querySelector(".tr-shr-in");
      if (inf) try { inf.focus(); } catch (e) { /* ignore */ }
    });
    var ab = root.querySelector(".tr-advbtn");
    if (ab) ab.addEventListener("click", function () { adv = !adv; saveAdv(); refreshUI(); });
    var cb = root.querySelector(".tr-catscb");
    if (cb) cb.addEventListener("change", function () { catsOn = !!cb.checked; saveCats(); refreshUI(); });
    var copyBtn = root.querySelector(".tr-shrcopy");
    var applyBtn = root.querySelector(".tr-shrapply");
    var inField = root.querySelector(".tr-shr-in");
    if (copyBtn) copyBtn.addEventListener("click", function () {
      var code = encodeCode(cfg.d);
      var done = function () { shrMsg("کد کپی شد — برای دوستانت بفرست ✓", true); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(done, function () { fallbackCopy(code); done(); });
      } else { fallbackCopy(code); done(); }
    });
    if (applyBtn && inField) applyBtn.addEventListener("click", function () {
      if (!inField.value.trim()) { shrMsg("اول کدی که گرفتی را بچسبان…", false); return; }
      if (applyCode(inField.value)) {
        inField.value = "";
        shrMsg("تنظیمات ترجمه اعمال شد ✓", true);
      } else shrMsg("کد معتبر نیست ✗ — دوباره بررسی کن", false);
    });
    if (inField) inField.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" && applyBtn) applyBtn.click();
    });
    return { presetEls: presetEls, domEls: domEls };
  }
  function mount(container, inline) {
    if (!container) return;
    if (mounted && mounted.bar.parentNode === container) { refreshUI(); return; }
    container.insertAdjacentHTML("afterbegin", barHtml());
    var bar = container.querySelector(".tr-bar");
    var pop = bar.querySelector(".tr-pop");
    var btn = bar.querySelector(".tr-btn");
    var wired = wirePanel(bar);
    if (inline) {
      bar.classList.add("tr-inline");
      pop.hidden = false;
      if (btn.parentNode) btn.parentNode.removeChild(btn);
    } else {
      btn.addEventListener("click", function () {
        var open = !pop.hidden;
        pop.hidden = open;
        btn.setAttribute("aria-expanded", open ? "false" : "true");
      });
      if (!docWired) {
        docWired = true;
        document.addEventListener("click", function (ev) {
          if (!mounted || mounted.pop.hidden || mounted.bar.contains(ev.target)) return;
          mounted.pop.hidden = true;
          mounted.btn.setAttribute("aria-expanded", "false");
        });
      }
    }
    mounted = { bar: bar, pop: pop, btn: btn, presetEls: wired.presetEls, domEls: wired.domEls,
      statsEl: bar.querySelector(".tr-stats"), kind: "pop" };
    refreshUI();
    if (msgState && Date.now() < msgState.until) {
      var mel = bar.querySelector(".tr-shrmsg");
      if (mel) {
        mel.hidden = false;
        mel.textContent = msgState.txt;
        mel.className = "tr-shrmsg " + (msgState.ok ? "ok" : "err");
      }
    }
  }
  /* ---------- v3.4: the global settings DRAWER («دکمه سمت چپ» ----------
     A fixed pill button on the LEFT edge opens a sliding column that PUSHES
     the page content to the right: desktop shifts the body padding (a real
     push, the layout reflows — exactly what was asked), mobile overlays with
     a scrim because pushing a narrow screen is hostile. The column reuses
     popInnerHtml() so presets/switches/share behave identically everywhere. */
  var escWired = false;
  function drawerOpen() { return document.body.classList.contains("wf-tr-open"); }
  function openDrawer() {
    if (!mounted || mounted.kind !== "drawer" || drawerOpen()) return;
    document.body.classList.add("wf-tr-open");
    if (mounted.btn) mounted.btn.setAttribute("aria-expanded", "true");
  }
  function closeDrawer() {
    if (!mounted || mounted.kind !== "drawer" || !drawerOpen()) return;
    document.body.classList.remove("wf-tr-open");
    if (mounted.btn) mounted.btn.setAttribute("aria-expanded", "false");
  }
  function toggleDrawer() { if (drawerOpen()) closeDrawer(); else openDrawer(); }
  function mountDrawer(opts) {
    opts = opts || {};
    if (mounted && mounted.kind === "drawer") { if (opts.open) openDrawer(); refreshUI(); return mounted.bar; }
    if (mounted) return null; /* an inline/legacy panel already owns this page */
    var fab = document.createElement("button");
    fab.type = "button";
    fab.className = "trd-fab";
    fab.id = "wf-tr-fab";
    fab.title = "تنظیمات سبک ترجمه";
    fab.setAttribute("aria-expanded", "false");
    fab.setAttribute("aria-controls", "wf-tr-drawer");
    fab.setAttribute("aria-haspopup", "dialog");
    fab.innerHTML = '<i class="tr-ic" aria-hidden="true"></i><span class="trd-fab-t">سبک ترجمه</span>';
    var scrim = document.createElement("div");
    scrim.className = "trd-scrim";
    scrim.id = "wf-tr-scrim";
    scrim.setAttribute("aria-hidden", "true");
    var bar = document.createElement("aside");
    bar.className = "tr-bar tr-bar-drawer";
    bar.id = "wf-tr-drawer";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-label", "تنظیمات سبک ترجمه");
    bar.innerHTML = '<div class="trd-head">'
      + '<p class="trd-title"><i class="tr-ic" aria-hidden="true"></i><span>سبک ترجمه</span><b class="tr-cur">' + esc(PRESET_NAME[cfg.m]) + "</b></p>"
      + '<button type="button" class="trd-close" aria-label="بستن تنظیمات"><i aria-hidden="true"></i></button>'
      + "</div>"
      /* v3.8: the drawer body IS the studio menu (sectioned root + drill-down
         views) — the tidy structure the user approved for اتاق کاستوم, so
         both places behave and look identically. withExt adds the studio
         room link row. */
      + '<div class="tr-pop">' + studioMenuHtml(true) + "</div>";
    document.body.appendChild(scrim);
    document.body.appendChild(bar);
    document.body.appendChild(fab);
    var wired = wirePanel(bar);
    [].slice.call(bar.querySelectorAll(".stmenu-nav[data-go]")).forEach(function (b) {
      b.addEventListener("click", function () { showStudioView(bar, b.getAttribute("data-go")); });
    });
    [].slice.call(bar.querySelectorAll(".stmenu-back")).forEach(function (b) {
      b.addEventListener("click", function () { showStudioView(bar, "root"); });
    });
    mounted = { bar: bar, pop: bar.querySelector(".tr-pop"), btn: fab, scrim: scrim,
      presetEls: wired.presetEls, domEls: wired.domEls,
      statsEl: bar.querySelector(".tr-stats"), kind: "drawer" };
    fab.addEventListener("click", toggleDrawer);
    scrim.addEventListener("click", closeDrawer);
    bar.querySelector(".trd-close").addEventListener("click", closeDrawer);
    document.body.classList.add("tr-body-anim");
    if (!escWired) {
      escWired = true;
      document.addEventListener("keydown", function (ev) {
        if (ev.key === "Escape" && drawerOpen()) closeDrawer();
      });
    }
    /* v3.5: the float loads CLOSED on every normal page — a transparent
       settings menu opening itself over content reads as noise. Only a
       caller that explicitly passes open:true (the studio room) opens it. */
    if (opts.open) {
      var desktop = !(window.matchMedia && window.matchMedia("(max-width: 960px)").matches);
      if (desktop) openDrawer();
    }
    refreshUI();
    return bar;
  }
  /* ---------- v3.6: the STUDIO MENU — translate.html's fixed column -------
     NOT a drawer, NOT an accordion: a permanent menu attached to the
     preview (like any site menu), never hidden. Root view = a few buttons;
     a category click GOES INTO its own submenu view (the user: «یک منو بره
     داخل نه که کشویی باز بشه»). Back rows return. Everything reuses the
     shared classes (.tr-preset/.tr-row/.tr-sw/.tr-shrow/…) so wirePanel(),
     refreshUI(), shrMsg(), setTipStats() and flash() behave identically. */
  function studioRows(rows) {
    var h = "", emitted = {};
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i], ck = COMBO_OF_MEMBER[row.k];
      if (ck && !emitted[ck]) { emitted[ck] = 1; h += rowHtml(COMBO_BY_KEY[ck], true); }
      h += rowHtml(row);
    }
    return h;
  }
  function studioView(id, lbl, inner) {
    return '<div class="stmenu-view" data-view="' + id + '" hidden>'
      + '<div class="stmenu-top"><button type="button" class="stmenu-back" data-back="1">'
      + '<i aria-hidden="true"></i>بازگشت</button>'
      + '<p class="stmenu-title">' + esc(lbl) + "</p></div>"
      + inner + "</div>";
  }
  function studioMenuHtml(withExt) {
    var h = '<div class="stmenu-view stmenu-root" data-view="root">';
    h += '<p class="stmenu-cap">حالت ترجمه</p>';
    h += '<div class="tr-presets">';
    PRESETS.forEach(function (p) {
      h += '<button type="button" class="tr-preset" data-m="' + p[0] + '" title="' + esc(p[2]) + '"><b>' + esc(p[1]) + "</b><span>" + esc(p[2]) + "</span></button>";
    });
    h += "</div>";
    h += '<p class="stmenu-cap">تنظیمات</p>';
    h += '<button type="button" class="stmenu-nav" data-go="vocab">واژه‌نامهٔ بازی<i class="st-chev" aria-hidden="true"></i></button>';
    h += '<button type="button" class="stmenu-nav" data-go="texts">خط‌های تولتیپ<i class="st-chev" aria-hidden="true"></i></button>';
    h += '<button type="button" class="stmenu-nav" data-go="share">اشتراک‌گذاری سبک ترجمهٔ من<i class="st-chev" aria-hidden="true"></i></button>';
    h += '<button type="button" class="stmenu-nav" data-go="other">سبک ترجمهٔ بقیه…<i class="st-chev" aria-hidden="true"></i></button>';
    /* v3.8: the drawer (withExt) also links to the studio room — same drill
       of settings, plus the live-preview entry point */
    if (withExt) {
      h += '<a class="stmenu-nav stmenu-ext" href="' + TR_BASE + 'translate.html">اتاق کاستوم ترجمه — پیش‌نمایش زنده<i class="st-chev" aria-hidden="true"></i></a>';
    }
    h += "</div>";
    h += studioView("vocab", "واژه‌نامهٔ بازی", studioRows(GROUPS[0].rows));
    h += studioView("texts", "خط‌های تولتیپ", studioRows(GROUPS[1].rows.concat(GROUPS[2].rows))
      + '<label class="tr-catsrow"><input type="checkbox" class="tr-catscb"' + (catsOn ? " checked" : "") + "> "
      + "راهنما: دستهٔ هر خط روی تولتیپ نشان داده شود</label>");
    h += studioView("share", "اشتراک‌گذاری سبک ترجمهٔ من",
      '<p class="stmenu-hint">این کد تنظیمات فعلی توست — کپی کن و برای دوستانت بفرست:</p>'
      + '<div class="tr-shrow"><input class="tr-shr-out" dir="ltr" readonly spellcheck="false" aria-label="کد تنظیمات شما">'
      + '<button type="button" class="tr-shrbtn tr-shrcopy">کپی</button></div>');
    h += studioView("other", "سبک ترجمهٔ بقیه…",
      '<p class="stmenu-hint">کد سبک بقیه رو بگیر و اینجا ثبت کن</p>'
      + '<div class="tr-shrow"><input class="tr-shr-in" dir="ltr" spellcheck="false" placeholder="WF4-…" aria-label="کد سبک ترجمهٔ بقیه">'
      + '<button type="button" class="tr-shrbtn tr-shrapply">ثبت</button></div>');
    h += '<p class="tr-stats" hidden></p>';
    h += '<p class="tr-shrmsg" hidden></p>';
    return h;
  }
  function showStudioView(root, name) {
    var views = [].slice.call(root.querySelectorAll(".stmenu-view")), i;
    for (i = 0; i < views.length; i++) {
      views[i].hidden = views[i].getAttribute("data-view") !== name;
    }
    root.setAttribute("data-cur", name);
  }
  function mountStudio(container) {
    if (!container) return null;
    if (mounted && mounted.bar === container) { refreshUI(); return container; }
    if (mounted) return null; /* another panel owns this page */
    container.innerHTML = studioMenuHtml();
    container.classList.add("stmenu");
    var wired = wirePanel(container);
    [].slice.call(container.querySelectorAll(".stmenu-nav")).forEach(function (b) {
      b.addEventListener("click", function () { showStudioView(container, b.getAttribute("data-go")); });
    });
    [].slice.call(container.querySelectorAll(".stmenu-back")).forEach(function (b) {
      b.addEventListener("click", function () { showStudioView(container, "root"); });
    });
    mounted = { bar: container, pop: container, btn: null,
      presetEls: wired.presetEls, domEls: wired.domEls,
      statsEl: container.querySelector(".tr-stats"), kind: "studio" };
    refreshUI();
    return container;
  }
  /* ---------- v3.7: stylesheet self-sufficiency ----------
     Pages get tr.js without the trdrawer.css <link> (nav-menu.js auto-loads
     tr.js everywhere). The drawer injects its own stylesheet then, and only
     mounts once it is actually applied — or the FAB flashes unstyled.
     Sub-directory pages (news/, item/, guides/) need the same ../ prefix
     the rest of the site uses. */
  var TR_BASE = (function () {
    var m = location.pathname.match(/^\/(?:news|guides|item)\//);
    var rest = m ? location.pathname.slice(m[0].length) : "";
    return m ? "../".repeat(1 + (rest.match(/[/]/g) || []).length) : "";
  })();
  function ensureCss() {
    if (document.querySelector('link[href*="trdrawer.css"]')) return null;
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = TR_BASE + "assets/css/trdrawer.css?v=20261114b";
    (document.head || document.documentElement).appendChild(l);
    return l;
  }
  function cssApplied(l) {
    if (!l) return true; /* the page shipped its own <link> */
    try {
      var ss = document.styleSheets, i;
      for (i = 0; i < ss.length; i++) if (ss[i] && ss[i].ownerNode === l) return true;
    } catch (e) { /* same-origin only — unreachable */ }
    return false;
  }
  /* auto-mount: every page that loads tr.js gets the left-edge drawer,
     except the studio room (translate.html) which mounts its own FIXED
     menu via mountStudio(). v3.7: when tr.js had to inject the stylesheet,
     mount AFTER it applies (load event, with an error/timeout escape so a
     bad CSS fetch can never trap the drawer). */
  (function () {
    if (document.getElementById("pv-body") || document.getElementById("str-panel")) return;
    var link = ensureCss();
    var go = function () { mountDrawer({}); };
    var kick = function () {
      if (cssApplied(link)) { go(); return; }
      link.addEventListener("load", go);
      link.addEventListener("error", go);
      setTimeout(function () { if (!mounted) go(); }, 1500);
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", kick);
    else kick();
  })();
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  }
  function flash(k) {
    if (!mounted) return;
    /* v3.8: drawer AND studio share the drill-down menu — walk INTO the view
       owning this row first (the drawer body is studioMenuHtml too now) */
    var sel = '.tr-row[data-k="' + String(k).replace(/[^a-z]/gi, "") + '"]';
    var hasViews = !!mounted.bar.querySelector(".stmenu-view");
    if (hasViews) {
      var vrow = mounted.pop.querySelector(sel);
      var vew = vrow && vrow.closest ? vrow.closest(".stmenu-view") : null;
      if (vew && vew.hidden) showStudioView(mounted.bar, vew.getAttribute("data-view"));
    }
    if (mounted.kind === "drawer") {
      if (!drawerOpen()) openDrawer();
    } else if (mounted.kind !== "studio" && mounted.pop.hidden) {
      mounted.pop.hidden = false;
      if (mounted.btn) mounted.btn.setAttribute("aria-expanded", "true");
    }
    /* v3.5: rows live in accordions — open the owning section first, then
       flash the row itself (always the row, no combo redirect). In the
       stmenu structure there are no accordions, so this is a no-op there. */
    var row = mounted.pop.querySelector(sel);
    if (!row) return;
    var sec = row.closest ? row.closest(".tr-sec") : null;
    if (sec) {
      var body = sec.querySelector(".tr-secbody");
      if (body && body.hidden) {
        sec.classList.add("open");
        body.hidden = false;
        var btn = sec.querySelector(".tr-secbtn");
        if (btn) btn.setAttribute("aria-expanded", "true");
      }
    }
    [].slice.call(mounted.pop.querySelectorAll(".tr-flash")).forEach(function (el) { el.classList.remove("tr-flash"); });
    if (row.scrollIntoView) try { row.scrollIntoView({ block: "center", behavior: "smooth" }); } catch (e) { row.scrollIntoView(); }
    row.classList.remove("tr-flash");
    void row.offsetWidth; /* restart animation */
    row.classList.add("tr-flash");
  }
  function setTipStats(fa, tot) {
    if (!mounted || !mounted.statsEl) return;
    if (!tot) { mounted.statsEl.hidden = true; return; }
    mounted.statsEl.hidden = false;
    mounted.statsEl.textContent = "تولتیپ این آیتم: " + faNum(fa) + " خط از " + faNum(tot) + " خط فارسی می‌شود";
  }
  /* cross-tab sync: settings changed in another tab -> reload + re-render */
  window.addEventListener("storage", function (e) {
    if (e.key !== KEY && e.key !== KEY_CATS && e.key !== KEY_ADV) return;
    cfg = load(); catsOn = loadCats(); adv = loadAdv();
    refreshUI(); fire();
  });

  window.WFTR = {
    on: on,
    mode: function () { return cfg.m; },
    setMode: setMode,
    toggle: toggle,
    onChange: function (cb) { listeners.push(cb); },
    mount: mount,
    mountDrawer: mountDrawer,
    mountStudio: mountStudio,
    openDrawer: openDrawer,
    closeDrawer: closeDrawer,
    toggleDrawer: toggleDrawer,
    flash: flash,
    setTipStats: setTipStats,
    /* the one text pipeline — every renderer (item/quest/talent/guide/map) uses these */
    tokens: tokens,
    faTokens: faTokens,
    /* cat of a fa-*.json tip line -> its global switch key */
    CATMAP: CATMAP,
    lineTk: function (cat) { return CATMAP[cat] || "textDesc"; },
    /* marker code -> switch (addon parity; tools/markerize_fa.py mirrors it) */
    MK: MK,
    MARKERS: MARKERS,
    /* EN game terms — build-time vocabulary (markerizer mirror) + anchor pass */
    TERMS: TERMS,
    CLASSES: CLASSES,
    KEYS: ALLKEYS,
    /* share code: WFTR.code() = current config as text, WFTR.applyCode(txt) applies a received code (WF4 + legacy WF3/WF2) */
    code: function () { return encodeCode(cfg.d); },
    applyCode: applyCode,
    cats: function () { return catsOn; },
    adv: function () { return adv; },
    /* hero-chip labels flip with the uiLabels switch */
    LBL_FA: { ilvl: "سطح آیتم", rlvl: "سطح مورد نیاز", stack: "حداکثر انبار" },
    /* tooltip line-category labels (badges + click-to-flash) */
    CAT_LB: CAT_LB
  };
})();
