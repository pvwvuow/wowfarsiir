/* studio.js — «اتاق کاستوم ترجمه» (translate.html) — tr.js v3.4 edition
   Live preview room for the GLOBAL content-type engine:
     - the settings live in the global left-edge DRAWER (WFTR.mountDrawer)
       which PUSHES the preview column to the right while open
     - the preview column = one sample per section:
         آیتم (REAL 19019 data — same shards the site serves)
         / کوئست / تلنت / راهنما / نقشه  (labeled «نمونهٔ نمایشی»)
   Review-round changes:
     - the item tab is fetched from data/forever/db/tip-11 + fa-11 (the REAL
       Thunderfury overlay, markers included); embedded FALLBACK below is the
       same merged record so the room works offline / pre-fetch too
     - HL map is GENERATED from WFTR.CATMAP + the tok-* wrapper family (no
       hand-copied category groupings to drift)
     - marker family ({{sp|tm|it|npc|zn|qs|ob}}) renders through the ONE
       pipeline (WF.faTokens) and every wrapper carries data-tk, so clicking
       a spell name / term / set name flashes its OWN switch
     - pinned highlight: click a switch row (or focus it) to keep the red
       blink while you scroll the preview — mobile-friendly; a floating
       «نمایش اثر» chip jumps to the preview
   Every switch is a CONTENT TYPE that applies to ALL sections the same way.
   All settings persist via tr.js localStorage and apply site-wide. */
(function () {
  "use strict";
  var pvEl = document.getElementById("pv-body");
  if (!pvEl || !window.WFTR) return;
  var WF = window.WFTR;

  var DATA_V = "20261110o"; /* keep in sync with the retail.js DATA_V sweep */
  var REAL_ID = "19019", REAL_SHARD = 11;

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function faNum(v) { return String(v).replace(/[0-9]/g, function (d) { return "۰۱۲۳۴۵۶۷۸۹".charAt(+d); }); }
  function on(k) { return !!WF.on(k); }
  function catTk(cat) { return WF.CATMAP[cat] || "textDesc"; }
  var QCOL = { 0: "#b4b4b4", 1: "#ffffff", 2: "#1eff00", 3: "#3a9bff", 4: "#c06cff", 5: "#ff8000", 6: "#e6cc80", 7: "#00cc98" };
  var QFA = { 0: "عادی", 1: "معمولی", 2: "بی‌نقص", 3: "ناب", 4: "حماسی", 5: "افسانه‌ای", 6: "آرتیفکت", 7: "میراثی" };
  var QEN = { 0: "Poor", 1: "Common", 2: "Uncommon", 3: "Rare", 4: "Epic", 5: "Legendary", 6: "Artifact", 7: "Heirloom" };
  var SLOT_FA = { weapon: "سلاح", armor: "زره", container: "کیسه", consumable: "مصرفی", glyph: "گلیف", trinket: "جام", quiver: "ترکش‌دان", recipe: "دستور" };
  function itemLink(pid) { return "item.html?ver=forever&id=" + pid; }

  /* tooltip lines: same merged shape as retail.js [cls, fa, cat, en] — the
     language choice is made by the GLOBAL switch of the line's category. */
  function tipCatAttr(cat, tk) {
    if (!cat) return "";
    var lb = (WF.CAT_LB && WF.CAT_LB[cat]) || cat;
    return ' data-tcat="' + esc(cat) + '" data-tcat-lb="' + esc(lb) + '" data-tk="' + esc(tk || catTk(cat)) + '"';
  }
  function tipLine(ln) {
    if (ln[0] === "gap") return '<div class="tl-gap"></div>';
    var cls = String(ln[0] || "");
    var merged = ln.length > 3;
    var en = String(merged ? ln[3] : (ln.length > 1 ? ln[1] : ""));
    var fa = merged ? String(ln[1] || "") : "";
    var cat = merged ? String(ln[2] || "misc") : "";
    var tk = merged ? catTk(cat) : "";
    var showFa = !!(merged && fa && on(tk));
    var disp = showFa ? fa : en;
    if (disp.indexOf("\t") >= 0) {
      var i = disp.indexOf("\t"), left = disp.slice(0, i), right = disp.slice(i + 1).trim();
      var lcl = cls.split(" ")[0];
      var lft = showFa ? WF.faTokens(esc(left)) : WF.tokens(esc(left), itemLink);
      var rgt = right ? (showFa ? WF.faTokens(esc(right)) : WF.tokens(esc(right), itemLink)) : "";
      return '<div class="tl tc"' + tipCatAttr(cat, tk) + '><span' + (showFa ? ">" : ' class="rt-en">') + lft + "</span>" +
        (right ? '<span class="' + esc(lcl) + (showFa ? '" dir="rtl">' : ' rt-en">') + rgt + "</span>" : "") + "</div>";
    }
    var lc = cls.split(" ")[0];
    if (/^\(\d+\)\s*Set/i.test(en)) lc = "qset";
    var h = '<div class="tl' + (lc ? " " + esc(lc) : "") + (showFa ? " fa" : "") + '"' + tipCatAttr(cat, tk) + (showFa ? ' dir="rtl"' : "") + ">";
    h += showFa ? WF.faTokens(esc(fa)) : WF.tokens(esc(en), itemLink);
    return h + "</div>";
  }
  function tipHtml(lines) { return '<div class="tip">' + lines.map(tipLine).join("") + "</div>"; }

  /* ---------- small preview atoms (non-tooltip samples) ---------- */
  function pvRow(tk, fa, en, cls) {
    var faOn = on(tk);
    return '<p class="pv-row ' + (cls || "") + '" data-tk="' + tk + '"' + (faOn ? ' dir="rtl"' : ' dir="ltr"') + ">"
      + (faOn ? esc(fa) : '<span class="rt-en">' + esc(en) + "</span>") + "</p>";
  }
  function pvRowTok(tk, faHtml, enHtml, cls) {
    var faOn = on(tk);
    return '<p class="pv-row ' + (cls || "") + '" data-tk="' + tk + '"' + (faOn ? ' dir="rtl"' : ' dir="ltr"') + ">"
      + (faOn ? faHtml : enHtml) + "</p>";
  }
  function wSpan(tk, fa, en) {
    return on(tk)
      ? '<span class="tok-w" data-tk="' + tk + '" dir="rtl">' + esc(fa) + "</span>"
      : '<span class="tok-w" data-tk="' + tk + '"><span class="rt-en" dir="ltr">' + esc(en) + "</span></span>";
  }
  function tokTm(en, fa) {
    return '<span class="tok-tm" data-tk="terms">' + (on("terms") ? esc(fa) : '<span class="rt-en" dir="ltr">' + esc(en) + "</span>") + "</span>";
  }
  function tokSp(en, fa) {
    return '<span class="tok-sp" data-tk="namesSpell">' + (on("namesSpell") ? esc(fa) : '<span class="rt-en" dir="ltr">' + esc(en) + "</span>") + "</span>";
  }

  /* ---------- REAL item record: embedded mirror of the site's markerized
     19019 overlay (fresh copy is fetched below and replaces this) ---------- */
  var ITEM = {
    name: "Thunderfury, Blessed Blade of the Windseeker",
    nameFa: "تندرفوری، تیغهٔ مبارک بادبین",
    q: 5, slot: "weapon", sub: "One-Handed Swords", ilvl: 80,
    lines: [
      ["q", "سطح آیتم ۸۰", "ilvl", "Item Level 80"],
      ["", "هنگام برداشتن قید می‌شود", "bind", "Binds when picked up"],
      ["", "یکتا", "bind", "Unique"],
      ["q1", "یک‌دست\tشمشیر", "slot", "One-Hand\tSword"],
      ["", "{{tm:Damage|آسیب}} ۸۲ تا ۱۵۳\tسرعت ۱٫۹۰", "stats", "82 - 153 Damage\tSpeed 1.90"],
      ["", "(۶۱٫۸ {{tm:damage|آسیب}} در ثانیه)", "stats", "(61.8 damage per second)"],
      ["", "+۵ {{tm:Agility|چابکی}}", "stats", "+5 Agility"],
      ["", "+۸ {{tm:Stamina|استقامت}}", "stats", "+8 Stamina"],
      ["", "+۸ {{tm:Fire Resistance|مقاومت در برابر آتش}}", "stats", "+8 Fire Resistance"],
      ["", "+۹ {{tm:Nature Resistance|مقاومت در برابر طبیعت}}", "stats", "+9 Nature Resistance"],
      ["", "سطح مورد نیاز ۶۰", "req", "Requires Level 60"],
      ["q2", "{{tm:Chance on Hit|شانس در ضربه}}: به دشمن با {{sp:the power of lightning|قدرت آذرخش}} حمله می‌کند و ۳۰۰ {{tm:Nature damage|آسیب طبیعت}} وارد می‌کند، سپس به دشمن نزدیکِ بعدی حمله می‌کند. هر پرش، {{tm:Nature Resistance|مقاومت طبیعت}} هدف را ۲۵ کاهش می‌دهد. به ۵ هدف حمله می‌کند. هدف شما همچنین در {{sp:Hurricane|گردباد}} فرو می‌رود و ۱۲ ثانیه {{tm:attack speed|سرعت حمله‌اش}} ۲۰٪ کاهش می‌یابد.", "spell", "Chance on Hit: Attacks an enemy with the power of lightning, dealing 300 Nature damage, then jumps to the next nearby enemy. Each jump reduces the target's Nature Resistance by 25. Affects 5 targets. Your target is also slowed by Hurricane and its attack speed is reduced by 20% for 12 sec."],
      ["sell", "قیمت فروش: {{g:25}} {{s:53}} {{c:55}}", "sell", "Sell Price: 25g 53s 55c"]
    ],
    real: true
  };
  var REAL = null; /* replaced by the fetched record when it arrives */

  function loadReal() {
    if (!window.fetch) return;
    fetch("data/forever/db/tip-" + REAL_SHARD + ".json?v=" + DATA_V)
      .then(function (r) { return r.json(); })
      .then(function (tip) {
        return fetch("data/forever/db/fa-" + REAL_SHARD + ".json?v=" + DATA_V)
          .then(function (r) { return r.json(); })
          .then(function (fa) { return [tip, fa]; });
      })
      .then(function (rs) {
        var rec = rs[0].tips && rs[0].tips[REAL_ID];
        var ov = rs[1][REAL_ID];
        if (!rec || !rec.e || !ov) return;
        var en = rec.tip || [], fl = ov.tip || [], lines = [];
        var n = Math.min(en.length, fl.length);
        if (en.length !== fl.length) console.warn("[studio] tip line-count mismatch", en.length, fl.length);
        for (var i = 0; i < en.length; i++) {
          var o = i < n ? fl[i] : null, e = en[i];
          if (o && o.length > 2 && o[2] && o[1]) lines.push([e[0], String(o[1]), String(o[2]), String(e.length > 1 ? e[1] : "")]);
          else lines.push(e);
        }
        REAL = { name: rec.e.name, nameFa: ov.n || "", q: rec.e.q, slot: rec.e.slot,
          sub: rec.e.sub || rec.e.type || "", ilvl: rec.e.ilvl, lines: lines, real: true };
        if (cur === "item") render();
      })
      .catch(function () { /* offline / pre-fetch: embedded mirror stays */ });
  }

  function itemChips(it) {
    var catsOn = on("uiLabels"), h = "";
    if (it.ilvl != null) {
      h += '<span class="pv-chip" data-tk="uiLabels">' + (catsOn ? esc(WF.LBL_FA.ilvl) : '<span class="rt-en">Item Level</span>')
        + " <b>" + faNum(it.ilvl) + "</b></span>";
    }
    var qf = QFA[it.q] || "", qe = QEN[it.q] || "";
    var sf = SLOT_FA[it.slot] || "", se = it.sub || it.slot || "";
    h += '<span class="pv-chip" data-tk="uiLabels">' + (catsOn
      ? esc(qf + (sf ? " · " + sf : ""))
      : '<span class="rt-en">' + esc(qe + (se ? " · " + se : "")) + "</span>") + "</span>";
    return '<p class="pv-chips" data-tk="uiLabels">' + h + "</p>";
  }

  function renderItem() {
    var it = REAL || ITEM;
    var nameFa = on("namesItem") && it.nameFa;
    var h = '<div class="str-card">';
    h += '<p class="pv-demo-badge' + (it.real ? " real" : "") + '">' + (it.real
      ? "نمونهٔ واقعی — تندرفوری ۱۹۰۱۹، همان دیتای سایت"
      : "نمونهٔ ذخیرهٔ محلی — نسخهٔ زنده در حال بارگیری…") + "</p>";
    h += '<div class="pv-hero"><div class="pv-gem" aria-hidden="true"></div><div>'
      + '<h2 class="pv-name" data-tk="namesItem" style="color:' + (QCOL[it.q] || "#f0c75e") + '">'
      + (nameFa ? esc(it.nameFa) : '<span class="rt-en" dir="ltr">' + esc(it.name) + "</span>") + "</h2>"
      + (nameFa ? '<p class="pv-ensub rt-en" dir="ltr">' + esc(it.name) + "</p>" : "")
      + itemChips(it)
      + "</div></div>";
    h += tipHtml(it.lines);
    h += '<p class="str-note">این نمونه از دیتابیس واقعی سایت می‌آید. سوییچ‌ها «نوع محتوا»اند نه خطِ تولتیپ: «توضیحات و افکت‌ها» هم Use/Equip را می‌گیرد هم پاداش ست را — ست فرقی با بقیه ندارد. واژه‌های بازی در داده با مارکر <i dir="ltr">{{tm:}}</i> علامت خورده‌اند: «اصطلاح‌های بازی» را خاموش کن تا Hit Rating، Stamina، Nature damage و… در همین خط‌ها و در کوئست و تلنت و راهنما هم‌زمان انگلیسی شوند؛ نام ست داخل خط ست با «اسم آیتم‌ها و ست‌ها» می‌چرخد. خط «Right Click to read…» ترجمه ندارد و همیشه امن و انگلیسی می‌ماند.</p>';
    h += "</div>";
    return h;
  }

  function renderQuest() {
    var h = '<div class="str-card">';
    h += '<p class="pv-demo-badge">نمونهٔ نمایشی — کوئست واقعی با ایجنت‌های ترجمه وایر می‌شود</p>';
    h += pvRow("namesQuest", "برخیز، تندرفوری!", "Awaken, Thunderfury!", "pv-q-title");
    h += pvRow("uiLabels", "سطح ۶۰ · گروهی · منبع: دانجن", "Level 60 · Group · Source: Dungeon", "pv-counter");
    h += pvRowTok("namesNpc", WF.faTokens(esc("دهندهٔ کوئست: {{npc:Highlord Demitrian|هایلرد دمیتریان}}")), 'Quest giver: <span class="rt-en" dir="ltr">Highlord Demitrian</span>', "pv-npcrow");
    h += '<div class="pv-sec">اهداف</div>';
    h += pvRowTok("textDesc",
      WF.faTokens(esc("شمشیرِ بادبوسیدهٔ خفته را به {{npc:Highlord Demitrian|هایلرد دمیتریان}} ببر و {{sp:Hurricane|گردباد}} را بر آن فرا بخوان.")),
      'Bring the Dormant Wind-Kissed Blade to <span class="rt-en" dir="ltr">Highlord Demitrian</span> and invoke <span class="rt-en" dir="ltr">Hurricane</span> upon it.');
    h += pvRow("textDesc", "۰ از ۱ انجام شد", "0 / 1 completed", "pv-counter");
    h += '<div class="pv-sec">توضیحات</div>';
    h += '<div class="pv-body-txt">';
    h += pvRowTok("textDesc",
      WF.faTokens(esc("این شمشیر خوابیده است، اما باد هنوز زمزمه‌اش می‌کند… آن را به هایلرد ببر تا دوباره بیدار شود. هنگام پوشیدن، ۲۰ {{tm:attack power|قدرت حمله}} به تو می‌دهد.")),
      "The blade sleeps, yet the wind still whispers its name... Bring it to the Highlord so it may wake again. Equipping it grants 20 attack power.");
    h += "</div>";
    h += '<div class="pv-sec">پیشرفت و پایان</div>';
    h += pvRow("textDesc", "هنوز نیاورده‌اش، مگر نه؟ باد می‌گوید هنوز در خواب است.", "You have not brought it yet? The wind says it still sleeps.");
    h += pvRow("textDesc", "بیدار شد! می‌شنوی چه می‌گوید؟ اکنون نوبت توست که شاهدش باشی.", "It is awake! Do you hear it? Now it falls to you to bear witness.");
    h += '<div class="pv-sec">پاداش</div>';
    h += pvRow("uiLabels", "۹۹ سکهٔ طلا · ۱۲٬۶۰۰ تجربه", "99 gold · 12,600 XP", "pv-reward");
    h += '<p class="str-note">متن کوئست با «توضیحات و افکت‌ها» کنترل می‌شود — همان سوییچی که Use/Equip و پاداش ست تولتیپ آیتم را می‌گرداند. نام NPC داخل هدف با مارکر <i dir="ltr">{{npc:}}</i> به «اسم شخصیت‌ها و موجودها» وصل است — خاموشش کن تا هایلرد در همین خط انگلیسی شود. ۲۰ attack power هم با «اصطلاح‌های بازی» سراسری می‌چرخد.</p>';
    h += "</div>";
    return h;
  }

  function renderTalent() {
    var h = '<div class="str-card">';
    h += '<p class="pv-demo-badge">نمونهٔ نمایشی — تلنت واقعی با ایجنت‌های ترجمه وایر می‌شود</p>';
    h += pvRow("uiLabels", "شاخهٔ خشم (جنگاور) · رتبهٔ ۵۰+", "Fury (Warrior) · Level 50+", "pv-counter");
    h += '<div class="pv-sec">استعداد اول</div>';
    h += pvRow("namesSpell", "تشنگی خون", "Bloodthirst", "pv-tal-name");
    h += pvRow("uiLabels", "رتبهٔ ۱ از ۱", "Rank 1/1", "pv-counter");
    h += pvRow("textReq", "نیازمند جنگاور · ۲۰ امتیاز در خشم", "Requires Warrior · 20 points in Fury", "pv-counter");
    h += pvRowTok("textDesc",
      WF.faTokens(esc("حملهٔ نزدیکِ بعدی در ۱۵ ثانیه ۱۱۰٪ آسیب سلاح وارد می‌کند و ۱۰ {{tm:rage|خشم}} تولید می‌کند.")),
      "The next melee attack within 15 sec deals 110% weapon damage and generates 10 rage.");
    h += '<div class="pv-sec">استعداد دوم</div>';
    h += pvRow("namesSpell", "تندباد", "Flurry", "pv-tal-name");
    h += pvRow("uiLabels", "رتبهٔ ۵ از ۵", "Rank 5/5", "pv-counter");
    h += pvRowTok("textDesc",
      WF.faTokens(esc("پس از ضربهٔ مرگبار، {{tm:attack speed|سرعت حمله}} شما برای ۳ ضربهٔ بعدیِ {{sp:Bloodthirst|تشنگی خون}} ۲۵٪ افزایش می‌یابد و ۶۰ {{tm:hit rating|رتبهٔ اصابت}} اضافه می‌کند.")),
      "After landing a critical strike, your attack speed increases by 25% for the next 3 swings of Bloodthirst and adds 60 hit rating.");
    h += '<p class="str-note">اسم استعداد با «اسم اسپل‌ها و استعدادها» فارسی می‌شود — همان سوییچی که نام اسپلِ داخل متن آیتم و کوئست را هم می‌گرداند. متن استعداد با «توضیحات و افکت‌ها»، نیازمندی با «نیازمندی‌ها» و hit rating / attack speed / rage داخل متن با «اصطلاح‌های بازی» سراسری کنترل می‌شوند — همین سوییچ‌ها در تب آیتم هم همان‌کار را می‌کنند.</p>';
    h += "</div>";
    return h;
  }

  function renderGuide() {
    var h = '<div class="str-card">';
    h += '<p class="pv-demo-badge">نمونهٔ نمایشی — بدنهٔ راهنما با ایجنت‌های ترجمه فارسی می‌شود</p>';
    h += '<h2 class="pv-name" data-tk="uiLabels" style="color:#f6e0a3;font-size:1.15rem">'
      + (on("uiLabels") ? "راهنمای آهنگری آیتم‌های حماسی" : '<span class="rt-en" dir="ltr">Forging Epic Items — A Guide</span>') + "</h2>";
    h += pvRow("uiLabels", "فاز کلاسیک · سطح متوسط", "Phase: Classic · Difficulty: Intermediate", "pv-counter");
    h += '<div class="pv-sec">متن راهنما</div>';
    h += '<p class="pv-row pv-body-txt" dir="ltr">First travel to ' + wSpan("namesZone", "تاناریس", "Tanaris")
      + " and speak with " + wSpan("namesNpc", "هایلرد دمیتریان", "Highlord Demitrian")
      + ". Open the " + wSpan("namesObj", "صندوق آراکنیتِ خفته", "Dormant Arcanite Container")
      + " beside the forge of " + wSpan("namesItem", "ریختِ نبرد نابودی", "Doomplate Battlegear")
      + " — every " + tokTm("critical strike", "ضربهٔ مرگبار")
      + " you land adds 40 " + tokTm("attack power", "قدرت حمله")
      + " while the ember buff is active. The final reward is "
      + WF.tokens("{{i:19019|Thunderfury, Blessed Blade of the Windseeker|5}}", itemLink) + ".</p>";
    h += '<p class="str-note">بدنهٔ راهنماها در فاز ترجمه (agentهای بعدی) با همان خط لولهٔ v3.1 فارسی می‌شود؛ ولی اسامی (آیتم/ست، NPC، مکان، آبجکت) و اصطلاحاتِ داخل متن همین حالا زنده کنترل می‌شوند — نشانگر را رویشان ببر و بعد به تب آیتم برو: همان سوییچ‌ها همان‌جا هم اثر دارند.</p>';
    h += "</div>";
    return h;
  }

  function renderMap() {
    var h = '<div class="str-card">';
    h += '<p class="pv-demo-badge">نمونهٔ نمایشی — برچسب‌های واقعی نقشه با دادهٔ zone وایر می‌شود</p>';
    h += '<div class="pv-sec">برچسب‌های روی نقشه</div>';
    h += '<div class="pv-map">';
    [["تاناریس", "Tanaris"], ["سیلیتوس", "Silithus"], ["دهانهٔ آنگورو", "Un'Goro Crater"]].forEach(function (z) {
      h += '<div class="pv-pin"><i aria-hidden="true"></i>' + wSpan("namesZone", z[0], z[1]) + "</div>";
    });
    h += "</div>";
    h += pvRow("namesZone", "دانجن: سکولومنس", "Dungeon: Scholomance");
    h += pvRow("namesObj", "صندوق گنج آتش‌خاک", "Fireplume Treasure Chest");
    h += pvRow("namesNpc", "مهمان‌دارِ کاروان", "Caravan Keeper");
    h += '<div class="pv-sec">برچسب‌های رابط نقشه</div>';
    h += pvRow("uiLabels", "مسیر پرواز · منطقهٔ میدان نبرد · راهروی گروهی", "Flight Path · Battleground area · Dungeon entrance", "pv-counter");
    h += '<p class="str-note">اسم مکان‌ها و دانجن‌ها با «اسم مناطق و دانجن‌ها» — همان سوییچی که اسم مکان در تولتیپ آیتم و کوئست را هم می‌گرداند — فارسی می‌شوند؛ آبجکت و شخصیت‌ها هم سوییچ خودشان را دارند. وقتی ذخیره شد، همین تنظیم‌ها روی برچسب‌های واقعی نقشهٔ سایت اعمال می‌شود.</p>';
    h += "</div>";
    return h;
  }

  /* ---------- «واژه‌ها» tab: the agent-pack ENTITY layer ----------
     data/forever/i18n/entities.json — 10 types (spell / skill / talent_tree /
     zone / creature / creature_type / npc / faction / item_ref / term) plus
     shared_new sentence patterns. v1 = browse + search; per-term user
     overrides ride on tr.js storage in the next round. */
  var ENT = null, entType = "term", entQ = "";
  var ENT_LB = { spell: "اسپیل‌ها", skill: "مهارت‌ها", talent_tree: "درخت تلنت",
    zone: "مناطق و دانجن‌ها", creature: "موجودها", creature_type: "نوع موجودها",
    npc: "شخصیت‌ها (NPC)", faction: "فکشن‌ها", item_ref: "ارجاع آیتم/ست", term: "اصطلاح‌های بازی" };
  function loadEnt() {
    if (ENT !== null || !window.fetch) return;
    ENT = false; /* in-flight */
    fetch("data/forever/i18n/entities.json?v=" + DATA_V)
      .then(function (r) { return r.json(); })
      .then(function (j) { ENT = j; if (cur === "words") render(); })
      .catch(function () { ENT = null; });
  }
  function entRows() {
    var m = ((ENT && ENT.types) || {})[entType] || {};
    var q = entQ.trim(), ql = q.toLowerCase();
    var keys = Object.keys(m).filter(function (k) {
      return !q || k.toLowerCase().indexOf(ql) >= 0 || String(m[k]).indexOf(q) >= 0;
    });
    var h = '<p class="ent-count">' + faNum(keys.length) + " مورد از " + faNum(Object.keys(m).length) + "</p>";
    h += '<div class="pv-body-txt">';
    var n = Math.min(keys.length, 300);
    for (var i = 0; i < n; i++) {
      h += '<p class="ent-row"><span class="ent-en">' + esc(keys[i]) + "</span>"
        + '<span class="ent-fa" dir="rtl">' + esc(m[keys[i]]) + "</span></p>";
    }
    if (keys.length > n) h += '<p class="ent-count">… ' + faNum(keys.length - n) + " مورد دیگر — با جست‌وجو محدودش کن</p>";
    return h + "</div>";
  }
  function renderWords() {
    var h = '<div class="str-card">';
    if (!ENT) {
      h += '<p class="pv-demo-badge">' + (ENT === false
        ? "در حال بارگیری واژه‌ها…"
        : "دادهٔ واژه‌ها در دسترس نیست") + "</p></div>";
      return h;
    }
    var types = ENT.types || {};
    h += '<p class="pv-demo-badge real">لایهٔ واژه‌ها — خروجی بستهٔ ترجمه (entities)؛ ترجمه‌های قفل با همین املا داخل متن‌ها نشسته‌اند</p>';
    h += '<div class="ent-chips">';
    Object.keys(ENT_LB).forEach(function (ty) {
      if (!(ty in types)) return;
      var c = Object.keys(types[ty]).length;
      if (!c && ty !== "faction") return;
      h += '<button type="button" class="ent-chip' + (ty === entType ? " on" : "")
        + '" data-ty="' + ty + '">' + ENT_LB[ty] + " <b>" + faNum(c) + "</b></button>";
    });
    h += "</div>";
    h += '<input id="ent-q" class="ent-search" type="search" value="' + esc(entQ)
      + '" placeholder="جست‌وجوی واژهٔ انگلیسی یا فارسی…" aria-label="جست‌وجوی واژه‌ها">';
    h += '<div id="ent-rows">' + entRows() + "</div>";
    h += '<p class="str-note">این لایه مستقیم از خروجی ایجنت‌ها می‌آید (همان ۱۰ نوعِ افزودهٔ مأموریت) و از این به بعد «روال رسمی» بخش ترجمه است. الگوی جمله‌های تکرارشونده (shared_new) هم در همین فایل ذخیره شده؛ مرحلهٔ بعد — جایگزینی ترجمهٔ دلخواه روی همین واژه‌ها — از همین‌جا وایر می‌شود.</p>';
    h += "</div>";
    return h;
  }
  function wireWords() {
    var q = document.getElementById("ent-q");
    if (q) q.addEventListener("input", function () {
      entQ = this.value;
      var r = document.getElementById("ent-rows");
      if (r) r.innerHTML = entRows();
    });
    [].slice.call(document.querySelectorAll(".ent-chip")).forEach(function (b) {
      b.addEventListener("click", function () {
        entType = b.getAttribute("data-ty") || entType;
        render();
      });
    });
  }

  /* ---------- tabs + render loop ---------- */
  var TABS = [
    ["item", "آیتم", renderItem],
    ["quest", "کوئست", renderQuest],
    ["talent", "تلنت", renderTalent],
    ["guide", "راهنما", renderGuide],
    ["map", "نقشه", renderMap],
    ["words", "واژه‌ها", renderWords]
  ];
  var cur = "item";
  /* deep link: translate.html#words (یا هر تب دیگر) همان تب را باز می‌کند */
  function hashTab() {
    var h = (location.hash || "").replace(/^#/, ""), i;
    for (i = 0; i < TABS.length; i++) if (TABS[i][0] === h) return h;
    return null;
  }
  function setHash() {
    try { history.replaceState(null, "", "#" + cur); } catch (e) {}
  }
  function renderTabBar() {
    var el = document.querySelector(".str-tabs");
    if (!el) return;
    el.innerHTML = TABS.map(function (t) {
      return '<button type="button" class="str-tab' + (t[0] === cur ? " on" : "") + '" data-t="' + t[0]
        + '" role="tab" aria-selected="' + (t[0] === cur) + '">' + t[1] + "</button>";
    }).join("");
    [].slice.call(el.querySelectorAll(".str-tab")).forEach(function (b) {
      b.addEventListener("click", function () {
        cur = b.getAttribute("data-t");
        renderTabBar();
        render();
        setHash();
      });
    });
  }
  function tipCounts(lines) {
    var all = 0, faC = 0, i;
    for (i = 0; i < lines.length; i++) {
      var ln = lines[i];
      if (ln[0] === "gap") continue;
      all++;
      if (ln.length > 3) {
        var tk = catTk(ln[2]);
        if (on(tk)) faC++;
      }
    }
    return [faC, all];
  }
  function render() {
    var t = TABS[0], i;
    for (i = 0; i < TABS.length; i++) if (TABS[i][0] === cur) t = TABS[i];
    pvEl.innerHTML = t[2]();
    if (cur === "words") wireWords();
    if (cur === "item") { var c = tipCounts((REAL || ITEM).lines); WF.setTipStats(c[0], c[1]); }
    else WF.setTipStats(0, 0);
    if (curKey) applyHl(curKey, true); /* re-anchor highlight after re-render */
  }

  /* ---------- hover/pin highlight: panel switch -> preview lines ----------
     Generated from CATMAP + the tok-* marker family (review fix: the old
     hand-written selector map could drift from CATMAP). One switch blinks
     its lines in EVERY section shown. */
  var HL = {};
  (function () {
    var cat;
    for (cat in WF.CATMAP) {
      (HL[WF.CATMAP[cat]] = HL[WF.CATMAP[cat]] || []).push('[data-tcat="' + cat + '"]');
    }
    function add(sw, sel) { (HL[sw] = HL[sw] || []).push(sel); }
    add("namesItem", '.tok-it, [data-tk="namesItem"]');
    add("namesSpell", '.tok-sp, [data-tk="namesSpell"]');
    add("namesNpc", '.tok-npc, [data-tk="namesNpc"]');
    add("namesZone", '.tok-zn, [data-tk="namesZone"]');
    add("namesQuest", '.tok-qs, [data-tk="namesQuest"]');
    add("namesObj", '.tok-ob, [data-tk="namesObj"]');
    add("terms", '.tok-tm, .tok-gm, [data-tk="terms"]');
    add("textDesc", '[data-tk="textDesc"]');
    add("textStats", '[data-tk="textStats"]');
    add("textReq", '[data-tk="textReq"]');
    add("textBind", '[data-tk="textBind"]');
    add("textDetail", '[data-tk="textDetail"]');
    add("textFlavor", '[data-tk="textFlavor"]');
    add("uiLabels", '[data-tk="uiLabels"]');
    var k;
    for (k in HL) HL[k] = HL[k].join(", ");
  })();
  /* v3.4: the settings column is the global DRAWER (assets/js/tr.js) —
     mounted open on desktop (it pushes the preview to the right), closed on
     mobile (overlay); the FAB on the left edge toggles it at any time */
  var panelEl = WF.mountDrawer({ open: true, force: true });
  var jumpEl = document.getElementById("pv-jump");
  var curKey = null, pinned = false;
  function setJump(v) { if (jumpEl) jumpEl.hidden = !v; }
  function clearHl() {
    curKey = null; pinned = false; setJump(false);
    [].slice.call(pvEl.querySelectorAll(".hl-red")).forEach(function (el) { el.classList.remove("hl-red"); });
  }
  function applyHl(k, pin) {
    [].slice.call(pvEl.querySelectorAll(".hl-red")).forEach(function (el) { el.classList.remove("hl-red"); });
    curKey = k; pinned = !!pin; setJump(!!pin);
    var sel = HL[k];
    if (!sel) return;
    [].slice.call(pvEl.querySelectorAll(sel)).forEach(function (el) { el.classList.add("hl-red"); });
  }
  function wireHover() {
    if (!panelEl) return;
    panelEl.addEventListener("pointerover", function (ev) {
      var row = ev.target && ev.target.closest ? ev.target.closest(".tr-row[data-k]") : null;
      if (!row || pinned) return;
      applyHl(row.getAttribute("data-k"), false);
    });
    panelEl.addEventListener("pointerout", function (ev) {
      if (pinned) return;
      var to = ev.relatedTarget;
      if (to && to.closest && to.closest(".tr-row[data-k]")) return;
      clearHl();
    });
    /* review fix (mobile/keyboard): tap or focus a row -> the blink PINS
       (stays while you scroll); tap the same row again to unpin */
    panelEl.addEventListener("click", function (ev) {
      var row = ev.target && ev.target.closest ? ev.target.closest(".tr-row[data-k]") : null;
      if (!row) return;
      var k = row.getAttribute("data-k");
      if (ev.target.closest(".tr-sw")) { applyHl(k, true); return; } /* toggle click: keep it visible */
      if (pinned && curKey === k) clearHl();
      else applyHl(k, true);
    });
    panelEl.addEventListener("focusin", function (ev) {
      var row = ev.target && ev.target.closest ? ev.target.closest(".tr-row[data-k]") : null;
      if (row) applyHl(row.getAttribute("data-k"), true);
    });
    /* reverse: click a preview line (or an inner tok-* anchor) -> flash its
       switch in the panel — inner markers now own their data-tk */
    pvEl.addEventListener("click", function (ev) {
      var t = ev.target && ev.target.closest ? ev.target.closest("[data-tk],[data-tcat]") : null;
      if (!t) return;
      var tk = t.getAttribute("data-tk");
      if (!tk) tk = catTk(t.getAttribute("data-tcat"));
      WF.flash(tk);
    });
    if (jumpEl) jumpEl.addEventListener("click", function () {
      try { pvEl.scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e) { pvEl.scrollIntoView(); }
    });
  }

  /* ---------- init ---------- */
  (function () { var h = hashTab(); if (h) cur = h; })();
  window.addEventListener("hashchange", function () {
    var h = hashTab();
    if (h && h !== cur) { cur = h; renderTabBar(); render(); }
  });
  WF.onChange(render);
  renderTabBar();
  render();
  if (hashTab()) setHash(); /* keep the deep link in the address bar */
  wireHover();
  loadReal();
  loadEnt();
})();
